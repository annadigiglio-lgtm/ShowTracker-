// ============================================================
// controllers/auth.controller.ts  –  P1 (Gestione utenti)
// ============================================================
// Cos'è un controller? Una funzione (req, res, next) che legge la richiesta,
// usa i modelli/service e manda la risposta. Niente definizione di URL qui:
// gli URL stanno in routes/auth.routes.ts.
//
// Pacchetti: bcrypt (oppure Bun.password, già incluso in Bun), jsonwebtoken
//
// register
//   - body: nome, email, password
//   - validare: campi presenti, email valida, password lunga almeno N caratteri
//   - se l'email esiste già -> 409 Conflict
//   - fare l'HASH della password prima di salvarla (MAI in chiaro!)
//   - creare l'utente; rispondere 201 con i dati dell'utente SENZA password
//
// login
//   - body: email, password
//   - cercare l'utente per email; se non c'è -> 401 "Credenziali non valide"
//   - confrontare la password con l'hash; se sbagliata -> 401 (stesso messaggio,
//     così non si capisce se è sbagliata l'email o la password)
//   - generare il JWT con jsonwebtoken: payload { id: user._id }, secret, expiresIn
//     (valori da config/auth.config.ts)
//   - salvare il token nel campo "token" dell'utente (serve per il logout)
//   - rispondere 200 con { token }
//
// logout  (rotta protetta)
//   - l'utente arriva da req.user (lo mette Passport)
//   - impostare user.token = null e salvare
//   - da quel momento il vecchio token viene rifiutato (vedi config/passport.config.ts)
//   - rispondere 200 "Logout effettuato"
//
// me  (rotta protetta, opzionale ma comoda per i test)
//   - restituire req.user senza password
//
// Nota: utils/sign.ts non serve se usate jsonwebtoken, che firma e verifica da solo.

import type { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import User from '../models/User';
import { jwtSecret, jwtExpiresIn } from '../config/auth.config';

const register = async (req: Request, res: Response) => {
    try {
        const { nome, email, password } = req.body;

        // Validazione dei campi
        if (!nome || !email || !password) {
            return res.status(400).json({ message: 'Tutti i campi sono obbligatori.' });
        }

        // Verifica se l'email è già in uso
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(409).json({ message: 'Email già in uso.' });
        }

        // Hash della password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Creazione dell'utente
        const user = new User({
            nome,
            email,
            password: hashedPassword
        });

        await user.save();

        // Risposta con i dati dell'utente (senza password)
        return res.status(201).json({
            id: user._id,
            nome: user.nome,
            email: user.email
        });
    } catch (error) {
        console.error('Errore durante la registrazione:', error);
        return res.status(500).json({ message: 'Errore interno del server.' });
    }
};

const login = async (req: Request, res: Response) => {
    try {
        const { email, password } = req.body;

        // Validazione dei campi
        if (!email || !password) {
            return res.status(400).json({ message: 'Email e password sono obbligatorie.' });
        }
        // Ricerca dell'utente per email
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(401).json({ message: 'Credenziali non valide.' });
        }
        // Verifica della password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ message: 'Credenziali non valide.' });
        }

        // Generazione del token JWT
        const token = jwt.sign({ id: user._id }, jwtSecret as any, { expiresIn: jwtExpiresIn });
        return res.status(200).json({ message: 'Login effettuato', token });
    } catch (error) {
        console.error('Errore durante il login:', error);
        return res.status(500).json({ message: 'Errore interno del server.' });
    }
};

const logout = async (req: Request, res: Response) => {
    try {
        // Recupera l'utente dalla richiesta
        const user = req.user as any; // req.user viene popolato da Passport
        if (!user) {
            return res.status(401).json({ message: 'Utente non autenticato.' });
        }
        // Imposta il token a null per invalidare il token corrente
        user.token = null;
        await user.save();
        return res.status(200).json({ message: 'Logout effettuato.' });
    } catch (error) {
        console.error('Errore durante il logout:', error);
        return res.status(500).json({ message: 'Errore interno del server.' });
    }
};

const me = async (req: Request, res: Response) => {
    try {
        const user = req.user as any;
        if (!user) {
            return res.status(401).json({ message: 'Utente non autenticato.' });
        }
        // Restituisce i dati dell'utente senza la password
        const { password, ...userData } = user.toObject();
        return res.status(200).json(userData);
    } catch (error) {
        console.error('Errore durante la richiesta dei dati utente:', error);
        return res.status(500).json({ message: 'Errore interno del server.' });
    }
};

export { register, login, logout, me };
