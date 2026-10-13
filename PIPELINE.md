# ShowTracker – Pipeline di lavoro del gruppo

Verifica intermedia Node.js, gruppo di 4 persone.

## Chi fa cosa

| Persona | Area | Responsabilità |
|---|---|---|
| **P1** | Setup + **A. Gestione utenti** | Struttura del progetto Express, connessione al database, file `.env`, modello `User`, registrazione / login / logout, configurazione di Passport.js con la strategia JWT (Bearer Token), middleware che protegge le rotte |
| **P2** | **B. Integrazione TMDb** | Modulo che chiama le API TMDb (chiave API nel `.env`), ricerca di film e serie, dettaglio con titolo, trama, cast, valutazioni, trailer e immagini, rotte di ricerca e dettaglio |
| **P3** | **C. Liste personali** | Modello del contenuto salvato e modello `Lista`, salvataggio di un contenuto TMDb nel database dell'utente, creazione / modifica / eliminazione delle liste ("Da vedere", "Visti", …), aggiunta e rimozione di contenuti dalle liste, stato visto / da vedere |
| **P4** | **C. Valutazioni e commenti** + collaudo | Modello per valutazione e commento, rotte per aggiungere / modificare / eliminare valutazioni e commenti, gestione centralizzata degli errori, collection Postman con tutti gli endpoint, README finale |

> P4 ha meno codice "di base" perché fa anche da tester: prova le rotte degli altri appena vengono unite e segnala i problemi.

---

## Fase 0 – Insieme (tutti e 4, all'inizio)

Prima di scrivere codice, decidete insieme:

- [x] **Struttura delle cartelle**, ad esempio `routes/`, `controllers/`, `models/`, `middleware/`, `services/`, `config/`
- [x] **Modelli dei dati**: quali campi ha `User`, contenuto salvato, `Lista`, commento / valutazione, e come si collegano tra loro (chi possiede cosa)
- [ ] **Elenco degli endpoint**: metodo, URL, body richiesto, risposta. Scriveteli nella tabella qui sotto, così ognuno sa cosa aspettarsi dagli altri.
- [ ] **Convenzioni**: formato delle risposte JSON e degli errori, nomi in italiano o in inglese, codici HTTP
- [ ] **Repository GitHub** creata da P1, con gli altri 3 aggiunti come collaboratori

### Contratto degli endpoint (da compilare insieme)

| Metodo | URL | Protetta? | Body | Risposta | Responsabile |
|---|---|---|---|---|---|
| GET | /utenti | Y | meh | lista utenti | P1 |
| POST | /register | N | email, psw, nome, token | success or fail | P2 |
| DELETE | /utenti | Y | id_user | success or fail | P3 |
| POST | /comments | N | comment | ok | P4 |
| GET | themoviedb.org/movie | Y | nome | Media | boh |

> **Revisione della tabella**
> - ⚠️ **GET /utenti:** la consegna non chiede di vedere la lista di tutti gli utenti, e mostrarla a chiunque abbia un token sarebbe un problema di privacy. Al suo posto: `GET /auth/me`, cioè "i miei dati". Il body "meh" non va bene: una GET non ha body.
> - ❌ **POST /register:**
>   - il token **non** si manda alla registrazione, lo **crea il server al login**;
>   - mancano proprio le rotte **login** e **logout**;
>   - è un compito di **P1**, non di P2.
> - ⚠️ **DELETE /utenti:** non è richiesta dalla consegna. Se la tenete, l'id **non** va nel body: l'utente da eliminare è quello del token (`req.user`), altrimenti chiunque potrebbe eliminare chiunque.
> - ❌ **POST /comments:**
>   - deve essere **protetta**, perché bisogna sapere chi commenta;
>   - deve dire **su quale contenuto** si commenta, es. `POST /media/:mediaId/comments`;
>   - "ok" non è una risposta: meglio **201** con il commento creato.
> - ❌ **themoviedb.org/movie:** questo è l'indirizzo di **TMDb**, non una nostra rotta. Il client chiama il **nostro** server (es. `GET /api/tmdb/search?query=...`) e poi è il nostro server a chiamare TMDb. Responsabile: **P2**, non "boh".
> - ⚠️ **Risposta:** "success or fail" va specificata, con status code e forma del JSON (vedi *Convenzioni* sopra).
> - Mancano tutte le rotte delle **liste** (P3) e delle **valutazioni** (P4).
>
> Una proposta completa è in [docs/runtime.md](docs/runtime.md) §7: usatela come base e poi riscrivete questa tabella in modo definitivo.

---

## Fase 1 – Lavoro in parallelo

**Dipendenza critica:** tutte le rotte di P2, P3 e P4 sono protette dal middleware JWT di P1, quindi **P1 consegna per primo il middleware di autenticazione** (anche prima di aver finito registrazione e logout).

Nel frattempo gli altri possono lavorare con un middleware finto temporaneo che imposta un utente fittizio, e sostituirlo appena quello vero è su `main`.

| Ordine | P1 | P2 | P3 | P4 |
|---|---|---|---|---|
| 1 | Setup progetto + push su `main` | Si registra su TMDb e ottiene la chiave API | Modelli contenuto salvato e Lista | Modello valutazione / commento |
| 2 | Modello User + registrazione | Funzione di ricerca | Salvataggio contenuto da TMDb (concordare con P2 il formato dei dati) | Rotte CRUD valutazioni / commenti |
| 3 | Login + generazione JWT | Funzione di dettaglio (cast, trailer, immagini) | CRUD delle liste | Gestione centralizzata degli errori |
| 4 | **Middleware Passport JWT → merge subito** | Rotte e controller | Aggiunta / rimozione contenuti, stato visto / da vedere | Collection Postman |
| 5 | Logout | Test con Postman | Test con Postman | Test delle rotte già unite |

---

## Fase 2 – Integrazione

- [ ] Ognuno unisce il proprio branch su `main` (vedi le regole Git sotto)
- [ ] Si sostituiscono i middleware finti con quello vero di P1
- [ ] P4 esegue l'intera collection Postman sul flusso completo:
  registrazione → login → ricerca → dettaglio → salvataggio → aggiunta a una lista → stato "visto" → valutazione e commento → logout

## Fase 3 – Rifinitura e consegna

- [ ] Correzione dei bug trovati in Fase 2 (ognuno corregge i propri)
- [ ] Controllo che `.env` **non** sia su GitHub e che ci sia un `.env.example`
- [ ] README: come installare, come avviare, elenco degli endpoint
- [ ] Ultimo test completo da una copia pulita (`git clone` + `npm install` + avvio)

---

## Regole Git

1. Nessuno lavora direttamente su `main`.
2. Un branch per persona o per funzionalità: `feature/auth`, `feature/tmdb`, `feature/liste`, `feature/commenti`
3. Prima di iniziare a lavorare: `git pull origin main` e poi merge di `main` nel proprio branch
4. Commit piccoli e con messaggi chiari
5. Ogni merge su `main` passa da una **Pull Request** rivista da almeno un'altra persona
6. Non si toccano i file degli altri senza avvisarli. Se serve modificare un file condiviso (`app.js`, `package.json`), lo si dice nel gruppo.

## File condivisi (a rischio di conflitti)

| File | Gestito da | Gli altri… |
|---|---|---|
| `app.js` / `index.js` | P1 | aggiungono solo la propria riga di registrazione delle rotte |
| `package.json` | tutti | dopo il pull lanciano `npm install` |
| `.env.example` | tutti | aggiungono le variabili che servono (es. P2 la chiave TMDb) |
