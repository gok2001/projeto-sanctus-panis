import { estaLogado, ehAdmin } from "./auth.js";

const URL = 'http://localhost:1880/getLanche';
const response = await fetch(URL);
const lanches = await response.json();
const cardapio = document.querySelector('.lista-cardapio')

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


const btnAdmin = document.querySelector('.btn-admin');

if (estaLogado() && ehAdmin()) {
    btnAdmin.classList.remove('hidden');
}
