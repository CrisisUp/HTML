const painel = document.getElementById('painel');
const btnLimparTudo = document.getElementById('limparTudo');

// Renderiza tudo do localStorage
function atualizarPainel() {
  painel.innerHTML = '';

  if (localStorage.length === 0) {
    painel.innerHTML = '<p>Nenhum dado encontrado no localStorage.</p>';
    return;
  }

  for (let i = 0; i < localStorage.length; i++) {
    const chave = localStorage.key(i);
    const valor = localStorage.getItem(chave);

    const item = document.createElement('div');
    item.className = 'item';

    item.innerHTML = `
      <span class="chave">${chave}</span>: 
      <span class="valor">${valor}</span>
      <button data-chave="${chave}">Remover</button>
    `;

    // Adiciona evento ao botão de remover
    item.querySelector('button').addEventListener('click', function () {
      const chave = this.getAttribute('data-chave');
      localStorage.removeItem(chave);
      atualizarPainel();
    });

    painel.appendChild(item);
  }
}

// Botão para limpar tudo
btnLimparTudo.addEventListener('click', () => {
  if (confirm('Tem certeza que deseja apagar tudo do localStorage?')) {
    localStorage.clear();
    atualizarPainel();
  }
});

// Atualiza o painel ao carregar a página
atualizarPainel();
