// js/events.js
export function setupEventListeners(addTask, clearStorage, toggleComplete, openEditModal, saveEdit, closeModal, toggleDarkMode, deleteTask, updateList, getMaterialIcon) {
    document.getElementById('taskForm').addEventListener('submit', (event) => {
        event.preventDefault();
        const input = document.getElementById('taskInput');
        const taskText = input.value.trim();
        if (addTask(taskText)) {
            updateList();
            input.value = '';
        }
    });

    document.getElementById('clear').addEventListener('click', () => {
        if (!confirm('Tem certeza que deseja limpar todas as dicas e pontos?')) return;
        window.ui.showLoading();
        setTimeout(() => {
            clearStorage();
            updateList();
            window.ui.showMessage('Dados limpos! Iniciando novamente. 🗑️', 'success');
            window.ui.hideLoading();
        }, 1000);
    });

    document.getElementById('themeBtn').addEventListener('click', toggleDarkMode);

    document.getElementById('saveEditBtn').addEventListener('click', () => {
        const newText = document.getElementById('editInput').value.trim();
        if (saveEdit(newText)) {
            updateList();
            closeModal();
            window.ui.showMessage('Dica editada! +5 pontos ✏️', 'success');
        }
    });

    document.getElementById('cancelEditBtn').addEventListener('click', closeModal);

    document.getElementById('editModal').addEventListener('click', (e) => {
        if (e.target === document.getElementById('editModal')) {
            closeModal();
        }
    });

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && document.getElementById('editModal').style.display === 'flex') {
            closeModal();
        }
    });

    // Inicializar lista
    updateList();
}