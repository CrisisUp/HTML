function adicionarProduto(nome, valorUnitario, quantidade) {
  const valorTotal = valorUnitario * quantidade;
  if (app.editIndex !== null) {
    // Atualiza o produto existente
    app.produtos[app.editIndex] = { nome, quantidade, valorUnitario, valorTotal };
    app.editIndex = null;
    app.elementos.adicionarBtn.textContent = "Adicionar Produto";
  } else {
    // Adiciona novo produto
    app.produtos.push({ nome, quantidade, valorUnitario, valorTotal });
  }
  salvarProdutos(app.produtos);
  atualizarTabelaProdutos();
}

function removerProduto(index) {
  app.produtos.splice(index, 1);
  salvarProdutos(app.produtos);
  atualizarTabelaProdutos();
}

function editarProduto(index) {
  const produto = app.produtos[index];
  document.getElementById("nome").value = produto.nome;
  document.getElementById("valor").value = produto.valorUnitario;
  document.getElementById("quantidade").value = produto.quantidade;
  app.editIndex = index;
  app.elementos.adicionarBtn.textContent = "Atualizar Produto";
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
  atualizarTabelaProdutos();
}

function atualizarTabelaProdutos() {
  const tbody = app.elementos.corpoTabelaProdutos;
  tbody.innerHTML = "";
  app.produtos.forEach((produto, index) => {
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>${produto.nome}</td>
      <td>${produto.quantidade}</td>
      <td>${produto.valorUnitario.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</td>
      <td>${produto.valorTotal.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</td>
      <td>
        <button class="acao-btn" onclick="editarProduto(${index})" aria-label="Editar produto ${produto.nome}">Editar</button>
        <button class="acao-btn" onclick="removerProduto(${index})" aria-label="Remover produto ${produto.nome}">Remover</button>
      </td>
    `;
    tbody.appendChild(tr);
  });
}