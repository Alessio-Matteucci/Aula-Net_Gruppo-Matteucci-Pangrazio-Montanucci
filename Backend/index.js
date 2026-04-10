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

export function checkRuoli(ruoliConsentiti) {
    return (req, res, next) => {
        const userRuolo = req.user?.ruolo;

        if (!userRuolo || !ruoliConsentiti.includes(userRuolo)) {
            return res.status(403).json({ error: 'Accesso negato' });
        }

        next();
    };
}

//GET prenotazioni, per restituire tutte le prenotazioni (filtrabili data e ora), permessi tutti
export async function prenotazioni(filters = {}) {
    try {
        let query = 'SELECT * FROM prenotazioni WHERE 1=1';
        const params = [];

        if (filters.data) {
            query += ' AND data = ?';
            params.push(filters.data);
        }

        if (filters.ora) {
            query += ' AND ora = ?';
            params.push(filters.ora);
        }
        query += ' ORDER BY data ASC, ora ASC';

        const [rows] = await pool.query(query, params);
        return rows;

    } catch (error) {
        console.error('Error fetching prenotazioni:', error);
        throw error;
    }
}

//POST prenotazione, per creare una nuova prenotazione, permessi Docente,ATA,ADMIN. La prenotazione va sull'aula e ci va: id, aula_id, utente_id, data, ora_inizio, ora_fine, created_at. 
//da corregere


//delete prenotazioni/:id, per eliminare una prenotazione esistente, permessi: il docente può eliminare solo le proprie prenotazioni, l'admin può eliminare tutte le prenotazioni
//da corregere
export async function deletePrenotazione(id, user) {
    try {
        let query = 'DELETE FROM prenotazioni WHERE id = ?';
        const params = [id];

        if (user.ruolo === 'Docente') {
            query += ' AND email = ?';
            params.push(user.email);
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