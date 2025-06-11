function inicializarEventos() {
  app.elementos.form.addEventListener("submit", (e) => {
    e.preventDefault();
    const nome = document.getElementById("nome").value.trim();
    const valorUnitario = parseFloat(document.getElementById("valor").value.replace(",", "."));
    const quantidade = parseInt(document.getElementById("quantidade").value);

    const erro = validarEntrada(nome, valorUnitario, quantidade);
    if (erro) {
      alert(erro);
      return;
    }

    adicionarProduto(nome, valorUnitario, quantidade);
    app.elementos.form.reset();
    alert("Produto adicionado com sucesso!");
  });

  app.elementos.finalizarBtn.addEventListener("click", gerarNotaFiscal);

  app.elementos.limparBtn.addEventListener("click", () => {
    limparProdutos();
    app.elementos.notaFiscal.textContent = "Nenhuma compra registrada ainda.";
    app.elementos.notaFiscal.classList.remove("mostrar");
  });
}