const itensCarrinho = document.querySelector('.itens-carrinho');
const totalHTML = document.querySelector('.total');
const btnAddItens = document.querySelector('.btn-add-itens');
const btnFinalizar = document.querySelector('.btn-finalizar');

let carrinho = JSON.parse(localStorage.getItem('carrinho')) || [];

function rendenizarCarrinho() {
    itensCarrinho.innerHTML = '';
    totalHTML = '';

    if (carrinho.length === 0) {
        itensCarrinho.innerHTML = `<p>Seu carrinho está vazio.</p>`;

        return;
    }

    let total = 0;

    carrinho.forEach((item, index) => {
        const subtotal = item.preco * item.quantidade;

        total += subtotal;

        itensCarrinho.innerHTML += `
            <div class="carrinho-pedido">
                <h2 class="nome-lanche">${item.nome}</h2>
                <p class="observacoes">Quantidade: ${item.quantidade}</p>
                <p class="preco preco-carrinho">R$ ${subtotal.toFixed(2)}</p>

                <button class="btn btn-remover" data-index="${index}">Excluir</button>
            </div>
        `;
    });

    totalHTML.innerHTML = `<p>Total: R$ ${total.toFixed(2)}</p>`;

    const btnsRemover = document.querySelectorAll('.btn-remover');
    btnsRemover.forEach(btn => {
        btn.addEventListener('click', () => {
            const index = btn.dataset.index;

            carrinho.splice(index, 1);

            localStorage.setItem('carrinho', JSON.stringify(carrinho));

            rendenizarCarrinho();
        });
    });
}

btnAddItens.addEventListener('click', () => {
    window.location.href = './cardapio.html';
});

btnFinalizar.addEventListener('click', () => {
    if (carrinho.length === 0) {
        alert('Seu carrinho está vazio.');

        return;
    }

    window.location.href = './pagamento.html';
});

rendenizarCarrinho();