// js/main.js
import * as data from './data.js';
import * as ui from './ui.js';
import * as events from './events.js';
import * as utils from './utils.js';
import * as theme from './theme.js';

// Expor módulo de dados globalmente para acesso em outros módulos
window.data = data;

// Inicializar tema
theme.initializeTheme();

// Configurar eventos, passando funções necessárias
events.setupEventListeners(
    (taskText) => data.addTask(taskText, () => data.updateLevel(ui.showBadge), ui.showMessage),
    () => data.clearStorage(() => data.updateLevel(ui.showBadge)),
    (index) => data.toggleComplete(index, () => data.updateLevel(ui.showBadge), ui.showMessage),
    (index) => ui.openEditModal(index, data.tasks, data.setEditIndex),
    (newText) => data.saveEdit(newText, () => data.updateLevel(ui.showBadge), ui.showMessage),
    ui.closeModal,
    theme.toggleDarkMode,
    (index) => data.deleteTask(index, () => data.updateLevel(ui.showBadge), ui.showMessage),
    () => ui.updateList(data.tasks, utils.getMaterialIcon, (index) => data.toggleComplete(index, () => data.updateLevel(ui.showBadge), ui.showMessage), (index) => ui.openEditModal(index, data.tasks, data.setEditIndex), (index) => data.deleteTask(index, () => data.updateLevel(ui.showBadge), ui.showMessage)),
    utils.getMaterialIcon
);