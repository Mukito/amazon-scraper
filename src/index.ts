import { Elysia } from 'elysia';    // Framework leve para criar APIs em TypeScript.
import axios from 'axios';          // Biblioteca para fazer requisições HTTP.
import * as cheerio from 'cheerio'; // Biblioteca para manipular HTML no estilo jQuery (usada para scraping).

const app = new Elysia();           // Instancia um novo servidor Elysia, que vai lidar com as requisições.


// Definição de Rota /api/scrape
app.get('/api/scrape', async ({ query }) => {
    const keyword = query.keyword;
    if (!keyword) {
        return { error: 'Keyword is required' };
    }

    // ScraperAPI
    const apiKey = '2a541e5ee70d119a406ebf3bbaafeef2';  // Define APIKey
    const url = `https://api.scraperapi.com/?api_key=${apiKey}&url=https://www.amazon.com/s?k=${encodeURIComponent(keyword)}`; // monta a URL de scraping para pesquisa Amazon

    // Headers para Evitar Bloqueios (Não deu certo fui blokeado mesmo assim, mas funciona com isso)

    try {
        const response = await axios.get(url, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36',
                'Accept-Language': 'en-US,en;q=0.9',
                'Accept-Encoding': 'gzip, deflate, br',
                'Referer': 'https://www.amazon.com/',
                'DNT': '1', // Do Not Track
                'Connection': 'keep-alive',
                'Upgrade-Insecure-Requests': '1'
            }
        });
        console.log(response.data);
        const $ = cheerio.load(response.data);
        

        // Extraindo Dados dos produtos
        const products: any[] = [];    // Cria um Array products para armazenar os dados coletados

        $('.s-main-slot .s-result-item').each((index, item) => {            // Percorre os elementos HTML
            const title = $(item).find('h2 a span').text().trim();                          // Nome do PRoduto
            const rating = $(item).find('.a-icon-star-small span').text().trim();           // Avaliação (estrelas)
            const reviews = $(item).find('.s-link-style .s-underline-text').text().trim();  // Numeros de Avaliações
            const image = $(item).find('img.s-image').attr('src');                          // URL da imagem

            if (title && rating && reviews && image) {
                products.push({
                    title,
                    rating,
                    reviews,
                    image
                });
            }

    });
    return { products };    // Retorna os produtos extraidos do formato JSON
        //Tratamento de Erros
    } catch (error) {
        return { error: 'Failed to fetch data', details: String(error) };
    }

});

// Iniciando o Servidor
app.listen(3000, () => console.log('Server running on http://localhost:3000'));


/* 
Resumo
Importa Elysia, Axios e Cheerio.

Cria um servidor com Elysia.

Adiciona uma rota GET (/api/scrape).

Obtém a keyword da URL.

Monta a URL da ScraperAPI para buscar na Amazon.

Faz a requisição com Axios e usa Cheerio para processar o HTML.

Extrai título, avaliação, reviews e imagem dos produtos.

Retorna os dados em JSON.

Inicia o servidor na porta 3000.

*/

