# Demonstração de Compressão de Dados

Este projeto foi desenvolvido como parte do seminário de Comunicações Digitais 2, apresentando uma demonstração prática dos algoritmos de compressão Gzip e Brotli.

## Autores
- Matheus Pereira de Andrade
- Alfredo Francisco Amancio Mota

## Instituição
Universidade Federal de Uberlândia - Engenharia Eletrônica e de Telecomunicações

## Funcionalidades
- Demonstração interativa dos algoritmos Gzip e Brotli
- Comparação visual entre os algoritmos
- Exibição de textos original, comprimido e descomprimido
- Cálculo de taxas de compressão e economia de dados
- Explicação detalhada do funcionamento dos algoritmos
 
## Tecnologias Utilizadas
- Node.js
- Express.js
- Zlib (para compressão Gzip e Brotli)

## Como Executar
1. Instale as dependências:
```bash
npm install
```

2. Inicie o servidor:
```bash
npm start
```

3. Acesse a aplicação em seu navegador:
```
http://localhost:3000/demo
```

## Estrutura do Projeto
- `server.js` - Servidor principal com toda a lógica da aplicação
- `package.json` - Configurações e dependências do projeto

## Demonstração
A aplicação permite que você:
1. Insira qualquer texto para compressão
2. Veja o texto original e seu tamanho
3. Compare os resultados da compressão Gzip e Brotli
4. Visualize os textos comprimidos e descomprimidos
5. Analise as taxas de compressão e economia de dados

## Algoritmos Implementados
### Gzip
- Utiliza LZ77 para compressão de repetições
- Aplica codificação Huffman para otimização
- Amplamente suportado em servidores web

### Brotli
- Usa dicionário estático para padrões comuns
- Implementa compressão baseada em contexto
- Desenvolvido pelo Google com foco em performance web

## Contribuições
Este projeto foi desenvolvido para fins educacionais como parte do seminário de Comunicações Digitais 2.

## Observações

- O servidor usa o middleware `compression` do Express
- A compressão é aplicada automaticamente quando suportada pelo cliente
- Você pode desabilitar a compressão enviando o header `x-no-compression`