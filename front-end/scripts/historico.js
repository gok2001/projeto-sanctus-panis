const API_URL = 'http://localhost:1880';
const usuario = JSON.parse(localStorage.getItem('usuarioLogado'));
const pedidosContainer = document.querySelector('.pedidos');

window.addEventListener('DOMContentLoaded', () => {
    if (usuario.roleUsuario === 'admin') {
        carregarTodosPedidos();
    } else {
        carregarPedidosUsuario();
    }
});

async function carregarTodosPedidos() {
    try {
        const response = await fetch(`${API_URL}/getPedidos`);

        if (!response.ok) {
            throw new Error('Erro ao buscar pedidos');
        }

        const pedidos = await response.json();

        pedidosContainer.innerHTML = '';

        pedidos.forEach(pedido => {
            const data = new Date(pedido.datahoraPedido).toLocaleString('pt-BR');

            pedidosContainer.innerHTML += `
                <a href="detalhes-pedido.html?id=${pedido.idPedido}" class="pedido">
                    <p>Pedido #${pedido.idPedido}</p>
                    <p>Cliente: ${pedido.nomeUsuario}</p>
                    <p>Data: ${data}</p>
                    <p>Status: ${pedido.statusPedido}</p>
                </a>
            `;
        });
    } catch (erro) {
        console.error(erro);
    }
}

async function carregarPedidosUsuario() {
    try {
        const response = await fetch(`${API_URL}/getPedidoUsuario/${usuario.idUsuario}`);

        if (!response.ok) {
            throw new Error('Erro ao buscar pedidos');
        }

        const pedidos = await response.json();

        pedidosContainer.innerHTML = '';

        if (pedidos.length === 0) {
            pedidosContainer.innerHTML = '<p>Nenhum pedido encontrado.</p>';

            return;
        }
        pedidos.forEach(pedido => {
            const data = new Date(pedido.datahoraPedido).toLocaleString('pt-BR');

            pedidosContainer.innerHTML += `
                <a href="detalhes-pedido.html?id=${pedido.idPedido}" class="pedido">
                    <p>Pedido #${pedido.idPedido}</p>
                    <p>Data: ${data}</p>
                    <p>Status: ${pedido.statusPedido}</p>
                </a>
            `;
        });
    } catch (erro) {
        console.error(erro);

        pedidosContainer.innerHTML = '<p>Erro ao carregar pedidos.</p>';
    }
}