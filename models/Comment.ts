// ============================================================
// REVISIONE models/Comment.ts  –  P4
// ============================================================
// ✅ Giusto avere un modello separato per i commenti.
// ✅ "content" è il campo giusto per il testo.
//
// ❌ Mancano i collegamenti, senza questi il commento è "orfano":
//    - user  -> ObjectId con ref "User"   (CHI ha scritto il commento)
//    - media -> ObjectId con ref "Media"  (SU QUALE film/serie)
//
// ⚠️ Mettete "required: true" su content, user e media.
//    Bonus: trim e una lunghezza massima su content.
// ============================================================

import mongoose from "mongoose";

const Comment = mongoose.model("Comment", new mongoose.Schema({
    content: { type: String, required: true, trim: true, maxlength: 1000 },
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    media: { type: mongoose.Schema.Types.ObjectId, ref: "Media", required: true },
    date: { type: Date, default: Date.now },
}));

export default Comment;
