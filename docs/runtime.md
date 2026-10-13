# Runtime – come si installa, si avvia e come gira ShowTracker

Questo file spiega **cosa serve per far partire il progetto** e **cosa succede quando il server è acceso**.
Tenetelo aggiornato: se aggiungete un pacchetto, una variabile `.env` o una rotta, scrivetelo qui.

---

## 1. Requisiti

| Cosa | Versione / note |
|---|---|
| [Bun](https://bun.sh) | runtime del progetto (esegue TypeScript direttamente, senza compilare) |
| MongoDB | locale (`mongodb://localhost:27017`) oppure un cluster gratuito su MongoDB Atlas |
| Account TMDb | per la chiave API: <https://www.themoviedb.org/settings/api> |
| Postman | per provare le rotte |

> Usate Node + npm invece di Bun? Va bene lo stesso, ma vi servono `tsx` o `ts-node` per eseguire i file `.ts` e il pacchetto `dotenv` per leggere il `.env`. **Scegliete uno dei due tutti insieme** e non mischiateli: il file di lock deve essere uno solo (`bun.lock` oppure `package-lock.json`).

---

## 2. Installazione (da una copia pulita)

```bash
git clone https://github.com/annadigiglio-lgtm/ShowTracker-.git
cd ShowTracker-
bun install
cp .env.example .env     # poi aprite .env e mettete i valori veri
```

### Pacchetti da aggiungere (una volta sola, da chi ne ha bisogno per primo)

| Pacchetto | A cosa serve | Chi |
|---|---|---|
| `express` + `@types/express` | server e rotte | P1 |
| `mongoose` | connessione e modelli MongoDB | P1 |
| `passport`, `passport-jwt` + i rispettivi `@types` | autenticazione Bearer Token | P1 |
| `jsonwebtoken` + `@types/jsonwebtoken` | creare il token al login | P1 |
| `bcrypt` (oppure `Bun.password`, già incluso) | hash delle password | P1 |

Comando: `bun add <pacchetto>` (oppure `bun add -d <pacchetto>` per i `@types`).
Dopo ogni `git pull` che modifica `package.json`, tutti rilanciano `bun install`.

---

## 3. Variabili d'ambiente

Sono elencate in [`.env.example`](../.env.example). Il file `.env` **non va su GitHub**.

| Variabile | Esempio | Usata in |
|---|---|---|
| `PORT` | `3000` | `index.ts` |
| `MONGO_URI` | `mongodb://localhost:27017/showtracker` | `config/db.config.ts` |
| `JWT_SECRET` | stringa lunga e casuale | `config/auth.config.ts`, `config/passport.config.ts` |
| `JWT_EXPIRES_IN` | `1h` | `config/auth.config.ts` |
| `TMDB_API_KEY` | la vostra chiave | `config/tmdb.config.ts` |
| `TMDB_BASE_URL` | `https://api.themoviedb.org/3` | `config/tmdb.config.ts` |
| `TMDB_IMAGE_BASE_URL` | `https://image.tmdb.org/t/p/w500` | `config/tmdb.config.ts` |
| `TMDB_LANGUAGE` | `it-IT` | `config/tmdb.config.ts` |

---

## 4. Comandi

Da aggiungere in `package.json` nella sezione `"scripts"`:

| Script | Comando | Quando |
|---|---|---|
| `dev` | `bun --watch index.ts` | sviluppo: riavvia il server a ogni salvataggio |
| `start` | `bun index.ts` | avvio "normale" / consegna |

Poi: `bun run dev` oppure `bun run start`.

Se tutto è ok in console vedete:

```
DB connesso
Server on :3000
```

---

## 5. Sequenza di avvio

Cosa succede, in ordine, quando lanciate `bun run dev`:

1. **`index.ts`** è il punto di ingresso. Bun carica in automatico le variabili del `.env`.
2. `index.ts` chiama **`connectDB()`** (`config/db.config.ts`). Se il DB non risponde il processo si ferma: meglio un errore subito che un server che risponde 500 a ogni richiesta.
3. `index.ts` importa **`app.ts`**, che prepara l'app Express in questo ordine:
   1. `express.json()` → legge i body JSON
   2. import di `config/passport.config.ts` + `passport.initialize()`
   3. `app.use("/api", routes)` → il router di `routes/index.ts`
   4. middleware `notFound` → 404 per le rotte che non esistono
   5. `middleware/error.middleware.ts` → **sempre per ultimo**
4. `app.listen(PORT)` → il server è in ascolto.

> **L'ordine dei `app.use` conta.** Se il middleware degli errori sta prima delle rotte, non riceve mai gli errori.

---

## 6. Ciclo di vita di una richiesta

Esempio: `POST /api/media` con header `Authorization: Bearer <token>`

```
Client (Postman)
   │
   ▼
express.json()                    legge il body
   │
   ▼
routes/index.ts → media.routes    trova la rotta giusta
   │
   ▼
auth.middleware (Passport JWT)    token assente/non valido/dopo logout → 401
   │                              token ok → req.user = utente
   ▼
media.controller.saveMedia        valida il body → 400 se sbagliato
   │
   ├──► services/tmdb.service     chiede i dati a TMDb (404 / 502 se problemi)
   │
   ├──► models/Media (MongoDB)    salva il documento (409 se già salvato)
   │
   ▼
res.status(201).json(...)         risposta al client

In caso di errore in un punto qualsiasi:
   next(err) ──► error.middleware ──► { success: false, error: { ... } }
```

---

## 7. Mappa delle rotte

Base URL: `http://localhost:3000/api`. 🔒 = serve `Authorization: Bearer <token>`.

| Metodo | URL | 🔒 | Body / Query | Responsabile |
|---|---|---|---|---|
| POST | `/auth/register` | | nome, email, password | P1 |
| POST | `/auth/login` | | email, password | P1 |
| POST | `/auth/logout` | 🔒 | – | P1 |
| GET | `/auth/me` | 🔒 | – | P1 |
| GET | `/tmdb/search` | 🔒 | `?query=&tipo=movie\|tv&page=` | P2 |
| GET | `/tmdb/:tipo/:tmdbId` | 🔒 | – | P2 |
| POST | `/media` | 🔒 | tmdbId, tipo | P3 |
| GET | `/media` | 🔒 | `?stato=&tipo=` | P3 |
| GET | `/media/:id` | 🔒 | – | P3 |
| PATCH | `/media/:id/stato` | 🔒 | stato | P3 |
| DELETE | `/media/:id` | 🔒 | – | P3 |
| POST | `/liste` | 🔒 | nome, descrizione? | P3 |
| GET | `/liste` | 🔒 | – | P3 |
| GET | `/liste/:id` | 🔒 | – | P3 |
| PATCH | `/liste/:id` | 🔒 | nome?, descrizione? | P3 |
| DELETE | `/liste/:id` | 🔒 | – | P3 |
| POST | `/liste/:id/media` | 🔒 | mediaId | P3 |
| DELETE | `/liste/:id/media/:mediaId` | 🔒 | – | P3 |
| GET | `/media/:mediaId/comments` | 🔒 | – | P4 |
| POST | `/media/:mediaId/comments` | 🔒 | content | P4 |
| PATCH | `/comments/:id` | 🔒 | content | P4 |
| DELETE | `/comments/:id` | 🔒 | – | P4 |
| GET | `/media/:mediaId/rating` | 🔒 | – | P4 |
| PUT | `/media/:mediaId/rating` | 🔒 | voto | P4 |
| DELETE | `/media/:mediaId/rating` | 🔒 | – | P4 |

Questa è una **proposta**: confrontatela con la tabella "Contratto degli endpoint" in `PIPELINE.md` e tenete una sola versione definitiva.

---

## 8. Codici HTTP usati

| Codice | Quando |
|---|---|
| 200 | ok (lettura, modifica, eliminazione) |
| 201 | risorsa creata (registrazione, salvataggio, nuova lista, nuovo commento) |
| 400 | body o parametri sbagliati / mancanti, id non valido |
| 401 | token mancante, non valido, scaduto o dopo il logout; credenziali sbagliate |
| 403 | la risorsa esiste ma non è tua (es. modificare il commento di un altro) |
| 404 | risorsa o rotta non trovata |
| 409 | duplicato (email già registrata, contenuto già salvato, lista con lo stesso nome) |
| 500 | errore interno inatteso |
| 502 | TMDb non risponde o risponde con errore |

---

## 9. Collaudo del flusso completo (Fase 2)

Con il server acceso, in Postman ([vedi `postman/README.md`](../postman/README.md)):

1. `POST /auth/register`
2. `POST /auth/login` → copiate/salvate il token
3. `GET /tmdb/search?query=...`
4. `GET /tmdb/movie/:tmdbId`
5. `POST /media` → salvate l'`_id` restituito
6. `POST /liste` e poi `POST /liste/:id/media`
7. `PATCH /media/:id/stato` con `"visto"`
8. `PUT /media/:id/rating` e `POST /media/:id/comments`
9. `POST /auth/logout`
10. Riprovate una rotta protetta con il vecchio token → deve dare **401**

---

## 10. Problemi frequenti

| Sintomo | Causa probabile |
|---|---|
| `MongooseServerSelectionError` all'avvio | MongoDB non è acceso o `MONGO_URI` è sbagliato |
| Sempre 401 anche con il token | manca `Bearer ` davanti al token, oppure `JWT_SECRET` diverso tra login e verifica |
| `req.body` è `undefined` | manca `app.use(express.json())` o è messo dopo le rotte; in Postman il body non è "raw → JSON" |
| TMDb risponde 401 | chiave API sbagliata o non caricata dal `.env` |
| Gli errori non arrivano al middleware degli errori | è registrato prima delle rotte, oppure un controller async non chiama `next(err)` |
| `EADDRINUSE` | la porta è già usata da un altro server acceso: chiudetelo o cambiate `PORT` |
