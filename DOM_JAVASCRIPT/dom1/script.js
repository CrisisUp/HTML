// 1. Selecionar os elementos
const botao = document.getElementById('meuBotao');
const mensagem = document.getElementById('mensagem');

// 2. Adicionar evento de clique no botão
botao.addEventListener('click', function() {
  // 3. Alterar o texto do parágrafo
  mensagem.textContent = 'Você clicou no botão!';

  // 4. Alterar o estilo (cor)
  mensagem.style.color = 'blue';

  // 5. Alterar o texto do botão
  botao.textContent = 'Clique de novo';
});
