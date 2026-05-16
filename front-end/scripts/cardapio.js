import { estaLogado, ehAdmin } from "./auth.js";

const cardapio = document.querySelector('.lista-cardapio')
const btnAdmin = document.querySelector('.btn-admin');
const modal = document.querySelector('.modal-lanche');
const btnAddIngrediente = document.querySelector('.btn-add-ingrediente');
const ingredientesContainer = document.querySelector('.ingredientes-container');

const URL_getLanche = 'http://localhost:1880/getLanche';
const responseLanche = await fetch(URL_getLanche);
const lanches = await responseLanche.json();

lanches.forEach(lanche => {

    const card = document.createElement('article');
    card.classList.add('item-cardapio');

    card.innerHTML = `
        <div class="item-info">

            <h2>${lanche.nomeLanche}</h2>
            <p class="preco">R$ ${lanche.precoLanche}</p>
            
        </div>

        <div class="acoes-item">

            <div class="quantidade">
                <button class="btn">-</button>
                <span class="qtd">0</span>
                <button class="btn">+</button>
            </div>

            <button class="btn">Adicionar</button>
        </div>
    `;

    cardapio.appendChild(card);
});

if (estaLogado() && ehAdmin()) {
    btnAdmin.classList.remove('hidden');
}

btnAdmin.addEventListener('click', () => {
    modal.classList.remove('hidden');
});

const URL_getProduto = 'http://localhost:1880/getProduto';
const responseProduto = await fetch(URL_getProduto);
const produtos = await responseProduto.json();

function criarIngrediente() {
    const div = document.createElement('div');
    div.classList.add('ingrediente-item');

    const options = produtos.map(produto => `
        <option value="${produto.idProduto}">
            ${produto.nomeProduto}
        </option>
    `).join('');

    div.innerHTML = `
        <select>
        <input type="number" class="quantidade-input" placeholder="Quantidade">
        <input type="text" class="unidade-input" placeholder="g/un">
    `;

    return div;
}

btnAddIngrediente.addEventListener('click', () => {
    ingredientesContainer.appendChild(criarIngrediente());
});
