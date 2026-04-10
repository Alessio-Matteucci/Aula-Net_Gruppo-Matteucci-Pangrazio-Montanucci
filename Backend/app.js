import express from 'express';
import {prenotazioni} from './index.js';
import {createPrenotazione} from './index.js';
import {deletePrenotazione} from './index.js'; 
import { aule } from './index.js';
import {checkRuoli} from './index.js';
import cors from 'cors';
import bodyParser from 'body-parser';

const app = express();
app.use(bodyParser.json());
app.use(cors());

app.listen(3000, () => {
    console.log('Server in ascolto sulla porta 3000');
});



//GET prenotazioni, per restituire tutte le prenotazioni (filtrabili data e ora), permessi tutti
app.get('/prenotazioni', async (req, res) => {
    try {
        const { data, ora } = req.query;

        const prenotazioniList = await prenotazioni({ data, ora });

        res.json(prenotazioniList);
    } catch (error) {
        res.status(500).json({ error: 'Errore nel recupero delle prenotazioni' });
    }
});


//POST prenotazione, per creare una nuova prenotazione, permessi Docente,ATA,ADMIN
app.post('/prenotazioni',checkRuoli(['Docente', 'ADMIN']),
    async (req, res) => {
        try {
            const prenotazioneData = req.body;
            const newPrenotazione = await createPrenotazione(prenotazioneData);

            res.status(201).json({
                message: 'Prenotazione creata con successo',
                prenotazione: newPrenotazione
            });

        } catch (error) {
            res.status(500).json({ error: 'Errore nella creazione della prenotazione' });
        }
    }
);

//delete prenotazioni/:id, per eliminare una prenotazione esistente, permessi: il docente può eliminare solo le proprie prenotazioni, l'admin può eliminare tutte le prenotazioni

app.delete('/prenotazioni/:id', async (req, res) => {
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