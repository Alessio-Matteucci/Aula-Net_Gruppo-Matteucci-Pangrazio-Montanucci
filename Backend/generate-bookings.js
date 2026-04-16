import mysql from 'mysql2';
import dotenv from 'dotenv';
import { normalizeRole } from './index.js';

dotenv.config();

const pool = mysql.createPool({
    host: process.env.MYSQL_HOST,
    user: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASSWORD,
    database: process.env.MYSQL_DATABASE,
    port: 3306
}).promise();

// Dati di test
const utenteTest = [
    { id: 1, email: 'aessiom2007@gmail.com', nome: 'Alessio', cognome: 'Matteucci' },
    { id: 2, email: 'alessio.matteucci@ittterni.org ', nome: 'Alessio', cognome: 'Studente' },
    { id: 3, email: 'simonepangrazio448@gmail.com', nome: 'Simone', cognome: 'Pangrazio' }
];

const classiTest = [
    { id: 1, nome: '1ACA' },
    { id: 2, nome: '1ACM' },
    { id: 3, nome: '1AEE' },
    { id: 4, nome: '1AIT' },
    { id: 5, nome: '1AMM' },
    { id: 6, nome: '1BEE' },
    { id: 7, nome: '1BIT' },
    { id: 8, nome: '1BMM' },
    { id: 9, nome: '1CIT' },
    { id: 10, nome: '1CMM' },
    { id: 11, nome: '1DIT' },
    { id: 12, nome: '2ACM' },
    { id: 13, nome: '2AE' },
    { id: 14, nome: '2AIT' },
    { id: 15, nome: '2AMM' },
    { id: 16, nome: '2BCM' },
    { id: 17, nome: '2BEE' },
    { id: 18, nome: '2BIT' },
    { id: 19, nome: '2BMM' },
    { id: 20, nome: '2CA' }
];

const orariTipici = [
    { inizio: '08:00:00', fine: '09:00:00' },
    { inizio: '09:00:00', fine: '10:00:00' },
    { inizio: '10:00:00', fine: '11:00:00' },
    { inizio: '11:00:00', fine: '12:00:00' },
    { inizio: '12:00:00', fine: '13:00:00' },
    { inizio: '13:00:00', fine: '14:00:00' },
    { inizio: '14:00:00', fine: '15:00:00' },
    { inizio: '15:00:00', fine: '16:00:00' },
    { inizio: '16:00:00', fine: '17:00:00' },
    { inizio: '17:00:00', fine: '18:00:00' }
];

function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function getRandomElement(arr) {
    return arr[Math.floor(Math.random() * arr.length)];
}

function getRandomDate(start, end) {
    const startDate = new Date(start);
    const endDate = new Date(end);
    const randomTime = startDate.getTime() + Math.random() * (endDate.getTime() - startDate.getTime());
    return new Date(randomTime);
}

function formatDate(date) {
    const y = date.getFullYear();
    const m = String(date.getMonth() + 1).padStart(2, '0');
    const d = String(date.getDate()).padStart(2, '0');
    return `${y}-${m}-${d}`;
}

async function generateBookings(numBookings = 50) {
    const connection = await pool.getConnection();
    
    try {
        await connection.beginTransaction();
        
        // Pulisci le prenotazioni esistenti (opzionale)
        console.log('Pulizia delle prenotazioni esistenti...');
        await connection.query('DELETE FROM prenotazione_classi');
        await connection.query('DELETE FROM prenotazioni');
        
        console.log(`Generazione di ${numBookings} prenotazioni...`);
        
        for (let i = 0; i < numBookings; i++) {
            // Dati casuali per la prenotazione
            const utente = getRandomElement(utenteTest);
            const aulaId = getRandomInt(1, 119);
            const data = formatDate(getRandomDate('2026-04-01', '2026-04-30'));
            const orario = getRandomElement(orariTipici);
            
            // Inserisci la prenotazione principale
            const [result] = await connection.query(
                'INSERT INTO prenotazioni (aula_id, utente_id, data, ora_inizio, ora_fine, created_at) VALUES (?, ?, ?, ?, ?, NOW())',
                [aulaId, utente.id, data, orario.inizio, orario.fine]
            );
            
            const prenotazioneId = result.insertId;
            
            // Aggiungi 1-3 classi casuali
            const numClassi = getRandomInt(1, 3);
            const classiSelezionate = [];
            
            while (classiSelezionate.length < numClassi) {
                const classe = getRandomElement(classiTest);
                if (!classiSelezionate.find(c => c.id === classe.id)) {
                    classiSelezionate.push(classe);
                }
            }
            
            // Inserisci le classi nella tabella di collegamento
            for (const classe of classiSelezionate) {
                await connection.query(
                    'INSERT INTO prenotazione_classi (prenotazione_id, classe_id) VALUES (?, ?)',
                    [prenotazioneId, classe.id]
                );
            }
            
            console.log(`Prenotazione ${i + 1}/${numBookings}: Aula ${aulaId}, ${data}, ${orario.inizio}-${orario.fine}, Utente: ${utente.nome} ${utente.cognome}, Classi: ${classiSelezionate.map(c => c.nome).join(', ')}`);
        }
        
        await connection.commit();
        console.log('Prenotazioni generate con successo!');
        
        // Statistiche
        const [stats] = await connection.query('SELECT COUNT(*) as total FROM prenotazioni');
        const [classiStats] = await connection.query('SELECT COUNT(*) as total FROM prenotazione_classi');
        
        console.log(`\nStatistiche finali:`);
        console.log(`- Prenotazioni totali: ${stats[0].total}`);
        console.log(`- Collegamenti classi: ${classiStats[0].total}`);
        
    } catch (error) {
        await connection.rollback();
        console.error('Errore durante la generazione delle prenotazioni:', error);
        throw error;
    } finally {
        connection.release();
    }
}

// Esecuzione
const numBookings = process.argv[2] ? parseInt(process.argv[2]) : 50;

if (isNaN(numBookings) || numBookings <= 0) {
    console.log('Usage: node generate-bookings.js [numero_prenotazioni]');
    console.log('Esempio: node generate-bookings.js 100');
    process.exit(1);
}

console.log(`Inizio generazione di ${numBookings} prenotazioni...`);
generateBookings(numBookings)
    .then(() => {
        console.log('Operazione completata!');
        process.exit(0);
    })
    .catch((error) => {
        console.error('Errore:', error);
        process.exit(1);
    });

export { generateBookings };
