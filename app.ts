// ============================================================
// REVISIONE app.ts  –  P1
// ============================================================
// Idea giusta ✅: separare app.ts (configura Express) da index.ts (avvia il server).
// Così l'app si può anche importare nei test senza accendere il server.
//
// Ma così com'è il file NON parte. Vedi i commenti riga per riga.
//
// Cosa manca (in quest'ordine, vedi docs/runtime.md §5):
//   1. creare l'app con express()
//   2. app.use(express.json())          -> altrimenti req.body è undefined
//   3. passport.initialize() + import di config/passport.config.ts
//   4. app.use("/api", routes)          -> il router di routes/index.ts
//   5. middleware notFound (404)
//   6. middleware degli errori          -> SEMPRE per ultimo
// ============================================================

// ⚠️ "Express" è un TIPO, non un valore. Nel tsconfig c'è "verbatimModuleSyntax": true,
//    quindi i tipi vanno importati con "import type" (o "type" davanti al nome).

import type { Express } from "express";
import express from "express";
import passport from "passport";
import "./config/passport.config";
import routes from "./routes";

// ❌ La classe "App" non esiste: non è definita né importata da nessuna parte.
//    Avete due strade, scegliete UNA:
//    a) SEMPLICE (consigliata): const app = express();  e poi gli app.use(...) qui sotto.

const app: Express = express();
app.use(express.json()); // ✅ Serve per leggere req.body (altrimenti è undefined).

passport.initialize(); // ✅ Serve per usare Passport (autenticazione).

app.use("/api", routes);

// Middleware rotte non trovate
app.use((req, res, next) => {
    res.status(404).json({ message: "Not Found" });
});  

// Middleware gestione errori
app.use((err: Error, req: any, res: any, next: any) => {
    console.error(err.stack);
    res.status(500).json({ message: "Internal Server Error" });
});

// ✅ Export di default corretto: index.ts lo importa con "import app from './app'".
export default app;
