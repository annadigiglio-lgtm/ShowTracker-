// ============================================================
// utils/AppError.ts  –  P4 (usato da TUTTI)
// ============================================================
// Una classe di errore personalizzata che estende Error e aggiunge
// lo status HTTP. Serve per scrivere nei controller/service cose come
// "lancia un errore 404 Contenuto non trovato" in modo uniforme.
//
// Campi suggeriti:
// - message     (quello di Error)
// - statusCode  (400, 401, 403, 404, 409, 500...)
//
// Il middleware middleware/error.middleware.ts controlla
// "err instanceof AppError" per sapere quale status usare.
//
// P4 lo scrive per primo e lo mette su main presto,
// così gli altri lo possono usare subito.
