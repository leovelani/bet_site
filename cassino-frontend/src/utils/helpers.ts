// Função para formatar valores monetários 
export function formatCurrency(value: number) {
    return `$${value.toFixed(2)}`;
}