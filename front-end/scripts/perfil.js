import { estaLogado, ehAdmin } from "./auth.js";

const API_URL = 'http://localhost:1880';
const usuario = JSON.parse(localStorage.getItem('usuarioLogado'));

const formPerfil = document.querySelector('.perfil-form');

const inputNome = document.querySelector('#nome');
const inputEmail = document.querySelector('#email');
const inputSenha = document.querySelector('#senha');

const adminArea = document.querySelector('.admin-area');

const ingredientesContainer = document.querySelector('.ingredientes-container');
const formIngrediente = document.querySelector('.form-ingrediente');
const inputNomeIngrediente = document.querySelector('.nome-ingrediente');
const inputQuantidadeIngrediente = document.querySelector('.quantidade-ingrediente');
const inputUnidadeIngrediente = document.querySelector('.unidade-ingrediente');

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

        localStorage.setItem('usuario', JSON.stringify(usuarioAtualizado));

        alert('Perfil atualizado com sucesso');

        inputSenha.value = '';
    } catch(error) {
        console.error(error);
        alert('Erro ao atualizar perfil');
    }
});

if (estaLogado() && ehAdmin()) {
    carregarIngredientes();
}

async function carregarIngredientes() {
    try {
        const response = await fetch(`${API_URL}/getIngredientes`);

        if (!response.ok) {
            throw new Error('Erro ao buscar ingredientes');
        }

        const ingredientes = await response.json();
        ingredientesContainer.innerHTML = '';

        ingredientes.forEach((ingrediente) => {
            ingredientesContainer.innerHTML += `
                <div class="ingrediente-item">
                    <span>${ingrediente.nomeIngrediente}</span>

                    <input type="number" id="quantidade-${ingrediente.idIngrediente}" value="${ingrediente.quantidadeIngrediente}">

                    <span>${ingrediente.unidadeIngrediente}</span>

                    <button class="btn"onclick="atualizarIngrediente(${ingrediente.idIngrediente})">Salvar</button>
                    <button class="btn-padrao" onclick="removerIngrediente(${ingrediente.idIngrediente})">Remover</button>
                </div>
            `;
        });
    } catch(error) {
        console.error(error);
        alert('Erro ao carregar ingredientes');
    }
}

formIngrediente.addEventListener('submit', async (event) => {
    event.preventDefault();

    const novoIngrediente = { 
        nomeIngrediente: inputNomeIngrediente.value,
        quantidadeIngrediente: inputQuantidadeIngrediente.value,
        unidadeIngrediente: inputUnidadeIngrediente.value
    };

    try {
        const response = await fetch(
            `${API_URL}/createIngrediente`,
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(
                    novoIngrediente
                )
            }
        );

        if (!response.ok) {
            throw new Error('Erro ao adicionar ingrediente');
        }

        alert('Ingrediente adicionado');

        formIngrediente.reset();
        carregarIngredientes();

    } catch(erro) {
        console.error(erro);
        alert('Erro ao adicionar ingrediente');
    }
});

window.atualizarIngrediente = async function(idIngrediente) {

    const inputQuantidade = document.getElementById(`quantidade-${idIngrediente}`);
    const dadosAtualizados = {
        idIngrediente,
        quantidadeIngrediente: inputQuantidade.value
    };

    try {
        const response = await fetch(
            `${API_URL}/updateIngrediente`,
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
            throw new Error('Erro ao atualizar ingrediente');
        }

        alert('Ingrediente atualizado');
    }
    catch(error) {
        console.error(error);
        alert('Erro ao atualizar ingrediente');
    }

}

window.removerIngrediente = async function(idIngrediente) {
    const confirmar = confirm('Deseja remover esse ingrediente?');

    if (!confirmar) {
        return;
    }

    try {
        const response = await fetch(
            `${API_URL}/deleteIngrediente`,
            {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    idIngrediente
                })
            }
        );

        if (!response.ok) {
            throw new Error('Erro ao remover ingrediente');
        }

        alert('Ingrediente removido');

        carregarIngredientes();
    } catch(erro) {
        console.error(erro);
        alert('Erro ao remover ingrediente');
    }
}