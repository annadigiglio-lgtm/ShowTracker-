// ============================================================
// REVISIONE models/User.ts  –  P1
// ============================================================
// ✅ I campi scelti sono quasi tutti giusti: email, password, nome, date.
// ✅ "token" è una buona idea: salvando il token attuale potete fare il
//    LOGOUT vero (al logout lo mettete a null e Passport rifiuta il vecchio token).
//
// Regole da aggiungere ai campi (dentro lo Schema):
//   - email:    required, unique (niente doppioni), lowercase, trim
//   - password: required; si salva SOLO l'hash (bcrypt / Bun.password)
//               e con "select: false" non esce mai nelle query per sbaglio
//   - nome:     required, trim
// ============================================================


import mongoose from "mongoose";
// MongoDB crea da solo un id unico per ogni documento (_id, di tipo ObjectId).

const User = mongoose.model("User", new mongoose.Schema({
    // user_id: { type: UUID, default: () => uuidv4() }, // ❌ Non serve, MongoDB crea _id
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    password: { type: String, required: true, select: false }, // ❌ Salvare SOLO l'hash, non la password in chiaro
    nome: { type: String, required: true, trim: true },
    date: { type: Date, default: Date.now },
    token: { type: String, default: null }, // ✅ Utile per il logout
}));

export default User;
