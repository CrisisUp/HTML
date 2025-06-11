// js/data.js
export const defaultTasks = [
    { text: "Separar garrafas de vidro", completed: false },
    { text: "Reutilizar potes plásticos", completed: false },
    { text: "Compostar restos de comida", completed: false },
    { text: "Reciclar latas de alumínio", completed: false },
    { text: "Doar roupas usadas", completed: false },
    { text: "Separar papelão limpo", completed: false },
    { text: "Reutilizar sacolas de pano", completed: false },
    { text: "Reciclar baterias usadas", completed: false },
    { text: "Separar embalagens metálicas", completed: false },
    { text: "Reutilizar frascos de vidro", completed: false },
    { text: "Reciclar eletrônicos quebrados", completed: false },
    { text: "Separar resíduos orgânicos", completed: false },
    { text: "Reutilizar caixas de papelão", completed: false },
    { text: "Reciclar revistas antigas", completed: false },
    { text: "Separar tampinhas plásticas", completed: false },
    { text: "Doar móveis em bom estado", completed: false },
    { text: "Reciclar cartuchos de tinta", completed: false },
    { text: "Separar plásticos recicláveis", completed: false },
    { text: "Reutilizar garrafas PET", completed: false },
    { text: "Reciclar embalagens tetra pak", completed: false }
];

export let tasks = JSON.parse(localStorage.getItem('tasks')) || [...defaultTasks];
export let points = JSON.parse(localStorage.getItem('points')) || 0;
export let level = Math.floor(points / 50) + 1;
export let editIndex = null;

export function setEditIndex(index) {
    editIndex = index;
}

export function addTask(taskText, updateLevel, showMessage) {
    if (tasks.length >= 50) {
        showMessage('Limite de 50 dicas atingido!', 'error');
        return false;
    }
    tasks.push({ text: taskText, completed: false });
    points += 10;
    updateLevel();
    saveToStorage();
    return true;
}

export function clearStorage(updateLevel) {
    tasks = [...defaultTasks];
    points = 0;
    level = 1;
    updateLevel();
    saveToStorage();
}

export function toggleComplete(index, updateLevel, showMessage) {
    tasks[index].completed = !tasks[index].completed;
    points += tasks[index].completed ? 20 : -20;
    points = Math.max(0, points);
    updateLevel();
    saveToStorage();
    showMessage(tasks[index].completed ? 'Dica concluída! +20 pontos ✅' : 'Dica desmarcada! -20 pontos 🔄', 'success');
}

export function saveEdit(newText, updateLevel, showMessage) {
    if (newText === '') {
        showMessage('Por favor, digite uma dica válida!', 'error');
        return false;
    }
    tasks[editIndex].text = newText;
    points += 5;
    updateLevel();
    saveToStorage();
    editIndex = null;
    return true;
}

export function deleteTask(index, updateLevel, showMessage) {
    tasks.splice(index, 1);
    points = Math.max(0, points - 5);
    updateLevel();
    saveToStorage();
    showMessage('Dica removida! -5 pontos 🗑️', 'success');
}

export function updateLevel(showBadge) {
    const newLevel = Math.floor(points / 50) + 1;
    if (newLevel > level) {
        level = newLevel;
        showBadge(`Parabéns! Você alcançou o Nível ${level}! 🏆`);
    }
}

function saveToStorage() {
    localStorage.setItem('tasks', JSON.stringify(tasks));
    localStorage.setItem('points', JSON.stringify(points));
}