import { obterUsuario } from "./auth.js";

async function loadComponent(id, file) {
    const element = document.getElementById(id);
    if (!element) return;

    try {
        const response = await fetch(file);
        if (!response.ok) throw new Error('Erro ao carregar ' + file);
        
        const data = await response.text();
        element.innerHTML = data;

    } catch (error) {
        console.error('Erro ao carregar componente: ', error);
    }
}

function atualizarMenuUsuario() {
    const usuario = obterUsuario();

    const linkHistorico = document.querySelector('#link-historico');

    if (!usuario) {
        linkHistorico.style.display = 'none';
        return;
    }
    
    const linkUsuario = document.querySelector('#link-usuario');

    if (!linkUsuario) return;

    if (usuario) {
        const primeiroNome = usuario.nomeUsuario.split(' ')[0];

        linkUsuario.href = '../pages/perfil.html';
        linkUsuario.innerHTML = `
            <div class="login-icon"></div>
            Perfil (${primeiroNome})
        `;
    }
}

document.addEventListener('DOMContentLoaded', async () => {
    await loadComponent('header', '../pages/static/header.html');
    await loadComponent('footer', '../pages/static/footer.html');

    atualizarMenuUsuario();

    const radios = document.querySelectorAll('input[name="opcao"]');

    radios.forEach(radio => {
        radio.addEventListener('change', handleOpcaoChange);
    });
});

const botaoCardapio = document.querySelector('#botao-cardapio');

if (botaoCardapio) {
    botaoCardapio.onclick = () => {
        location.href = './cardapio.html';
    }
}

const botaoCardapioFinal = document.querySelector('#botao-cardapio-final');

if (botaoCardapioFinal) {
    botaoCardapioFinal.onclick = () => {
        location.href = './cardapio.html';
    }
}
