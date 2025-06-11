// js/ui.js
export function updateList(tasks, getMaterialIcon, toggleComplete, openEditModal, deleteTask) {
    const list = document.getElementById('taskList');
    const completedList = document.getElementById('completedList');
    const completedTitle = document.getElementById('completedTitle');
    list.innerHTML = '';
    completedList.innerHTML = '';

    const completedCount = tasks.filter(task => task.completed).length;
    const totalCount = tasks.length;
    document.getElementById('counter').textContent =
        `Nível ${window.data.level} | ${window.data.points} pontos | ${completedCount}/${totalCount} dicas concluídas`;
    completedTitle.textContent = `Dicas Concluídas (${completedCount})`;

    tasks.forEach((task, index) => {
        const li = document.createElement('li');
        if (task.completed) {
            li.classList.add('completed', 'animate__animated', 'animate__fadeIn');
        } else {
            li.classList.add('animate__animated', 'animate__fadeIn');
        }

        const textSpan = document.createElement('span');
        const iconClass = task.completed ? 'fa-check' : getMaterialIcon(task.text);
        textSpan.innerHTML = `<i class="fas ${iconClass}"></i> ${task.text}`;

        const actionsDiv = document.createElement('div');
        actionsDiv.className = 'actions';

        const completeBtn = document.createElement('button');
        completeBtn.innerHTML = task.completed ? '<i class="fas fa-undo"></i>' : '<i class="fas fa-check"></i>';
        completeBtn.className = 'complete';
        completeBtn.setAttribute('aria-label', task.completed ? 'Desmarcar tarefa' : 'Concluir tarefa');
        completeBtn.onclick = () => toggleComplete(index);

        const editBtn = document.createElement('button');
        editBtn.innerHTML = '<i class="fas fa-edit"></i>';
        editBtn.className = 'edit';
        editBtn.setAttribute('aria-label', 'Editar tarefa');
        editBtn.onclick = () => openEditModal(index);

        const deleteBtn = document.createElement('button');
        deleteBtn.innerHTML = '<i class="fas fa-trash"></i>';
        deleteBtn.className = 'delete animate__animated';
        deleteBtn.setAttribute('aria-label', 'Excluir tarefa');
        deleteBtn.onclick = () => {
            if (!confirm('Tem certeza que deseja excluir esta dica?')) return;
            deleteTask(index);
        };

        actionsDiv.appendChild(completeBtn);
        actionsDiv.appendChild(editBtn);
        actionsDiv.appendChild(deleteBtn);

        li.appendChild(textSpan);
        li.appendChild(actionsDiv);

        if (task.completed) {
            completedList.appendChild(li);
        } else {
            list.appendChild(li);
        }
    });
}

export function showMessage(text, type = 'success') {
    const message = document.getElementById('message');
    message.innerHTML = text;
    message.className = `message ${type}`;
    message.style.display = 'block';
    setTimeout(() => {
        message.style.display = 'none';
    }, 2000);
}

export function showBadge(text) {
    const badge = document.getElementById('badge');
    badge.textContent = text;
    badge.style.display = 'block';
    setTimeout(() => {
        badge.style.display = 'none';
    }, 3000);
}

export function showLoading() {
    document.getElementById('loading').style.display = 'block';
}

export function hideLoading() {
    document.getElementById('loading').style.display = 'none';
}

export function openEditModal(index, tasks, setEditIndex) {
    setEditIndex(index);
    const input = document.getElementById('editInput');
    input.value = tasks[index].text;
    document.getElementById('editModal').style.display = 'flex';
}

export function closeModal() {
    document.getElementById('editModal').style.display = 'none';
    window.data.editIndex = null;
}