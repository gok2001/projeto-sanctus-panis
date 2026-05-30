const itensResumo = document.querySelector('#itens-resumo');
const totalResumo = document.querySelector('#total-resumo');
const carrinho = JSON.parse(localStorage.getItem('carrinho')) || [];

window.addEventListener('DOMContentLoaded', () => {
    carregarResumoPedido();

    const radios = document.querySelectorAll('input[name="opcao"]');

    radios.forEach(radio => {
        radio.addEventListener('change', handleOpcaoChange);
    });
});

function carregarResumoPedido() {
    itensResumo.innerHTML = '';

    if (carrinho.length === 0) {
        itensResumo.innerHTML = '<p>Nenhum item no carrinho.</p>';
        return;
    }

    let total = 0;

    carrinho.forEach(item => {
        const subtotal = item.preco * item.quantidade;
        total += subtotal;

        itensResumo.innerHTML += `
            <p>
                ${item.nome} x${item.quantidade}
                - R$ ${subtotal.toFixed(2)}
            </p>
        `;
    });

    totalResumo.innerHTML = `<strong>Total: R$ ${total.toFixed(2)}</strong>`;
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