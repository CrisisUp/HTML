// js/utils.js
export function sanitizeInput(input) {
    const div = document.createElement('div');
    div.textContent = input;
    return div.innerHTML;
}

export function getMaterialIcon(taskText) {
    const text = taskText.toLowerCase();
    if (text.includes('plástico') || text.includes('plastico')) {
        return 'fa-bottle-water';
    } else if (text.includes('papel') || text.includes('jornal') || text.includes('papelão')) {
        return 'fa-newspaper';
    } else if (text.includes('vidro')) {
        return 'fa-wine-bottle';
    } else {
        return 'fa-recycle';
    }
}