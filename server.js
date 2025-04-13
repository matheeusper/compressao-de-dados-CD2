const express = require('express');
const compression = require('compression');
const path = require('path')
const zlib = require('zlib');
const app = express();
const port = 3000;

app.use(express.static(path.join(__dirname, 'public')));

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

// Configura o EJS como motor de visualização
app.set('view engine', 'ejs');

// Define o diretório padrão dos arquivos .ejs (opcional, por padrão é './views')
app.set('views', './views');

// Função para formatar bytes
function formatBytes(bytes) {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

// Rota principal
app.get('/', (req, res) => {
    res.render(`index`);
});

// Rota para demonstrar a compressão
app.get('/demo', (req, res) => {
    res.render(`demo`);
});

// Rota POST para processar o texto
app.post('/demo', (req, res) => {
    const texto = req.body.texto || '';
    const originalSize = Buffer.byteLength(texto);
    
    // Comprime o texto usando Gzip
    const gzipBuffer = zlib.gzipSync(texto);
    const gzipSize = gzipBuffer.length;
    const gzipText = gzipBuffer.toString('base64');
    const gzipDecompressed = zlib.gunzipSync(gzipBuffer).toString();
    
    // Comprime o texto usando Brotli
    const brotliBuffer = zlib.brotliCompressSync(texto);
    const brotliSize = brotliBuffer.length;
    const brotliText = brotliBuffer.toString('base64');
    const brotliDecompressed = zlib.brotliDecompressSync(brotliBuffer).toString();
    
    res.render(`post`,{
        formatBytes:formatBytes,
        originalSize:originalSize,
        texto:texto,
        gzipSize:gzipSize,
        gzipText:gzipText,
        gzipDecompressed:gzipDecompressed,
        brotliSize:brotliSize,
        brotliText:brotliText,
        brotliDecompressed:brotliDecompressed

    });
});

app.listen(port, () => {
    console.log(`Servidor rodando em http://localhost:${port}`);
}); 