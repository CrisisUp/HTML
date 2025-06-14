// js/produtos.js

// Converte valor numérico em string que pode vir com vírgula para número float
function parseValor(valor) {
    if (typeof valor === 'string') {
        valor = valor.replace(',', '.');
    }
    return parseFloat(valor);
}

function adicionarProduto(nome, valorUnitario, quantidade) {
    if (!window.app || !Array.isArray(window.app.produtos)) {
        console.error('app ou app.produtos não definido. Verifique js/init.js.');
        return;
    }

    // Converter valorUnitario para número float caso venha como string com vírgula
    valorUnitario = parseValor(valorUnitario);

    // Validar dados mínimos (nome não vazio, valor positivo, quantidade positiva)
    if (!nome.trim()) {
        alert('Nome do produto não pode ser vazio.');
        return;
    }
    if (isNaN(valorUnitario) || valorUnitario <= 0) {
        alert('Valor unitário inválido.');
        return;
    }
    if (!Number.isInteger(quantidade) || quantidade <= 0) {
        alert('Quantidade inválida.');
        return;
    }

    // Verificar se produto com mesmo nome já existe (excluindo o que está editando)
    const produtoExistente = window.app.produtos.find((p, idx) => p.nome === nome && idx !== window.app.editIndex);
    if (produtoExistente) {
        alert('Produto já cadastrado. Edite-o ou escolha outro nome.');
        return;
    }

    const valorTotal = valorUnitario * quantidade;
    const produto = { nome, quantidade, valorUnitario, valorTotal };

    if (window.app.editIndex !== null) {
        // Atualizar produto existente
        window.app.produtos[window.app.editIndex] = produto;
        window.app.editIndex = null;
        // Resetar texto do botão para "Adicionar Produto"
        document.getElementById('adicionarBtn').textContent = 'Adicionar Produto';
    } else {
        // Adicionar novo produto
        window.app.produtos.push(produto);
    }

    atualizarTabelaProdutos();

    // Limpar formulário após adicionar/editar
    document.getElementById('nome').value = '';
    document.getElementById('valor').value = '';
    document.getElementById('quantidade').value = '';

    // Dar foco ao campo nome para melhor UX
    document.getElementById('nome').focus();
}

function limparProdutos() {
    if (!window.app || !Array.isArray(window.app.produtos)) {
        console.error('app ou app.produtos não definido.');
        return;
    }
    window.app.produtos = [];
    window.app.editIndex = null;
    atualizarTabelaProdutos();

    // Resetar texto do botão
    document.getElementById('adicionarBtn').textContent = 'Adicionar Produto';

    // Limpar campos do formulário
    document.getElementById('nome').value = '';
    document.getElementById('valor').value = '';
    document.getElementById('quantidade').value = '';

    document.getElementById('nome').focus();
}

function atualizarTabelaProdutos() {
    const tbody = document.getElementById('corpoTabelaProdutos');
    if (!tbody) {
        console.warn('Elemento corpoTabelaProdutos não encontrado.');
        return;
    }
    tbody.innerHTML = '';

    if (!window.app?.produtos?.length) {
        tbody.innerHTML = '<tr><td colspan="5">Nenhum produto adicionado.</td></tr>';
        return;
    }

    window.app.produtos.forEach((p, i) => {
        const tr = document.createElement('tr');

        // Nome
        const tdNome = document.createElement('td');
        tdNome.textContent = p.nome;
        tr.appendChild(tdNome);

        // Quantidade
        const tdQuantidade = document.createElement('td');
        tdQuantidade.textContent = p.quantidade;
        tr.appendChild(tdQuantidade);

        // Valor Unitário formatado
        const tdValorUnitario = document.createElement('td');
        tdValorUnitario.textContent = p.valorUnitario.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
        tr.appendChild(tdValorUnitario);

        // Valor Total formatado
        const tdValorTotal = document.createElement('td');
        tdValorTotal.textContent = p.valorTotal.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
        tr.appendChild(tdValorTotal);

        // Ações (Editar e Remover)
        const tdAcoes = document.createElement('td');

        const btnEditar = document.createElement('button');
        btnEditar.textContent = 'Editar';
        btnEditar.setAttribute('aria-label', `Editar produto ${p.nome}`);
        btnEditar.onclick = () => editarProduto(i);
        tdAcoes.appendChild(btnEditar);

        const btnRemover = document.createElement('button');
        btnRemover.textContent = 'Remover';
        btnRemover.setAttribute('aria-label', `Remover produto ${p.nome}`);
        btnRemover.onclick = () => removerProduto(i);
        tdAcoes.appendChild(btnRemover);

        tr.appendChild(tdAcoes);

        tbody.appendChild(tr);
    });
}

function editarProduto(index) {
    if (!window.app?.produtos[index]) return;
    const p = window.app.produtos[index];
    document.getElementById('nome').value = p.nome;
    document.getElementById('valor').value = p.valorUnitario;
    document.getElementById('quantidade').value = p.quantidade;
    document.getElementById('adicionarBtn').textContent = 'Atualizar Produto';
    window.app.editIndex = index;

    // Dar foco ao campo nome para editar rápido
    document.getElementById('nome').focus();
}

function removerProduto(index) {
    if (!window.app?.produtos[index]) return;
    if (!confirm(`Deseja remover o produto "${window.app.produtos[index].nome}"?`)) return;

    window.app.produtos.splice(index, 1);

    // Se estava editando este produto, resetar estado
    if (window.app.editIndex === index) {
        window.app.editIndex = null;
        document.getElementById('adicionarBtn').textContent = 'Adicionar Produto';
        document.getElementById('nome').value = '';
        document.getElementById('valor').value = '';
        document.getElementById('quantidade').value = '';
    }

    atualizarTabelaProdutos();
}
