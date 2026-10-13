// ============================================================
// REVISIONE models/User.ts  –  P1
// ============================================================
// ✅ I campi scelti sono quasi tutti giusti: email, password, nome, date.
// ✅ "token" è una buona idea: salvando il token attuale potete fare il
//    LOGOUT vero (al logout lo mettete a null e Passport rifiuta il vecchio token).
//
// ❌ Come gli altri modelli: è un oggetto normale, non uno Schema mongoose.
// ❌ Manca l'export: nessun altro file può usare User.
//
// Regole da aggiungere ai campi (dentro lo Schema):
//   - email:    required, unique (niente doppioni), lowercase, trim
//   - password: required; si salva SOLO l'hash (bcrypt / Bun.password)
//               e con "select: false" non esce mai nelle query per sbaglio
//   - nome:     required, trim
// ============================================================

// ❌ Il pacchetto "uuid" non è installato e qui NON serve:
//    MongoDB crea da solo un id unico per ogni documento (_id, di tipo ObjectId).
//    Togliete questo import e il campo user_id.
import { UUID } from "uuid";
// ⚠️ Vedi sotto: se togliete il campo comments, non serve neanche questo import.
import { Comment } from "./Comment";

const User = {
    // ❌ Non serve, c'è già _id automatico (vedi sopra).
    user_id: UUID,
    email: String,
    password: String,
    nome: String,
    // ✅ Per il logout. Non required (all'inizio e dopo il logout è null).
    token: String,
    // ❌ "List" non esiste in TypeScript/JavaScript (è di Java/C#).
    // ⚠️ E comunque è meglio NON tenere i commenti dentro l'utente: la lista
    //    crescerebbe all'infinito. Si fa il contrario: è il Comment ad avere
    //    il campo "user" che punta all'utente. Per trovare i commenti di un
    //    utente basta cercare i Comment con quel user.
    comments: List<Comment>,
    // ⚠️ Corretti come idea, ma con { timestamps: true } nelle opzioni dello
    //    Schema mongoose li crea e aggiorna da solo (createdAt / updatedAt).
    created_at: Date,
    updated_at: Date,
};
