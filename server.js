const express = require('express');
const app = express();
const port = 3000;

app.get('/', (req, res) =>{
    res.send('funcionou');//mostra na web
});

app.get('/login', (req, res) => {
    res.send('Logado');
});

app.listen(port, () => {
    console.log('Servidor funcionando');//mostra no terminal
});

app.use((req, res) => {
    res.send('Rota não encontrada');
});

