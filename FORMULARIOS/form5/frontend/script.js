document.addEventListener('DOMContentLoaded', function() {
    // Configurações
    const config = {
        apiUrl: 'http://localhost:3000/api',
        minSubmitTime: 2000, // 2 segundos para previnir bots
        enableSanitization: true
    };

    // Elementos
    const formulario = document.getElementById('meuFormulario');
    const tempoInicial = Date.now();

    // Padrões de validação
    const validationPatterns = {
        nome: /^[a-zA-ZÀ-ú\s']{5,100}$/,
        email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
        // Adicione outros campos conforme necessário
    };

    // Mensagens de erro
    const errorMessages = {
        nome: 'Nome deve ter entre 5 e 100 caracteres',
        email: 'Por favor, insira um email válido',
        // Adicione mensagens para outros campos
    };

    // Função para mostrar erros
    function showError(message, isGlobal = true) {
        if (isGlobal) {
            const errorContainer = document.getElementById('error-message') || createErrorContainer();
            errorContainer.textContent = message;
        }
        console.error(message);
    }

    function createErrorContainer() {
        const container = document.createElement('div');
        container.id = 'error-message';
        container.className = 'global-error';
        formulario.prepend(container);
        return container;
    }

    // Função para validar campo individual
    function validateField(input, pattern, errorMessage) {
        const value = input.value.trim();
        const isValid = pattern.test(value);
        
        input.classList.toggle('invalid', !isValid);
        input.classList.toggle('valid', isValid);
        
        const errorElement = input.nextElementSibling;
        if (errorElement && errorElement.classList.contains('field-error')) {
            errorElement.textContent = isValid ? '' : errorMessage;
        }
        
        return isValid;
    }

    // Função para sanitizar inputs
    function sanitizeInput(input) {
        return input.replace(/</g, '&lt;').replace(/>/g, '&gt;');
    }

    // Obter token CSRF
    async function getCSRFToken() {
        try {
            const response = await fetch(`${config.apiUrl}/csrf-token`, {
                credentials: 'include'
            });

            if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
            
            const data = await response.json();
            if (!data.csrfToken) throw new Error('Token CSRF não recebido');
            
            return data.csrfToken;
        } catch (error) {
            showError('Falha na verificação de segurança. Recarregue a página.');
            console.error('Erro ao obter CSRF token:', error);
            return null;
        }
    }

    // Enviar formulário
    async function submitForm(formData) {
        // Verificar tempo mínimo
        if (Date.now() - tempoInicial < config.minSubmitTime) {
            showError('Por favor, preencha o formulário com cuidado.');
            return false;
        }

        // Validar todos os campos
        let isValid = true;
        Object.entries(validationPatterns).forEach(([field, pattern]) => {
            const input = document.getElementById(field);
            if (input) {
                isValid = validateField(input, pattern, errorMessages[field]) && isValid;
            }
        });

        if (!isValid) {
            showError('Por favor, corrija os erros destacados.');
            return false;
        }

        // Sanitizar dados
        const sanitizedData = {};
        Object.keys(validationPatterns).forEach(field => {
            const input = document.getElementById(field);
            if (input) {
                sanitizedData[field] = config.enableSanitization ? 
                    sanitizeInput(input.value.trim()) : 
                    input.value.trim();
            }
        });

        // Obter token CSRF
        const csrfToken = await getCSRFToken();
        if (!csrfToken) return false;

        // Enviar para o servidor
        try {
            const response = await fetch(`${config.apiUrl}/form/submit`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'CSRF-Token': csrfToken
                },
                body: JSON.stringify(sanitizedData),
                credentials: 'include'
            });

            const result = await response.json();

            if (!response.ok) {
                const serverError = result.errors?.map(e => e.msg).join('\n') || 
                                  result.message || 
                                  'Erro desconhecido no servidor';
                throw new Error(serverError);
            }

            // Sucesso
            showSuccess('Formulário enviado com sucesso!');
            formulario.reset();
            
            // Limpar estados de validação
            Object.keys(validationPatterns).forEach(field => {
                const input = document.getElementById(field);
                if (input) {
                    input.classList.remove('valid', 'invalid');
                    const errorElement = input.nextElementSibling;
                    if (errorElement && errorElement.classList.contains('field-error')) {
                        errorElement.textContent = '';
                    }
                }
            });

            return true;
        } catch (error) {
            showError(error.message);
            console.error('Erro ao enviar formulário:', error);
            return false;
        }
    }

    // Mostrar mensagem de sucesso
    function showSuccess(message) {
        const successContainer = document.getElementById('success-message') || createSuccessContainer();
        successContainer.textContent = message;
        setTimeout(() => successContainer.textContent = '', 5000);
    }

    function createSuccessContainer() {
        const container = document.createElement('div');
        container.id = 'success-message';
        container.className = 'global-success';
        formulario.prepend(container);
        return container;
    }

    // Event Listeners
    formulario.addEventListener('submit', async function(e) {
        e.preventDefault();
        await submitForm(new FormData(formulario));
    });

    // Validação em tempo real
    Object.entries(validationPatterns).forEach(([field, pattern]) => {
        const input = document.getElementById(field);
        if (input) {
            input.addEventListener('blur', () => {
                validateField(input, pattern, errorMessages[field]);
            });
            
            input.addEventListener('input', () => {
                input.classList.remove('valid', 'invalid');
                const errorElement = input.nextElementSibling;
                if (errorElement && errorElement.classList.contains('field-error')) {
                    errorElement.textContent = '';
                }
            });
        }
    });
});