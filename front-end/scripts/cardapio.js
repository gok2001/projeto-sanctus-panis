import { estaLogado, ehAdmin } from "./auth.js";

const cardapio = document.querySelector('.lista-cardapio')
const btnAdmin = document.querySelector('.btn-admin');
const modal = document.querySelector('.modal-lanche');
const btnAddIngrediente = document.querySelector('.btn-add-ingrediente');
const ingredientesContainer = document.querySelector('.ingredientes-container');

const formLanche = document.querySelector('.form-lanche');

const URL_getLanche = 'http://localhost:1880/getLanche';
const responseLanche = await fetch(URL_getLanche);
const lanches = await responseLanche.json();

lanches.forEach(lanche => {

    const card = document.createElement('article');
    card.classList.add('item-cardapio');

    card.innerHTML = `
        <div class="item-info">

            <h2>${lanche.nomeLanche}</h2>
            <p class="descricao">${lanche.descricao}</p>
            <p class="preco">R$ ${lanche.precoLanche.toFixed(2)}</p>
            
        </div>

        <div class="acoes-item">

            <div class="quantidade">
                <button class="btn menos">-</button>
                <span class="qtd">0</span>
                <button class="btn mais">+</button>
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
    if (modal.classList.contains('hidden')) {
        modal.classList.remove('hidden');
    } else {
        modal.classList.add('hidden');
    }
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
        <select class="produto-select">${options}</select>
        <input type="number" class="quantidade-input" placeholder="Quantidade">
        <input type="text" class="unidade-input" placeholder="g/un">
        <button type="button" class="btn btn-remove">X</button>
    `;

    const btnRemove = div.querySelector('.btn-remove');

    btnRemove.addEventListener('click', () => {
        div.remove();
    });

    return div;
}

btnAddIngrediente.addEventListener('click', () => {
    ingredientesContainer.appendChild(criarIngrediente());
});

const URL_addLanche = 'http://localhost:1880/addLanche';

formLanche.addEventListener('submit', async (event) => {
    event.preventDefault();

    const nomeLanche = document.querySelector('#nome-lanche').value;
    const precoLanche = document.querySelector('#preco-lanche').value;
    const ingredientes = [];
    
    document.querySelectorAll('.ingrediente-item').forEach(item => {
        ingredientes.push({
            idProduto: item.querySelector('.produto-select').value,
            quantidade: item.querySelector('.quantidade-input').value,
            unidade: item.querySelector('.unidade-input').value
        });
    });

    const dados = {
        nomeLanche,
        precoLanche,
        ingredientes
    }
    
    try {
        const response = await fetch(
            URL_addLanche, 
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(dados)
            }
        );

        alert('Lanche cadastrado!');
        location.reload();

    } catch (erro) {
        console.error(erro);
        alert('Erro ao cadastrar lanche')
    }
    
});
