const produtos = [
  { nome: 'Quebra-cabeça educativo', preco: 29.9, categoria: 'educativo' },
  { nome: 'Urso de pelúcia grande', preco: 49.9, categoria: 'pelucia' },
  { nome: 'Cubo mágico', preco: 19.9, categoria: 'educativo' },
  { nome: 'Caixa organizadora com alça', preco: 39.9, categoria: 'organizacao' }
];

const carrinho = [];

const gridProdutos = document.querySelector('.grid-produtos');
const listaCarrinho = document.getElementById('lista-carrinho');
const totalCarrinho = document.getElementById('total-carrinho');
const contadorCarrinho = document.getElementById('contador-carrinho');
const audioAdicao = document.getElementById('audio-adicao');
const audioRemocao = document.getElementById('audio-remocao');
const audioFiltro = document.getElementById('audio-filtro');

function atualizarCarrinho() {
  listaCarrinho.innerHTML = '';
  let total = 0;
  carrinho.forEach((item, index) => {
    total += item.preco;
    const li = document.createElement('li');
    li.textContent = `${item.nome} - R$ ${item.preco.toFixed(2)}`;
    li.addEventListener('click', () => {
      carrinho.splice(index, 1);
      atualizarCarrinho();
      audioRemocao.play();
    });
    listaCarrinho.appendChild(li);
  });
  totalCarrinho.textContent = `Total: R$ ${total.toFixed(2)}`;
  contadorCarrinho.textContent = carrinho.length;
}

function adicionarProduto(produto) {
  carrinho.push(produto);
  atualizarCarrinho();
  audioAdicao.play();
}

function mostrarProdutos(filtro = 'todos') {
  gridProdutos.innerHTML = '';
  const filtrados = filtro === 'todos' ? produtos : produtos.filter(p => p.categoria === filtro);
  filtrados.forEach(prod => {
    const div = document.createElement('div');
    div.className = 'produto';
    div.innerHTML = `<h3>${prod.nome}</h3><p>R$ ${prod.preco.toFixed(2)}</p><button>Adicionar</button>`;
    div.querySelector('button').addEventListener('click', () => adicionarProduto(prod));
    gridProdutos.appendChild(div);
  });
}

mostrarProdutos();

document.getElementById('filtro-categoria').addEventListener('change', (e) => {
  mostrarProdutos(e.target.value);
  audioFiltro.play();
});

document.getElementById('abrir-carrinho').addEventListener('click', () => {
  document.getElementById('carrinho').hidden = false;
});

document.getElementById('fechar-carrinho').addEventListener('click', () => {
  document.getElementById('carrinho').hidden = true;
});

document.getElementById('limpar-carrinho').addEventListener('click', () => {
  carrinho.length = 0;
  atualizarCarrinho();
  audioRemocao.play();
});

document.getElementById('alternar-tema').addEventListener('click', () => {
  document.body.classList.toggle('escuro');
});

// Filtro por voz com reconhecimento de fala
const botaoVoz = document.getElementById('ativar-filtro-voz');
if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  const recognizer = new SpeechRecognition();
  recognizer.lang = 'pt-BR';
  recognizer.onresult = function (event) {
    const resultado = event.results[0][0].transcript.toLowerCase();
    if (resultado.includes('educativo')) mostrarProdutos('educativo');
    else if (resultado.includes('pelúcia')) mostrarProdutos('pelucia');
    else if (resultado.includes('organização')) mostrarProdutos('organizacao');
    else mostrarProdutos();
    audioFiltro.play();
  };
  botaoVoz.addEventListener('click', () => {
    recognizer.start();
  });
} else {
  botaoVoz.disabled = true;
  botaoVoz.title = 'Reconhecimento de voz não suportado neste navegador';
}


  