const palavrasPorNivel = {
    facil: [
        { palavra: "banana", dica: "Fruta amarela" },
        { palavra: "casa", dica: "Lugar para morar" },
        { palavra: "livro", dica: "Usado para leitura" },
        { palavra: "porta", dica: "Serve para entrar ou sair" },
        { palavra: "brasil", dica: "País da América do Sul" }
    ],
    medio: [
        { palavra: "computador", dica: "Dispositivo eletrônico" },
        { palavra: "abacaxi", dica: "Fruta tropical com coroa" },
        { palavra: "telefone", dica: "Dispositivo de comunicação" },
        { palavra: "pintor", dica: "Profissional da arte" },
        { palavra: "escola", dica: "Local de aprendizado" }
    ],
    dificil: [
        { palavra: "javascript", dica: "Linguagem de programação" },
        { palavra: "burocracia", dica: "Excesso de regras formais" },
        { palavra: "microscopio", dica: "Instrumento para ver o invisível" },
        { palavra: "eletricista", dica: "Profissional que lida com fios" },
        { palavra: "desenvolvedor", dica: "Profissional de software" }
    ]
};

let nivelAtual = "facil";
let vitoriasSeguidas = 0;
let palavraSelecionada = "";
let dicaSelecionada = "";
let letrasCorretas = [];
let letrasErradas = [];
const maxTentativas = 12;
let modoMultiplayer = false;
let cronometro;
let tempoMaximo = 60;
let pontuacao = 0;

const canvas = document.getElementById("forcaCanvas");
const ctx = canvas.getContext("2d");

const startBtn = document.getElementById('start-btn');
const infoJogo = document.getElementById('info-jogo');

startBtn.addEventListener('click', () => {
    startBtn.style.display = 'none';                            // Esconde o botão
    infoJogo.style.display = 'flex';                            // Mostra container principal
    document.querySelector('.info-jogos').style.display = '';   
    iniciarJogo(); // já começa o jogo
});

function removerAcentos(texto) {
    return texto.normalize("NFD").replace(/\p{Diacritic}/gu, "").toLowerCase();
}

function iniciarJogo(usandoMultiplayer = false) {
    clearInterval(cronometro);
     modoMultiplayer = false;
    document.getElementById("tempo").textContent = tempoMaximo;
    document.getElementById("pontuacao").textContent = `🏆 Pontuação: ${pontuacao}`;

    if (usandoMultiplayer) {
        const palavra = document.getElementById("palavraManual").value.trim();
        if (!palavra || !/^[a-zA-Z]+$/.test(palavra)) {
            alert("Digite uma palavra válida (apenas letras)!");
            return;
        }
        palavraSelecionada = removerAcentos(palavra);
        dicaSelecionada = "Palavra escolhida pelo outro jogador";
        modoMultiplayer = true;
        document.getElementById("entrada-palavra").style.display = "none";
    } else {
        const lista = palavrasPorNivel[nivelAtual];
        const item = lista[Math.floor(Math.random() * lista.length)];
        palavraSelecionada = item.palavra;
        dicaSelecionada = item.dica;
    }

    letrasCorretas = [];
    letrasErradas = [];
    document.getElementById("mensagem").textContent = "";
    document.getElementById("reiniciar").style.display = "none";
    document.getElementById("tentativas-restantes").textContent = "Tentativas restantes: " + maxTentativas;
    document.getElementById("nivel").textContent = "Nível: " + capitalizar(nivelAtual);
    document.getElementById("dica").textContent = "💡 Dica: " + dicaSelecionada;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    desenharEstrutura();
    atualizarPalavra();
    atualizarLetrasErradas();
    criarTeclado();
    iniciarCronometro();
}

function capitalizar(texto) {
    return texto.charAt(0).toUpperCase() + texto.slice(1);
}

function iniciarCronometro() {
    let tempo = tempoMaximo;
    document.getElementById("tempo").textContent = tempo;
    cronometro = setInterval(() => {
        tempo--;
        document.getElementById("tempo").textContent = tempo;
        if (tempo <= 0) {
            clearInterval(cronometro);
            document.getElementById("mensagem").textContent = `⏰ Tempo esgotado! A palavra era: ${palavraSelecionada}`;
            vitoriasSeguidas = 0;
            fimDeJogo();
        }
    }, 1000);
}

function atualizarPalavra() {
    const palavraDisplay = palavraSelecionada
        .split("")
        .map(letra => (letrasCorretas.includes(letra) ? letra : "_"))
        .join(" ");
    document.getElementById("palavra-secreta").textContent = palavraDisplay;
    if (!palavraDisplay.includes("_")) {
        document.getElementById("mensagem").textContent = `🎉 Parabéns! Você venceu!`;
        clearInterval(cronometro);
        if (!modoMultiplayer) {
            vitoriasSeguidas++;
            if (vitoriasSeguidas % 3 === 0) avancarNivel();
        }
         // Bônus por tempo restante:
        const tempoRestante = parseInt(document.getElementById("tempo").textContent);
        pontuacao += tempoRestante;
        // Bônus se não houve erros:
        if (letrasErradas.length === 0) pontuacao += 50;
        if (pontuacao < 0) pontuacao = 0;
        document.getElementById("pontuacao").textContent = `🏆 Pontuação: ${pontuacao}`;
        fimDeJogo();
    }
}

