function adicionarProduto(nome, valorUnitario, quantidade) {
  const valorTotal = valorUnitario * quantidade;
  app.produtos.push({ nome, quantidade, valorUnitario, valorTotal });
  salvarProdutos(app.produtos);
}

function salvarProdutos(produtos) {
  localStorage.setItem("produtos", JSON.stringify(produtos));
}

function carregarProdutos() {
  return JSON.parse(localStorage.getItem("produtos")) || [];
}

function limparProdutos() {
  app.produtos.length = 0;
  salvarProdutos(app.produtos);
}