const app = {
  elementos: {
    notaFiscal: document.getElementById("notaFiscal"),
    form: document.getElementById("produtoForm"),
    finalizarBtn: document.getElementById("finalizar"),
    limparBtn: document.getElementById("limpar")
  },
  produtos: carregarProdutos()
};