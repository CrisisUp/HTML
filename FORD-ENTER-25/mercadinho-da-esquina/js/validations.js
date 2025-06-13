// Validações do formulário
export function validarProduto(nome, valorStr, quantidade, produtos, nomeInput, valorInput, quantidadeInput, mostrarMensagem) {
    const nomeTrim = nome.trim();
    const valorUnitario = parseFloat(valorStr.replace(",", "."));
    const quantidadeNum = parseInt(quantidade);

    // Validações do nome
    if (!nomeTrim) {
        mostrarMensagem("O nome do produto é obrigatório.", "erro");
        nomeInput.focus();
        return false;
    }
    if (nomeTrim.length > 50) {
        mostrarMensagem("O nome do produto deve ter no máximo 50 caracteres.", "erro");
        nomeInput.focus();
        return false;
    }
    if (!/^[A-Za-zÀ-ÿ0-9\s\-\'\.]+$/.test(nomeTrim)) {
        mostrarMensagem("O nome do produto contém caracteres inválidos.", "erro");
        nomeInput.focus();
        return false;
    }
    if (/^[\s\-\'\.]+$/.test(nomeTrim)) {
        mostrarMensagem("O nome do produto não pode conter apenas espaços ou caracteres especiais.", "erro");
        nomeInput.focus();
        return false;
    }
    if (produtos.some(p => p.nome.toLowerCase() === nomeTrim.toLowerCase())) {
        mostrarMensagem("Este produto já foi adicionado.", "erro");
        nomeInput.focus();
        return false;
    }

    // Validações do valor
    if (valorStr === "" || isNaN(valorUnitario)) {
        mostrarMensagem("O valor unitário deve ser um número válido.", "erro");
        valorInput.focus();
        return false;
    }
    if (valorUnitario <= 0) {
        mostrarMensagem("O valor unitário deve ser maior que zero.", "erro");
        valorInput.focus();
        return false;
    }
    if (valorUnitario > 10000) {
        mostrarMensagem("O valor unitário não pode exceder R$10.000.", "erro");
        valorInput.focus();
        return false;
    }
    if (!/^\d+(\.\d{1,2})?$/.test(valorStr)) {
        mostrarMensagem("O valor unitário deve ter até 2 casas decimais.", "erro");
        valorInput.focus();
        return false;
    }

    // Validações da quantidade
    if (isNaN(quantidadeNum) || quantidade === "") {
        mostrarMensagem("A quantidade deve ser um número inteiro.", "erro");
        quantidadeInput.focus();
        return false;
    }
    if (quantidadeNum <= 0) {
        mostrarMensagem("A quantidade deve ser maior que zero.", "erro");
        quantidadeInput.focus();
        return false;
    }

    // Sanitiza o nome contra XSS
    const nomeSanitizado = nomeTrim.replace(/</g, "&lt;").replace(/>/g, "&gt;");

    return { nome: nomeSanitizado, quantidade: quantidadeNum, valorUnitario, valorTotal: valorUnitario * quantidadeNum };
}