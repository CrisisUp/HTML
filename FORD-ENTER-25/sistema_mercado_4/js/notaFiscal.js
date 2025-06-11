function gerarNotaFiscal() {
  const tbody = app.elementos.tabelaNota;
  const valorTotal = app.elementos.valorTotal;
  tbody.innerHTML = "";

  if (app.produtos.length === 0) {
    tbody.innerHTML = '<tr><td colspan="5">Nenhuma compra registrada ainda.</td></tr>';
    valorTotal.textContent = "R$ 0,00";
    return;
  }

  let totalFinal = 0;
  app.produtos.forEach((p, i) => {
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>${i + 1}</td>
      <td>${p.nome}</td>
      <td>${p.quantidade}</td>
      <td>${p.valorUnitario.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</td>
      <td>${p.valorTotal.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</td>
    `;
    tbody.appendChild(tr);
    totalFinal += p.valorTotal;
  });

  valorTotal.textContent = totalFinal.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
  app.elementos.notaFiscal.classList.add("mostrar");
  setTimeout(() => app.elementos.notaFiscal.classList.remove("mostrar"), 2500);
}