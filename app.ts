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
//    In più vi serve anche la funzione express() (export di default), es.:
//    import di default "express" + il tipo Express.
// ❌ Il pacchetto express non è ancora installato (non è nel package.json):
//    bun add express  e  bun add -d @types/express
import { Express } from "express";

// ❌ La classe "App" non esiste: non è definita né importata da nessuna parte.
//    Avete due strade, scegliete UNA:
//    a) SEMPLICE (consigliata): const app = express();  e poi gli app.use(...) qui sotto.
//    b) A CLASSE: creare un file (es. App.ts) con una classe App che nel costruttore
//       fa express() e registra middleware/rotte, e un metodo getApp() che la restituisce.
//       Poi importarla qui. È più codice per lo stesso risultato.
const app: Express = new App().getApp();

// ✅ Export di default corretto: index.ts lo importa con "import app from './app'".
export default app;
