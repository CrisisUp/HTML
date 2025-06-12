const loadComponents = Promise.all([
    loadComponent('form-section', 'components/form.html'),
    loadComponent('nota-fiscal-section', 'components/nota-fiscal.html'),
]);

window.loadComponents = loadComponents;

async function loadComponent(id, path) {
    const response = await fetch(path);
    const html = await response.text();
    document.getElementById(id).innerHTML = html;
}