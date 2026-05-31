import { API_URL } from "./api.js";

const formLogin = document.querySelector('.login-form');

const inputEmail = document.querySelector('#email-login');
const inputSenha = document.querySelector('#senha-login');

const btnLogin = formLogin.querySelector('button');

formLogin.addEventListener('submit', async (event) => {
    event.preventDefault();

    const emailUsuario = inputEmail.value.trim();
    const senhaUsuario = inputSenha.value;

    btnLogin.disabled = true;
    btnLogin.textContent = 'Entrando...'

    const dados = { emailUsuario, senhaUsuario };

    try {
        const response = await fetch(
            `${API_URL}/login`,
            {

            method: 'POST',
            headers: {
                'Content-Type': 'application/JSON'
            },
            body: JSON.stringify(dados)

        });

        const usuario = await response.json();

        if (usuario.length > 0) {
            localStorage.setItem(
                'usuarioLogado',
                JSON.stringify(usuario[0])
            );

            alert('Login realizado!');
            window.location.href = 'index.html';
        } else {
            alert('Email ou senha incorretos');
        }
    } catch (erro) {

        console.error(erro);
        alert('Erro no login');

    } finally {
        btnLogin.disabled = false;
        btnLogin.textContent = 'Entrar';
    }
});