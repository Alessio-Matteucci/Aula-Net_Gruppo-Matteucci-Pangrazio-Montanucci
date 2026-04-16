import express from 'express';
import {prenotazioni} from './index.js';
import {createPrenotazione} from './index.js';
import {deletePrenotazione} from './index.js'; 
import { aule } from './index.js';
import { classi } from './index.js';
import { getUtente } from './index.js';
import { loginGoogle } from './index.js';
import {checkRuoli} from './index.js';
import { normalizeRole } from './index.js';
import cors from 'cors';
import bodyParser from 'body-parser';
import dotenv from 'dotenv';

const ruoliPermessi = ['docente', 'ata', 'admin']
dotenv.config();
const rawPort = Number(process.env.PORT || 3000)
const PORT = !Number.isFinite(rawPort) || rawPort <= 0 || rawPort === 3306 ? 3000 : rawPort

function decodeGoogleCredential(credential) {
    if (!credential || typeof credential !== 'string') return null
    const parts = credential.split('.')
    if (parts.length < 2) return null
    try {
        const normalized = parts[1].replace(/-/g, '+').replace(/_/g, '/')
        const padded = normalized + '='.repeat((4 - (normalized.length % 4 || 4)) % 4)
        const payload = JSON.parse(Buffer.from(padded, 'base64').toString('utf8'))
        return payload
    } catch {
        return null
    }
}

const app = express();
app.use(bodyParser.json());
app.use(cors());

async function resolveUserFromAuthHeader(req, _res, next) {
    try {
        const auth = req.headers?.authorization || ''
        if (!auth.startsWith('Bearer ')) return next()
        const token = auth.slice('Bearer '.length).trim()
        if (!token) return next()

        if (token.startsWith('legacy:')) {
            const email = token.slice('legacy:'.length).trim()
            if (email) req.user = await loginGoogle(email)
            return next()
        }

        const payload = decodeGoogleCredential(token)
        const email = payload?.email
        const nome = payload?.name
        if (email) req.user = await loginGoogle(email, nome)
    } catch {
        // token non valido o utente non trovato
    }
    next()
}

app.use(resolveUserFromAuthHeader);

app.listen(PORT, () => {
    console.log(`Server in ascolto sulla porta ${PORT}`);
});


//GET prenotazioni, per restituire le prenotazioni con controllo accessi
app.get('/prenotazioni', async (req, res) => {
    try {
        const { data, ora, start, end, aula_id, classe_id, all_bookings } = req.query;
        
        // Controllo accessi: 
        // - admin vede sempre tutte
        // - docente/ata vedono tutte solo se all_bookings=true (per mappa 2D)
        // - docente/ata vedono prenotazioni di un'aula specifica se aula_id è specificato
        // - studente vede prenotazioni della sua classe o le proprie
        // - altrimenti vedono solo le proprie
        let utente_id = null;
        let student_classe_id = null;
        const userRole = normalizeRole(req.user?.ruolo);
        
        if (userRole !== 'admin') {
            if (!req.user?.id) {
                return res.status(401).json({ error: 'Utente non autenticato' });
            }
            
            if (userRole === 'studente') {
                // Gli studenti vedono le prenotazioni della loro classe
                if (req.user.classe_id) {
                    student_classe_id = req.user.classe_id;
                } else {
                    // Se lo studente non ha una classe assegnata, vede solo le proprie prenotazioni
                    utente_id = req.user.id;
                }
            } else {
                // Docenti/ATA vedono tutte solo se:
                // 1. all_bookings=true (per mappa 2D)
                // 2. aula_id è specificato (per calendario di un'aula specifica)
                if (all_bookings !== 'true' && !aula_id) {
                    utente_id = req.user.id;
                }
            }
        }
        
        const prenotazioniList = await prenotazioni({ data, ora, start, end, aula_id, classe_id, utente_id, student_classe_id });

        res.json(prenotazioniList);
    } catch (error) {
        res.status(500).json({ error: 'Errore nel recupero delle prenotazioni' });
    }
});


//POST prenotazione, per creare una nuova prenotazione, permessi Docente,ATA,ADMIN
app.post('/prenotazioni', checkRuoli(ruoliPermessi), async (req, res) => {
    try {
        const prenotazioneData = req.body || {};
        if (!req.user?.id) {
            return res.status(401).json({ error: 'Utente non autenticato' })
        }
        const payload = {
            ...prenotazioneData,
            utente_id: req.user.id,
        }
        const newPrenotazione = await createPrenotazione(payload);
        res.status(201).json(newPrenotazione);
    } catch (error) {
        res.status(500).json({ error: 'Errore nella creazione della prenotazione' });
    }
});

//nella post dovrai scrivere: { "aula_id": 1, "utente_id": 1, "data": "2024-06-30", "ora_inizio": "10:00:00", "ora_fine": "12:00:00" } 

//delete prenotazioni/:id, per eliminare una prenotazione esistente, permessi: il docente può eliminare solo le proprie prenotazioni, l'admin può eliminare tutte le prenotazioni

app.delete('/prenotazioni/:id', checkRuoli(['docente', 'admin']), async (req, res) => {
    try {
        const prenotazioneId = req.params.id;
        const user = req.user; // Assumendo che l'utente sia autenticato e disponibile in req.user
        await deletePrenotazione(prenotazioneId, user);

        res.json({ message: 'Prenotazione eliminata con successo' });
    } catch (error) {
        res.status(500).json({ error: 'Errore nell\'eliminazione della prenotazione' });
    }
});

//GET /aule, per restituire tutte le aule disponibili, permessi tutti
app.get('/aule', async (req, res) => {
    try {
        const auleList = await aule();
        res.json(auleList);
    } catch (error) {
        res.status(500).json({ error: 'Errore nel recupero delle aule' });  
    }
});

//GET /classi, per restituire tutte le classi disponibili, permessi tutti
app.get('/classi', async (req, res) => {
    try {        const classiList = await classi();
        res.json(classiList);
    } catch (error) {
        res.status(500).json({ error: 'Errore nel recupero delle classi' });  
    }
});

//GET /utente, per restituire i dati dell'utente autenticato, permessi tutti
app.get('/utente', async (req, res) => {
    try {
        const email = req.user.email; 
        const utenteData = await getUtente(email);
        res.json(utenteData);
    } catch (error) {
        res.status(500).json({ error: 'Errore nel recupero dei dati utente' });  
    }
});

//POST /login/google, per autenticare un utente tramite Google OAuth
app.post('/login/google', async (req, res) => {
    try {
        const { credential } = req.body ?? {};
        const googlePayload = decodeGoogleCredential(credential)
        const email = googlePayload?.email
        const nome = googlePayload?.name

        if (!email) {
            return res.status(400).json({ error: 'Token Google non valido (email mancante)' })
        }

        const userData = await loginGoogle(email, nome);
        res.json({
            token: credential,
            user: userData,
        });
    } catch (error) {
        const message = error?.message || 'Errore nell\'autenticazione'
        const status = /non trovato/i.test(message) ? 401 : 500
        res.status(status).json({ error: message });
    }
});

// Retro-compatibilità con vecchio endpoint /login
app.post('/login', async (req, res) => {
    const email = req.body?.email
    if (!email) return res.status(400).json({ error: 'Email mancante' })
    try {
        const userData = await loginGoogle(email, req.body?.nome)
        res.json({
            token: `legacy:${email}`,
            user: userData,
        })
    } catch (error) {
        const message = error?.message || 'Errore nell\'autenticazione'
        const status = /non trovato/i.test(message) ? 401 : 500
        res.status(status).json({ error: message })
    }
})

