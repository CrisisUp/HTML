// Captura elementos do DOM com tipagem clara
const botao = document.getElementById("botao") as HTMLButtonElement;
const mensagem = document.getElementById("mensagem") as HTMLParagraphElement;

const campoNome = document.getElementById("nome") as HTMLInputElement;
const botaoSaudar = document.getElementById("saudar") as HTMLButtonElement;
const paragrafoSaudacao = document.getElementById("saudacao") as HTMLParagraphElement;

const painelExplicacao = document.getElementById("explicacao") as HTMLDivElement;

// Função para mostrar código no painel
function mostrarCodigo(texto: string): void {
    painelExplicacao.style.display = "block";
    painelExplicacao.textContent = texto;
}

// Evento do botão "Mudar texto"
botao.addEventListener("click", (): void => {
    mensagem.textContent = "Você clicou no botão! 🎉";
    mostrarCodigo(`// Altera texto do parágrafo com ID "mensagem"
const mensagem = document.getElementById("mensagem") as HTMLParagraphElement;
mensagem.textContent = "Você clicou no botão! 🎉";`);
});

// Evento do botão "Saudar"
botaoSaudar.addEventListener("click", (): void => {
    const nome: string = campoNome.value.trim();

    if (nome) {
        paragrafoSaudacao.textContent = `Olá, ${nome}! 👋`;
    } else {
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
