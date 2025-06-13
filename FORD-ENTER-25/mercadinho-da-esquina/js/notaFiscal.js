// Manipulação da nota fiscal
export function gerarNotaFiscal(produtos, notaFiscalElement, mostrarMensagem) {
    if (produtos.length === 0) {
        notaFiscalElement.innerHTML = "Nenhuma compra registrada ainda.";
        mostrarMensagem("Nenhuma compra registrada para gerar a nota fiscal.", "erro");
        return;
    }

    let totalFinal = 0;
    let tabela = `
        <table>
            <thead>
                <tr>
                    <th scope="col">Item</th>
                    <th scope="col">Produto</th>
                    <th scope="col">Quantidade</th>
                    <th scope="col">Valor Unitário</th>
                    <th scope="col">Valor Total</th>
                </tr>
            </thead>
            <tbody>
    `;

    produtos.forEach((p, i) => {
        tabela += `
            <tr>
                <td>${i + 1}</td>
                <td>${p.nome}</td>
                <td>${p.quantidade} un.</td>
                <td>${p.valorUnitario.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</td>
                <td>${p.valorTotal.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</td>
            </tr>
        `;
        totalFinal += p.valorTotal;
    });

    tabela += `
            <tr class="total">
                <td colspan="4">Total da compra:</td>
                <td>${totalFinal.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</td>
            </tr>
        </tbody>
        </table>
    `;

    const notaAnterior = notaFiscalElement.innerHTML;
    notaFiscalElement.innerHTML = `<h3>Nota Fiscal</h3>${tabela}`;
    if (notaAnterior !== notaFiscalElement.innerHTML) {
        notaFiscalElement.classList.add("mostrar");
        mostrarMensagem("Nota fiscal gerada com sucesso!", "sucesso");
        setTimeout(() => notaFiscalElement.classList.remove("mostrar"), 2500);
    }
}