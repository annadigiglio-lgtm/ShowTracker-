// ============================================================
// controllers/comment.controller.ts  –  P4 (Valutazioni e commenti)
// ============================================================
// Commenti e valutazioni si fanno solo sui contenuti SALVATI (Media)
// dall'utente. Prima di tutto controllate sempre che il Media esista
// e appartenga a req.user -> altrimenti 404.
//
// --- COMMENTI ---
// getComments        GET    /media/:mediaId/comments
//   - commenti di quel Media, ordinati dal più recente (sort createdAt -1)
//
// addComment         POST   /media/:mediaId/comments   body: content
//   - content obbligatorio e non vuoto; bonus: lunghezza massima -> 400
//   - salvare con user e media -> 201
//
// updateComment      PATCH  /comments/:id              body: content
//   - solo l'autore può modificarlo: se comment.user != req.user._id -> 403
//
// deleteComment      DELETE /comments/:id
//   - stessa regola dell'autore -> 403 se non è suo
//
// --- VALUTAZIONI ---
// setRating          PUT    /media/:mediaId/rating     body: voto
//   - voto numero tra 1 e 10 -> altrimenti 400
//   - findOneAndUpdate({ user, media }, { voto }, { upsert: true, new: true })
//     così la stessa rotta crea O aggiorna
//
// getRating          GET    /media/:mediaId/rating
//
// deleteRating       DELETE /media/:mediaId/rating

import type { Request, Response } from "express";
import Comment from "../models/Comment";
import Rating from "../models/Rating";

const getComments = async (req: Request, res: Response) => {
    try {
        const { mediaId } = req.params;
        const comments = await Comment.find({ media: mediaId }).sort({ date: -1 });
        res.json(comments);
    } catch (error) {
        res.status(500).json({ message: "Error fetching comments", error });
    }
};

const addComment = async (req: Request, res: Response) => {
    try {
        const { mediaId } = req.params;
        const { content } = req.body;
        const { userId } = (req.user as any)._id;

        if (!content || content.trim() === "") {
            return res.status(400).json({ message: "Content is required" });
        }

        const comment = await Comment.create({ content, user: userId, media: mediaId as any });
        res.status(201).json(comment);
    } catch (error) {
        res.status(500).json({ message: "Error adding comment", error });
    }
};

const updateComment = async (req: Request, res: Response) => {
    const { id } = req.params;
    const { content } = req.body;
    // il cast as any serve perche req.user è di tipo User | undefined, e TypeScript non sa che _id esiste su User.
    const userId = (req.user as any)._id;
    const updatedComment = await Comment.findOneAndUpdate(
        { _id: id, user: userId },
        { content },
        { new: true }
    );

    if (!updatedComment) {
        return res.status(404).json({
            message: "Comment not found or you are not authorized"
        });
    }

    res.json(updatedComment);
};

const deleteComment = async (req: Request, res: Response) => {
    const { id } = req.params;
    // il cast as any serve perche req.user è di tipo User | undefined, e TypeScript non sa che _id esiste su User.
    const userId = (req.user as any)._id; 
    const comment = await Comment.findOneAndDelete({ _id: id, user: userId });

    if (!comment) {
        return res.status(404).json({ 
            message: "Comment not found or you are not authorized" 
        });
    }

    res.json({ message: "Comment deleted" });
};

// ====================== Valutazioni ====================== 
const getRating = async (req: Request, res: Response) => {
    try {
        const { mediaId } = req.params;
        const userId = (req.user as any)._id;

        // Cerca il voto di QUESTO specifico utente per QUESTO specifico media
        const rating = await Rating.findOne({ media: mediaId, user: userId });

        if (!rating) {
            return res.status(404).json({ message: "Nessuna valutazione trovata per questo contenuto" });
        }

        res.json(rating);
    } catch (error) {
        res.status(500).json({ message: "Errore durante il recupero del voto", error });
    }
};

const setRating = async (req: Request, res: Response) => {
    try {
        const { mediaId } = req.params;
        const { voto } = req.body;
        const userId = (req.user as any)._id;

        // Validazione del voto
        if (typeof voto !== "number" || voto < 1 || voto > 10) {
            return res.status(400).json({ 
                message: "Valutazione non valida. Fornire un valore numerico compreso tra 1 e 10." 
            });
        }

        // Cerca il voto dell'utente per quel media: se esiste lo aggiorna, altrimenti lo crea (upsert)
        const updatedRating = await Rating.findOneAndUpdate(
            { media: mediaId, user: userId },
            { voto, media: mediaId, user: userId }, // Assicura che i campi vengano impostati in caso di inserimento
            { upsert: true, new: true, runValidators: true }
        );

        res.json(updatedRating);
    } catch (error) {
        res.status(500).json({ message: "Errore durante il salvataggio della valutazione", error });
    }
};

const deleteRating = async (req: Request, res: Response) => {
    try {
        const { mediaId } = req.params;
        const userId = (req.user as any)._id;

        // Cancella solo se la valutazione appartiene all'utente loggato
        const deletedRating = await Rating.findOneAndDelete({ media: mediaId, user: userId });

        if (!deletedRating) {
            return res.status(404).json({ message: "Nessuna valutazione da eliminare trovata" });
        }

        res.json({ message: "Valutazione eliminata con successo" });
    } catch (error) {
        res.status(500).json({ message: "Errore durante l'eliminazione della valutazione", error });
    }
};

export { getComments, addComment, updateComment, deleteComment, getRating, setRating, deleteRating };