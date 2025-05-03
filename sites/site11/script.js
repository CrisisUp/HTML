let carrinho = JSON.parse(localStorage.getItem('carrinho')) || [];

const produtos = [
  {
    nome: 'Telefone infantil',
    preco: 100.00,
    categoria: 'Brinquedos Educativos',
    imagem: 'img/img1.webp',
    descricao: 'Brinquedo educativo com luzes e sons.',
  },
  {
    nome: 'Caminhão infantil',
    preco: 150.00,
    categoria: 'Brinquedos Educativos',
    imagem: 'img/img2.webp',
    descricao: 'Caminhão colorido que estimula a imaginação.',
  },
  {
    nome: 'Stitch Baby',
    preco: 200.00,
    categoria: 'Pelúcias',
    imagem: 'img/img3.webp',
    descricao: 'Pelúcia colecionável do personagem Stitch.',
  },
  {
    nome: 'Casinha infantil',
    preco: 250.00,
    categoria: 'Brinquedos Educativos',
    imagem: 'img/img4.webp',
    descricao: 'Casinha para brincadeiras criativas.',
  },
  {
    nome: 'Organizador de brinquedos',
    preco: 300.00,
    categoria: 'Organização Infantil',
    imagem: 'img/img5.webp',
    descricao: 'Colorido e prático para guardar brinquedos.',
  },
  {
    nome: 'Ursinho dorminhoco',
    preco: 180.00,
    categoria: 'Pelúcias',
    imagem: 'img/img6.webp',
    descricao: 'Ursinho de pelúcia macio e acolhedor.',
  }
];

const lista = document.getElementById('lista-carrinho');
const total = document.getElementById('total-carrinho');
const aside = document.getElementById('carrinho');
const contador = document.getElementById('contador-carrinho');
const audio = document.getElementById('audio-adicao');
const audioRemocao = document.getElementById('audio-remocao');

function falar(texto) {
  const utterance = new SpeechSynthesisUtterance(texto);
  utterance.lang = 'pt-BR';
  speechSynthesis.speak(utterance);
}

function somCliqueSimples() {
  const ctx = new (window.AudioContext || window.webkitAudioContext)();
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  osc.type = 'square';
  osc.frequency.setValueAtTime(500, ctx.currentTime);
  gain.gain.setValueAtTime(0.1, ctx.currentTime);
  osc.connect(gain);
  gain.connect(ctx.destination);
  osc.start();
  osc.stop(ctx.currentTime + 0.1);
}

function atualizarCarrinho() {
  lista.innerHTML = '';
  let soma = 0;

  carrinho.forEach((item, index) => {
    const li = document.createElement('li');
    li.classList.add('item-carrinho');

    const totalItem = item.preco * item.qtd;
    soma += totalItem;

    li.innerHTML = `
      <span><strong>${item.nome}</strong></span>
      <span>R$ ${item.preco.toFixed(2)} x ${item.qtd} = <strong>R$ ${totalItem.toFixed(2)}</strong></span>
      <div class="controles-qtd">
        <button aria-label="Diminuir" onclick="alterarQtd(${index}, -1)">−</button>
        <button aria-label="Aumentar" onclick="alterarQtd(${index}, 1)">+</button>
        <button aria-label="Remover" onclick="removerItem(${index})">🗑️</button>
      </div>
    `;
    lista.appendChild(li);
  });

  total.textContent = `Total: R$ ${soma.toFixed(2)}`;
  contador.textContent = carrinho.reduce((acc, item) => acc + item.qtd, 0);
  localStorage.setItem('carrinho', JSON.stringify(carrinho));
}

function alterarQtd(index, delta) {
  const item = carrinho[index];
  item.qtd += delta;

  if (item.qtd <= 0) {
    carrinho.splice(index, 1);
    audioRemocao.play();
    falar(`Você removeu ${item.nome} do carrinho.`);
  } else {
    const acao = delta > 0 ? 'aumentou' : 'diminuiu';
    falar(`Você ${acao} a quantidade de ${item.nome} para ${item.qtd}.`);
  }

  somCliqueSimples();
  atualizarCarrinho();
}

function removerItem(index) {
  const item = carrinho[index];
  carrinho.splice(index, 1);
  audioRemocao.play();
  falar(`Você removeu ${item.nome} do carrinho.`);
  atualizarCarrinho();
}

function criarProduto(produto) {
  const article = document.createElement('article');
  article.classList.add('produto');
  article.dataset.categoria = produto.categoria;
  article.tabIndex = 0;
  article.innerHTML = `
    <figure>
      <img src="${produto.imagem}" alt="${produto.nome}" />
    </figure>
    <div class="detalhes-produto">
      <h3 class="nome-produto">${produto.nome}</h3>
      <p class="descricao-produto">${produto.descricao}</p>
      <div class="rodape-produto">
        <span class="preco">R$ ${produto.preco.toFixed(2)}</span>
        <button class="btn-comprar" aria-label="Adicionar ${produto.nome} ao carrinho">Comprar</button>
      </div>
    </div>
  `;
  article.querySelector('.btn-comprar').onclick = () => {
    const existente = carrinho.find(item => item.nome === produto.nome);
    if (existente) {
      existente.qtd++;
    } else {
      carrinho.push({ nome: produto.nome, preco: produto.preco, qtd: 1 });
    }
    audio.play();
    falar(`Você adicionou ${produto.nome} ao carrinho.`);
    article.classList.add('animado');
    setTimeout(() => article.classList.remove('animado'), 300);
    atualizarCarrinho();
  };
  return article;
}

function carregarProdutos(categoria = 'todos') {
  const container = document.getElementById('lista-produtos');
  container.innerHTML = '';
  produtos
    .filter(p => categoria === 'todos' || p.categoria === categoria)
    .forEach(p => container.appendChild(criarProduto(p)));
}

document.getElementById('abrir-carrinho').onclick = () => {
  aside.hidden = false;
  aside.setAttribute('aria-hidden', 'false');
};

document.getElementById('fechar-carrinho').onclick = () => {
  aside.setAttribute('aria-hidden', 'true');
  setTimeout(() => aside.hidden = true, 300);
};

document.getElementById('limpar-carrinho').onclick = () => {
  carrinho.length = 0;
  atualizarCarrinho();
  falar('Você esvaziou o carrinho.');
};

document.querySelectorAll('.btn-filtro').forEach(btn => {
  btn.onclick = () => {
    document.querySelectorAll('.btn-filtro').forEach(b => b.classList.remove('ativo'));
    btn.classList.add('ativo');
    carregarProdutos(btn.dataset.categoria);
  };
});

carregarProdutos();
atualizarCarrinho();
