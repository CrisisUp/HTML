// Gerenciamento do localStorage
export function salvarProdutos(produtos) {
    localStorage.setItem("produtos", JSON.stringify(produtos));
}

export function carregarProdutos() {
    return JSON.parse(localStorage.getItem("produtos")) || [];
}