// ============================================================
// config/tmdb.config.ts  –  P2 (Integrazione TMDb)
// ============================================================
// Scopo: tenere in un solo posto le impostazioni di TMDb.
//
// Esportate un oggetto con:
// - apiKey        -> process.env.TMDB_API_KEY
// - baseUrl       -> process.env.TMDB_BASE_URL   (https://api.themoviedb.org/3)
// - imageBaseUrl  -> process.env.TMDB_IMAGE_BASE_URL (per costruire l'URL completo dei poster)
// - language      -> process.env.TMDB_LANGUAGE   (es. "it-IT", così trama e titoli sono in italiano)
//
// Consiglio: all'avvio controllate che apiKey esista, altrimenti
// stampate un warning chiaro ("Manca TMDB_API_KEY nel .env").

export const tmdbConfig = {
    apiKey: process.env.TMDB_API_KEY || "",
    baseUrl: process.env.TMDB_BASE_URL || "https://api.themoviedb.org/3",
    imageBaseUrl: process.env.TMDB_IMAGE_BASE_URL || "https://image.tmdb.org/t/p/w500",
    language: process.env.TMDB_LANGUAGE || "it-IT"
};

if (!tmdbConfig.apiKey) {
    console.warn("Manca TMDB_API_KEY nel .env");
}