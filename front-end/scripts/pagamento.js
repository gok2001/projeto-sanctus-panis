const API_URL = 'http://localhost:1880';
const URL_addPedido = `${API_URL}/addPedido`;
const URL_addItemPedido = `${API_URL}/addItemPedido`;

const formFinalizarPedido = document.querySelector('.form-finalizar-pedido');
const itensResumo = document.querySelector('#itens-resumo');
const totalResumo = document.querySelector('#total-resumo');
const carrinho = JSON.parse(localStorage.getItem('carrinho')) || [];
const selectPagamento = document.querySelector('#seleciona-pagamento');
const trocoContainer = document.querySelector('#troco-container');
const inputTroco = document.querySelector('#troco');

const usuario = JSON.parse(localStorage.getItem('usuarioLogado'));

window.addEventListener('DOMContentLoaded', () => {
    carregarResumoPedido();

    const radios = document.querySelectorAll('input[name="opcao"]');

    radios.forEach(radio => {
        radio.addEventListener('change', handleOpcaoChange);
    });

    selectPagamento.addEventListener('change', handlePagamentoChange);
});

formFinalizarPedido.addEventListener('submit', async (event) => {
    event.preventDefault();
    
    if (!usuario) {
        alert('Você precisa estar logado!');
        return;
    }

    if (carrinho.length === 0) {
        alert('Carrinho vazio');
        return;
    }

    try {
        const responsePedido = await fetch(
            URL_addPedido,
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({idUsuario: usuario.idUsuario})
            }
        );

        if (!responsePedido.ok) {
            throw new Error('Erro ao criar pedido');
        }

        const pedidoCriado = await responsePedido.json();
        const idPedido = pedidoCriado.insertId;
        
        for (const item of carrinho) {
            const dadosItem = {
                idPedido,
                idLanche: item.id,
                quantidade: item.quantidade
            };

            const responseItem = await fetch(
                URL_addItemPedido,
                {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(dadosItem)
                }
            );

            if (!responseItem.ok) {
                throw new Error('Erro ao adicionar item');
            }
        }

        localStorage.removeItem('carrinho');

        alert('Pedido realizado com sucesso!');

        window.location.href = './index.html';
    } catch (erro) {
        console.error(erro);
        alert('Erro ao finalizar o pedido');
    }
})

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

function handlePagamentoChange(event) {
    if (event.target.value === 'dinheiro') {
        trocoContainer.classList.remove('hidden');
        inputTroco.required = true;
    } else {
        trocoContainer.classList.add('hidden');
        inputTroco.required = false;
        inputTroco.value = '';
    }
}