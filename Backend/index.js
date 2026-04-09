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

//GET prenotazioni, per restituire tutte le prenotazioni (filtrabili data e ora), permessi tutti
export async function prenotazioni(){
    try {
        const [rows] = await pool.query('SELECT * FROM prenotazioni');
        return rows;
    } catch (error) {
        console.error('Error fetching prenotazioni:', error);
        throw error;
    }
}

//POST prenotazione, per creare una nuova prenotazione, permessi Docente,ATA,ADMIN

export async function createPrenotazione(data) {
    const { nome, cognome, email, data_prenotazione, ora_prenotazione } = data;
    try {
        const [result] = await pool.query(
            'INSERT INTO prenotazioni (nome, cognome, email, data_prenotazione, ora_prenotazione) VALUES (?, ?, ?, ?, ?)',
            [nome, cognome, email, data_prenotazione, ora_prenotazione]
        );
        return { id: result.insertId, ...data };
    }
    catch (error) {
        console.error('Error creating prenotazione:', error);
        throw error;
    }
}

