const URL = 'http://10.110.12.62:1880/addUsuario';
const formCadastro = document.querySelector('.form-cadastro');

formCadastro.addEventListener('submit', async (event) => {
    event.preventDefault();

    const emailUsuario = document.querySelector('#email-cadastro').value;
    const cpfUsuario = document.querySelector('#cpf').value;
    const senhaUsuario = document.querySelector('#senha-cadastro').value;
    const confirmarSenha = document.querySelector('#confirmar-senha').value;

    if (senhaUsuario !== confirmarSenha) {
        alert('As senhas não coincidem!');
        return;
    }

    const dados = {
        emailUsuario,
        cpfUsuario,
        senhaUsuario
    };

    try {
        await fetch(URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(dados)
        });

        alert('Cadastro enviado!')
    } catch (erro) {
        console.error('Erro:', erro);
        alert('Erro ao cadastrar usuário');
    }
});