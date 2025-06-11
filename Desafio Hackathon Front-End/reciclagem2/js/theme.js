// Alterna modo noturno/diurno
export function initTheme() {
    const themeBtn = document.getElementById('themeToggle');
    const isDarkMode = localStorage.getItem('darkMode') === 'true';
    
    if (isDarkMode) {
        document.body.classList.add('dark-mode');
        themeBtn.innerHTML = '<i class="fas fa-sun" aria-hidden="true"></i>';
        themeBtn.setAttribute('aria-label', 'Ativar modo diurno');
    } else {
        themeBtn.innerHTML = '<i class="fas fa-moon" aria-hidden="true"></i>';
        themeBtn.setAttribute('aria-label', 'Ativar modo noturno');
    }
    
    themeBtn.addEventListener('click', toggleDarkMode);
}

function toggleDarkMode() {
    const themeBtn = document.getElementById('themeToggle');
    const isDarkMode = document.body.classList.toggle('dark-mode');
    
    if (isDarkMode) {
        themeBtn.innerHTML = '<i class="fas fa-sun" aria-hidden="true"></i>';
        themeBtn.setAttribute('aria-label', 'Ativar modo diurno');
        localStorage.setItem('darkMode', 'true');
    } else {
        themeBtn.innerHTML = '<i class="fas fa-moon" aria-hidden="true"></i>';
        themeBtn.setAttribute('aria-label', 'Ativar modo noturno');
        localStorage.setItem('darkMode', 'false');
    }
}