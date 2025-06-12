function gerarNotaFiscal() {
  const tbody = app.elementos.tabelaNota;
  const valorTotalEl = app.elementos.valorTotal;
  const notaFiscalEl = app.elementos.notaFiscal;

  // Limpa a tabela
  tbody.innerHTML = "";

  // Função auxiliar para formatar valores em BRL
  const formatarMoeda = (valor) =>
    valor.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

  // Verifica se há produtos válidos
  if (!app.produtos || app.produtos.length === 0) {
    tbody.innerHTML = '<tr><td colspan="5">Nenhuma compra registrada ainda.</td></tr>';
    valorTotalEl.textContent = formatarMoeda(0);
    return;
  }

  let totalFinal = 0;

  app.produtos.forEach((p, i) => {
    // Verifica se o produto tem os campos esperados
    if (
      !p.nome ||
      isNaN(p.quantidade) ||
      isNaN(p.valorUnitario) ||
      isNaN(p.valorTotal)
    ) {
      console.warn(`Produto inválido na posição ${i}:`, p);
      return; // Ignora o produto malformado
    }

    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>${i + 1}</td>
      <td>${p.nome}</td>
      <td>${p.quantidade}</td>
      <td>${formatarMoeda(p.valorUnitario)}</td>
      <td>${formatarMoeda(p.valorTotal)}</td>
    `;
    tbody.appendChild(tr);
    totalFinal += p.valorTotal;
  });

  // Adiciona a linha de total
  const trTotal = document.createElement("tr");
  trTotal.innerHTML = `
    <td colspan="4" style="text-align: right;"><strong>Total</strong></td>
    <td><strong>${formatarMoeda(totalFinal)}</strong></td>
  `;
  tbody.appendChild(trTotal);

  // Atualiza o elemento do valor total fora da tabela, se houver
  valorTotalEl.textContent = formatarMoeda(totalFinal);

  // Mostra visualmente a nota fiscal (classe CSS)
  notaFiscalEl.classList.add("mostrar");
  setTimeout(() => notaFiscalEl.classList.remove("mostrar"), 2500);
}
