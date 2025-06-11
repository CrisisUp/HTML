// events.js
import { getAppState, setAppState } from './main.js';
import { showMessage } from './utils.js';
import { updatePoints } from './data.js';
import { updateUI } from './utils.js';

let editIndex = null;

export function setupFormSubmit() {
  const form = document.getElementById('taskForm');
  if (form) {
    form.addEventListener('submit', function(e) {
      e.preventDefault();
      const input = document.getElementById('taskInput');
      const text = input.value.trim();

      if (!text) {
        showMessage('Por favor, digite uma dica válida!', 'error');
        return;
      }

      const { tasks } = getAppState();
      if (tasks.length >= 50) {
        showMessage('Limite de 50 dicas atingido!', 'error');
        return;
      }

      const newTasks = [...tasks, { text, completed: false }];
      setAppState({ ...getAppState(), tasks: newTasks });
      updatePoints(10);
      showMessage('Dica adicionada! +10 pontos', 'success');
      
      input.value = '';
      input.focus();
    });
  }
}

// Configura todos os event handlers
export function setupEventHandlers() {
    // Formulário de adição
    document.getElementById('taskForm')?.addEventListener('submit', handleAddTask);
    
    // Botão limpar
    document.getElementById('clear')?.addEventListener('click', handleClearAll);
    
    // Eventos de teclado globais
    document.addEventListener('keydown', handleGlobalKeys);
    
    // Modal de edição
    document.getElementById('saveEdit')?.addEventListener('click', handleSaveEdit);
    document.getElementById('cancelEdit')?.addEventListener('click', closeModal);
    
    // Delegation para eventos dinâmicos
    document.addEventListener('click', handleDynamicEvents);
}

// Manipulador para eventos dinâmicos
function handleDynamicEvents(e) {
    const { tasks } = getAppState();
    
    // Completar tarefa
    if (e.target.closest('.complete')) {
        const li = e.target.closest('li');
        const index = Array.from(li.parentNode.children).indexOf(li);
        const adjustedIndex = li.parentNode.id === 'completedList' 
            ? tasks.findIndex(t => t.completed) + index
            : index;
        
        toggleTaskComplete(adjustedIndex);
    }
    
    // Editar tarefa
    else if (e.target.closest('.edit')) {
        const li = e.target.closest('li');
        const index = Array.from(li.parentNode.children).indexOf(li);
        const adjustedIndex = li.parentNode.id === 'completedList' 
            ? tasks.findIndex(t => t.completed) + index
            : index;
        
        openEditModal(adjustedIndex);
    }
    
    // Excluir tarefa
    else if (e.target.closest('.delete')) {
        const li = e.target.closest('li');
        const index = Array.from(li.parentNode.children).indexOf(li);
        const adjustedIndex = li.parentNode.id === 'completedList' 
            ? tasks.findIndex(t => t.completed) + index
            : index;
        
        if (confirm('Tem certeza que deseja excluir esta dica?')) {
            deleteTask(adjustedIndex);
        }
    }
}

// Adiciona nova tarefa
function handleAddTask(e) {
    e.preventDefault();
    const input = document.getElementById('taskInput');
    const text = input.value.trim();
    
    if (!text) {
        showMessage('Por favor, digite uma dica válida!', 'error');
        return;
    }
    
    const { tasks } = getAppState();
    if (tasks.length >= 50) {
        showMessage('Limite de 50 dicas atingido!', 'error');
        return;
    }
    
    const newTasks = [...tasks, { text, completed: false }];
    setAppState({ ...getAppState(), tasks: newTasks });
    updatePoints(10);
    showMessage('Dica de reciclagem adicionada! +10 pontos ♻️', 'success');
    
    input.value = '';
    input.focus();
}

// Alterna estado de conclusão
function toggleTaskComplete(index) {
    const { tasks } = getAppState();
    const newTasks = [...tasks];
    newTasks[index].completed = !newTasks[index].completed;
    
    setAppState({ ...getAppState(), tasks: newTasks });
    updatePoints(newTasks[index].completed ? 20 : -20);
    showMessage(newTasks[index].completed 
        ? 'Dica concluída! +20 pontos ✅' 
        : 'Dica desmarcada! -20 pontos 🔄', 'success');
}

// Abre modal de edição
function openEditModal(index) {
    editIndex = index;
    const modal = document.getElementById('editModal');
    const input = document.getElementById('editInput');
    const { tasks } = getAppState();
    
    input.value = tasks[index].text;
    modal.style.display = 'flex';
    modal.setAttribute('aria-modal', 'true');
    
    setTimeout(() => {
        input.focus();
    }, 100);
}

// Salva edição
function handleSaveEdit() {
    const input = document.getElementById('editInput');
    const text = input.value.trim();
    
    if (!text) {
        showMessage('Por favor, digite uma dica válida!', 'error');
        return;
    }
    
    const { tasks } = getAppState();
    const newTasks = [...tasks];
    newTasks[editIndex].text = text;
    
    setAppState({ ...getAppState(), tasks: newTasks });
    updatePoints(5);
    showMessage('Dica editada! +5 pontos ✏️', 'success');
    closeModal();
}

// Fecha modal
function closeModal() {
    document.getElementById('editModal').style.display = 'none';
    editIndex = null;
}

// Exclui tarefa
function deleteTask(index) {
    const { tasks } = getAppState();
    const newTasks = [...tasks];
    newTasks.splice(index, 1);
    
    setAppState({ ...getAppState(), tasks: newTasks });
    updatePoints(-5);
    showMessage('Dica removida! -5 pontos 🗑️', 'success');
}

// Limpa todas as tarefas
function handleClearAll() {
    if (!confirm('Tem certeza que deseja limpar todas as dicas e pontos?')) return;
    
    setAppState({
        tasks: getDefaultTasks(),
        points: 0,
        level: 1
    });
    
    showMessage('Dados limpos! Iniciando novamente. 🗑️', 'success');
}

// Manipula teclas globais
function handleGlobalKeys(e) {
    // ESC fecha modal
    if (e.key === 'Escape' && document.getElementById('editModal').style.display === 'flex') {
        closeModal();
    }
    
    // Ctrl+Enter no input adiciona tarefa
    if (e.key === 'Enter' && e.ctrlKey && document.activeElement.id === 'taskInput') {
        document.getElementById('taskForm').dispatchEvent(new Event('submit'));
    }
}