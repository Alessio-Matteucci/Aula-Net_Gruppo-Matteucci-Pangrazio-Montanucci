# Report contributi progetto

Questo documento riassume le attivita' svolte nel progetto sulla base della cronologia Git disponibile fino al 15/04/2026.

## Quadro generale

- Totale commit analizzati: **21**
- Autori rilevati: **3 persone** (con 4 identita' email, di cui 2 riconducibili a Simone Pangrazio)
- Periodo coperto: **09/04/2026 - 14/04/2026**

## Contributi per autore

### Alessio Matteucci

- Commit: **9**
- Ambiti principali emersi dai messaggi:
  - Inizializzazione e avvio del progetto
  - Sviluppo frontend con pagine essenziali
  - Base ed evoluzione della mappa 2D/interfaccia grafica
  - Hardening del login (controlli sicurezza e fix Google login)
  - Correzione gestione ruoli utente (uppercase)
  - Gestione `.env` in `.gitignore`

Commit associati:
- `dcc674b` - fix uppercase ruoli utente(richiesto da montanucci)
- `d9397b5` - modifiche essenziali al login con controlli aggiuntivi alla sicurezza e fix login con google
- `c31d454` - modifiche interfaccia grafica e ulteriore elaborazione 2d
- `e81e9c0` - Merge branch 'main' of https://github.com/Alessio-Matteucci/Aula-Net_Gruppo-Matteucci-Pangrazio-Montanucci
- `96f1bc8` - aggiunto il file .env al gitignore  + base per mappa 2d
- `164f90b` - frontend con pagine essenziali
- `c0682a3` - fix nomi
- `62ea08b` - push inizializzazione del progetto
- `402c6b7` - Initial commit

### Filippo Montanucci

- Commit: **8**
- Ambiti principali emersi dai messaggi:
  - Costruzione backend e aggiunta funzioni
  - Correzione errori e aggiornamento funzionalita'
  - Test/prova integrazione login Google
  - Bonifica file sensibili (`Delete Backend/.env`)
  - Attivita' di integrazione tramite merge da `main`

Commit associati:
- `d12fa1d` - Merge branch 'main' of https://github.com/Alessio-Matteucci/Aula-Net_Gruppo-Matteucci-Pangrazio-Montanucci
- `4d350d0` - aggiornamento funzioni
- `54a46b1` - aggiunta prova funzione login google
- `a621774` - Delete Backend/.env
- `d7496b7` - Merge branch 'main' of https://github.com/Alessio-Matteucci/Aula-Net_Gruppo-Matteucci-Pangrazio-Montanucci
- `0f6a890` - correzione errori
- `e8b11b3` - aggiunta funzioni
- `39ad43f` - aggiunta cartella backend

### Simone Pangrazio (Officialshespu)

Le statistiche Git mostrano due identita' dello stesso autore:
- `Officialshespu <147031676+Officialshespu@users.noreply.github.com>`
- `Officialshespu <simonepangrazio26@gmail.com>`

Commit complessivi attribuiti: **4**

Ambiti principali emersi dai messaggi:
- Upload iniziale file
- Finalizzazione database
- Fix mappa 2D
- Unione frontend/backend

Commit associati:
- `a59ab5b` - unione frontend backend
- `2975409` - fix mappa 2d
- `d94b520` - finalizzazione database
- `0e7922e` - Add files via upload

## Timeline cronologica (dal piu' vecchio al piu' recente)

- 09/04/2026 - `402c6b7` - Alessio-Matteucci - Initial commit
- 09/04/2026 - `0e7922e` - Officialshespu - Add files via upload
- 09/04/2026 - `62ea08b` - Alessio-Matteucci - push inizializzazione del progetto
- 09/04/2026 - `c0682a3` - Alessio-Matteucci - fix nomi
- 09/04/2026 - `39ad43f` - Filippo Montanucci - aggiunta cartella backend
- 10/04/2026 - `e8b11b3` - Filippo Montanucci - aggiunta funzioni
- 10/04/2026 - `164f90b` - Alessio-Matteucci - frontend con pagine essenziali
- 10/04/2026 - `0f6a890` - Filippo Montanucci - correzione errori
- 10/04/2026 - `d7496b7` - Filippo Montanucci - Merge branch 'main' of https://github.com/Alessio-Matteucci/Aula-Net_Gruppo-Matteucci-Pangrazio-Montanucci
- 10/04/2026 - `d94b520` - Officialshespu - finalizzazione database
- 11/04/2026 - `96f1bc8` - Alessio-Matteucci - aggiunto il file .env al gitignore  + base per mappa 2d
- 11/04/2026 - `a621774` - Filippo Montanucci - Delete Backend/.env
- 11/04/2026 - `54a46b1` - Filippo Montanucci - aggiunta prova funzione login google
- 14/04/2026 - `e81e9c0` - Alessio-Matteucci - Merge branch 'main' of https://github.com/Alessio-Matteucci/Aula-Net_Gruppo-Matteucci-Pangrazio-Montanucci
- 14/04/2026 - `c31d454` - Alessio-Matteucci - modifiche interfaccia grafica e ulteriore elaborazione 2d
- 14/04/2026 - `2975409` - Officialshespu - fix mappa 2d
- 14/04/2026 - `4d350d0` - Filippo Montanucci - aggiornamento funzioni
- 14/04/2026 - `d12fa1d` - Filippo Montanucci - Merge branch 'main' of https://github.com/Alessio-Matteucci/Aula-Net_Gruppo-Matteucci-Pangrazio-Montanucci
- 14/04/2026 - `a59ab5b` - Officialshespu - unione frontend backend
- 14/04/2026 - `d9397b5` - Alessio-Matteucci - modifiche essenziali al login con controlli aggiuntivi alla sicurezza e fix login con google
- 14/04/2026 - `dcc674b` - Alessio-Matteucci - fix uppercase ruoli utente(richiesto da montanucci)

## Note metodologiche

- Le attribuzioni sono state ricavate dai metadati Git (`autore`, `data`, `messaggio commit`).
- Dove i messaggi sono generici (es. "aggiunta funzioni", "correzione errori"), il dettaglio tecnico preciso richiederebbe analisi diff commit-per-commit.
- I commit di merge sono stati mantenuti per rappresentare anche il lavoro di integrazione tra rami.
