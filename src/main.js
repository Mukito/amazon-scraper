// Carrega o DOM - Garante que o código so funciona depois do HTML carregado
document.addEventListener("DOMContentLoaded", () => {
    const searchButton = document.getElementById('search');     // Pega o botão 
    const keywordInput = document.getElementById('keyword');    // Pega o campo de entrada
    const resultsDiv = document.getElementById('results');      // Pega a div resultados vao aparecer id=results

    //Verificar se os elementos foram encontrados senao existir para a execução
    if (!searchButton || !keywordInput || !resultsDiv) {
        console.error("Erro: Elementos não encontrados no DOM.");
        return;
    }

    // Evento do Botão
    searchButton.addEventListener('click', async () => {
        // Exibe no console
        console.log('🔍 Botão de busca clicado! ${keyword}');
        // Captura a palavra e verifica
        const keyword = keywordInput.value.trim();  // o trim() remove espaços do texto
        if (!keyword) {
            alert("Por favor, insira uma palavra-chave.");  // caso nao escreva nada aparece um alerta na tela
            return;
        }

        // enquanto espera "Buscando"
        resultsDiv.innerHTML = "<p>Buscando...</p>";

        // Fazer a requisição para a API do servidor
        try {
            console.log('🔍 Resposta da API');
            const response = await fetch(`http://localhost:3000/api/scrape?keyword=${encodeURIComponent(keyword)}`); // encodeURIComponent(keyword) - transforma caracteres especiais em erros.
            const data = await response.json(); // Converte a resposta em um objeto JS

            // Limpa os Resultados anteriores - remove qual quer resultado
            resultsDiv.innerHTML = ''; 

            // verifica se houve erro na API
            if (data.error) {
                resultsDiv.innerHTML = `<p>Erro: ${data.error}</p>`;
                return;
            }

            // Exibir os produtos na tela
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
