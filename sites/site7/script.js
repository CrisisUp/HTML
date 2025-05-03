const carrinho = [];
const audioAdicao = document.getElementById('audio-adicao');
const audioRemocao = document.getElementById('audio-remocao');

document.addEventListener('DOMContentLoaded', function() {
  const produtos = document.querySelectorAll('.produto');
  
  produtos.forEach((produto, index) => {
    produto.querySelector('.btn-comprar').addEventListener('click', function() {
      adicionarAoCarrinho(produto);
    });
  });
  
  function adicionarAoCarrinho(produto) {
    const nomeProduto = produto.querySelector('h3').textContent;
    const precoProduto = parseFloat(produto.dataset.preco);
    
    carrinho.push({ nome: nomeProduto, preco: precoProduto });
    
    // Reproduzir som de adição
    audioAdicao.currentTime = 0;
    audioAdicao.play();
    
    atualizarCarrinho();
  }

  function atualizarCarrinho() {
    const itensCarrinho = document.getElementById('itens-carrinho');
    itensCarrinho.innerHTML = '';
    
    carrinho.forEach((item, index) => {
      const divItem = document.createElement('div');
      divItem.innerHTML = `
        <p>${item.nome} - R$${item.preco.toFixed(2)}</p>
        <button onclick="removerItem(${index})">Remover</button>
      `;
      itensCarrinho.appendChild(divItem);
    });
  }

  window.removerItem = function(index) {
    carrinho.splice(index, 1);
    
    // Som de remoção
    audioRemocao.currentTime = 0;
    audioRemocao.play();
    
    atualizarCarrinho();
  }
});

  