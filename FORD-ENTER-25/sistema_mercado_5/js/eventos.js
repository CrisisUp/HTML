/* js/eventos.js */
function validateInput(e) {
    const id = e.target.id;
    const value = e.target.value;
    const erro = document.getElementById(`erro-${id}`);

    if (id === 'nome') {
        if (!value.trim()) { erro.textContent = 'O nome é obrigatório'; }
        else if (value.length > 50) { erro.textContent = 'O nome deve ter no máximo 50 caracteres'; }
        else if (!/^[a-zA-Z\s-]+$/.test(value)) { erro.textContent = 'Use apenas letras, espaços ou hífens'; }
        else { erro.textContent = ''; }
    } else if (id === 'valor') {
        const num = parseFloat(value);
        if (isNaN(num) || num <= 0) { erro.textContent = 'Insira um valor válido'; }
        else if (num > 10000) { erro.textContent = 'O valor não pode exceder R$ 10.000'; }
        else { erro.textContent = ''; }
    } else if (id === 'quantidade') {
        const num = parseInt(value);
        if (isNaN(num) || num < 1) { erro.textContent = 'Insira uma quantidade válida'; }
        else if (num > 600) { erro.textContent = 'A quantidade não pode exceder 600'; }
        else { erro.textContent = ''; }
    }
}

function validarEntrada(nome, valorUnitario, quantidade) {
    return {
        nome: !nome.trim() ? 'O nome é obrigatório' :
            nome.length > 50 ? 'O nome deve ter no máximo 50 caracteres' :
                !/^[a-zA-Z\s-]+$/.test(nome) ? 'Use apenas letras, espaços ou hífens' : '',
        valor: isNaN(valorUnitario) || valorUnitario <= 0 ? 'Insira um valor válido' :
            valorUnitario > 10000 ? 'O valor não pode exceder R$ 10.000' : '',
        quantidade: isNaN(quantidade) || quantidade < 1 ? 'Insira uma quantidade válida' :
            quantidade > 600 ? 'A quantidade não pode exceder 600' : ''
    };
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
        const valorUnitario = parseFloat(document.getElementById('valor')?.value || '0');
        const quantidade = parseInt(document.getElementById('quantidade')?.value || '0');

        const erros = validarEntrada(nome, valorUnitario, quantidade);
        exibirErros(erros);

        if (erros.nome || erros.valor || erros.quantidade) {
            return;
        }

        adicionarProduto(nome, valorUnitario, quantidade);
        form.reset();
        exibirErros({ nome: '', valor: '', quantidade: '' });
        mostrarNotificacao(app.editIndex !== null ? 'Produto atualizado com sucesso!' : 'Produto adicionado com sucesso!');
    });

    finalizarBtn.addEventListener('click', gerarNotaFiscal);

    limparBtn.addEventListener('click', () => {
        limparProdutos();
        tabelaNota.innerHTML = '<tr><td colspan="5">Nenhuma compra registrada ainda.</td></tr>';
        valorTotal.textContent = 'R$ 0,00';
        notaFiscal.classList.remove('mostrar');
        exibirErros({ nome: '', valor: '', quantidade: '' });
        adicionarBtn.textContent = 'Adicionar Produto';
        app.editIndex = null;
    });

    console.log('Botoes adicionar-oferta:', document.querySelectorAll('.adicionar-oferta').length);

    document.body.addEventListener('click', (e) => {
        if (e.target.matches('.adicionar-oferta')) {
            const btn = e.target;
            const nome = btn.dataset.nome?.trim();
            const valorUnitario = parseFloat(btn.dataset.valor);
            const quantidade = parseInt(btn.dataset.quantidade);

            const erros = validarEntrada(nome, valorUnitario, quantidade);
            if (erros.nome || erros.valor || erros.quantidade) {
                mostrarNotificacaoErro('Erro ao adicionar produto: ' +
                    (erros.nome || erros.valor || erros.quantidade));
                return;
            }

            adicionarProduto(nome, valorUnitario, quantidade);
            mostrarNotificacao(`Produto ${nome} adicionado com sucesso!`);
        }
    });
}

function mostrarNotificacao(mensagem) {
    let notificacao = document.getElementById('notificacao');
    if (!notificacao) {
        notificacao = document.createElement('div');
        notificacao.id = 'notificacao';
        notificacao.className = 'notificacao';
        notificacao.setAttribute('role', 'alert');
        notificacao.setAttribute('aria-live', 'assertive');
        notificacao.setAttribute('tabindex', '-1');
        document.body.appendChild(notificacao);
    }
    notificacao.textContent = mensagem;
    notificacao.classList.add('mostrar');
    notificacao.focus();
    setTimeout(() => {
        notificacao.classList.remove('mostrar');
        setTimeout(() => notificacao.remove(), 300);
    }, 3000);
}

function mostrarNotificacaoErro(mensagem) {
    let notificacao = document.createElement('div');
    notificacao.className = 'notificacao erro';
    notificacao.setAttribute('role', 'alert');
    notificacao.setAttribute('aria-live', 'assertive');
    notificacao.textContent = mensagem;
    document.body.appendChild(notificacao);
    notificacao.classList.add('mostrar');
    setTimeout(() => {
        notificacao.classList.remove('mostrar');
        setTimeout(() => notificacao.remove(), 300);
    }, 3000);
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
            console.error('app.elementos não carregado após 10 segundos. Verifique a ordem dos scripts em index.html ou erros em init.js.');
            clearInterval(checkApp);
        }
    }, 10000);
});

function esperarAppCarregado(tentativas = 20) {
    if (window.app && window.app.elementos) {
        console.log("✅ app.elementos carregado com sucesso.");
    } else if (tentativas > 0) {
        setTimeout(() => esperarAppCarregado(tentativas - 1), 500);
    } else {
        console.warn("⚠️ app.elementos não carregado após múltiplas tentativas.");
    }
}

document.addEventListener('DOMContentLoaded', esperarAppCarregado);
