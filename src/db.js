const mysql = require('mysql2');

const connection = mysql.createConnection({
   host: 'tramway.proxy.rlwy.net',
   user: 'root',
   password: 'KslTEAypOFcxJHHLfMkUxgyotPxSawxC',
   database: 'railway',
   port: 50101
});

connection.connect((err) => {
    if(err){
        console.log('Erro na conexão', err);
    } else {
        console.log('Conectou ao banco de dados');
    }
});

module.exports = connection;