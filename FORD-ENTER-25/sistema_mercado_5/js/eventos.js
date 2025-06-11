function inicializarEventos() {
  app.elementos.form.addEventListener("submit", (e) => {
    e.preventDefault();
    const nome = document.getElementById("nome").value.trim();
    const valorUnitario = parseFloat(document.getElementById("valor").value.replace(",", "."));
    const quantidade = parseInt(document.getElementById("quantidade").value);

    const erros = validarEntrada(nome, valorUnitario, quantidade);
    exibirErros(erros);

    if (erros.nome || erros.valor || erros.quantidade) {
      return;
    }

    adicionarProduto(nome, valorUnitario, quantidade);
    app.elementos.form.reset();
    exibirErros({ nome: "", valor: "", quantidade: "" });
    mostrarNotificacao(app.editIndex !== null ? "Produto atualizado com sucesso!" : "Produto adicionado com sucesso!");
  });

  app.elementos.finalizarBtn.addEventListener("click", gerarNotaFiscal);

  app.elementos.limparBtn.addEventListener("click", () => {
    limparProdutos();
    app.elementos.tabelaNota.innerHTML = '<tr><td colspan="5">Nenhuma compra registrada ainda.</td></tr>';
    app.elementos.valorTotal.textContent = "R$ 0,00";
    app.elementos.notaFiscal.classList.remove("mostrar");
    exibirErros({ nome: "", valor: "", quantidade: "" });
    app.elementos.adicionarBtn.textContent = "Adicionar Produto";
    app.editIndex = null;
  });

  // Evento para botões de oferta
  document.querySelectorAll('.adicionar-oferta').forEach(btn => {
    btn.addEventListener('click', () => {
      const nome = btn.dataset.nome;
      const valorUnitario = parseFloat(btn.dataset.valor);
      const quantidade = parseInt(btn.dataset.quantidade);
      adicionarProduto(nome, valorUnitario, quantidade); // Corrigido
      mostrarNotificacao(`Produto ${nome} adicionado com sucesso!`);
    });
  });
}

function mostrarNotificacao(mensagem) {
  let notificacao = document.getElementById('notificacao');
  if (!notificacao) {
    notificacao = document.createElement('div');
    notificacao.id = 'notificacao';
    notificacao.className = 'notificacao';
    document.body.appendChild(notificacao);
  }
  notificacao.textContent = mensagem;
  notificacao.classList.add('mostrar');
  setTimeout(() => notificacao.classList.remove('mostrar'), 3000);
}