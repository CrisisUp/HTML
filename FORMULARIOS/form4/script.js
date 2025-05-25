document.addEventListener('DOMContentLoaded', function() {
    const formulario = document.getElementById('meuFormulario');
    
    // Padrões Regex
    const padroes = {
        nome: /^[a-zA-ZÀ-ú\s']{5,}$/, // Mínimo 5 caracteres, apenas letras e espaços
        email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, // Email válido
        senha: /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}$/, // Mínimo 8 caracteres, 1 maiúscula, 1 minúscula, 1 número
        telefone: /^\(\d{2}\)\s?\d{4,5}-?\d{4}$/, // (DD) 99999-9999 ou variações
        cpf: /^\d{3}\.?\d{3}\.?\d{3}-?\d{2}$/, // 999.999.999-99 ou variações
        dataNascimento: /^(0[1-9]|[12][0-9]|3[01])\/(0[1-9]|1[0-2])\/\d{4}$/, // dd/mm/aaaa
        cep: /^\d{5}-?\d{3}$/ // 99999-999 ou 99999999
    };
    
    // Mensagens de erro
    const mensagensErro = {
        nome: 'Nome deve ter pelo menos 5 caracteres e conter apenas letras',
        email: 'Por favor, insira um email válido',
        senha: 'Senha deve ter pelo menos 8 caracteres, incluindo 1 maiúscula, 1 minúscula e 1 número',
        telefone: 'Formato esperado: (DD) 99999-9999',
        cpf: 'Formato esperado: 999.999.999-99',
        dataNascimento: 'Formato esperado: dd/mm/aaaa',
        cep: 'Formato esperado: 99999-999'
    };
    
    // Adiciona listeners para validação em tempo real
    Object.keys(padroes).forEach(campo => {
        const input = document.getElementById(campo);
        const mensagemErro = input.nextElementSibling;
        
        input.addEventListener('input', function() {
            validarCampo(input, padroes[campo], mensagemErro, mensagensErro[campo]);
        });
        
        input.addEventListener('blur', function() {
            validarCampo(input, padroes[campo], mensagemErro, mensagensErro[campo]);
        });
    });
    
    // Validação no envio do formulário
    formulario.addEventListener('submit', function(e) {
        let formularioValido = true;
        
        Object.keys(padroes).forEach(campo => {
            const input = document.getElementById(campo);
            const mensagemErro = input.nextElementSibling;
            const valido = validarCampo(input, padroes[campo], mensagemErro, mensagensErro[campo]);
            
            if (!valido) {
                formularioValido = false;
            }
        });
        
        if (!formularioValido) {
            e.preventDefault();
            alert('Por favor, corrija os erros no formulário antes de enviar.');
        } else {
            alert('Formulário enviado com sucesso!');
            // Aqui você pode adicionar o código para enviar o formulário
        }
    });
    
    // Função para validar um campo
    function validarCampo(input, regex, elementoErro, mensagemErro) {
        const valor = input.value.trim();
        
        if (valor === '') {
            if (input.required) {
                elementoErro.textContent = 'Este campo é obrigatório';
                input.classList.add('invalido');
                input.classList.remove('valido');
                return false;
            }
            elementoErro.textContent = '';
            input.classList.remove('invalido');
            input.classList.remove('valido');
            return true;
        }
        
        if (!regex.test(valor)) {
            elementoErro.textContent = mensagemErro;
            input.classList.add('invalido');
            input.classList.remove('valido');
            return false;
        }
        
        elementoErro.textContent = '';
        input.classList.add('valido');
        input.classList.remove('invalido');
        return true;
    }
    
    // Máscaras para os campos (opcional)
    document.getElementById('telefone').addEventListener('input', function(e) {
        let valor = e.target.value.replace(/\D/g, '');
        if (valor.length > 2) {
            valor = `(${valor.substring(0, 2)}) ${valor.substring(2)}`;
        }
        if (valor.length > 10) {
            valor = `${valor.substring(0, 10)}-${valor.substring(10)}`;
        }
        e.target.value = valor;
    });
    
    document.getElementById('cpf').addEventListener('input', function(e) {
        let valor = e.target.value.replace(/\D/g, '');
        if (valor.length > 3) {
            valor = `${valor.substring(0, 3)}.${valor.substring(3)}`;
        }
        if (valor.length > 7) {
            valor = `${valor.substring(0, 7)}.${valor.substring(7)}`;
        }
        if (valor.length > 11) {
            valor = `${valor.substring(0, 11)}-${valor.substring(11)}`;
        }
        e.target.value = valor;
    });
    
    document.getElementById('cep').addEventListener('input', function(e) {
        let valor = e.target.value.replace(/\D/g, '');
        if (valor.length > 5) {
            valor = `${valor.substring(0, 5)}-${valor.substring(5)}`;
        }
        e.target.value = valor;
    });
});