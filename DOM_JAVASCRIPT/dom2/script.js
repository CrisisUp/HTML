const addBtn = document.getElementById('addBtn');
const lista = document.getElementById('lista');
let contador = 1;

addBtn.addEventListener('click', function () {
  const item = document.createElement('div'); // Criar um novo elemento de item
  item.textContent = `Item ${contador}`;
  item.style.margin = '8px 0';

  const btnRemover = document.createElement('button'); // Criar botão de remoção
  btnRemover.textContent = 'Remover';
  btnRemover.style.marginLeft = '10px';

  // Evento para remover o item pai
  btnRemover.addEventListener('click', function () {lista.removeChild(item);});

  item.appendChild(btnRemover); // Adicionar botão ao item
  lista.appendChild(item); // Adicionar item à lista
  contador++;
});
