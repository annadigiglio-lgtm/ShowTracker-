// ============================================================
// routes/comment.routes.ts  –  P4 (Valutazioni e commenti)
// ============================================================
// Montato su /api (vedi routes/index.ts). Tutte PROTETTE (middleware JWT).
//
// | Metodo | URL                         | Body     | Controller    |
// |--------|-----------------------------|----------|---------------|
// | GET    | /media/:mediaId/comments    | -        | getComments   |
// | POST   | /media/:mediaId/comments    | content  | addComment    |
// | PATCH  | /comments/:id               | content  | updateComment |
// | DELETE | /comments/:id               | -        | deleteComment |
// | GET    | /media/:mediaId/rating      | -        | getRating     |
// | PUT    | /media/:mediaId/rating      | voto     | setRating     |
// | DELETE | /media/:mediaId/rating      | -        | deleteRating  |
//
// Alternativa: dividere in due file (comment.routes.ts e rating.routes.ts).

import { Router } from "express";
import { authenticateJWT } from "../middleware/auth.middleware";
import { getComments, addComment, updateComment, deleteComment, getRating, setRating, deleteRating } from "../controllers/comment.controller";

const router = Router();

// Tutte le rotte sono protette: richiedono il token JWT
router.use(authenticateJWT);

router.get("/media/:mediaId/comments", getComments);
router.post("/media/:mediaId/comments", addComment);
router.patch("/comments/:id", updateComment);
router.delete("/comments/:id", deleteComment);

router.get("/media/:mediaId/rating", getRating);
router.put("/media/:mediaId/rating", setRating);
router.delete("/media/:mediaId/rating", deleteRating);

export default router;