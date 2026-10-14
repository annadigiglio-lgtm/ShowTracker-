// Secret JWT e expiration del token

// ============================================================
// REVISIONE  –  P1
// ============================================================
// ✅ Il commento descrive correttamente lo scopo del file.
// ❌ Però è vuoto: va scritto.
//
// Cosa esportare:
// - jwtSecret     -> process.env.JWT_SECRET    (MAI scritto qui dentro in chiaro!)
// - jwtExpiresIn  -> process.env.JWT_EXPIRES_IN (es. "1h"), con un valore di default
//
// Consiglio: se JWT_SECRET manca, lanciate un errore all'avvio con un
// messaggio chiaro. Meglio accorgersene subito che avere token firmati
// con "undefined".
//
// Chi lo usa: controllers/auth.controller.ts (per firmare il token al login)
// e config/passport.config.ts (per verificarlo). Devono usare LO STESSO secret.

import dotenv from "dotenv";
dotenv.config();

const jwtSecret = process.env.JWT_SECRET;
if (!jwtSecret) {
    throw new Error("JWT_SECRET is not defined in environment variables");
}

const jwtExpiresIn = process.env.JWT_EXPIRES_IN || "1h";

export { jwtSecret, jwtExpiresIn };
