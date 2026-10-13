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

const router = Router();

router.post("/register", (req, res) => {
    // Implementare la logica per la registrazione
    const { email, password, nome } = req.body;

    res.json({ message: "User registered" });
});

router.post("/login", (req, res) => {
    // Implementare la logica per il login
    const { email, password } = req.body;

    res.json({ message: "User logged in" });
});

router.post("/logout", (req, res) => {
    // Implementare la logica per il logout
    const { email, password } = req.body;

    res.json({ message: "User logged out" });
});

router.get("/me", (req, res) => {
    // Implementare la logica per ottenere le informazioni dell'utente
    const { email, password } = req.body;
    
    res.json({ message: "User information" });
});

export default router;