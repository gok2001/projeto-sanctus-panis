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

    if (!usuario) return;
    
    const linkUsuario = document.querySelector('#link-usuario');

    if (!linkUsuario) return;

    if (usuario) {
        linkUsuario.href = '../pages/perfil.html';
        linkUsuario.innerHTML = `
            <div class="login-icon"></div>
            Perfil
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

let botaoCardapio = document.getElementById('botao-cardapio');

botaoCardapio.onclick = function () {
    location.href = 'cardapio.html';
}
