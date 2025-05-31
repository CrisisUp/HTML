const body = document.body;
const paragrafo = document.getElementById('paragrafo');
let estiloAtual = null; // Aqui armazenamos o estilo definitivo

const estilos = {
  btn1: { background: 'white', color: 'black', fontFamily: 'Arial, sans-serif' },
  btn2: { background: 'linear-gradient(to right, #f6d365, #fda085)', color: '#333', fontFamily: 'Verdana' },
  btn3: { background: '#121212', color: '#e0e0e0', fontFamily: 'Courier New, monospace' },
  btn4: { background: '#0f0f0f', color: '#39ff14', fontFamily: 'Lucida Console, monospace', textShadow: '0 0 5px #39ff14' },
  btn5: { background: '#fffbe6', color: '#2c2c2c', fontFamily: "'Press Start 2P', cursive", fonteURL: 'https://fonts.googleapis.com/css2?family=Press+Start+2P&display=swap' },
  btn6: { background: '#fce4ec', color: '#6a1b9a', fontFamily: 'Comic Sans MS' },
  btn7: { background: '#0a0f1c', color: '#00f0ff', fontFamily: 'Orbitron, sans-serif', fonteURL: 'https://fonts.googleapis.com/css2?family=Orbitron&display=swap' },
  btn8: { background: '#ffe6e6', color: '#b30059', fontFamily: 'Georgia, serif' },
  btn9: { background: '#f9f9f9', color: '#000', fontFamily: 'Times New Roman, serif' },
  btn10: { background: '#000', color: '#0f0', fontFamily: 'monospace', textShadow: '0 0 10px #0f0' }
};

// Aplica estilo permanente e salva como atual
function aplicarEstilo(estilo) {
  estiloAtual = estilo;
  aplicarVisual(estilo);
}

// Aplica estilo visual (pode ser temporário)
function aplicarVisual(estilo) {
  body.style.background = estilo.background;
  body.style.color = estilo.color;
  body.style.fontFamily = estilo.fontFamily || '';
  body.style.textShadow = estilo.textShadow || '';

  paragrafo.style.fontFamily = estilo.fontFamily || '';
  paragrafo.style.color = estilo.color;

  // Carrega fonte se necessário
  if (estilo.fonteURL) {
    const link = document.createElement('link');
    link.href = estilo.fonteURL;
    link.rel = 'stylesheet';
    document.head.appendChild(link);
  }
}

// Aplica os eventos de cada botão
Object.keys(estilos).forEach(id => {
  const botao = document.getElementById(id);
  const estilo = estilos[id];

  botao.addEventListener('click', () => aplicarEstilo(estilo));

  botao.addEventListener('mouseenter', () => {
    body.style.opacity = '0.7';
    aplicarVisual(estilo);
  });

  botao.addEventListener('mouseleave', () => {
    body.style.opacity = '1';
    if (estiloAtual) aplicarVisual(estiloAtual);
    else {
      body.removeAttribute('style');
      paragrafo.removeAttribute('style');
    }
  });
});

// Botão de reset
document.getElementById('reset').addEventListener('click', () => {
  estiloAtual = null;
  body.removeAttribute('style');
  paragrafo.removeAttribute('style');
});
