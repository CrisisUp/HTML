function mostrarErro(mensagem, isErro = true) {
    const erroExistente = document.querySelector('.error-message, .info-message');
    if (erroExistente) erroExistente.remove();
    const erroDiv = document.createElement('div');
    erroDiv.className = isErro ? 'error-message' : 'info-message';
    erroDiv.textContent = mensagem;
    erroDiv.setAttribute('role', 'alert');
    const fecharBtn = document.createElement('button');
    fecharBtn.textContent = '×';
    fecharBtn.className = 'fechar-erro';
    fecharBtn.onclick = () => erroDiv.remove();
    erroDiv.appendChild(fecharBtn);
    const mainGrid = document.querySelector('.main-grid');
    if (mainGrid) mainGrid.prepend(erroDiv);
    setTimeout(() => erroDiv.remove(), 3000);
}

function adicionarProduto(nome, valorUnitario, quantidade) {
    if (!window.app || !Array.isArray(window.app.produtos)) {
        console.error('app ou app.produtos não definido. Verifique js/init.js.');
        return;
    }

    valorUnitario = parseValor(valorUnitario);
    quantidade = Number(quantidade);

    if (!nome.trim()) {
        mostrarErro('Nome do produto não pode ser vazio.');
        return;
    }
    if (nome.trim().length > 100) {
        mostrarErro('Nome do produto não pode exceder 100 caracteres.');
        return;
    }
    if (valorUnitario === null || valorUnitario <= 0) {
        mostrarErro('Valor unitário inválido ou negativo.');
        return;
    }
    if (!Number.isInteger(quantidade) || quantidade <= 0) {
        mostrarErro('Quantidade deve ser um número inteiro positivo.');
        return;
    }

    const produtoExistente = window.app.produtos.find((p, idx) => p.nome === nome && idx !== window.app.editIndex);
    if (produtoExistente) {
        mostrarErro('Produto já cadastrado. Edite-o ou escolha outro nome.');
        return;
    }

    const valorTotal = Number((valorUnitario * quantidade).toFixed(2));
    const produto = { nome, quantidade, valorUnitario, valorTotal };
    const nomeSanitizado = nome.replace(/[<>]/g, '');

    if (window.app.editIndex !== -1) {
        window.app.produtos[window.app.editIndex] = produto;
        mostrarErro(`Produto "${nomeSanitizado}" atualizado com sucesso.`, false);
        window.app.editIndex = -1;
        document.getElementById('adicionarBtn').textContent = 'Adicionar Produto';
    } else {
        window.app.produtos.push(produto);
        mostrarErro(`Produto "${nomeSanitizado}" adicionado com sucesso.`, false);
    }

    atualizarTabelaProdutos();
    document.getElementById('nome').value = '';
    document.getElementById('valor').value = '';
    document.getElementById('quantidade').value = '';
    document.getElementById('nome').focus();
}

function limparProdutos() {
    if (!window.app || !Array.isArray(window.app.produtos)) {
        console.error('app ou app.produtos não definido.');
        return;
    }
    if (!confirm('Deseja limpar todos os produtos?')) return;
    window.app.produtos = [];
    window.app.editIndex = -1;
    atualizarTabelaProdutos();
    if (typeof limparNotaFiscal === 'function') limparNotaFiscal();
    document.getElementById('adicionarBtn').textContent = 'Adicionar Produto';
    document.getElementById('nome').value = '';
    document.getElementById('valor').value = '';
    document.getElementById('quantidade').value = '';
    document.getElementById('nome').focus();
    if (document.querySelector('.main-grid')) {
        mostrarErro('Lista de produtos limpa com sucesso.', false);
    }
}

function atualizarTabelaProdutos() {
    const tbody = document.getElementById('corpoTabelaProdutos');
    if (!tbody) {
        console.warn('Elemento corpoTabelaProdutos não encontrado.');
        return;
    }
    tbody.innerHTML = '';
    if (!window.app?.produtos?.length) {
        const tr = document.createElement('tr');
        const td = document.createElement('td');
        td.colSpan = 5;
        td.textContent = 'Nenhum produto adicionado.';
        td.className = 'tabela-vazia';
        tr.appendChild(td);
        tbody.appendChild(tr);
        return;
    }
    window.app.produtos.forEach((p, i) => {
        const tr = document.createElement('tr');
        const tdNome = document.createElement('td');
        tdNome.textContent = p.nome;
        tr.appendChild(tdNome);
        const tdQuantidade = document.createElement('td');
        tdQuantidade.textContent = p.quantidade;
        tr.appendChild(tdQuantidade);
        const tdValorUnitario = document.createElement('td');
        tdValorUnitario.textContent = p.valorUnitario.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
        tr.appendChild(tdValorUnitario);
        const tdValorTotal = document.createElement('td');
        tdValorTotal.textContent = p.valorTotal.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
        tr.appendChild(tdValorTotal);
        const tdAcoes = document.createElement('td');
        const btnEditar = document.createElement('button');
        btnEditar.className = 'btn btn-editar';
        btnEditar.textContent = 'Editar';
        btnEditar.setAttribute('aria-label', `Editar produto ${p.nome.replace(/[<>]/g, '')}`);
        btnEditar.onclick = () => editarProduto(i);
        tdAcoes.appendChild(btnEditar);
        const btnRemover = document.createElement('button');
        btnRemover.className = 'btn btn-remover';
        btnRemover.textContent = 'Remover';
        btnRemover.setAttribute('aria-label', `Remover produto ${p.nome.replace(/[<>]/g, '')}`);
        btnRemover.onclick = () => removerProduto(i);
        tdAcoes.appendChild(btnRemover);
        tr.appendChild(tdAcoes);
        tbody.appendChild(tr);
    });
    if (typeof atualizarNotaFiscal === 'function') atualizarNotaFiscal();
}

function editarProduto(index) {
    if (!window.app?.produtos[index]) return;
    const p = window.app.produtos[index];
    document.getElementById('nome').value = p.nome;
    document.getElementById('valor').value = p.valorUnitario.toFixed(2);
    document.getElementById('quantidade').value = p.quantidade;
    document.getElementById('adicionarBtn').textContent = 'Atualizar Produto';
    window.app.editIndex = index;
    document.getElementById('nome').focus();
    if (document.querySelector('.main-grid')) {
        mostrarErro(`Editando produto "${p.nome.replace(/[<>]/g, '')}".`, false);
    }
}

function removerProduto(index) {
    if (!window.app?.produtos[index]) return;
    const nomeSanitizado = window.app.produtos[index].nome.replace(/[<>]/g, '');
    if (!confirm(`Deseja remover o produto "${nomeSanitizado}"?`)) return;
    window.app.produtos.splice(index, 1);
    if (window.app.editIndex === index) {
        window.app.editIndex = -1;
        document.getElementById('adicionarBtn').textContent = 'Adicionar Produto';
        document.getElementById('nome').value = '';
        document.getElementById('valor').value = '';
        document.getElementById('quantidade').value = '';
    }
    atualizarTabelaProdutos();
    if (document.querySelector('.main-grid')) {
        mostrarErro(`Produto "${nomeSanitizado}" removido com sucesso.`, false);
    }
}