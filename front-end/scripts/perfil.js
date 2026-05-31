import { estaLogado, ehAdmin, logout, obterUsuario } from "./auth.js";
import { API_URL } from "./api.js";

const usuario = obterUsuario();
const formPerfil = document.querySelector('.perfil-form');

const adminArea = document.querySelector('.admin-area');
const produtosContainer = document.querySelector('#produtos-container');
const formProduto = document.querySelector('.form-produto');

const btnLogout = document.querySelector('#btn-logout');
const btnAtualizar = formPerfil.querySelector('button[type="submit"');
const btnProduto = formProduto.querySelector('button')

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
    nomeUsuario.value = usuario.nomeUsuario;
    emailUsuario.value = usuario.emailUsuario;
}

function verificarAdmin() {
    if (estaLogado() && ehAdmin()) {
        adminArea.classList.remove('hidden');
        carregarProdutos();
    }
}

formPerfil.addEventListener('submit', async (event) => {
    event.preventDefault();

    const nomeUsuario = document.querySelector('#nome').value;trim();
    const emailUsuario = document.querySelector('#email').value.trim();
    const senhaUsuario = document.querySelector('#senha');

    const regexEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!nome) {
        alert('Informe seu nome');
        return;
    }

    if (!regexEmail.test(email)) {
        alert('Email inválido');
        return;
    }

    if (senha && senha.length < 6) {
        alert('A nova senha deve possuir pelo menos 6 caracteres');
        return;
    }

    btnAtualizar.disabled = true;
    btnAtualizar.textContent = 'Atualizando...'

    const dadosAtualizados = {
        idUsuario: usuario.idUsuario,
        nomeUsuario: nomeUsuario.value,
        emailUsuario: emailUsuario.value,
    };

    if (senhaUsuario) {
        dadosAtualizados.senhaUsuario = senhaUsuario;
    }

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

        senhaUsuario.value = '';
    } catch (error) {
        console.error(error);
        alert('Erro ao atualizar perfil');
    } finally {
        btnAtualizar.disabled = false;
        btnAtualizar.textContent = 'Atualizar Dados';
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

                    <button type="button" class="btn" onclick="atualizarProduto(${produto.idProduto})">Salvar</button>
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

    const nomeProduto = document.querySelector('.nome-produto').value.trim();
    const qtdProduto = Number(document.querySelector('.quantidade-produto').value);
    const unidadeProduto = document.querySelector('.unidade-produto').trim();

    if (!nomeProduto) {
        alert('Informe o nome do produto');
        return;
    }

    if (qtdProduto <= 0 || isNaN(qtdProduto)) {
        alert('Quantidade inválida');
        return;
    }

    if (!unidadeProduto) {
        alert('Informe a unidade do produto');
        return;
    }

    btnProduto.disabled = true;
    btnProduto.textContent = 'Adicionando...';

    const novoProduto = { 
        nomeProduto: nomeProduto.value,
        qtdProduto: qtdProduto.value,
        unidadeProduto: unidadeProduto.value
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
    } finally {
        btnProduto.disabled = false;
        btnProduto.textContent = 'Adicionar Produto';
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