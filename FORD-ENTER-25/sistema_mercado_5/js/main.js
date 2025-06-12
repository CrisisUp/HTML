/* js/main.js */

/*
document.addEventListener('DOMContentLoaded', () => {
    const checkApp = setInterval(() => {
        if (window.app?.elementos) {
            console.log('Inicializando com app.elementos:', window.app.elementos);
            clearInterval(checkApp);
            inicializar();
        }
    }, 100);

    setTimeout(() => {
        if (!window.app?.elementos) {
            console.error('Inicialização falhou: app.elementos não definido após 10 segundos');
            clearInterval(checkApp);
        }
    }, 10000);
});

function inicializar() {
    if (!window.app?.elementos) {
        console.error('app.elementos não está definido em inicializar');
        return;
    }
    inicializarEventos(); // Chama eventos.js
    // Outras inicializações
}

*/


// js/main.js

// Função para converter string com vírgula ou ponto para número float
function parseValor(valorStr) {
    if (typeof valorStr !== 'string') return NaN;
    // Troca vírgula por ponto
    valorStr = valorStr.replace(',', '.');
    return parseFloat(valorStr);
}

// Atualiza a tabela de produtos na tela
function atualizarTabelaProdutos() {
    const tbody = document.getElementById('corpoTabelaProdutos');
    tbody.innerHTML = '';

    if (!window.app.produtos.length) {
        tbody.innerHTML = '<tr><td colspan="5">Nenhum produto adicionado.</td></tr>';
        return;
    }

    window.app.produtos.forEach((p, i) => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>${p.nome}</td>
            <td>${p.quantidade}</td>
            <td>${p.valorUnitario.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</td>
            <td>${p.valorTotal.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</td>
            <td>
                <button type="button" onclick="editarProduto(${i})">Editar</button>
                <button type="button" onclick="removerProduto(${i})">Remover</button>
            </td>
        `;
        tbody.appendChild(tr);
    });
}

// Limpa o formulário e reseta o estado de edição
function limparFormulario() {
    document.getElementById('nome').value = '';
    document.getElementById('valor').value = '';
    document.getElementById('quantidade').value = '1';

    document.getElementById('adicionarBtn').textContent = 'Adicionar Produto';

    // Remove mensagens de erro se existirem
    ['erro-nome', 'erro-valor', 'erro-quantidade'].forEach(id => {
        document.getElementById(id).textContent = '';
    });

    window.app.editIndex = null;
}

// Ação do botão adicionar/atualizar produto
function adicionarOuAtualizarProduto(event) {
    event.preventDefault();

    const nomeInput = document.getElementById('nome');
    const valorInput = document.getElementById('valor');
    const quantidadeInput = document.getElementById('quantidade');

    const nome = nomeInput.value.trim();
    const valorStr = valorInput.value.trim();
    const quantidadeStr = quantidadeInput.value.trim();

    // Validações
    let valid = true;

    if (!nome) {
        document.getElementById('erro-nome').textContent = 'Informe o nome do produto.';
        valid = false;
    } else {
        document.getElementById('erro-nome').textContent = '';
    }

    const valorUnitario = parseValor(valorStr);
    if (isNaN(valorUnitario) || valorUnitario <= 0) {
        document.getElementById('erro-valor').textContent = 'Informe um valor unitário válido maior que zero.';
        valid = false;
    } else {
        document.getElementById('erro-valor').textContent = '';
    }

    const quantidade = parseInt(quantidadeStr, 10);
    if (isNaN(quantidade) || quantidade < 1) {
        document.getElementById('erro-quantidade').textContent = 'Informe uma quantidade válida (mínimo 1).';
        valid = false;
    } else {
        document.getElementById('erro-quantidade').textContent = '';
    }

    if (!valid) return;

    const valorTotal = valorUnitario * quantidade;

    const produto = { nome, valorUnitario, quantidade, valorTotal };

    if (window.app.editIndex !== null) {
        window.app.produtos[window.app.editIndex] = produto;
        window.app.editIndex = null;
    } else {
        window.app.produtos.push(produto);
    }

    atualizarTabelaProdutos();
    limparFormulario();
}

// Editar produto
function editarProduto(index) {
    const produto = window.app.produtos[index];
    if (!produto) return;

    document.getElementById('nome').value = produto.nome;
    document.getElementById('valor').value = produto.valorUnitario.toFixed(2).replace('.', ',');
    document.getElementById('quantidade').value = produto.quantidade;

    document.getElementById('adicionarBtn').textContent = 'Atualizar Produto';

    window.app.editIndex = index;
}

// Remover produto
function removerProduto(index) {
    window.app.produtos.splice(index, 1);
    atualizarTabelaProdutos();
    limparFormulario();
}

// Finalizar compra: gerar nota fiscal
function finalizarCompra() {
    const corpoNota = document.getElementById('corpoTabelaNota');
    const valorTotalCompra = document.getElementById('valor-total');

    corpoNota.innerHTML = '';

    if (!window.app.produtos.length) {
        corpoNota.innerHTML = '<tr><td colspan="5">Nenhum produto na nota fiscal.</td></tr>';
        valorTotalCompra.textContent = 'R$ 0,00';
        return;
    }

    let totalCompra = 0;

    window.app.produtos.forEach((p, i) => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>${i + 1}</td>
            <td>${p.nome}</td>
            <td>${p.quantidade}</td>
            <td>${p.valorUnitario.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</td>
            <td>${p.valorTotal.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</td>
        `;
        corpoNota.appendChild(tr);
        totalCompra += p.valorTotal;
    });

    valorTotalCompra.textContent = totalCompra.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
}

// Limpar tudo: produtos e nota fiscal
function limparTudo() {
    window.app.produtos = [];
    window.app.editIndex = null;
    atualizarTabelaProdutos();

    const corpoNota = document.getElementById('corpoTabelaNota');
    corpoNota.innerHTML = '<tr><td colspan="5">Nenhum produto na nota fiscal.</td></tr>';

    document.getElementById('valor-total').textContent = 'R$ 0,00';

    limparFormulario();
}

// Evento para ligar os botões e o formulário
function inicializarEventos() {
    const form = document.getElementById('produtoForm');
    const btnFinalizar = document.getElementById('finalizar');
    const btnLimpar = document.getElementById('limpar');

    form.addEventListener('submit', adicionarOuAtualizarProduto);
    btnFinalizar.addEventListener('click', finalizarCompra);
    btnLimpar.addEventListener('click', limparTudo);
}

// Inicialização do app
function init() {
    window.app = {
        produtos: [],
        editIndex: null
    };
    atualizarTabelaProdutos();
    inicializarEventos();
}

// Para permitir uso das funções no onclick dos botões da tabela
window.editarProduto = editarProduto;
window.removerProduto = removerProduto;

window.addEventListener('DOMContentLoaded', init);
