import { initTheme } from './theme.js';
import { loadData, saveData } from './data.js';
import { renderUI, updateUI } from './ui.js';
import { setupEventHandlers } from './events.js';
import { showMessage } from './utils.js';
import { setupFormSubmit } from './events.js';

// main.js
export let tasks = [];
export let points = 0;
export let level = 1;

export function getAppState() {
    return { tasks, points, level };
}

export function setAppState(newState) {
    tasks = newState.tasks || [];
    points = newState.points || 0;
    level = newState.level || 1;
    saveData();
    updateUI();
}

// Importações
import { initTheme } from './theme.js';
import { loadData } from './data.js';
import { renderUI } from './ui.js';
import { setupEventHandlers } from './events.js';
import { saveData } from './data.js';

function initApp() {
    initTheme();
    loadData();
    renderUI();
    setupEventHandlers();
}

document.addEventListener('DOMContentLoaded', initApp);