const app = {
  elementos: {
    notaFiscal: document.getElementById("notaFiscal"),
    tabelaNota: document.getElementById("corpoTabelaNota"),
    valorTotal: document.getElementById("valorTotal"),
    form: document.getElementById("produtoForm"),
    adicionarBtn: document.getElementById("adicionarBtn"),
    finalizarBtn: document.getElementById("finalizar"),
    limparBtn: document.getElementById("limpar"),
    corpoTabelaProdutos: document.getElementById("corpoTabelaProdutos"),
    erroNome: document.getElementById("erro-nome"),
    erroValor: document.getElementById("erro-valor"),
    erroQuantidade: document.getElementById("erro-quantidade")
  },
  produtos: carregarProdutos(),
  editIndex: null // Índice do produto sendo editado
};