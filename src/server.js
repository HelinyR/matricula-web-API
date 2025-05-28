const express = require('express');
const app = express();
const port = 3000;
const db = require('./db.js');
const setSupervisorRoutes = require('./routes/supervisorRoutes.js');

app.use(express.json());

setSupervisorRoutes(app);

app.get('/', (req, res) => {
    res.send('Servidor funcionando');
});

app.listen(port, () => {
    console.log(`Servidor funcionando em http://localhost:${port}`);
});

app.use((req, res) => {
    res.status(404).send('Rota nao encontrada');
});