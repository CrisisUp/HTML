import { getAppState } from './main.js';
import { showMessage } from './utils.js';

// Renderiza a interface principal
export function renderUI() {
    renderTaskForm();
    renderTaskLists();
}

// Atualiza a interface
export function updateUI() {
    renderTaskLists();
    updateCounter();
}

// Renderiza o formulário de tarefas
function renderTaskForm() {
    const formContainer = document.querySelector('main');
    formContainer.insertAdjacentHTML('afterbegin', `
        <form id="taskForm" role="form" aria-labelledby="formTitle">
            <h2 id="formTitle" class="sr-only">Adicionar nova dica</h2>
            <label for="taskInput" class="sr-only">Digite uma dica de reciclagem</label>
            <input type="text" id="taskInput" placeholder="Ex.: Separar plásticos para reciclagem" required
                aria-required="true" aria-describedby="inputHelp">
            <span id="inputHelp" class="sr-only">Pressione Enter para adicionar a dica</span>
            <button id="add" type="submit" aria-label="Adicionar nova dica"><i class="fas fa-plus" aria-hidden="true"></i></button>
        </form>
    `);
}

// Renderiza as listas de tarefas
function renderTaskLists() {
    const { tasks } = getAppState();
    const pendingList = document.getElementById('taskList');
    const completedList = document.getElementById('completedList');
    
    pendingList.innerHTML = '';
    completedList.innerHTML = '';
    
    tasks.forEach((task, index) => {
        const li = createTaskElement(task, index);
        if (task.completed) {
            completedList.appendChild(li);
        } else {
            pendingList.appendChild(li);
        }
    });
}

// Cria um elemento de tarefa
function createTaskElement(task, index) {
    const li = document.createElement('li');
    li.setAttribute('role', 'listitem');
    li.setAttribute('aria-label', `Dica: ${task.text}, ${task.completed ? 'concluída' : 'pendente'}`);
    
    const iconClass = task.completed ? 'fa-check' : getMaterialIcon(task.text);
    li.innerHTML = `
        <span>
            <i class="fas ${iconClass}" aria-hidden="true"></i>
            ${task.text}
        </span>
        <div class="actions">
            <button class="complete" aria-label="${task.completed ? 'Desmarcar tarefa' : 'Concluir tarefa'}">
                <i class="fas ${task.completed ? 'fa-undo' : 'fa-check'}" aria-hidden="true"></i>
            </button>
            <button class="edit" aria-label="Editar tarefa">
                <i class="fas fa-edit" aria-hidden="true"></i>
            </button>
            <button class="delete" aria-label="Excluir tarefa">
                <i class="fas fa-trash" aria-hidden="true"></i>
            </button>
        </div>
    `;
    
    return li;
}

// Determina o ícone com base no material
function getMaterialIcon(text) {
    const lowerText = text.toLowerCase();
    if (lowerText.includes('plástico') || lowerText.includes('plastico')) {
        return 'fa-bottle-water';
    } else if (lowerText.includes('papel') || lowerText.includes('jornal') || lowerText.includes('papelão')) {
        return 'fa-newspaper';
    } else if (lowerText.includes('vidro')) {
        return 'fa-wine-bottle';
    }
    return 'fa-recycle';
}