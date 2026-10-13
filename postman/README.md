# Postman – P4

Qui va esportata la collection Postman (`ShowTracker.postman_collection.json`) e, se serve, l'environment (`ShowTracker.postman_environment.json`).

Suggerimenti:

- Create un **environment** con le variabili `baseUrl` (`http://localhost:3000/api`) e `token`.
- Nella richiesta di **login**, nella tab *Tests* (o *Scripts → Post-response*), salvate il token della risposta nella variabile `token`. Così tutte le altre richieste lo usano da sole.
- Nella collection impostate *Authorization → Bearer Token → `{{token}}`*, e tutte le richieste lo ereditano.
- Ordinate le richieste come il flusso completo della Fase 2:
  registrazione → login → ricerca → dettaglio → salvataggio → lista → stato "visto" → valutazione e commento → logout.
- Per ogni rotta aggiungete almeno un caso che **deve fallire** (senza token → 401, id inesistente → 404, body vuoto → 400).
- Dopo l'export, ricontrollate che nel file non ci siano token veri o la chiave TMDb.