function atualizarLetrasErradas() {
    document.getElementById("letras-erradas").textContent = "Letras erradas: " + letrasErradas.join(", ");
    const tentativasRestantes = maxTentativas - letrasErradas.length;
    document.getElementById("tentativas-restantes").textContent = "Tentativas restantes: " + tentativasRestantes;

    desenharForcaAnimado(letrasErradas.length);

    if (tentativasRestantes <= 0) {
        clearInterval(cronometro);
        document.getElementById("mensagem").textContent = `💀 Você perdeu! A palavra era: ${palavraSelecionada}`;
        vitoriasSeguidas = 0;
        fimDeJogo();
    }
}

function criarTeclado() {
    const teclado = document.getElementById("teclado");
    teclado.innerHTML = "";
    const alfabeto = "abcdefghijklmnopqrstuvwxyz".split("");
    alfabeto.forEach(letra => {
        const botao = document.createElement("button");
        botao.textContent = letra;
        botao.disabled = letrasCorretas.includes(letra) || letrasErradas.includes(letra);
        botao.onclick = () => verificarLetra(letra);
        teclado.appendChild(botao);
    });
}

function verificarLetra(letra) {
    if (letrasCorretas.includes(letra) || letrasErradas.includes(letra)) return;
    if (palavraSelecionada.includes(letra)) {
        letrasCorretas.push(letra);
        pontuacao += 10;
    } else {
        letrasErradas.push(letra);
        pontuacao -= 5;
    }
    document.getElementById("pontuacao").textContent = `🏆 Pontuação: ${pontuacao}`;
    atualizarPalavra();
    atualizarLetrasErradas();
    criarTeclado();
}

function fimDeJogo() {
    document.querySelectorAll("#teclado button").forEach(btn => btn.disabled = true);
    document.getElementById("reiniciar").style.display = "inline-block";
}

function avancarNivel() {
    if (nivelAtual === "facil") {
        nivelAtual = "medio";
        alert("🎯 Você avançou para o nível MÉDIO!");
    } else if (nivelAtual === "medio") {
        nivelAtual = "dificil";
        alert("🔥 Você avançou para o nível DIFÍCIL!");
    }
}

function ativarMultiplayer() {
    document.getElementById("entrada-palavra").style.display = "block";
    document.getElementById("palavraManual").value = "";
}

function desenharEstrutura() {
    ctx.strokeStyle = "#333";
    ctx.lineWidth = 2;
    ctx.beginPath(); ctx.moveTo(10, 240); ctx.lineTo(190, 240); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(50, 240); ctx.lineTo(50, 20); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(50, 20); ctx.lineTo(150, 20); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(150, 20); ctx.lineTo(150, 40); ctx.stroke();
}

// Desenho animado com requestAnimationFrame
function desenharForcaAnimado(etapa) {
    if (etapa > 0 && etapa <= 12) {
        let passo = 0;
        const desenharParte = () => {
            if (passo < etapa) {
                desenharForca(passo + 1);
                passo++;
                requestAnimationFrame(desenharParte);
            }
        };
        desenharParte();
    }
}

function desenharForca(etapa) {
    ctx.strokeStyle = "#000";
    switch (etapa) {
        case 1: ctx.beginPath(); ctx.arc(150, 55, 15, 0, Math.PI * 2); ctx.stroke(); break;
        case 2: ctx.beginPath(); ctx.moveTo(150, 70); ctx.lineTo(150, 120); ctx.stroke(); break;
        case 3: ctx.beginPath(); ctx.moveTo(150, 80); ctx.lineTo(130, 100); ctx.stroke(); break;
        case 4: ctx.beginPath(); ctx.moveTo(150, 80); ctx.lineTo(170, 100); ctx.stroke(); break;
        case 5: ctx.beginPath(); ctx.moveTo(150, 120); ctx.lineTo(130, 150); ctx.stroke(); break;
        case 6: ctx.beginPath(); ctx.moveTo(150, 120); ctx.lineTo(170, 150); ctx.stroke(); break;
        case 7: ctx.beginPath(); ctx.arc(130, 100, 3, 0, Math.PI * 2); ctx.stroke(); break;
        case 8: ctx.beginPath(); ctx.arc(170, 100, 3, 0, Math.PI * 2); ctx.stroke(); break;
        case 9: ctx.beginPath(); ctx.arc(130, 150, 3, 0, Math.PI * 2); ctx.stroke(); break;
        case 10: ctx.beginPath(); ctx.arc(170, 150, 3, 0, Math.PI * 2); ctx.stroke(); break;
        case 11:
            ctx.beginPath(); ctx.arc(144, 52, 1.5, 0, Math.PI * 2); ctx.stroke();
            ctx.beginPath(); ctx.arc(156, 52, 1.5, 0, Math.PI * 2); ctx.stroke();
            break;
        case 12:
            ctx.beginPath(); ctx.arc(150, 60, 5, 0, Math.PI, true); ctx.stroke();
            break;
    }
}

window.addEventListener("keydown", (e) => {
    const letra = e.key.toLowerCase();
    // Verifica se é letra a-z
    if (/^[a-z]$/.test(letra)) {
        // Verifica se o botão correspondente está habilitado para evitar repetição
        const botao = Array.from(document.querySelectorAll("#teclado button"))
            .find(btn => btn.textContent === letra);
        if (botao && !botao.disabled) {
            verificarLetra(letra);
        }
    }
});

iniciarJogo();