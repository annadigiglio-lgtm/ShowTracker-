// ============================================================
// REVISIONE utils/sign.ts
// ============================================================
// ✅ Il codice in sé FUNZIONA: è una firma HMAC-SHA256 corretta.
//
// ⚠️ MA in questo progetto non serve. La consegna chiede JWT con Passport.js:
//    - il pacchetto "jsonwebtoken" firma il token al login (jwt.sign)
//    - "passport-jwt" lo verifica sulle rotte protette
//    Entrambi fanno già HMAC-SHA256 al loro interno (algoritmo HS256).
//    Usare questo file al posto loro vorrebbe dire NON rispettare la consegna.
//    Consiglio: eliminatelo, oppure lasciatelo ma non usatelo.
//
// ⚠️ Attenzione anche: questa NON è una funzione per le password.
//    Le password vanno salvate con bcrypt o Bun.password (che sono lenti apposta
//    e aggiungono il "salt"). HMAC non va bene per le password.
// ============================================================

function sign(data: string, secret: string): string {
  // ⚠️ Commenti rimasti da un esempio ("Implement here"): il codice è già scritto,
  //    vanno tolti.
  // Implement the signing logic here
  // For example, you can use a hashing algorithm like HMAC with SHA256
  // ⚠️ "require" è la sintassi vecchia (CommonJS). Il progetto usa "type": "module",
  //    quindi è più corretto un import in cima al file da "crypto" (o "node:crypto").
  //    Bun lo accetta lo stesso, ma meglio non mischiare.
  const crypto = require('crypto');
  return crypto.createHmac('sha256', secret).update(data).digest('hex');
}

function verify(data: string, signature: string, secret: string): boolean {
  // Implement the verification logic here
  const expectedSignature = sign(data, secret);
  // ⚠️ Confrontare firme con === è vulnerabile ai "timing attack" (il confronto
  //    si ferma al primo carattere diverso, e dal tempo si può indovinare la firma).
  //    Per le firme si usa crypto.timingSafeEqual. Ancora un motivo per usare jsonwebtoken.
  return expectedSignature === signature;
}

export { sign, verify };
