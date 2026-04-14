import express from 'express';
import {prenotazioni} from './index.js';
import {createPrenotazione} from './index.js';
import {deletePrenotazione} from './index.js'; 
import { aule } from './index.js';
import { classi } from './index.js';
import { getUtente } from './index.js';
import { loginGoogle } from './index.js';
import {checkRuoli} from './index.js';
import cors from 'cors';
import bodyParser from 'body-parser';
import dotenv from 'dotenv';

const ruoliPermessi = ['Docente', 'ATA', 'ADMIN']
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

app.listen(PORT, () => {
    console.log(`Server in ascolto sulla porta ${PORT}`);
});


//GET prenotazioni, per restituire tutte le prenotazioni (filtrabili data e ora), permessi tutti
app.get('/prenotazioni', async (req, res) => {
    try {
        const { data, ora, start, end, aula_id, classe_id } = req.query;
        const prenotazioniList = await prenotazioni({ data, ora, start, end, aula_id, classe_id });

        res.json(prenotazioniList);
    } catch (error) {
        res.status(500).json({ error: 'Errore nel recupero delle prenotazioni' });
    }
});


//POST prenotazione, per creare una nuova prenotazione, permessi Docente,ATA,ADMIN
app.post('/prenotazioni', checkRuoli(ruoliPermessi), async (req, res) => {
    try {
        const prenotazioneData = req.body;
        const newPrenotazione = await createPrenotazione(prenotazioneData);
        res.status(201).json(newPrenotazione);
    } catch (error) {
        res.status(500).json({ error: 'Errore nella creazione della prenotazione' });
    }
});

//nella post dovrai scrivere: { "aula_id": 1, "utente_id": 1, "data": "2024-06-30", "ora_inizio": "10:00:00", "ora_fine": "12:00:00" } 

//delete prenotazioni/:id, per eliminare una prenotazione esistente, permessi: il docente può eliminare solo le proprie prenotazioni, l'admin può eliminare tutte le prenotazioni

app.delete('/prenotazioni/:id', checkRuoli(['Docente','ADMIN']), async (req, res) => {
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



