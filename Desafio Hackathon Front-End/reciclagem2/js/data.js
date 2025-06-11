// data.js
import { getAppState, setAppState } from './main.js';
import { showMessage, updateCounter } from './utils.js';

// Carrega dados do localStorage
export function loadData() {
    try {
        const savedTasks = JSON.parse(localStorage.getItem('tasks')) || [];
        const savedPoints = parseInt(localStorage.getItem('points')) || 0;
        
        setAppState({
            tasks: savedTasks.length > 0 ? savedTasks : getDefaultTasks(),
            points: savedPoints,
            level: Math.floor(savedPoints / 50) + 1
        });
        
        updateCounter();
    } catch (error) {
        showMessage('Erro ao carregar dados. Reiniciando...', 'error');
        setAppState({
            tasks: getDefaultTasks(),
            points: 0,
            level: 1
        });
    }
}

// Salva dados no localStorage
export function saveData() {
    const { tasks, points } = getAppState();
    localStorage.setItem('tasks', JSON.stringify(tasks));
    localStorage.setItem('points', points.toString());
}

// Retorna as tarefas padrão
function getDefaultTasks() {
    return [
        { text: "Separar garrafas de vidro", completed: false },
        { text: "Reutilizar potes plásticos", completed: false },
        // ... outras tarefas padrão
    ];
}

// Atualiza os pontos (mover do utils.js para cá)
export function updatePoints(value) {
    const state = getAppState();
    const newPoints = Math.max(0, state.points + value);
    const newLevel = Math.floor(newPoints / 50) + 1;
    
    setAppState({
        ...state,
        points: newPoints,
        level: newLevel
    });
    
    updateCounter();
    
    if (newLevel > state.level) {
        showMessage(`Parabéns! Você alcançou o nível ${newLevel}!`, 'success');
    }
    
    return newPoints;
}