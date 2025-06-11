// js/theme.js
export function toggleDarkMode() {
    const isDarkMode = document.body.classList.toggle('dark-mode');
    const themeIcon = document.querySelector('.theme-btn i');
    const themeBtn = document.querySelector('.theme-btn');

    if (isDarkMode) {
        themeIcon.classList.replace('fa-moon', 'fa-sun');
        themeBtn.setAttribute('aria-label', 'Ativar modo diurno');
        localStorage.setItem('darkMode', 'true');
    } else {
        themeIcon.classList.replace('fa-sun', 'fa-moon');
        themeBtn.setAttribute('aria-label', 'Ativar modo noturno');
        localStorage.setItem('darkMode', 'false');
    }
}

export function initializeTheme() {
    if (localStorage.getItem('darkMode') === 'true') {
        document.body.classList.add('dark-mode');
        document.querySelector('.theme-btn i').classList.replace('fa-moon', 'fa-sun');
        document.querySelector('.theme-btn').setAttribute('aria-label', 'Ativar modo diurno');
    }
}