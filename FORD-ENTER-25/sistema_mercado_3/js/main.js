function inicializar() {
  inicializarEventos();
  if (app.produtos.length > 0) {
    gerarNotaFiscal();
  }
}

inicializar();