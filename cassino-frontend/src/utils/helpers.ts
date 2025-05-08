// Função para formatar valores monetários 
export function formatCurrency(value: number) {
    return `$${value.toFixed(2)}`;
}

// Interface base para apostas com método clone
export interface IBet {
    clone(): IBet;
}