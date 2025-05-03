// Carrinho localStorage
const carrinho = JSON.parse(localStorage.getItem('carrinho')) || [];

const contador = document.getElementById('contador-carrinho');
const lista = document.getElementById('lista-carrinho');
const total = document.getElementById('total-carrinho');
const aside = document.getElementById('carrinho');

function atualizarCarrinho() {
  lista.innerHTML = '';
  let soma = 0;

  carrinho.forEach(item => {
    const li = document.createElement('li');
    li.textContent = `${item.nome} - R$ ${item.preco.toFixed(2)}`;
    lista.appendChild(li);
    soma += item.preco;
  });

  total.textContent = `Total: R$ ${soma.toFixed(2)}`;
  contador.textContent = carrinho.length;
  localStorage.setItem('carrinho', JSON.stringify(carrinho));
}

document.querySelectorAll('.btn-comprar').forEach(botao => {
  botao.addEventListener('click', e => {
    const produto = e.target.closest('.produto');
    const nome = produto.dataset.nome;
    const preco = parseFloat(produto.dataset.preco);

    carrinho.push({ nome, preco });
    atualizarCarrinho();
  });
});

document.getElementById('abrir-carrinho').onclick = () => {
  aside.hidden = false;
};

document.getElementById('fechar-carrinho').onclick = () => {
  aside.hidden = true;
};

document.getElementById('limpar-carrinho').onclick = () => {
  carrinho.length = 0;
  atualizarCarrinho();
};

// Inicializar ao carregar
atualizarCarrinho();

  