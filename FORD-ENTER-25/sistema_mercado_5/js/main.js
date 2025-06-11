function inicializar() {
  inicializarEventos();
  atualizarTabelaProdutos();
  if (app.produtos.length > 0) {
    gerarNotaFiscal();
  }
}

inicializar();