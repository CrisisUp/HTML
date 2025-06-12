// Converte string com vírgula para número float
function parseValor(valor) {
    if (typeof valor === 'string') {
        valor = valor.replace(',', '.');
    }
    const numero = parseFloat(valor);
    if (isNaN(numero) || numero < 0) {
        console.warn('Valor inválido ou negativo:', valor);
        return null;
    }
    return numero;
}

function mostrarErro(mensagem) {
    const erroDiv = document.createElement('div');
    erroDiv.className = 'error-message';
    erroDiv.textContent = mensagem;
    document.querySelector('.main-grid').prepend(erroDiv);
    setTimeout(() => erroDiv.remove(), 3000);
}

function inicializarApp() {
    const app = {
        elementos: {
            form: document.getElementById('produtoForm'),
            adicionarBtn: document.getElementById('adicionarBtn'),
            finalizarBtn: document.getElementById('finalizar'),
            limparBtn: document.getElementById('limpar'),
            tabelaNota: document.getElementById('corpoTabelaNota'),
            valorTotal: document.getElementById('valor-total'),
            notaFiscal: document.getElementById('notaFiscal'),
        },
        editIndex: -1, // -1 indica que nenhum produto está sendo editado
        produtos: [],
    };

    console.log('app.elementos inicializado:', app.elementos);

    // Verifica se os elementos foram encontrados
    const elementosCriticos = ['form', 'tabelaNota'];
    for (const [key, value] of Object.entries(app.elementos)) {
        if (!value && elementosCriticos.includes(key)) {
            throw new Error(`Elemento crítico ${key} não encontrado no DOM`);
        } else if (!value) {
            console.warn(`Elemento ${key} não encontrado no DOM`);
        }
    }

    // Mescla com o objeto existente, preservando dados anteriores
    window.app = { ...window.app, ...app };
}

function inicializarOfertas() {
    const botoes = document.querySelectorAll('.adicionar-oferta');

    botoes.forEach(botao => {
        botao.addEventListener('click', () => {
            const nome = botao.getAttribute('data-nome');
            const valorStr = botao.getAttribute('data-valor');
            const valor = parseValor(valorStr);

            if (!nome || valor === null || valor <= 0) {
                mostrarErro('Valor unitário inválido, negativo ou nome do produto ausente.');
                return;
            }

            const existente = window.app.produtos.find(p => p.nome === nome);
            if (existente) {
                existente.quantidade += 1;
                existente.valorTotal = existente.quantidade * existente.valorUnitario;
                atualizarTabelaProdutos();
            } else {
                adicionarProduto(nome, valor, 1);
            }
        });
    });
}

document.addEventListener('DOMContentLoaded', () => {
    if (window.loadComponents) {
        window.loadComponents.then(() => {
            inicializarApp();
            inicializarOfertas();
        }).catch(err => console.error('Erro ao carregar componentes:', err));
    } else {
        inicializarApp();
        inicializarOfertas();
    }
});