const inputItem = document.getElementById('inputItem');
const btnAdicionar = document.getElementById('btnAdicionar');
const lista = document.getElementById('lista');

// Carregar lista do localStorage
let itens = JSON.parse(localStorage.getItem('itens')) || [];

// Renderizar itens ao carregar
itens.forEach(texto => criarItem(texto));

// Adicionar item ao clicar no botão
btnAdicionar.addEventListener('click', () => {
  const texto = inputItem.value.trim();

  if (texto === '') {
    alert('Digite algo para adicionar!');
    return;
  }

  criarItem(texto);
  itens.push(texto);
  salvarLista();
  inputItem.value = '';
});

// Criar item com botão de remoção
function criarItem(texto) {
  const item = document.createElement('div');
  item.className = 'item';
  item.textContent = texto;

  const btnRemover = document.createElement('button');
  btnRemover.textContent = 'Remover';
  btnRemover.style.marginLeft = '10px';

  btnRemover.addEventListener('click', () => {
    item.classList.add('fade-out');
    setTimeout(() => {
      lista.removeChild(item);
      itens = itens.filter(i => i !== texto);
      salvarLista();
    }, 400);
  });

  item.appendChild(btnRemover);
  lista.appendChild(item);
}

// Salvar no localStorage
function salvarLista() {
  localStorage.setItem('itens', JSON.stringify(itens));
}

