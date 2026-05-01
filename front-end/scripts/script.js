async function loadComponent(id, file) {
    const element = document.getElementById(id);
    if (!element) return;

    try {
        const response = await fetch(file);
        if (!response.ok) throw new Error('Erro ao carregar ' + file);
        
        const data = await response.text();

        element.innerHTML = data;
    } catch (error) {
        console.error('Erro ao carregar componente:', error);
    }
}

document.addEventListener('DOMContentLoaded', () => {
    loadComponent('header', '../pages/static/header.html');
    loadComponent('footer', '../pages/static/footer.html');
});

document.querySelectorAll('input[name="opcao"]').forEach(radio => {
    radio.addEventListener('change', function() {
        let pagamento = document.getElementById('pagamento');
        
        if (this.value === 'entrega' && this.checked) {
            pagamento.style.display = 'flex';
        } else {
            pagamento.style.display = 'none';
        }
    });
});