// ============================================================
// config/passport.config.ts  –  P1 (Gestione utenti)
import passport from "passport";
import { Strategy as JwtStrategy, ExtractJwt } from "passport-jwt";
import { jwtSecret } from "./auth.config";
import User from "../models/User";
// ============================================================
// Scopo: configurare Passport.js con la strategia JWT (Bearer Token).
const estraiToken = ExtractJwt.fromAuthHeaderAsBearerToken();
//
// Pacchetti: passport, passport-jwt  (+ @types/passport, @types/passport-jwt)
//
// Passi:
// 1. Importare JwtStrategy ed ExtractJwt da "passport-jwt"
// 2. Opzioni della strategia:
//      - jwtFromRequest -> ExtractJwt.fromAuthHeaderAsBearerToken()
//        (il client manda l'header:  Authorization: Bearer <token>)
//      - secretOrKey    -> il secret preso da auth.config.ts / process.env.JWT_SECRET
//      - passReqToCallback: true  (utile se volete confrontare il token, vedi logout)
// 3. Funzione di verifica (riceve il payload decodificato del token):
//      - cercare l'utente nel DB tramite l'id contenuto nel payload
//      - se non esiste -> done(null, false)
//      - LOGOUT: se nel modello User salvate il token attuale (campo "token"),
//        controllate che il token della richiesta sia uguale a quello salvato.
//        Se l'utente ha fatto logout (token = null) -> done(null, false)
//      - se tutto ok -> done(null, utente)  ==> l'utente finisce in req.user
// 4. passport.use(strategia)
// 5. Ricordarsi di importare questo file in app.ts e fare app.use(passport.initialize())
//
// Nota: con JWT NON servono sessioni -> { session: false } quando si autentica.

passport.use(
    new JwtStrategy(
        {
            jwtFromRequest: estraiToken,
            secretOrKey: jwtSecret as string,
            passReqToCallback: true,
        },
        async (req, payload, done) => {
            try {
                const utente = await User.findById(payload.id);

                if (!utente) {
                    return done(null, false);
                }

                const tokenRicevuto = estraiToken(req);
                if (utente.token !== tokenRicevuto) {
                    return done(null, false);
                }

                return done(null, utente);
            } catch (errore) {
                return done(errore, false);
            }
        }
    )
);