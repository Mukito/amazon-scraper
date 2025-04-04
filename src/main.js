document.addEventListener("DOMContentLoaded", () => {
    const searchButton = document.getElementById('search');
    const keywordInput = document.getElementById('keyword');
    const resultsDiv = document.getElementById('results');

    if (!searchButton || !keywordInput || !resultsDiv) {
        console.error("Erro: Elementos não encontrados no DOM.");
        return;
    }

    searchButton.addEventListener('click', async () => {
        
        console.log('🔍 Botão de busca clicado! ${keyword}');
        const keyword = keywordInput.value.trim();
        if (!keyword) {
            alert("Por favor, insira uma palavra-chave.");
            return;
        }

        resultsDiv.innerHTML = "<p>Buscando...</p>";

        try {
            console.log('🔍 Resposta da API');
            const response = await fetch(`http://localhost:3000/api/scrape?keyword=${encodeURIComponent(keyword)}`);
            const data = await response.json();

            resultsDiv.innerHTML = '';

            if (data.error) {
                resultsDiv.innerHTML = `<p>Erro: ${data.error}</p>`;
                return;
            }

            if (data.products && data.products.length > 0) {
                data.products.forEach(product => {
                    const productElement = document.createElement('div');
                    productElement.classList.add('product');
                    productElement.innerHTML = `
                        <img src="${product.image}" alt="Imagem do produto">
                        <div>
                            <h3>${product.title}</h3>
                            <p>⭐ ${product.rating} - ${product.reviews} avaliações</p>
                        </div>
                    `;
                    resultsDiv.appendChild(productElement);
                });
            } else {
                resultsDiv.innerHTML = '<p>Nenhum resultado encontrado.</p>';
            }
        } catch (error) {
            resultsDiv.innerHTML = '<p>Erro ao buscar dados.</p>';
            console.error(error);
        }
    });
});
