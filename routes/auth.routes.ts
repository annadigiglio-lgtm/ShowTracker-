// ============================================================
// routes/auth.routes.ts  –  P1 (Gestione utenti)
// ============================================================
// Qui si collegano gli URL alle funzioni di controllers/auth.controller.ts.
// Montato su /api/auth (vedi routes/index.ts).
//
// | Metodo | URL        | Protetta | Controller |
// |--------|------------|----------|------------|
// | POST   | /register  | NO       | register   |
// | POST   | /login     | NO       | login      |
// | POST   | /logout    | SI       | logout     |
// | GET    | /me        | SI       | me         |
//
// "Protetta" = prima del controller va messo il middleware di
// middleware/auth.middleware.ts (quello che usa Passport JWT).

import { Router } from "express";
import { authenticateJWT } from "../middleware/auth.middleware";
import bcrypt from "bcrypt";
import User from "../models/User.ts";
import jwt from "jsonwebtoken";

const router = Router();

// Rotte pubbliche (non protette)
router.post("/register", async (req, res) => {
    try {
        // Estrare i dati
        const { email, password, nome } = req.body;
        if (!email || !password || !nome) {
            return res.status(400).json({ message: "Missing required fields" });
        }

        // Verificare se l'utente esiste già
        const userExists = await User.findOne({ email });
        if (userExists) {
            return res.status(400).json({ message: "User already exists" });
        }

        // Criptare la password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Salvare l'utente nel database 
        const user = new User({
            nome,
            email,
            password: hashedPassword,
        });
        await user.save();

        // Restituire una risposta di successo e il token JWT generato 
        // per autenticare l'utente appena registrato
        res.json({ message: "User registered", token: "jwt_token_here"});
    } catch (error) {
        res.status(500).json({ message: "Error registering user", error });
    }
});

router.post("/login", async (req, res) => {
    // Estrae i dati di login dalla richiesta
    const { email, password } = req.body;

    try {
        // Cercare l'utente nel database tramite l'email fornita
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: "User not found" });
        }

        // Confrontare la password fornita con quella salvata nel database
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: "Invalid password" });
        }

        // Se le password corrispondono, generare un token JWT per l'utente con jwt.sign() 
        // (vedi controllers/auth.controller.ts) e restituirlo nella risposta
        const payload = { id: user._id, email: user.email };
        const token = jwt.sign(payload, process.env.JWT_SECRET || "default_secret", {
            expiresIn: "1h", // Imposta la scadenza del token a 1 ora
        });

        res.json({ 
            message: "User logged in", 
            token: "Bearer " + token 
        });
    } catch (error) {
        res.status(500).json({ message: "Error logging in user", error });
    }
});

// Rotte protette (richiedono autenticazione)
router.post("/logout", authenticateJWT, (req, res) => {
    // I token JWT sono stateless, quindi non possono essere invalidati lato server.
    // Devono essere eliminati dal localStorage lato client
    // Lato server confermiamo l'operazine e cancelliamo cookie httpOnly se presenti
    res.clearCookie("token"); // Se stai usando cookie per il token, e non so se li sto usando... non credo

    // Poichè abbiamo il campo token nello User (model), dobbiamo metterlo null 
    // Così passport rifiuta il vecchio token al nuovo accesso 
    const user = req.user as any;
    user.token = null;
    user.save();

    res.json({
        message: "User logged out. Please remove the token from your client."
    })
});

router.get("/me", authenticateJWT, (req, res) => {
    // req.user è disponibile dal middleware di autenticazione JWT
    // e contiene già l'utente autenticato

    // Rimuoviamo la password dalla risposta
    const user = req.user as any;
    const {password, ...userData } = user.toObject() ? user.toObject() : user;
    
    res.json({ user: userData });
});

export default router;