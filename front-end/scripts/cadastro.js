import { API_URL } from "./api.js";

const formCadastro = document.querySelector('.form-cadastro');

const btnCadastro = formCadastro.querySelector('button');

formCadastro.addEventListener('submit', async (event) => {
    event.preventDefault();

    btnCadastro.disabled = true;
    btnCadastro.textContent = 'Cadastrando...';

    const nomeUsuario = document.querySelector('#nome-cadastro').value;
    const emailUsuario = document.querySelector('#email-cadastro').value;
    const cpfUsuario = document.querySelector('#cpf').value;
    const senhaUsuario = document.querySelector('#senha-cadastro').value;
    const confirmarSenha = document.querySelector('#confirmar-senha').value;

    if (senhaUsuario !== confirmarSenha) {
        alert('As senhas não coincidem!');
        return;
    }

    const dados = {
        nomeUsuario,
        emailUsuario,
        cpfUsuario,
        senhaUsuario
    };

    try {
        await fetch(
            `${API_URL}/addUsuario`,
            {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(dados)
        });
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