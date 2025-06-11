function gerarNotaFiscal() {
  if (app.produtos.length === 0) {
    app.elementos.notaFiscal.textContent = "Nenhuma compra registrada ainda.";
    return;
  }

  let nota = "Nota Fiscal:\n\n";
  let totalFinal = 0;

  app.produtos.forEach((p, i) => {
    nota += `${i + 1}. ${p.nome} - ${p.quantidade} un. x ${p.valorUnitario.toLocaleString('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    })} = ${p.valorTotal.toLocaleString('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    })}\n`;
    totalFinal += p.valorTotal;
  });

  nota += `\nTotal da compra: ${totalFinal.toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  })}`;

  app.elementos.notaFiscal.textContent = nota;
  app.elementos.notaFiscal.classList.add("mostrar");
  setTimeout(() => app.elementos.notaFiscal.classList.remove("mostrar"), 2500);
}