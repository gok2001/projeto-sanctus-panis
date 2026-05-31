import { API_URL } from "./api.js";

const formCadastro = document.querySelector('.form-cadastro');

const btnCadastro = formCadastro.querySelector('button');

formCadastro.addEventListener('submit', async (event) => {
    event.preventDefault();

    btnCadastro.disabled = true;
    btnCadastro.textContent = 'Cadastrando...';

    const nomeUsuario = document.querySelector('#nome-cadastro').value.trim();
    const emailUsuario = document.querySelector('#email-cadastro').value.trim();
    const cpfUsuario = document.querySelector('#cpf').value.trim;
    const senhaUsuario = document.querySelector('#senha-cadastro').value;
    const confirmarSenha = document.querySelector('#confirmar-senha').value;

    const regexEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;


    try {
        if (!nomeUsuario) {
            alert('Informe seu nome');
            return;
        }

        if (!emailUsuario) {
            alert('Informe seu email');
            return;
        }

        if (!regexEmail.test(emailUsuario)) {
            alert('Email inválido');
            return;
        }

        if (!cpfUsuario) {
            alert('Informe seu CPF');
            return;
        }

        if (senhaUsuario.length < 8) {
            alert('A senha deve possuir pelo menos 8 caracteres');
            return;
        }

        if (senhaUsuario !== confirmarSenha) {
            alert('As senhas não coincidem!');
            return;
        }

        const novoUsuario = {
            nomeUsuario,
            emailUsuario,
            cpfUsuario,
            senhaUsuario
        };

        const response = await fetch(
            `${API_URL}/addUsuario`,
            {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(novoUsuario)
        });

        if (!response.ok) {
            throw new Error('Erro ao cadastrar usuário');
        }

        alert('Cadastro enviado!');
        window.location.href = 'login.html';

    } catch (erro) {
        console.error('Erro:', erro);
        alert('Erro ao cadastrar usuário');
        
    } finally {
        btnCadastro.disabled = false;
        btnCadastro.textContent = 'Cadastrar';
    }
});