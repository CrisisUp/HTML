"use strict";
// Captura elementos do DOM com tipagem clara
const botao = document.getElementById("botao");
const mensagem = document.getElementById("mensagem");
const campoNome = document.getElementById("nome");
const botaoSaudar = document.getElementById("saudar");
const paragrafoSaudacao = document.getElementById("saudacao");
const painelExplicacao = document.getElementById("explicacao");
// Função para mostrar código no painel
function mostrarCodigo(texto) {
    painelExplicacao.style.display = "block";
    painelExplicacao.textContent = texto;
}
// Evento do botão "Mudar texto"
botao.addEventListener("click", () => {
    mensagem.textContent = "Você clicou no botão! 🎉";
    mostrarCodigo(`// Altera texto do parágrafo com ID "mensagem"
const mensagem = document.getElementById("mensagem") as HTMLParagraphElement;
mensagem.textContent = "Você clicou no botão! 🎉";`);
});
// Evento do botão "Saudar"
botaoSaudar.addEventListener("click", () => {
    const nome = campoNome.value.trim();
    if (nome) {
        paragrafoSaudacao.textContent = `Olá, ${nome}! 👋`;
    }
    else {
        paragrafoSaudacao.textContent = "Por favor, digite seu nome.";
    }
    mostrarCodigo(`// Captura valor do campo com ID "nome"
// Mostra saudação no parágrafo com ID "saudacao"
const nome: string = campoNome.value.trim();
if (nome) {
  paragrafoSaudacao.textContent = "Olá, " + nome + "! 👋";
} else {
  paragrafoSaudacao.textContent = "Por favor, digite seu nome.";
}`);
});
