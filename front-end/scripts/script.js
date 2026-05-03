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

function handleOpcaoChange(event) {
    let pagamento = document.getElementById('pagamento');
    let inputsEndereco = document.querySelectorAll('.endereco input')
    
    if (event.target.value === 'entrega') {
        pagamento.classList.remove('hidden');

        inputsEndereco.forEach(input => {
            input.required = true;
        });
    } else {
        pagamento.classList.add('hidden');

        inputsEndereco.forEach(input => {
            input.required = false;
        });
    }
}

document.addEventListener('DOMContentLoaded', () => {
    loadComponent('header', '../pages/static/header.html');
    loadComponent('footer', '../pages/static/footer.html');

    const radios = document.querySelectorAll('input[name="opcao"]');

    radios.forEach(radio => {
        radio.addEventListener('change', handleOpcaoChange);
    });
});
