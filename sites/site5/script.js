let carrinho = JSON.parse(localStorage.getItem('carrinho')) || [];

const contador = document.getElementById('contador-carrinho');
const lista = document.getElementById('lista-carrinho');
const total = document.getElementById('total-carrinho');
const aside = document.getElementById('carrinho');

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
  carrinho[index].qtd += delta;
  if (carrinho[index].qtd <= 0) carrinho.splice(index, 1);
  atualizarCarrinho();
}

function removerItem(index) {
  carrinho.splice(index, 1);
  atualizarCarrinho();
}

document.querySelectorAll('.btn-comprar').forEach(botao => {
  botao.addEventListener('click', e => {
    const produto = e.target.closest('.produto');
    const nome = produto.dataset.nome;
    const preco = parseFloat(produto.dataset.preco);
    const existente = carrinho.find(item => item.nome === nome);

    if (existente) {
      existente.qtd += 1;
    } else {
      carrinho.push({ nome, preco, qtd: 1 });
    }

    produto.classList.add('animado');
    setTimeout(() => produto.classList.remove('animado'), 300);

    atualizarCarrinho();
  });
});

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
};

atualizarCarrinho();
