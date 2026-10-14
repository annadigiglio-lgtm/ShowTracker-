// ============================================================
// routes/media.routes.ts  –  P3 (Contenuti salvati)
// ============================================================
// Montato su /api/media. Tutte PROTETTE (middleware JWT).
//
// | Metodo | URL          | Body                  | Controller   |
// |--------|--------------|-----------------------|--------------|
// | POST   | /            | tmdbId, tipo          | saveMedia    |
// | GET    | /            | (?stato=, ?tipo=)     | getMyMedia   |
// | GET    | /:id         | -                     | getMediaById |
// | PATCH  | /:id/stato   | stato                 | updateStato  |
// | DELETE | /:id         | -                     | deleteMedia  |
//
// Le rotte dei commenti (/media/:mediaId/comments) sono di P4 e stanno
// in routes/comment.routes.ts: non aggiungetele qui per evitare conflitti.

import { Router } from "express";
import { authenticateJWT } from "../middleware/auth.middleware";
import { saveMedia, getMyMedia, getMediaById, updateStato, deleteMedia } from "../controllers/media.controller";

const router = Router();

router.use(authenticateJWT);

router.post("/", saveMedia);
router.get("/", getMyMedia);
router.get("/:id", getMediaById);
router.patch("/:id/stato", updateStato);
router.delete("/:id", deleteMedia);

export default router;

