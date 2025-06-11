// utils.js
import { getAppState, setAppState } from './main.js';

// Mostra mensagem na interface
export function showMessage(text, type = 'success') {
    const message = document.getElementById('message');
    message.textContent = text;
    message.className = `message ${type}`;
    message.style.display = 'block';
    message.setAttribute('role', 'alert');
    message.setAttribute('aria-live', 'assertive');
    
    setTimeout(() => {
        message.style.display = 'none';
    }, 2000);
}

// Atualiza o contador
export function updateCounter() {
    const { tasks, points, level } = getAppState();
    const completedCount = tasks.filter(t => t.completed).length;
    const counter = document.getElementById('counter');
    
    counter.textContent = `Nível ${level} | ${points} pontos | ${completedCount}/${tasks.length} dicas concluídas`;
    counter.setAttribute('aria-live', 'polite');
}

// Atualiza a interface (mover do data.js para cá)
export function updateUI() {
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
    updateCounter();
}

// Função auxiliar para criar elementos (usada pelo updateUI)
function createTaskElement(task, index) {
    const li = document.createElement('li');
    li.setAttribute('role', 'listitem');
    
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