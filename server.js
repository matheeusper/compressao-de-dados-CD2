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

// Rota principal
app.get('/', (req, res) => {
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
                .demo-button {
                    display: inline-block;
                    background: #3498db;
                    color: white;
                    padding: 15px 30px;
                    text-decoration: none;
                    border-radius: 8px;
                    font-size: 18px;
                    margin: 20px 0;
                    transition: background 0.3s;
                }
                .demo-button:hover {
                    background: #2980b9;
                }
                .explanation {
                    margin-top: 40px;
                    padding: 30px;
                    background: white;
                    border-radius: 10px;
                    box-shadow: 0 2px 10px rgba(0,0,0,0.05);
                }
                .algorithm-section {
                    margin: 30px 0;
                    padding: 20px;
                    background: #f8f9fa;
                    border-radius: 10px;
                }
                .algorithm-step {
                    margin: 20px 0;
                    padding: 15px;
                    background: white;
                    border-radius: 8px;
                    box-shadow: 0 2px 4px rgba(0,0,0,0.05);
                }
                .technique {
                    margin: 15px 0;
                    padding: 15px;
                    background: #f8f9fa;
                    border-radius: 8px;
                }
                .technique h5 {
                    color: #2c3e50;
                    margin-top: 0;
                }
                .example {
                    margin-top: 10px;
                    padding: 10px;
                    background: white;
                    border-radius: 5px;
                    font-family: 'Consolas', monospace;
                }
                .example-label {
                    font-weight: bold;
                    color: #7f8c8d;
                    margin-bottom: 5px;
                }
                .process-step {
                    margin: 20px 0;
                    padding: 15px;
                    background: white;
                    border-radius: 8px;
                    box-shadow: 0 2px 4px rgba(0,0,0,0.05);
                }
                .process-step h4 {
                    color: #2c3e50;
                    margin-top: 0;
                    padding-bottom: 10px;
                    border-bottom: 2px solid #3498db;
                }
                .step-content ul {
                    margin: 10px 0;
                    padding-left: 20px;
                }
                .step-content li {
                    margin: 8px 0;
                    line-height: 1.5;
                }
                .footer {
                    text-align: center;
                    margin-top: 40px;
                    padding: 20px;
                    color: #7f8c8d;
                    font-size: 0.9em;
                }
            </style>
        </head>
        <body>
            <div class="header">
                <div class="container">
                    <h1>Compressão de Dados</h1>
                    <h2>Seminário CD2</h2>
                    <div class="authors">
                        <span>Matheus Pereira de Andrade</span>
                        <span>Alfredo Francisco Amancio Mota</span>
                        <span>Universidade Federal de Uberlândia</span>
                    </div>
                </div>
            </div>

            <div class="container">
                <div class="content">
                    <h2>Bem-vindo ao Seminário de Compressão de Dados</h2>
                    <p>Este projeto demonstra os algoritmos de compressão Gzip e Brotli, mostrando como eles funcionam e seus benefícios para a web.</p>
                    
                    <a href="/demo" class="demo-button">Testar Compressão</a>

                    <div class="explanation">
                        <h2>Como Funcionam os Algoritmos de Compressão</h2>
                        
                        <div class="context-section">
                            <p>A compressão de dados em sites é essencial para melhorar a performance de carregamento das páginas. Quando você acessa um site, os arquivos HTML, CSS e JS são transferidos do servidor para o navegador. Quanto menores esses arquivos, mais rápido o carregamento.</p>
                            
                            <p>Algoritmos como <strong>Gzip</strong> e <strong>Brotli</strong> são usados para reduzir o tamanho desses arquivos antes de serem enviados. Eles funcionam como "zipadores" de conteúdo textual, sem perder informação — ou seja, são <em>sem perda</em>.</p>
                            
                            <p>O navegador, por sua vez, sabe como descomprimir esses dados, tornando tudo transparente para o usuário final. Isso resulta em sites mais rápidos, menor uso de banda e melhor desempenho, especialmente em redes lentas ou dispositivos móveis.</p>
                        </div>

                        <div class="algorithm-section">
                            <h3>1. Como Funciona o Gzip</h3>
                            <div class="algorithm-step">
                                <h4>Princípio Básico</h4>
                                <p>O Gzip combina duas técnicas principais para reduzir o tamanho dos dados:</p>
                                
                                <div class="technique">
                                    <h5>LZ77 (Lempel-Ziv 77)</h5>
                                    <p>Identifica padrões e sequências repetitivas no texto, substituindo-as por referências.</p>
                                    <div class="example">
                                        <div class="example-label">Exemplo:</div>
                                        <pre>Texto Original: "ABCABCABCABC"
Após LZ77: "ABC" + [referência para repetição]</pre>
                                    </div>
                                </div>

                                <div class="technique">
                                    <h5>Codificação de Huffman</h5>
                                    <p>Atribui códigos binários de comprimento variável aos caracteres com base em sua frequência.</p>
                                    <div class="example">
                                        <div class="example-label">Exemplo:</div>
                                        <pre>Texto: "AABBB"
Frequências: A=2, B=3
Códigos: A=0, B=1
Resultado: "00111"</pre>
                                    </div>
                                </div>
                            </div>

                            <div class="algorithm-step">
                                <h4>Aplicação no Contexto de Sites</h4>
                                <p>No ambiente web, o Gzip é configurado no servidor para comprimir arquivos de texto:</p>
                                <ol>
                                    <li><strong>Preparação no Servidor:</strong> Verifica suporte do navegador via Accept-Encoding</li>
                                    <li><strong>Transmissão:</strong> Envia arquivos com Content-Encoding: gzip</li>
                                    <li><strong>Descompressão:</strong> Navegador descomprime automaticamente</li>
                                </ol>
                            </div>
                        </div>

                        <div class="algorithm-section">
                            <h3>2. Como Funciona o Brotli</h3>
                            <div class="algorithm-step">
                                <h4>Princípio Básico</h4>
                                <p>O Brotli utiliza uma abordagem diferente, combinando dois conceitos principais:</p>
                                
                                <div class="technique">
                                    <h5>Dicionário Pré-definido</h5>
                                    <p>Utiliza um dicionário estático com palavras e padrões comuns da web.</p>
                                    <div class="example">
                                        <div class="example-label">Exemplo:</div>
                                        <pre>Texto Original: "function greet() { return 'hello'; }"
Após Brotli: [código para "function"] [código para "return"]</pre>
                                    </div>
                                </div>

                                <div class="technique">
                                    <h5>Compressão Adaptativa</h5>
                                    <p>Analisa o contexto do arquivo para escolher a melhor estratégia de compressão.</p>
                                    <div class="example">
                                        <div class="example-label">Exemplo:</div>
                                        <pre>HTML Original: &lt;div class="container"&gt;Conteúdo&lt;/div&gt;
Após Brotli: [código para div] [código para class]</pre>
                                    </div>
                                </div>
                            </div>

                            <div class="algorithm-step">
                                <h4>Aplicação no Contexto de Sites</h4>
                                <p>O Brotli é adotado por servidores modernos e navegadores recentes:</p>
                                <ol>
                                    <li><strong>No Servidor:</strong> Detecta compatibilidade via Accept-Encoding</li>
                                    <li><strong>Envio:</strong> Usa Content-Encoding: br</li>
                                    <li><strong>Descompressão:</strong> Navegador descomprime automaticamente</li>
                                </ol>
                            </div>
                        </div>

                        <div class="process-section">
                            <h3>3. Do Backend ao Frontend: A Jornada dos Dados</h3>
                            
                            <div class="process-step">
                                <h4>No Backend (Servidor)</h4>
                                <div class="step-content">
                                    <ul>
                                        <li>Configuração e compressão dos dados</li>
                                        <li>Inclusão de cabeçalhos HTTP apropriados</li>
                                        <li>Seleção do algoritmo baseado na compatibilidade</li>
                                    </ul>
                                </div>
                            </div>

                            <div class="process-step">
                                <h4>Durante a Transmissão</h4>
                                <div class="step-content">
                                    <ul>
                                        <li>Redução significativa do tamanho dos dados</li>
                                        <li>Menor latência e tempo de download</li>
                                        <li>Economia de banda</li>
                                    </ul>
                                </div>
                            </div>

                            <div class="process-step">
                                <h4>No Frontend (Navegador)</h4>
                                <div class="step-content">
                                    <ul>
                                        <li>Detecção automática do método de compressão</li>
                                        <li>Descompressão transparente dos dados</li>
                                        <li>Renderização da página com alta performance</li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="footer">
                    <p>Universidade Federal de Uberlândia - 2024</p>
                </div>
            </div>
        </body>
        </html>
    `);
});

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

                    <div class="algorithm-section">
                        <h3>1. Como Funciona o Gzip</h3>
                        <div class="algorithm-step">
                            <h4>Princípio Básico</h4>
                            <p>O Gzip combina duas técnicas principais para reduzir o tamanho dos dados:</p>
                            
                            <div class="technique">
                                <h5>LZ77 (Lempel-Ziv 77)</h5>
                                <p>Identifica padrões e sequências repetitivas no texto, substituindo-as por referências.</p>
                                <div class="example">
                                    <div class="example-label">Exemplo:</div>
                                    <pre>Texto Original: "ABCABCABCABC"
Após LZ77: "ABC" + [referência para repetição]</pre>
                                </div>
                            </div>

                            <div class="technique">
                                <h5>Codificação de Huffman</h5>
                                <p>Atribui códigos binários de comprimento variável aos caracteres com base em sua frequência.</p>
                                <div class="example">
                                    <div class="example-label">Exemplo:</div>
                                    <pre>Texto: "AABBB"
Frequências: A=2, B=3
Códigos: A=0, B=1
Resultado: "00111"</pre>
                                </div>
                            </div>
                        </div>

                        <div class="algorithm-step">
                            <h4>Aplicação no Contexto de Sites</h4>
                            <p>No ambiente web, o Gzip é configurado no servidor para comprimir arquivos de texto:</p>
                            <ol>
                                <li><strong>Preparação no Servidor:</strong> Verifica suporte do navegador via Accept-Encoding</li>
                                <li><strong>Transmissão:</strong> Envia arquivos com Content-Encoding: gzip</li>
                                <li><strong>Descompressão:</strong> Navegador descomprime automaticamente</li>
                            </ol>
                        </div>
                    </div>

                    <div class="algorithm-section">
                        <h3>2. Como Funciona o Brotli</h3>
                        <div class="algorithm-step">
                            <h4>Princípio Básico</h4>
                            <p>O Brotli utiliza uma abordagem diferente, combinando dois conceitos principais:</p>
                            
                            <div class="technique">
                                <h5>Dicionário Pré-definido</h5>
                                <p>Utiliza um dicionário estático com palavras e padrões comuns da web.</p>
                                <div class="example">
                                    <div class="example-label">Exemplo:</div>
                                    <pre>Texto Original: "function greet() { return 'hello'; }"
Após Brotli: [código para "function"] [código para "return"]</pre>
                                </div>
                            </div>

                            <div class="technique">
                                <h5>Compressão Adaptativa</h5>
                                <p>Analisa o contexto do arquivo para escolher a melhor estratégia de compressão.</p>
                                <div class="example">
                                    <div class="example-label">Exemplo:</div>
                                    <pre>HTML Original: &lt;div class="container"&gt;Conteúdo&lt;/div&gt;
Após Brotli: [código para div] [código para class]</pre>
                                </div>
                            </div>
                        </div>

                        <div class="algorithm-step">
                            <h4>Aplicação no Contexto de Sites</h4>
                            <p>O Brotli é adotado por servidores modernos e navegadores recentes:</p>
                            <ol>
                                <li><strong>No Servidor:</strong> Detecta compatibilidade via Accept-Encoding</li>
                                <li><strong>Envio:</strong> Usa Content-Encoding: br</li>
                                <li><strong>Descompressão:</strong> Navegador descomprime automaticamente</li>
                            </ol>
                        </div>
                    </div>

                    <div class="process-section">
                        <h3>3. Do Backend ao Frontend: A Jornada dos Dados</h3>
                        
                        <div class="process-step">
                            <h4>No Backend (Servidor)</h4>
                            <div class="step-content">
                                <ul>
                                    <li>Configuração e compressão dos dados</li>
                                    <li>Inclusão de cabeçalhos HTTP apropriados</li>
                                    <li>Seleção do algoritmo baseado na compatibilidade</li>
                                </ul>
                            </div>
                        </div>

                        <div class="process-step">
                            <h4>Durante a Transmissão</h4>
                            <div class="step-content">
                                <ul>
                                    <li>Redução significativa do tamanho dos dados</li>
                                    <li>Menor latência e tempo de download</li>
                                    <li>Economia de banda</li>
                                </ul>
                            </div>
                        </div>

                        <div class="process-step">
                            <h4>No Frontend (Navegador)</h4>
                            <div class="step-content">
                                <ul>
                                    <li>Detecção automática do método de compressão</li>
                                    <li>Descompressão transparente dos dados</li>
                                    <li>Renderização da página com alta performance</li>
                                </ul>
                            </div>
                        </div>
                    </div>

                    <style>
                        .algorithm-section {
                            margin: 30px 0;
                            padding: 20px;
                            background: #f8f9fa;
                            border-radius: 10px;
                        }
                        .algorithm-step {
                            margin: 20px 0;
                            padding: 15px;
                            background: white;
                            border-radius: 8px;
                            box-shadow: 0 2px 4px rgba(0,0,0,0.05);
                        }
                        .technique {
                            margin: 15px 0;
                            padding: 15px;
                            background: #f8f9fa;
                            border-radius: 8px;
                        }
                        .technique h5 {
                            color: #2c3e50;
                            margin-top: 0;
                        }
                        .example {
                            margin-top: 10px;
                            padding: 10px;
                            background: white;
                            border-radius: 5px;
                            font-family: 'Consolas', monospace;
                        }
                        .example-label {
                            font-weight: bold;
                            color: #7f8c8d;
                            margin-bottom: 5px;
                        }
                        .process-step {
                            margin: 20px 0;
                            padding: 15px;
                            background: white;
                            border-radius: 8px;
                            box-shadow: 0 2px 4px rgba(0,0,0,0.05);
                        }
                        .process-step h4 {
                            color: #2c3e50;
                            margin-top: 0;
                            padding-bottom: 10px;
                            border-bottom: 2px solid #3498db;
                        }
                        .step-content ul {
                            margin: 10px 0;
                            padding-left: 20px;
                        }
                        .step-content li {
                            margin: 8px 0;
                            line-height: 1.5;
                        }
                    </style>
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