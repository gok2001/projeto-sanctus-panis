import { estaLogado, ehAdmin, logout, obterUsuario } from "./auth.js";
import { API_URL } from "./api.js";

const usuario = obterUsuario();
const formPerfil = document.querySelector('.perfil-form');
const btnLogout = document.querySelector('#btn-logout');
const inputNome = document.querySelector('#nome');
const inputEmail = document.querySelector('#email');
const inputSenha = document.querySelector('#senha');
const adminArea = document.querySelector('.admin-area');
const produtosContainer = document.querySelector('#produtos-container');
const formProduto = document.querySelector('.form-produto');
const inputNomeProduto = document.querySelector('.nome-produto');
const inputQtdProduto = document.querySelector('.quantidade-produto');
const inputUnidadeProduto = document.querySelector('.unidade-produto');

window.addEventListener('DOMContentLoaded', () => {
    verificarUsuario();
    carregarDadosUsuario();
    verificarAdmin();
});

function verificarUsuario() {
    if (!usuario) {
        window.location.href = './login.html';
    }
}

function carregarDadosUsuario() {
    inputNome.value = usuario.nomeUsuario;
    inputEmail.value = usuario.emailUsuario;
}

function verificarAdmin() {
    if (estaLogado() && ehAdmin()) {
        adminArea.classList.remove('hidden');
        carregarProdutos();
    }
}

formPerfil.addEventListener('submit', async (event) => {
    event.preventDefault();
    const dadosAtualizados = {
        idUsuario: usuario.idUsuario,
        nomeUsuario: inputNome.value,
        emailUsuario: inputEmail.value,
        senhaUsuario: inputSenha.value
    };

    try {
        const response = await fetch(
            `${API_URL}/updateUsuario`,
            {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(dadosAtualizados)
            }
        );

        if (!response.ok) {
            throw new Error('Erro ao atualizar usuário');
        }

        const usuarioAtualizado = {
            ...usuario,
            ...dadosAtualizados
        };

        localStorage.setItem('usuarioLogado', JSON.stringify(usuarioAtualizado));

        alert('Perfil atualizado com sucesso');

        inputSenha.value = '';
    } catch(error) {
        console.error(error);
        alert('Erro ao atualizar perfil');
    }
});

async function carregarProdutos() {
    try {
        const response = await fetch(`${API_URL}/getProduto`);

        if (!response.ok) {
            throw new Error('Erro ao buscar produtos');
        }

        const produtos = await response.json();
        produtosContainer.innerHTML = '';

        produtos.forEach((produto) => {
            produtosContainer.innerHTML += `
                <div class="produto-item">
                    <span>${produto.nomeProduto}</span>

                    <input type="number" id="quantidade-${produto.idProduto}" value="${produto.qtdProduto}">

                    <span>${produto.unidadeProduto}</span>

                    <button type="button" class="btn"onclick="atualizarProduto(${produto.idProduto})">Salvar</button>
                    <button type="button" class="btn" onclick="removerProduto(${produto.idProduto})">X</button>
                </div>
            `;
        });
    } catch(error) {
        console.error(error);
        alert('Erro ao carregar produtos'); 
    }
}

formProduto.addEventListener('submit', async (event) => {
    event.preventDefault();

    const novoProduto = { 
        nomeProduto: inputNomeProduto.value,
        qtdProduto: inputQtdProduto.value,
        unidadeProduto: inputUnidadeProduto.value
    };

    try {
        const response = await fetch(
            `${API_URL}/addProduto`,
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(
                    novoProduto
                )
            }
        );

        if (!response.ok) {
            throw new Error('Erro ao adicionar produto');
        }

        alert('Produto adicionado');

        formProduto.reset();
        carregarProdutos();

    } catch(erro) {
        console.error(erro);
        alert('Erro ao adicionar produto');
    }
});

btnLogout.addEventListener('click', () => {
    const confirmar = confirm('Deseja realmente sair?');

    if (!confirmar) {
        return;
    }

    logout();
});

window.atualizarProduto = async function(idProduto) {

    const inputQuantidade = document.getElementById(`quantidade-${idProduto}`);
    const dadosAtualizados = {
        idProduto,
        qtdProduto: inputQuantidade.value
    };

    try {
        const response = await fetch(
            `${API_URL}/putProduto`,
            {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(
                    dadosAtualizados
                )
            }
        );

        if (!response.ok) {
            throw new Error('Erro ao atualizar Produto');
        }

        alert('Produto atualizado');
    } catch(error) {
        console.error(error);
        alert('Erro ao atualizar produto');
    }
}

window.removerProduto = async function(idProduto) {
    const confirmar = confirm('Deseja remover esse produto?');

    if (!confirmar) {
        return;
    }

    try {
        const response = await fetch(
            `${API_URL}/deleteProduto`,
            {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    idProduto
                })
            }
        );

        if (!response.ok) {
            throw new Error('Erro ao remover produto');
        }

        alert('Produto removido');

        carregarProdutos();
    } catch(erro) {
        console.error(erro);
        alert('Erro ao remover produto');
    }
}