const express = require('express');
const compression = require('compression');
const zlib = require('zlib');
const app = express();
const port = 3000;

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

// Função para formatar bytes
function formatBytes(bytes) {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

// Rota para demonstrar a compressão
app.get('/demo', (req, res) => {
    res.send(`
        <!DOCTYPE html>
        <html>
        <head>
            <title>Compressão de Dados - Seminário CD2</title>
            <style>
                body { 
                    font-family: 'Segoe UI', Arial, sans-serif; 
                    margin: 0;
                    padding: 0;
                    background: #f5f7fa;
                    color: #2c3e50;
                }
                .container {
                    max-width: 1000px;
                    margin: 0 auto;
                    padding: 20px;
                }
                .header {
                    background: #2c3e50;
                    color: white;
                    padding: 30px 0;
                    text-align: center;
                    margin-bottom: 30px;
                    box-shadow: 0 2px 5px rgba(0,0,0,0.1);
                }
                .header h1 {
                    margin: 0;
                    font-size: 2.5em;
                    font-weight: 300;
                }
                .header h2 {
                    margin: 10px 0 0;
                    font-size: 1.2em;
                    font-weight: 300;
                    opacity: 0.9;
                }
                .authors {
                    margin-top: 15px;
                    font-size: 1.1em;
                }
                .authors span {
                    display: inline-block;
                    margin: 0 10px;
                }
                .content {
                    background: white;
                    padding: 30px;
                    border-radius: 10px;
                    box-shadow: 0 2px 10px rgba(0,0,0,0.05);
                }
                .form-group {
                    margin-bottom: 20px;
                }
                textarea {
                    width: 100%;
                    min-height: 150px;
                    padding: 15px;
                    border: 2px solid #e0e0e0;
                    border-radius: 8px;
                    font-family: 'Consolas', monospace;
                    font-size: 14px;
                    resize: vertical;
                    transition: border-color 0.3s;
                }
                textarea:focus {
                    outline: none;
                    border-color: #3498db;
                }
                button {
                    background: #3498db;
                    color: white;
                    border: none;
                    padding: 12px 25px;
                    border-radius: 8px;
                    cursor: pointer;
                    font-size: 16px;
                    transition: background 0.3s;
                }
                button:hover {
                    background: #2980b9;
                }
                .text-display {
                    background: #fff;
                    border: 1px solid #e0e0e0;
                    border-radius: 8px;
                    margin: 20px 0;
                    overflow: hidden;
                    box-shadow: 0 2px 5px rgba(0,0,0,0.05);
                }
                .text-header {
                    background: #f8f9fa;
                    padding: 15px 20px;
                    border-bottom: 1px solid #e0e0e0;
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                }
                .text-label {
                    font-weight: 600;
                    color: #2c3e50;
                }
                .text-size {
                    color: #7f8c8d;
                    font-size: 0.9em;
                }
                .text-body {
                    padding: 20px;
                    margin: 0;
                    white-space: pre-wrap;
                    word-wrap: break-word;
                    font-family: 'Consolas', monospace;
                    line-height: 1.6;
                    max-height: 300px;
                    overflow-y: auto;
                }
                .compressed-text {
                    margin-top: 10px;
                    padding: 15px;
                    background: #f8f9fa;
                    border-radius: 8px;
                    font-family: 'Consolas', monospace;
                    font-size: 0.9em;
                    word-break: break-all;
                }
                .decompressed {
                    margin-top: 15px;
                    background: #e8f4f8;
                }
                .decompressed .text-label {
                    color: #27ae60;
                }
                .compression-summary {
                    margin-top: 30px;
                    padding: 25px;
                    background: #f8f9fa;
                    border-radius: 8px;
                    box-shadow: 0 2px 5px rgba(0,0,0,0.05);
                }
                .compression-summary h3 {
                    margin-top: 0;
                    color: #2c3e50;
                    font-size: 1.3em;
                    font-weight: 600;
                }
                .summary-grid {
                    display: grid;
                    grid-template-columns: repeat(3, 1fr);
                    gap: 20px;
                }
                .summary-item {
                    background: white;
                    padding: 20px;
                    border-radius: 8px;
                    text-align: center;
                    box-shadow: 0 2px 5px rgba(0,0,0,0.05);
                }
                .summary-label {
                    font-weight: 600;
                    color: #2c3e50;
                    margin-bottom: 10px;
                }
                .summary-value {
                    font-size: 1.4em;
                    color: #3498db;
                    margin-bottom: 5px;
                }
                .summary-detail {
                    font-size: 0.9em;
                    color: #27ae60;
                }
                .back-button {
                    display: inline-block;
                    margin-top: 30px;
                    background: #3498db;
                    color: white;
                    padding: 12px 25px;
                    text-decoration: none;
                    border-radius: 8px;
                    transition: background 0.3s;
                }
                .back-button:hover {
                    background: #2980b9;
                }
                .footer {
                    text-align: center;
                    margin-top: 40px;
                    padding: 20px;
                    color: #7f8c8d;
                    font-size: 0.9em;
                }
                .explanation {
                    margin-top: 40px;
                    padding: 30px;
                    background: white;
                    border-radius: 10px;
                    box-shadow: 0 2px 10px rgba(0,0,0,0.05);
                }
                .algorithm {
                    margin-bottom: 30px;
                    padding: 20px;
                    background: #f8f9fa;
                    border-radius: 8px;
                }
                .algorithm h3 {
                    color: #2c3e50;
                    margin-top: 0;
                    padding-bottom: 10px;
                    border-bottom: 2px solid #3498db;
                }
                .step {
                    margin: 15px 0;
                    padding: 15px;
                    background: white;
                    border-radius: 8px;
                    border-left: 4px solid #3498db;
                }
                .step h4 {
                    margin-top: 0;
                    color: #2c3e50;
                }
                .example {
                    margin-top: 10px;
                    padding: 10px;
                    background: #f8f9fa;
                    border-radius: 5px;
                    font-family: 'Consolas', monospace;
                }
                .example pre {
                    margin: 0;
                    white-space: pre-wrap;
                }
                .example-label {
                    font-weight: bold;
                    color: #7f8c8d;
                    margin-bottom: 5px;
                }
            </style>
        </head>
        <body>
            <div class="header">
                <div class="container">
                    <h1>Compressão de Dados</h1>
                    <h2>Seminário - Comunicações Digitais 2</h2>
                    <div class="authors">
                        <span>Matheus Pereira de Andrade</span>
                        <span>Alfredo Francisco Amancio Mota</span>
                    </div>
                </div>
            </div>
            <div class="container">
                <div class="content">
                    <h2>Compare a compressão entre Gzip e Brotli</h2>
                    <form method="POST" action="/demo">
                        <div class="form-group">
                            <textarea name="texto" placeholder="Digite ou cole seu texto aqui..."></textarea>
                        </div>
                        <button type="submit">Comparar Algoritmos</button>
                    </form>
                </div>

                <div class="explanation">
                    <h2>Como Funcionam os Algoritmos de Compressão</h2>
                    
                    <div class="context-section">
                        <p>A compressão de dados em sites é essencial para melhorar a performance de carregamento das páginas. Quando você acessa um site, os arquivos HTML, CSS e JS são transferidos do servidor para o navegador. Quanto menores esses arquivos, mais rápido o carregamento.</p>
                        
                        <p>Algoritmos como <strong>Gzip</strong> e <strong>Brotli</strong> são usados para reduzir o tamanho desses arquivos antes de serem enviados. Eles funcionam como "zipadores" de conteúdo textual, sem perder informação — ou seja, são <em>sem perda</em>.</p>
                        
                        <p>O navegador, por sua vez, sabe como descomprimir esses dados, tornando tudo transparente para o usuário final. Isso resulta em sites mais rápidos, menor uso de banda e melhor desempenho, especialmente em redes lentas ou dispositivos móveis.</p>
                    </div>
                    
                    <div class="algorithm">
                        <h3>Algoritmo Gzip</h3>
                        <div class="step">
                            <h4>1. LZ77 - Compressão de Repetições</h4>
                            <p>O Gzip usa o algoritmo LZ77 para encontrar e substituir sequências repetidas no texto. Ele procura por padrões que se repetem e os substitui por referências.</p>
                            <div class="example">
                                <div class="example-label">Exemplo:</div>
                                <pre>Texto Original: "ABABABABABABABAB"
Após LZ77: "AB[8,2]" (8 repetições começando na posição 2)</pre>
                            </div>
                        </div>
                        <div class="step">
                            <h4>2. Huffman - Codificação de Frequência</h4>
                            <p>Após o LZ77, o Gzip usa o algoritmo de Huffman para atribuir códigos mais curtos aos caracteres mais frequentes, reduzindo ainda mais o tamanho.</p>
                            <div class="example">
                                <div class="example-label">Exemplo:</div>
                                <pre>Texto: "ABABAB"
Frequências: A=3, B=3
Códigos: A=0, B=1
Resultado: "010101"</pre>
                            </div>
                        </div>
                        <div class="step">
                            <h4>Uso em Sites</h4>
                            <p>O Gzip é suportado pela maioria dos navegadores e servidores. Ele é ativado por padrão em muitos servidores web (como Apache, Nginx) e é excelente para comprimir HTML, CSS e JavaScript.</p>
                            <div class="example">
                                <div class="example-label">Exemplo Prático:</div>
                                <pre>Página HTML Original: 50KB
Após Gzip: ~15KB (70% menor)
Tempo de Carregamento: 2s → 0.6s</pre>
                            </div>
                        </div>
                    </div>

                    <div class="algorithm">
                        <h3>Algoritmo Brotli</h3>
                        <div class="step">
                            <h4>1. Dicionário Estático</h4>
                            <p>O Brotli usa um dicionário pré-definido de palavras e padrões comuns para substituir sequências conhecidas, especialmente eficiente para conteúdo web.</p>
                            <div class="example">
                                <div class="example-label">Exemplo:</div>
                                <pre>Texto Original: "function hello() { return 'hello'; }"
Após Dicionário: "fn hello() { rt 'hello'; }"</pre>
                            </div>
                        </div>
                        <div class="step">
                            <h4>2. Compressão de Contexto</h4>
                            <p>O Brotli analisa o contexto do texto para otimizar a compressão baseada no tipo de conteúdo, usando diferentes estratégias para diferentes tipos de dados.</p>
                            <div class="example">
                                <div class="example-label">Exemplo:</div>
                                <pre>HTML Original: "<div class="container">Texto</div>"
Após Contexto: "<.container>Texto</>"</pre>
                            </div>
                        </div>
                        <div class="step">
                            <h4>Uso em Sites</h4>
                            <p>O Brotli foi desenvolvido pelo Google com foco na web. Ele oferece compressão melhor que o Gzip, especialmente para arquivos pequenos como páginas HTML. Hoje é suportado por quase todos os navegadores modernos e é ideal para sites que priorizam performance.</p>
                            <div class="example">
                                <div class="example-label">Exemplo Prático:</div>
                                <pre>Página HTML Original: 50KB
Após Brotli: ~10KB (80% menor)
Tempo de Carregamento: 2s → 0.4s</pre>
                            </div>
                        </div>
                    </div>

                    <div class="algorithm">
                        <h3>Comparação Prática</h3>
                        <div class="step">
                            <h4>Exemplo com Página Web Real</h4>
                            <div class="example">
                                <div class="example-label">Página HTML Original:</div>
                                <pre>&lt;!DOCTYPE html&gt;
&lt;html&gt;
&lt;head&gt;
    &lt;title&gt;Meu Site&lt;/title&gt;
    &lt;style&gt;
        .container { max-width: 1200px; margin: 0 auto; }
        .header { background: #f8f9fa; padding: 20px; }
    &lt;/style&gt;
&lt;/head&gt;
&lt;body&gt;
    &lt;div class="container"&gt;
        &lt;header class="header"&gt;
            &lt;h1&gt;Título&lt;/h1&gt;
            &lt;p&gt;Parágrafo de exemplo&lt;/p&gt;
        &lt;/header&gt;
    &lt;/div&gt;
&lt;/body&gt;
&lt;/html&gt;</pre>
                                <div class="example-label">Resultados:</div>
                                <pre>Gzip:
- Tamanho Original: 500 bytes
- Após Compressão: 200 bytes (60% menor)
- Tempo de Carregamento: 100ms → 40ms

Brotli:
- Tamanho Original: 500 bytes
- Após Compressão: 150 bytes (70% menor)
- Tempo de Carregamento: 100ms → 30ms</pre>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="footer">
                <p>Universidade Federal de Uberlândia - Engenharia Eletrônica e de Telecomunicações</p>
            </div>
        </body>
        </html>
    `);
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
    
    res.send(`
        <!DOCTYPE html>
        <html>
        <head>
            <title>Compressão de Dados - Seminário CD2</title>
            <style>
                body { 
                    font-family: Arial, sans-serif; 
                    margin: 20px;
                    max-width: 800px;
                    margin: 0 auto;
                    padding: 20px;
                }
                .text-display {
                    background: #fff;
                    border: 1px solid #ddd;
                    border-radius: 5px;
                    margin: 15px 0;
                    overflow: hidden;
                }
                .text-header {
                    background: #f8f9fa;
                    padding: 10px 15px;
                    border-bottom: 1px solid #ddd;
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                }
                .text-label {
                    font-weight: bold;
                    color: #2c3e50;
                }
                .text-size {
                    color: #7f8c8d;
                    font-size: 0.9em;
                }
                .text-body {
                    padding: 15px;
                    margin: 0;
                    white-space: pre-wrap;
                    word-wrap: break-word;
                    font-family: monospace;
                    line-height: 1.5;
                    max-height: 300px;
                    overflow-y: auto;
                }
                .compressed-text {
                    margin-top: 10px;
                    padding: 10px;
                    background: #f8f9fa;
                    border-radius: 5px;
                    font-family: monospace;
                    font-size: 0.9em;
                    word-break: break-all;
                }
                .decompressed {
                    margin-top: 15px;
                    background: #e8f4f8;
                }
                .decompressed .text-label {
                    color: #27ae60;
                }
                .back-button {
                    display: inline-block;
                    margin-top: 20px;
                    background: #2c3e50;
                    color: white;
                    padding: 10px 20px;
                    text-decoration: none;
                    border-radius: 5px;
                }
                .back-button:hover {
                    background: #34495e;
                }
                .compression-summary {
                    margin-top: 30px;
                    padding: 20px;
                    background: #f8f9fa;
                    border-radius: 5px;
                }
                .compression-summary h3 {
                    margin-top: 0;
                    color: #2c3e50;
                }
                .summary-grid {
                    display: grid;
                    grid-template-columns: repeat(3, 1fr);
                    gap: 15px;
                }
                .summary-item {
                    background: white;
                    padding: 15px;
                    border-radius: 5px;
                    text-align: center;
                }
                .summary-label {
                    font-weight: bold;
                    color: #2c3e50;
                    margin-bottom: 5px;
                }
                .summary-value {
                    font-size: 1.2em;
                    color: #34495e;
                    margin-bottom: 5px;
                }
                .summary-detail {
                    font-size: 0.9em;
                    color: #27ae60;
                }
            </style>
        </head>
        <body>
            <div class="header">
                <div class="container">
                    <h1>Compressão de Dados</h1>
                    <h2>Seminário - Comunicações Digitais 2</h2>
                    <div class="authors">
                        <span>Matheus Pereira de Andrade</span>
                        <span>Alfredo Francisco Amancio Mota</span>
                    </div>
                </div>
            </div>
            <div class="container">
                <div class="content">
                    <h2>Resultados da Compressão</h2>
                    <div class="text-content">
                        <h2>Seu Texto:</h2>
                        <div class="text-display">
                            <div class="text-header">
                                <span class="text-label">Texto Original</span>
                                <span class="text-size">${formatBytes(originalSize)}</span>
                            </div>
                            <pre class="text-body">${texto}</pre>
                        </div>
                        
                        <div class="text-display">
                            <div class="text-header">
                                <span class="text-label">Texto Comprimido (Gzip)</span>
                                <span class="text-size">${formatBytes(gzipSize)} (${((1 - gzipSize/originalSize) * 100).toFixed(2)}% menor)</span>
                            </div>
                            <div class="compressed-text">
                                <pre>${gzipText}</pre>
                            </div>
                            <div class="text-header decompressed">
                                <span class="text-label">Texto Descomprimido (Gzip)</span>
                                <span class="text-size">${formatBytes(Buffer.byteLength(gzipDecompressed))}</span>
                            </div>
                            <pre class="text-body">${gzipDecompressed}</pre>
                        </div>
                        
                        <div class="text-display">
                            <div class="text-header">
                                <span class="text-label">Texto Comprimido (Brotli)</span>
                                <span class="text-size">${formatBytes(brotliSize)} (${((1 - brotliSize/originalSize) * 100).toFixed(2)}% menor)</span>
                            </div>
                            <div class="compressed-text">
                                <pre>${brotliText}</pre>
                            </div>
                            <div class="text-header decompressed">
                                <span class="text-label">Texto Descomprimido (Brotli)</span>
                                <span class="text-size">${formatBytes(Buffer.byteLength(brotliDecompressed))}</span>
                            </div>
                            <pre class="text-body">${brotliDecompressed}</pre>
                        </div>

                        <div class="compression-summary">
                            <h3>Resumo da Compressão</h3>
                            <div class="summary-grid">
                                <div class="summary-item">
                                    <div class="summary-label">Original</div>
                                    <div class="summary-value">${formatBytes(originalSize)}</div>
                                </div>
                                <div class="summary-item">
                                    <div class="summary-label">Gzip</div>
                                    <div class="summary-value">${formatBytes(gzipSize)}</div>
                                    <div class="summary-detail">${((1 - gzipSize/originalSize) * 100).toFixed(2)}% menor</div>
                                </div>
                                <div class="summary-item">
                                    <div class="summary-label">Brotli</div>
                                    <div class="summary-value">${formatBytes(brotliSize)}</div>
                                    <div class="summary-detail">${((1 - brotliSize/originalSize) * 100).toFixed(2)}% menor</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="footer">
                <p>Universidade Federal de Uberlândia - Engenharia Eletrônica e de Telecomunicações</p>
            </div>
        </body>
        </html>
    `);
});

app.listen(port, () => {
    console.log(`Servidor rodando em http://localhost:${port}`);
}); 