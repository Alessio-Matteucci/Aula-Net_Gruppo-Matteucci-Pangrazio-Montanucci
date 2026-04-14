import mysql from 'mysql2';
import dotenv from 'dotenv';

dotenv.config();

const pool = mysql.createPool({
    host: process.env.MYSQL_HOST,
    user: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASSWORD,
    database: process.env.MYSQL_DATABASE,
    port: 3306
}).promise(); 

export default pool;

//controlla se il ruolo è tra quelli permessi in ruoliPermessi, se no da errore
export function checkRuoli(ruoliPermessi) {
    return (req, res, next) => {
        const user = req.user;

        if (user && ruoliPermessi.includes(user.ruolo)) {
            next();
        } else {
            res.status(403).json({ error: 'Accesso negato' });
        }
    };
}

//GET prenotazioni, per restituire tutte le prenotazioni (filtrabili data e ora), permessi tutti
export async function prenotazioni(filters = {}) {
    try {
        let query = 'SELECT * FROM prenotazioni';
        const params = [];
const conditions = [];

        if (filters.data) {
            conditions.push('data = ?');
            params.push(filters.data);
        }
        if (filters.ora) {
            conditions.push('ora_inizio <= ? AND ora_fine >= ?');
            params.push(filters.ora, filters.ora);
        }

        if (conditions.length > 0) {
            query += ' WHERE ' + conditions.join(' AND ');
            query += ' ora_inizio <= ? AND ora_fine >= ?';
            params.push(filters.ora, filters.ora);
        }
        const [rows] = await pool.query(query, params);
        return rows;
    } catch (error) {
        console.error('Error fetching prenotazioni:', error);
        throw error;
    }
}

//POST prenotazione, per creare una nuova prenotazione, permessi Docente,ATA,ADMIN. La prenotazione va sull'aula e ci va: id, aula_id, utente_id, data, ora_inizio, ora_fine, created_at. 
export async function createPrenotazione(prenotazioneData) {
    try {
        const { aula_id, utente_id, data, ora_inizio, ora_fine } = prenotazioneData;
        const [result] = await pool.query(
            'INSERT INTO prenotazioni (aula_id, utente_id, data, ora_inizio, ora_fine, created_at) VALUES (?, ?, ?, ?, ?, NOW())',
            [aula_id, utente_id, data, ora_inizio, ora_fine]
        );
        return { id: result.insertId, ...prenotazioneData };
    } catch (error) {
        console.error('Error creating prenotazione:', error);
        throw error;
    }
};


//delete prenotazioni/:id, per eliminare una prenotazione esistente, permessi: il docente può eliminare solo le proprie prenotazioni, l'admin può eliminare tutte le prenotazioni
//da corregere
export async function deletePrenotazione(id, user) {
    try {
        let query = 'DELETE FROM prenotazioni WHERE id = ?';
        const params = [id];

        if (user.ruolo === 'Docente') {
            query += ' AND utente_id = ?';
            params.push(user.id);
        }

        const [result] = await pool.query(query, params);

        if (result.affectedRows === 0) {
            throw new Error('Prenotazione non trovata o accesso negato');
        }

        return { message: 'Prenotazione eliminata con successo' };

    } catch (error) {
        console.error('Error deleting prenotazione:', error);
        throw error;
    }
}

//GET /aule, per restituire tutte le aule disponibili, permessi tutti
export async function aule() {
    try {
        const [rows] = await pool.query('SELECT * FROM aule');
        return rows;
    } catch (error) {
        console.error('Error fetching aule:', error);
        throw error;
    }
}

//GET /classi, per restituire tutte le classi disponibili, permessi tutti
export async function classi() {
    try {
        const [rows] = await pool.query('SELECT * FROM classi');
        return rows;
    } catch (error) {
        console.error('Error fetching classi:', error);
        throw error;
    }
}

//GET /utente, per restituire i dati dell'utente autenticato, permessi tutti
export async function getUtente(email) {
    try {
        const [rows] = await pool.query('SELECT * FROM utenti WHERE email = ?', [email]);
        return rows[0];
    } catch (error) {
        console.error('Error fetching utente:', error);
        throw error;
    }
}

//post /login/google, per autenticare un utente tramite Google, permessi tutti e controlla se c'è un'account con quella email, se c'è lo logga se no da errore
export async function loginGoogle(email, nome) {
    try {
        const [rows] = await pool.query('SELECT * FROM utenti WHERE email = ?', [email]);
        if (rows.length > 0) {
            return rows[0];
        } else {
            throw new Error('Utente non trovato');
        }

    } catch (error) {
        console.error('Error during Google login:', error);
        throw error;
    }
}