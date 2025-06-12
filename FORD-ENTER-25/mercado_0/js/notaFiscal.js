function gerarNotaFiscal() {
  const { tabelaNota: tbody, valorTotal: valorTotalEl, notaFiscal: notaFiscalEl } = app.elementos;

  // Valida elementos do DOM
  if (!tbody || !valorTotalEl || !notaFiscalEl) {
    console.error('Elementos do DOM não encontrados:', { tbody, valorTotalEl, notaFiscalEl });
    mostrarNotificacao('Erro ao gerar nota fiscal: elementos não encontrados.', true);
    return;
  }

  // Limpa a tabela
  tbody.innerHTML = '';

  // Função auxiliar para formatar valores em BRL
  const formatarMoeda = (valor) =>
    valor.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });

  // Obtém a contagem de colunas dinamicamente
  const colCount = tbody.closest('table')?.querySelector('thead tr')?.children.length || 5;

  // Verifica se há produtos válidos
  if (!app.produtos || app.produtos.length === 0) {
    tbody.innerHTML = `<tr><td colspan="${colCount}" class="tabela-vazia">Nenhuma compra registrada ainda.</td></tr>`;
    valorTotalEl.textContent = formatarMoeda(0);
    mostrarNotificacao('Nenhum produto para gerar nota fiscal.', true);
    return;
  }

  let totalFinal = 0;
  let temProdutosInvalidos = false;

  app.produtos.forEach((p, i) => {
    // Valida campos do produto
    if (
      !p.nome ||
      isNaN(p.quantidade) ||
      isNaN(p.valorUnitario) ||
      isNaN(p.valorTotal)
    ) {
      console.warn(`Produto inválido na posição ${i}:`, p);
      temProdutosInvalidos = true;
      return;
    }

    const tr = document.createElement('tr');
    tr.className = 'nota-row';
    tr.innerHTML = `
      <td>${i + 1}</td>
      <td>${p.nome.replace(/[<>]/g, '')}</td>
      <td>${p.quantidade}</td>
      <td>${formatarMoeda(p.valorUnitario)}</td>
      <td>${formatarMoeda(p.valorTotal)}</td>
    `;
    tbody.appendChild(tr);
    totalFinal += Number(p.valorTotal.toFixed(2));
  });

  // Adiciona a linha de total
  const trTotal = document.createElement('tr');
  trTotal.className = 'nota-total';
  trTotal.setAttribute('aria-label', 'Total da nota fiscal');
  trTotal.innerHTML = `
    <td colspan="${colCount - 1}"><strong>Total</strong></td>
    <td><strong>${formatarMoeda(totalFinal)}</strong></td>
  `;
  tbody.appendChild(trTotal);

  // Atualiza o valor total
  valorTotalEl.textContent = formatarMoeda(totalFinal);

  // Melhora a acessibilidade da tabela
  const tabela = tbody.closest('table');
  if (tabela) {
    tabela.setAttribute('role', 'grid');
    tabela.setAttribute('aria-describedby', 'nota-fiscal-descricao');
    tabela.querySelectorAll('thead th').forEach(th => th.setAttribute('scope', 'col'));
  }

  // Adiciona botão de fechar
  let fecharBtn = notaFiscalEl.querySelector('.fechar-nota');
  if (!fecharBtn) {
    fecharBtn = document.createElement('button');
    fecharBtn.textContent = '×';
    fecharBtn.className = 'fechar-nota';
    fecharBtn.setAttribute('aria-label', 'Fechar nota fiscal');
    fecharBtn.onclick = () => notaFiscalEl.classList.remove('mostrar');
    notaFiscalEl.appendChild(fecharBtn);
  }

  // Mostra a nota fiscal
  notaFiscalEl.classList.add('mostrar');
  setTimeout(() => notaFiscalEl.classList.remove('mostrar'), 5000);

  // Notifica o usuário
  if (temProdutosInvalidos) {
    mostrarNotificacao('Nota fiscal gerada, mas alguns produtos inválidos foram ignorados.', true);
  } else {
    mostrarNotificacao('Nota fiscal gerada com sucesso!', false);
  }
}