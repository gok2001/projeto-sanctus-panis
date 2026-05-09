const URL = 'http://10.110.12.62:1880/login';
const formLogin = document.querySelector('.login-form');

formLogin.addEventListener('submit', async (event) => {
    event.preventDefault();
    
    const emailUsuario = document.querySelector('#email-login').value;
    const senhaUsuario = document.querySelector('#senha-login').value;

    const dados = {
        emailUsuario,
        senhaUsuario
    };

    try {
        const response = await fetch(URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/JSON'
            },
            body: JSON.stringify(dados)
        });

        const usuario = await response.json();

        if (usuario.length > 0) {
            alert('Login realizado!');
            window.location.href = 'index.html'
        } else {
            alert('Email ou senha incorretos');
        }
    } catch (erro) {
        console.error(erro);
        alert('Erro no login');
    }
});