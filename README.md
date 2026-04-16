# Aula-Net

Applicazione web per la gestione e prenotazione delle aule scolastiche.

Il progetto e composto da:
- `Frontend` in React + Vite
- `Backend` in Node.js + Express
- Database MySQL (dump incluso: `aula_net.sql`)

## Funzionalita principali

- visualizzazione delle aule e delle classi
- gestione prenotazioni (creazione, elenco, eliminazione)
- autenticazione utente con Google
- controllo ruoli lato backend (docente, ATA, admin)

## Struttura del repository

- `Frontend/` interfaccia utente React
- `Backend/` API REST e logica server
- `aula_net.sql` struttura e dati iniziali del database

## Prerequisiti

Installa questi strumenti sul nuovo dispositivo:
- Node.js 18+ (consigliato LTS)
- npm (incluso con Node.js)
- MySQL Server 8+
- MySQL Workbench
- Git

Verifica rapida:

```bash
node -v
npm -v
mysql --version
```

## Installazione completa su un nuovo dispositivo

### 1) Clona il progetto

```bash
git clone <URL_DEL_REPOSITORY>
cd Aula-Net_Gruppo-Matteucci-Pangrazio-Montanucci
```

### 2) Importa il database con MySQL Workbench

1. Apri **MySQL Workbench** e connettiti al server locale.
2. Crea (se necessario) un database chiamato `aula_net`.
3. Vai su **Server > Data Import**.
4. Seleziona **Import from Self-Contained File** e scegli il file `aula_net.sql` del progetto.
5. In **Default Target Schema** seleziona `aula_net`.
6. Clicca **Start Import**.

Al termine troverai tabelle come `aule`, `classi`, `prenotazioni`, `utenti`.

### 3) Configura i file `.env`

#### Backend

Dentro `Backend/` crea il file `.env` partendo da `.env.example`:

```env
MYSQL_HOST=localhost
MYSQL_USER=root
MYSQL_PASSWORD=la_tua_password_mysql
MYSQL_DATABASE=aula_net
PORT=3000
```

#### Frontend

Dentro `Frontend/` crea il file `.env` partendo da `.env.example`:

```env
VITE_API_BASE_URL=http://localhost:3000
VITE_GOOGLE_CLIENT_ID=il_tuo_google_client_id
VITE_BYPASS_AUTH=true
VITE_BYPASS_EMAIL=email@gmail.com
```

Note:
- `VITE_API_BASE_URL` deve puntare al backend.
- `VITE_BYPASS_AUTH=true` abilita un accesso di sviluppo senza login Google reale.
- Per uso reale imposta `VITE_BYPASS_AUTH=false` e configura `VITE_GOOGLE_CLIENT_ID`.

### 4) Installa le dipendenze (`npm install`)

Esegui i comandi richiesti in entrambe le cartelle:

```bash
cd Backend
npm install
```

```bash
cd ../Frontend
npm install
```

### 5) Avvia l'app

Apri due terminali separati.

Terminale 1 (backend):

```bash
cd Backend
npm run dev
```

Terminale 2 (frontend):

```bash
cd Frontend
npm run dev
```

Il frontend sara disponibile normalmente su `http://localhost:5173` (porta Vite predefinita) e comunichera con il backend su `http://localhost:3000`.

## Script disponibili

### Backend (`Backend/package.json`)

- `npm run dev` avvio server in watch mode
- `npm start` avvio server normale

### Frontend (`Frontend/package.json`)

- `npm run dev` avvio in sviluppo
- `npm run build` build produzione
- `npm run preview` anteprima build
- `npm run lint` controllo lint

## API principali (backend)

- `GET /prenotazioni`
- `POST /prenotazioni`
- `DELETE /prenotazioni/:id`
- `GET /aule`
- `GET /classi`
- `GET /utente`
- `POST /login/google`
- `POST /login` (retro-compatibilita)

## Troubleshooting rapido

- Errore connessione DB:
  - verifica credenziali in `Backend/.env`
  - controlla che MySQL sia avviato
  - conferma che il DB si chiami `aula_net`

- Frontend non raggiunge backend:
  - controlla `VITE_API_BASE_URL` in `Frontend/.env`
  - verifica che il backend sia in ascolto sulla porta `3000`

- Login Google fallisce:
  - controlla `VITE_GOOGLE_CLIENT_ID`
  - verifica che l'email sia presente nella tabella `utenti`

## Note per il team

- Mantieni aggiornato `aula_net.sql` quando cambiano schema o dati base.
- Non committare file `.env` con credenziali reali.
