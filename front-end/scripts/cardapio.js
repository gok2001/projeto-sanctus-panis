import { estaLogado, ehAdmin } from "./auth.js";
import { API_URL } from "./api.js";

const cardapio = document.querySelector('.lista-cardapio')
const btnAdmin = document.querySelector('.btn-admin');
const modal = document.querySelector('.modal-lanche');
const btnAddIngrediente = document.querySelector('.btn-add-ingrediente');
const ingredientesContainer = document.querySelector('.ingredientes-container');
const formLanche = document.querySelector('.form-lanche');

let carrinho = JSON.parse(localStorage.getItem('carrinho')) || [];

const responseLanche = await fetch(`${API_URL}/getLanche`);
const lanches = await responseLanche.json();

lanches.forEach(lanche => {
    const card = document.createElement('article');
    card.classList.add('item-cardapio');
    card.dataset.id = lanche.idLanche;
    card.dataset.nome = lanche.nomeLanche;
    card.dataset.preco = lanche.precoLanche;

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

            <button class="btn btn-add-carrinho">Adicionar</button>
        </div>
    `;

    cardapio.appendChild(card);

    const btnMais = card.querySelector('.mais');
    const btnMenos = card.querySelector('.menos');
    const qtd = card.querySelector('.qtd');
    const btnAdicionar = card.querySelector('.btn-add-carrinho');

    let quantidade = 0;

    btnMais.addEventListener('click', () => {
        quantidade++;
        qtd.textContent = quantidade;
    });

    btnMenos.addEventListener('click', () => {
        if (quantidade > 0) {
            quantidade--;
            qtd.textContent = quantidade;
        }
    });

    btnAdicionar.addEventListener('click', () => {
        if (quantidade <= 0) {
            alert('Escolha uma quantidade maior que 0');
            return;
        }

        const id = card.dataset.id;
        const nome = card.dataset.nome;
        const preco = Number(card.dataset.preco);

        const itemExistente = carrinho.find(item => item.id === id);

        if (itemExistente) {
            itemExistente.quantidade += quantidade;
        } else {
            carrinho.push({
                id,
                nome,
                preco,
                quantidade
            });
        }

        localStorage.setItem('carrinho', JSON.stringify(carrinho));

        console.log(carrinho);

        quantidade = 0;
        qtd.textContent = 0;

        alert('Item adicionado ao carrinho!')
    });
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

const responseProduto = await fetch(`${API_URL}/getProduto`);
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
            `${API_URL}/addLanche`, 
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
