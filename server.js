const express = require('express');
const compression = require('compression');
const path = require('path')
const zlib = require('zlib');
const app = express();
const port = 3000;
const {minify} = require('html-minifier')


app.use(express.static('public'));

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
    const gzipText = stringParaBits(gzipBuffer.toString('hex'));
    const gzipDecompressed = zlib.gunzipSync(gzipBuffer).toString();
    
    // Comprime o texto usando Brotli
    const brotliBuffer = zlib.brotliCompressSync(texto);
    const brotliSize = brotliBuffer.length;
    const brotliText = stringParaBits(brotliBuffer.toString('hex'));
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

//Rota post para minificação
app.post('/mini', (req,res)=>{
    const texto = req.body.texto || '';
    const originalSize = Buffer.byteLength(texto);

    // Comprime o texto original usando Gzip
    const gzipBuffer = zlib.gzipSync(texto);
    const gzipSize = gzipBuffer.length;
    const gzipText = gzipBuffer.toString('hex');
    const gzipDecompressed = (zlib.gunzipSync(gzipBuffer).toString());
   
    // Comprime o texto original usando Brotli
    const brotliBuffer = zlib.brotliCompressSync(texto);
    const brotliSize = brotliBuffer.length;
    const brotliText = brotliBuffer.toString('hex');
    const brotliDecompressed = stringParaBits(zlib.brotliDecompressSync(brotliBuffer).toString());
    
    const mini = minificarHTMLTexto(texto)
    const miniSize = Buffer.byteLength(mini);

    // Comprime o texto mini usando Gzip
    const gzipBufferMini = zlib.gzipSync(mini);
    const gzipSizeMini = gzipBufferMini.length;
    const gzipTextMini = gzipBufferMini.toString('hex');
    const gzipDecompressedMini = stringParaBits(zlib.gunzipSync(gzipBufferMini).toString());

    // Comprime o texto mini usando Brotli
    const brotliBufferMini = zlib.brotliCompressSync(mini);
    const brotliSizeMini = brotliBufferMini.length;
    const brotliTextMini = brotliBufferMini.toString('hex');
    const brotliDecompressedMini = stringParaBits(zlib.brotliDecompressSync(brotliBufferMini).toString());

    res.render('mini_post', {
        toglle:true,
        formatBytes:formatBytes,
        originalSize:originalSize,
        texto:texto,
        gzipSize:gzipSize,
        gzipText:gzipText,
        gzipDecompressed:gzipDecompressed,
        brotliSize:brotliSize,
        brotliText:brotliText,
        brotliDecompressed:brotliDecompressed,
        miniSize:miniSize,
        mini:mini,
        gzipSizeMini:gzipSizeMini,
        gzipTextMini:gzipTextMini,
        gzipDecompressedMini:gzipDecompressedMini,
        brotliSizeMini:brotliSizeMini,
        brotliTextMini:brotliTextMini,
        brotliDecompressedMini:brotliDecompressedMini})
})

//Rota get minificação
app.get('/mini', (req,res)=>{
    
    res.render('mini',{toglle:false})
})
app.listen(port, () => {
    console.log(`Servidor rodando em http://localhost:${port}`);
}); 

function minificarHTMLTexto(html) {
    let resultado;
    try {
        // Realiza a minificação do HTML
        resultado = minify(html, {
            collapseWhitespace: true,
            removeComments: true,
            removeEmptyAttributes: true,
            ignoreCustomFragments: [/<%[\s\S]*?%>/g],
        });
    } catch (erro) {
        // Se ocorrer um erro durante a minificação
        console.error('Erro ao minificar HTML:', erro);
        resultado = null; // Garantindo que o resultado tenha valor definido mesmo em caso de erro
    } finally {
        // O código dentro de finally será sempre executado, independentemente de erro ou não
        console.log('Minificação concluída.');
        // Aqui você poderia liberar recursos ou realizar outras tarefas
    }

    // Retorna o resultado da minificação ou `null` caso tenha ocorrido um erro
    return resultado;
}
  
function stringParaBits(hexString) {
    let bits;
    try {
      bits = hexString
        .match(/.{1,2}/g) // Divide a string em pares de caracteres (cada par de hex representa 1 byte)
        .map(byteHex => parseInt(byteHex, 16)  // Converte cada par hex para número decimal
          .toString(2)                         // Converte o número decimal para binário
          .padStart(8, '0')                    // Garante 8 bits por byte
        )
        .join(' ');
    } catch (error) {
      console.log(error);
      bits = null;
    } finally {
      console.log("Transformação para bits realizada");
    }
  
    return bits;
  }