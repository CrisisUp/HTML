function validarEntrada(nome, valorUnitario, quantidade) {
  if (!nome) return "O nome do produto não pode estar vazio.";
  if (isNaN(valorUnitario) || valorUnitario <= 0) return "O valor unitário deve ser um número positivo.";
  if (isNaN(quantidade) || quantidade <= 0) return "A quantidade deve ser um número positivo.";
  return null;
}