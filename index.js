const express = require("express");
const route = require('./routes/routes.js');
const PORT = process.env.PORT || 3000;

const app = express();
app.use(express.json());

app.use('/', route);

// demander au serveur applicatif d'attendre des requêtes depuis le port spécifié plus haut
app.listen(PORT, () => {
    console.log(`Example app listening at http:localhost:${PORT}`);
  });