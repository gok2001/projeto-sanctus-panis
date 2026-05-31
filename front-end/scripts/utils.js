export function formatarMoeda(valor) {
    return Number(valor).toLocaleString(
        'pt-BR',
        {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        }
    );
}