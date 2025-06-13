// Manipulação da interface do usuário
export function mostrarMensagem(mensagemElement, mensagem, tipo = "sucesso") {
    mensagemElement.textContent = mensagem;
    mensagemElement.className = `mensagem ${tipo}`;
    mensagemElement.style.opacity = "1";
    setTimeout(() => {
        mensagemElement.style.opacity = "0";
        setTimeout(() => {
            mensagemElement.textContent = "";
            mensagemElement.className = "mensagem";
        }, 500);
    }, 3000);
}

export function limparNotaFiscal(produtos, notaFiscalElement, salvarProdutos, mostrarMensagem) {
    if (produtos.length === 0) {
        mostrarMensagem("A nota fiscal já está vazia.", "erro");
        return;
    }
    produtos.length = 0;
    salvarProdutos(produtos);
    notaFiscalElement.innerHTML = "Nenhuma compra registrada ainda.";
    notaFiscalElement.classList.remove("mostrar");
    mostrarMensagem("Nota fiscal limpa com sucesso!", "sucesso");
}