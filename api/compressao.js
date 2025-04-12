const express = require('express');
const compression = require('compression');
const zlib = require('zlib');

const app = express();

// Configuração do middleware de compressão
app.use(compression({
    filter: (req, res) => {
        if (req.headers['x-no-compression']) {
            return false;
        }
        return compression.filter(req, res);
    }
}));

// Middleware para processar dados do formulário
app.use(express.urlencoded({ extended: true }));

// Rota principal
app.get('/', (req, res) => {
    res.send(`<!DOCTYPE html>
    <html>
    <head>
        <title>Compressão de Dados - Seminário CD2</title>
        <style>
            /* Estilos aqui */
        </style>
    </head>
    <body>
        <h1>Bem-vindo ao Seminário de Compressão de Dados</h1>
        <p>Este projeto demonstra os algoritmos de compressão Gzip e Brotli.</p>
    </body>
    </html>`);
});

// Rota para demonstrar a compressão
app.get('/demo', (req, res) => {
    // Lógica para a rota demo
});

// Rota POST para processar o texto
app.post('/demo', (req, res) => {
    // Lógica para processar o texto
});

// Exportar a função para o Vercel
module.exports = app;