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
