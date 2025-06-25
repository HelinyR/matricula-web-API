const express = require('express');
const cors = require('cors');
const app = express();
const port = 3000;
const db = require('./db.js');
const setSupervisorRoutes = require('./routes/supervisorRoutes.js');
const loginController = require('./routes/loginController'); // ✅ NOVO

app.use(express.json());
app.use(cors());

setSupervisorRoutes(app);
app.use('/api', loginController); // ✅ NOVO

app.get('/', (req, res) => {
    res.send('Servidor funcionando');
});

app.listen(port, () => {
    console.log(`Servidor funcionando em http://localhost:${port}`);
});

app.use((req, res) => {
    res.status(404).send('Rota nao encontrada');
});
