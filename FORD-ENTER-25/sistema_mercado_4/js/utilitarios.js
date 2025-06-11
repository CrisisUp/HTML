function validarEntrada(nome, valorUnitario, quantidade) {
  const erros = {
    nome: "",
    valor: "",
    quantidade: ""
  };

  if (!nome) erros.nome = "O nome do produto não pode estar vazio.";
  if (isNaN(valorUnitario) || valorUnitario <= 0) erros.valor = "O valor unitário deve ser um número positivo.";
  if (isNaN(quantidade) || quantidade <= 0) erros.quantidade = "A quantidade deve ser um número positivo.";

  return erros;
}

function exibirErros(erros) {
  app.elementos.erroNome.textContent = erros.nome;
  app.elementos.erroValor.textContent = erros.valor;
  app.elementos.erroQuantidade.textContent = erros.quantidade;
}