Routes      -> le rotte di tutte le pagine e delle API
Controllers -> i controllers
Models      -> i modelli dei dati salvati nel db
Middleware  -> ????
Services    -> ???
Config      -> .env e altri file di configurazione   

---

## Revisione

- ✅ **Routes:** giusto. Solo una precisazione: qui non ci sono "pagine" (niente HTML), è solo un'API che risponde JSON. Le routes collegano **metodo + URL** alla funzione del controller e dicono quali middleware usare.
- ⚠️ **Controllers:** "i controllers" non spiega cosa fanno. Sono le funzioni `(req, res, next)` che leggono la richiesta (body, params, query), controllano i dati, usano i modelli e i service e mandano la risposta con lo status code giusto.
- ✅ **Models:** giusto. Ogni file definisce uno Schema mongoose, cioè la forma dei documenti nel database e le regole sui campi (obbligatorio, unico, ecc.).
- ❌ **Middleware `????`:** sono funzioni che stanno **in mezzo**, tra l'arrivo della richiesta e il controller (o dopo, per gli errori). Possono fermare la richiesta oppure passarla avanti con `next()`. Da noi:
  - `auth.middleware.ts` controlla il token JWT (se non è valido risponde 401)
  - `error.middleware.ts` riceve tutti gli errori e risponde in un formato unico
  - `fakeAuth.middleware.ts` è temporaneo, finché P1 non finisce quello vero
- ❌ **Services `???`:** codice che parla con **sistemi esterni** o che contiene logica riusabile da più controller. Da noi: `tmdb.service.ts`, che fa le chiamate alle API di TMDb. Così i controller non fanno `fetch` direttamente.
- ⚠️ **Config:** il `.env` **non** sta in `config/`, sta nella **radice** del progetto (Bun lo cerca lì). In `config/` ci sono i file `.ts` che **leggono** le variabili del `.env` e preparano le impostazioni: database, Passport, JWT, TMDb.
- ⚠️ **Mancano dall'elenco:**
  - **Utils:** piccole funzioni di aiuto usate da tutti (`AppError.ts`, `asyncHandler.ts`)
  - **Docs:** la documentazione
  - **Postman:** la collection per i test

Il giro completo di una richiesta è spiegato in [runtime.md](runtime.md) §6.
