const itensCarrinho = document.querySelector('.itens-carrinho');
const totalHTML = document.querySelector('.total');
const btnAddItens = document.querySelector('.btn-add-itens');
const btnFinalizar = document.querySelector('.btn-finalizar');

let carrinho = JSON.parse(localStorage.getItem('carrinho')) || [];

function rendenizarCarrinho() {
    itensCarrinho.innerHTML = '';
    totalHTML.innerHTML = '';

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

const URL_addPedido = 'http://localhost:1880/addPedido';
const URL_addItemPedido = 'http://localhost:1880/addItemPedido';

btnFinalizar.addEventListener('click', async () => {
    if (carrinho.length === 0) {
        alert('Carrinho vazio');

        return;
    }

    try {
        const usuario = JSON.parse(localStorage.getItem('usuarioLogado'))
        const dadosPedido = { idUsuario: usuario.idUsuario };
        const responsePedido = await fetch(
            URL_addPedido,
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },

                body: JSON.stringify(dadosPedido)
            }
        );

        const pedidoCriado = await responsePedido.json();
        const idPedido = pedidoCriado.insertId;

        for (const item of carrinho) {
            const dadosItem = {
                idPedido,
                idLanche: item.id,
                quantidade: item.quantidade
            };

            await fetch(
                URL_addItemPedido,
                {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
    
                    body: JSON.stringify(dadosItem)
                }
            );
        }
        
        window.location.href = './pagamento.html';
    } catch (erro) {
        alert('Erro ao finalizar pedido');
    }
});

rendenizarCarrinho();