const body = document.body;
const paragrafo = document.getElementById('paragrafo');
const seletor = document.getElementById('seletor');
const estiloBox = document.getElementById('estiloAtual').querySelector('strong');

let estiloAtual = null;

const estilos = {
  Clássico: { background: 'white', color: 'black', fontFamily: 'Arial, sans-serif' },
  Gradiente: { background: 'linear-gradient(to right, #f6d365, #fda085)', color: '#333', fontFamily: 'Verdana' },
  Escuro: { background: '#121212', color: '#e0e0e0', fontFamily: 'Courier New, monospace' },
  Matrix: { background: '#0f0f0f', color: '#39ff14', fontFamily: 'Lucida Console, monospace', textShadow: '0 0 5px #39ff14' },
  Retrô: { background: '#fffbe6', color: '#2c2c2c', fontFamily: "'Press Start 2P', cursive", fonteURL: 'https://fonts.googleapis.com/css2?family=Press+Start+2P&display=swap' }
};

function aplicarVisual(estilo) {
  body.style.background = estilo.background;
  body.style.color = estilo.color;
  body.style.fontFamily = estilo.fontFamily || '';
  body.style.textShadow = estilo.textShadow || '';
  paragrafo.style.fontFamily = estilo.fontFamily || '';
  paragrafo.style.color = estilo.color;

  if (estilo.fonteURL) {
    const link = document.createElement('link');
    link.href = estilo.fonteURL;
    link.rel = 'stylesheet';
    document.head.appendChild(link);
  }
}

function aplicarEstilo(nome, estilo) {
  estiloAtual = { nome, estilo };
  aplicarVisual(estilo);
  estiloBox.textContent = nome;
}

function criarMiniatura(nome, estilo) {
  const div = document.createElement('div');
  div.classList.add('miniatura');

  const textoPreview = document.createElement('div');
  textoPreview.classList.add('preview-texto');
  textoPreview.textContent = 'Aa';

  const legenda = document.createElement('div');
  legenda.textContent = nome;

  div.appendChild(textoPreview);
  div.appendChild(legenda);

  // Miniatura visual
  div.style.background = estilo.background;
  div.style.color = estilo.color;
  div.style.fontFamily = estilo.fontFamily;

  div.addEventListener('click', () => aplicarEstilo(nome, estilo));
  div.addEventListener('mouseenter', () => {
    body.style.opacity = '0.7';
    aplicarVisual(estilo);
  });
  div.addEventListener('mouseleave', () => {
    body.style.opacity = '1';
    if (estiloAtual) aplicarVisual(estiloAtual.estilo);
    else {
      body.removeAttribute('style');
      paragrafo.removeAttribute('style');
    }
  });

  seletor.appendChild(div);
}

// Criar miniaturas
Object.entries(estilos).forEach(([nome, estilo]) => criarMiniatura(nome, estilo));

// Botão reset
const botaoReset = document.createElement('button');
botaoReset.textContent = 'Resetar Estilo';
botaoReset.style.padding = '10px';
botaoReset.style.marginTop = '10px';
botaoReset.style.border = 'none';
botaoReset.style.borderRadius = '6px';
botaoReset.style.background = '#ccc';
botaoReset.style.cursor = 'pointer';
botaoReset.addEventListener('click', () => {
  estiloAtual = null;
  body.removeAttribute('style');
  paragrafo.removeAttribute('style');
  estiloBox.textContent = 'Nenhum';
});
seletor.appendChild(botaoReset);
