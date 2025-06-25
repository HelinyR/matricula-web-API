const express = require('express');
const cors = require('cors');
const app = express();
const port = 3000;
const db = require('./db.js');
const setSupervisorRoutes = require('./routes/supervisorRoutes.js');
const loginRoutes = require('./routes/loginRoutes'); // ✅ NOVO
const setAtendenteRoutes = require('./routes/atendenteRoutes.js');
const setCandidatoRoutes = require('./routes/candidatoRoutes.js');

app.use(express.json());
app.use(cors());

setSupervisorRoutes(app);
setAtendenteRoutes(app); 
setCandidatoRoutes(app);
app.use('/api', loginRoutes); 

app.get('/', (req, res) => {
    res.send('Servidor funcionando');
});

app.listen(port, () => {
    console.log(`Servidor funcionando em http://localhost:${port}`);
});

app.use((req, res) => {
    res.status(404).send('Rota nao encontrada');
});
