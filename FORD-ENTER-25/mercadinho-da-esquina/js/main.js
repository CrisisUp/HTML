import { validarProduto } from './validations.js';
import { gerarNotaFiscal } from './notaFiscal.js';
import { salvarProdutos, carregarProdutos } from './storage.js';
import { mostrarMensagem, limparNotaFiscal } from './ui.js';

// Inicialização
const produtos = carregarProdutos();
const notaFiscal = document.getElementById("notaFiscal");
const form = document.getElementById("produtoForm");
const finalizarBtn = document.getElementById("finalizar");
const limparBtn = document.getElementById("limpar");
const mensagemDiv = document.getElementById("mensagem");

// Evento de envio do formulário
form.addEventListener("submit", (e) => {
    e.preventDefault();
    const nomeInput = document.getElementById("nome");
    const valorInput = document.getElementById("valor");
    const quantidadeInput = document.getElementById("quantidade");
    const nome = nomeInput.value;
    const valorStr = valorInput.value;
    const quantidade = quantidadeInput.value;

    const produtoValido = validarProduto(
        nome,
        valorStr,
        quantidade,
        produtos,
        nomeInput,
        valorInput,
        quantidadeInput,
        (msg, tipo) => mostrarMensagem(mensagemDiv, msg, tipo)
    );

    if (produtoValido) {
        produtos.push(produtoValido);
        salvarProdutos(produtos);
        form.reset();
        mostrarMensagem(mensagemDiv, "Produto adicionado com sucesso!", "sucesso");
    }
});

// Evento de finalizar compra
finalizarBtn.addEventListener("click", () => {
    gerarNotaFiscal(produtos, notaFiscal, (msg, tipo) => mostrarMensagem(mensagemDiv, msg, tipo));
});

// Evento de limpar nota
limparBtn.addEventListener("click", () => {
    limparNotaFiscal(produtos, notaFiscal, salvarProdutos, (msg, tipo) => mostrarMensagem(mensagemDiv, msg, tipo));
});

// Gera nota fiscal automaticamente se houver produtos salvos
if (produtos.length > 0) {
    finalizarBtn.click();
}