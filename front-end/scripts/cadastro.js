import { API_URL } from "./api.js";

const formCadastro = document.querySelector('.form-cadastro');

const inputNome = document.querySelector('#nome-cadastro');
const inputEmail = document.querySelector('#email-cadastro');
const inputCpf = document.querySelector('#cpf');
const inputSenha = document.querySelector('#senha-cadastro');
const inputConfirmarSenha = document.querySelector('#confirmar-senha');

const btnCadastro = formCadastro.querySelector('button');

inputCpf.addEventListener('input', () => {
    let valor = inputCpf.value.replace(/\D/g, '').slice(0, 11);

    valor = valor.replace(/(\d{3})(\d)/, '$1.$2');
    valor = valor.replace(/(\d{3})(\d)/, '$1.$2');
    valor = valor.replace(/(\d{3})(\d{1,2})$/, '$1-$2');

    inputCpf.value = valor;
});

function validarCPF(cpf) {
    cpf = cpf.replace(/\D/g, '');

    if (cpf.length !== 11) {
        return false;
    }

    if (/^(\d)\1{10}$/.test(cpf)) {
        return false;
    }

    let soma = 0;

    for (let i = 0; i < 9; i++) {
        soma += Number(cpf.charAt(i)) * (10 - i);
    }

    let resto = (soma * 10) % 11;

    if (resto === 10) {
        resto = 0;
    }

    if (resto !== Number(cpf.charAt(9))) {
        return false;
    }

    soma = 0;

    for (let i = 0; i < 10; i++) {
        soma += Number(cpf.charAt(i)) * (11 - i);
    }

    resto = (soma * 10) % 11;

    if (resto === 10) {
        resto = 0;
    }

    if (resto !== Number(cpf.charAt(10))) {
        return false;
    }

    return true;
}

formCadastro.addEventListener('submit', async (event) => {
    event.preventDefault();

    const nomeUsuario = inputNome.value.trim();
    const emailUsuario = inputEmail.value.trim();
    const cpfUsuario = inputCpf.value.replace(/\D/g, '').trim();
    const senhaUsuario = inputSenha.value;
    const confirmarSenha = inputConfirmarSenha.value;

    const regexEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!regexEmail.test(emailUsuario)) {
        alert('Email inválido');
        return;
    }

    if (!validarCPF(cpfUsuario)) {
        alert('CPF inválido');
        return;
    }

    if (senhaUsuario !== confirmarSenha) {
        alert('As senhas não coincidem!');
        return;
    }

    btnCadastro.disabled = true;
    btnCadastro.textContent = 'Cadastrando...';

    const novoUsuario = {
        nomeUsuario,
        emailUsuario,
        cpfUsuario,
        senhaUsuario
    };

    try {
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