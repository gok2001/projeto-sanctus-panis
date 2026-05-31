import { API_URL } from "./api.js";
import { formatarMoeda } from "./utils.js";

const params = new URLSearchParams(window.location.search);
const idPedido = params.get('id');
const itensContainer = document.querySelector('.itens-pedido');
const totalContainer = document.querySelector('.total-pedido');

window.addEventListener(
    'DOMContentLoaded',
    carregarItensPedido
);

async function carregarItensPedido() {
    try {
        const response = await fetch(`${API_URL}/getItensPedido/${idPedido}`);

        if (!response.ok) {
            throw new Error('Erro ao carregar itens');
        }

        const itens = await response.json();

        let total = 0;

        itensContainer.innerHTML = '';

        itens.forEach(item => {
            const subtotal = item.precoLanche * item.quantidade;
            total += subtotal;

            itensContainer.innerHTML += `
                <div class="pedido-item">
                    <div class="pedido-info">
                        <h2>${item.nomeLanche}</h2>
                        <p>Quantidade: ${item.quantidade}</p>
                    </div>
                    
                    <div class="pedido-subtotal">
                        <p>Subtotal: R$ ${formatarMoeda(subtotal)}</p>
                    </div>
                </div>
            `;
        });

        totalContainer.innerHTML = `<h2>Total: R$ ${formatarMoeda(total)}</h2>`;
    } catch (erro) {
        console.error(erro);

        itensContainer.innerHTML = '<p>Erro ao carregar pedido.</p>';
    }
}