function validateInput(e) {
    const id = e.target.id;
    const value = e.target.value;
    const erro = document.getElementById(`erro-${id}`);

    if (erro) {
        erro.setAttribute('role', 'alert');
        if (id === 'nome') {
            if (!value.trim()) erro.textContent = 'O nome é obrigatório';
            else if (value.length > 100) erro.textContent = 'O nome deve ter no máximo 100 caracteres';
            else erro.textContent = '';
        } else if (id === 'valor') {
            const num = parseValor(value);
            if (num === null || num <= 0) erro.textContent = 'Insira um valor válido';
            else if (num > 10000) erro.textContent = 'O valor não pode exceder R$ 10.000';
            else erro.textContent = '';
        } else if (id === 'quantidade') {
            const num = Number(value);
            if (isNaN(num) || !Number.isInteger(num) || num < 1) erro.textContent = 'Insira uma quantidade válida';
            else if (num > 999) erro.textContent = 'A quantidade não pode exceder 999';
            else erro.textContent = '';
        }
    }
}

function validarEntrada(nome, valorUnitario, quantidade) {
    return {
        nome: !nome || !nome.trim() ? 'O nome é obrigatório' :
            nome.length > 100 ? 'O nome deve ter no máximo 100 caracteres' : null,
        valorUnitario: valorUnitario === null || isNaN(valorUnitario) || valorUnitario <= 0 ? 'Insira um valor válido' :
            valorUnitario > 10000 ? 'O valor não pode exceder R$ 10.000' : null,
        quantidade: isNaN(quantidade) || !Number.isInteger(Number(quantidade)) || quantidade < 1 ? 'Insira uma quantidade válida' :
            quantidade > 999 ? 'A quantidade não pode exceder 999' : null
    };
}

function exibirErros(erros) {
    ['nome', 'valor', 'quantidade'].forEach(id => {
        const erro = document.getElementById(`erro-${id}`);
        if (erro) {
            erro.textContent = erros[id] || '';
            erro.setAttribute('role', 'alert');
        }
    });
}

function mostrarNotificacao(mensagem, isErro = false) {
    let notificacao = document.getElementById('notificacao');
    if (!notificacao) {
        notificacao = document.createElement('div');
        notificacao.id = 'notificacao';
        notificacao.setAttribute('role', 'alert');
        notificacao.setAttribute('aria-live', 'assertive');
        notificacao.setAttribute('tabindex', '-1');
        document.body.appendChild(notificacao);
    }
    notificacao.className = `notificacao ${isErro ? 'erro' : 'sucesso'}`;
    notificacao.textContent = mensagem;
    notificacao.classList.add('mostrar');
    notificacao.focus();
    setTimeout(() => notificacao.classList.remove('mostrar'), 3000);
}

function inicializarEventos() {
    if (!window.app?.elementos) {
        console.error('app.elementos não está definido. Verifique js/init.js.');
        return;
    }

    const { form, adicionarBtn, finalizarBtn, limparBtn, tabelaNota, valorTotal, notaFiscal } = window.app.elementos;

    if (!form || !adicionarBtn || !finalizarBtn || !limparBtn || !tabelaNota || !valorTotal || !notaFiscal) {
        console.error('Um ou mais elementos do DOM não foram encontrados:', {
            form, adicionarBtn, finalizarBtn, limparBtn, tabelaNota, valorTotal, notaFiscal
        });
        return;
    }

    ['nome', 'valor', 'quantidade'].forEach(id => {
        const input = document.getElementById(id);
        if (input) {
            input.addEventListener('input', validateInput);
        } else {
            console.warn(`Input com ID ${id} não encontrado`);
        }
    });

    form.addEventListener('submit', (e) => {
        e.preventDefault();
        const nome = document.getElementById('nome')?.value.trim() || '';
        const valorUnitario = parseValor(document.getElementById('valor')?.value || '0');
        const quantidade = Number(document.getElementById('quantidade')?.value || '0');

        const erros = validarEntrada(nome, valorUnitario, quantidade);
        exibirErros(erros);

        if (erros.nome || erros.valorUnitario || erros.quantidade) {
            return;
        }

        adicionarProduto(nome, valorUnitario, quantidade);
        form.reset();
        exibirErros({ nome: null, valorUnitario: null, quantidade: null });
        mostrarNotificacao(window.app.editIndex !== -1 ? 'Produto atualizado com sucesso!' : 'Produto adicionado com sucesso!');
    });

    finalizarBtn.addEventListener('click', gerarNotaFiscal);

    limparBtn.addEventListener('click', () => {
        limparProdutos();
        tabelaNota.innerHTML = '<tr><td colspan="5">Nenhuma compra registrada ainda.</td></tr>';
        valorTotal.textContent = 'R$ 0,00';
        notaFiscal.classList.remove('mostrar');
        exibirErros({ nome: null, valorUnitario: null, quantidade: null });
        adicionarBtn.textContent = 'Adicionar Produto';
        window.app.editIndex = -1;
    });

    console.log('Botões adicionar-oferta:', document.querySelectorAll('.adicionar-oferta').length);
}

document.addEventListener('DOMContentLoaded', () => {
    const checkApp = setInterval(() => {
        if (window.app?.elementos) {
            console.log('app.elementos carregado com sucesso:', window.app.elementos);
            clearInterval(checkApp);
            inicializarEventos();
        }
    }, 100);
    setTimeout(() => {
        if (!window.app?.elementos) {
            console.error('app.elementos não carregado após 10 segundos.');
            clearInterval(checkApp);
        }
    }, 10000);
});