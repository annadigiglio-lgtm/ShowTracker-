// ============================================================
// routes/lista.routes.ts  –  P3 (Liste personali)
// ============================================================
// Montato su /api/liste. Tutte PROTETTE (middleware JWT).
//
// | Metodo | URL                  | Body                 | Controller           |
// |--------|----------------------|----------------------|----------------------|
// | POST   | /                    | nome, descrizione?   | createLista          |
// | GET    | /                    | -                    | getMyListe           |
// | GET    | /:id                 | -                    | getListaById         |
// | PATCH  | /:id                 | nome?, descrizione?  | updateLista          |
// | DELETE | /:id                 | -                    | deleteLista          |
// | POST   | /:id/media           | mediaId              | addMediaToLista      |
// | DELETE | /:id/media/:mediaId  | -                    | removeMediaFromLista |

import { Router } from "express";
import { authenticateJWT } from "../middleware/auth.middleware";
import { createLista, getMyListe, getListaById, updateLista, deleteLista, addMediaToLista, removeMediaFromLista } from "../controllers/lista.controller";

const router = Router();

router.use(authenticateJWT);

router.post("/", createLista);
router.get("/", getMyListe);
router.get("/:id", getListaById);
router.patch("/:id", updateLista);
router.delete("/:id", deleteLista);
router.post("/:id/media", addMediaToLista);
router.delete("/:id/media/:mediaId", removeMediaFromLista);

export default router;
