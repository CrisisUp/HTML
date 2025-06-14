/* js/init.js */

// Converte string com vírgula para número float
function parseValor(valor) {
    if (typeof valor === 'string') {
        valor = valor.replace(',', '.');
    }
    return parseFloat(valor);
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
            notaFiscal: document.getElementById('notaFiscal')
        },
        editIndex: null,
        produtos: []
    };

    console.log('app.elementos inicializado:', app.elementos);

    for (const [key, value] of Object.entries(app.elementos)) {
        if (!value) { 
            console.warn(`Elemento ${key} não encontrado no DOM`);
        }
    }

    window.app = app;
}

document.addEventListener('DOMContentLoaded', () => {
    if (window.loadComponents) {
        window.loadComponents.then(() => inicializarApp()).catch(err => console.error('Erro ao carregar componentes:', err));
    } else {
        inicializarApp();
    }
});

function inicializarOfertas() {
    const botoes = document.querySelectorAll('.adicionar-oferta');

    botoes.forEach(botao => {
        botao.addEventListener('click', () => {
            const nome = botao.getAttribute('data-nome');
            const valorStr = botao.getAttribute('data-valor');
            const valor = parseValor(valorStr);

            if (!nome || isNaN(valor)) {
                alert('Valor unitário inválido ou nome do produto ausente.');
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
