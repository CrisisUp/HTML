# Promova a Reciclagem - Desafio Hackathon

Um aplicativo web interativo para promover práticas de reciclagem, com gamificação, interface responsiva e modo noturno. Desenvolvido com HTML, CSS e JavaScript, utiliza bibliotecas externas (Font Awesome, Animate.css, Google Fonts) e uma imagem de fundo para estética.

## Índice
- [Descrição](#descrição)
- [Funcionalidades](#funcionalidades)
- [Estrutura do Projeto](#estrutura-do-projeto)
- [Pré-requisitos](#pré-requisitos)
- [Instalação](#instalação)
- [Como Usar](#como-usar)
- [Testes](#testes)
- [Capturas de Tela](#capturas-de-tela)
- [Estilização e UX](#estilização-e-ux)
- [Segurança](#segurança)
- [Gamificação](#gamificação)
- [Possíveis Melhorias](#possíveis-melhorias)
- [Contribuição](#contribuição)
- [Licença](#licença)
- [Autor](#autor)

## Descrição
O aplicativo permite aos usuários adicionar, concluir, editar e excluir dicas de reciclagem, com um sistema de pontuação gamificado. Inclui um botão de regras com popover, alternância entre modo noturno/diurno, e um layout com título centralizado e botões no final da linha no `header`. A interface é acessível, responsiva e segura, com animações e mensagens de feedback.

## Funcionalidades
- **Gerenciamento de Tarefas**:
  - Adicionar dicas (máximo 50, +10 pontos).
  - Concluir/desmarcar dicas (+20/-20 pontos).
  - Editar dicas via `prompt` (+5 pontos).
  - Excluir dicas com confirmação (-5 pontos).
- **Gamificação**:
  - Sistema de pontos e níveis (50 pontos por nível).
  - Exibição de badges ao subir de nível.
  - Contador de nível, pontos e dicas concluídas no `header`.
- **Interface do Header**:
  - Título "Promova a Reciclagem" centralizado.
  - Botão de regras (`fa-info-circle`): exibe popover com regras ao passar o mouse.
  - Botão de tema (`fa-moon`/`fa-sun`): alterna modo noturno/diurno, persiste no `localStorage`.
- **Modo Noturno**:
  - Fundo escurecido com `recycling.jpg` visível (overlay `rgba(26, 26, 26, 0.8)`).
  - Ajustes de cores para contraste (texto `#e0e0e0`, botões, listas).
- **UX e Acessibilidade**:
  - Botões com ícones contrastantes (`fa-check`, `fa-undo`, `fa-edit`, `fa-trash`, `fa-plus`).
  - Mensagens de sucesso/erro com animações (`fadeIn`).
  - Ícones por material (plástico: `fa-bottle-water`, papel: `fa-newspaper`, vidro: `fa-wine-bottle`).
  - Atributos `aria-label` e `role="list"` para acessibilidade.
- **Segurança**:
  - Sanitização de entradas (`sanitizeText`) para prevenir XSS.
  - Limite de 50 tarefas.
  - Confirmação para exclusão.

## Estrutura do Projeto

├── index.html         # Arquivo principal (HTML, CSS, JS)
├── recycling.jpg      # Imagem de fundo
├── README.md          # Documentação
├── LICENSE            # Licença MIT
├── screenshots/       # Pasta para capturas de tela
│   ├── light-mode.png
│   ├── dark-mode.png
│   ├── rules-popover.png

- **index.html**: Contém HTML (estrutura), CSS (estilos) e JavaScript (lógica).
- **recycling.jpg**: Imagem de fundo do [Unsplash](https://images.unsplash.com/photo-1620121692029-d088224ddc74?q=80&w=2070&auto=format&fit=crop).
- **Dependências Externas**:
  - Font Awesome 6.4.2 (ícones).
  - Animate.css 4.1.1 (animações).
  - Google Fonts (Poppins).

## Pré-requisitos
- Navegador moderno (Chrome, Firefox, Edge, etc.).
- Conexão com a internet para dependências externas (ou arquivos locais para offline).
- VSCode (opcional, para edição).
- Imagem `recycling.jpg` no mesmo diretório do `index.html`.

## Instalação
1. Clone o repositório:
   ```bash
   git clone <URL_DO_REPOSITORIO>

Baixe a imagem de fundo do Unsplash e salve como recycling.jpg na pasta do projeto.

Para uso offline:
Baixe Font Awesome, Animate.css e Poppins.

Substitua os links CDN no <head> por caminhos locais (ex.: href="./fontawesome/css/all.min.css").

Abra index.html em um navegador.

Como Usar
Adicionar Dica:
Digite uma dica (ex.: "Separar plásticos") no campo de texto.

Clique no botão  (fa-plus) ou pressione Enter.

Veja a mensagem: "Dica adicionada! +10 pontos ".

Concluir/Desmarcar:
Clique no botão  (fa-check) para concluir (+20 pontos).

Clique no botão ↺ (fa-undo) para desmarcar (-20 pontos).

Editar:
Clique no botão  (fa-edit): edite via prompt (+5 pontos).

Excluir:
Clique no botão  (fa-trash): confirme no alerta (-5 pontos).

Regras:
Passe o mouse sobre o botão  (fa-info-circle) no header para ver as regras.

Modo Noturno:
Clique no botão  (fa-moon) para ativar o modo noturno.

Clique no botão  (fa-sun) para voltar ao modo diurno.

Gamificação:
Veja o contador no header: "Nível X | Y pontos | Z/W dicas concluídas".

A cada 50 pontos, suba de nível e veja uma badge (ex.: "Nível 2! ").

Testes
Funcionais:
Adicione 50 tarefas: deve exibir "Limite de 50 dicas atingido!".

Insira <script>alert('teste')</script>: aparece como texto.

Conclua 3 tarefas (60 pontos): sobe para Nível 2, exibe badge.

Exclua tarefa: pede confirmação, reduz 5 pontos.

Edite tarefa vazia: ignora edição.

Header:
Título "Promova a Reciclagem" centralizado.

Botões / à direita, lado a lado.

Hover no botão : popover com regras (uma por linha).

Clique no botão : alterna modo noturno, recycling.jpg visível com overlay.

Visuais:
Botões com ícones brancos em gradientes (verde, azul, vermelho).

Modo noturno: fundo escurecido, texto claro, imagem visível.

Responsividade: teste em 320px a 1200px (DevTools).

Acessibilidade:
Use leitor de tela (NVDA) para verificar aria-label.

Confirme role="list" na <ul>.

Capturas de Tela
Modo Diurno:
Modo Diurno

Modo Noturno:
Modo Noturno

Popover de Regras:
Popover de Regras

Nota: As capturas devem ser adicionadas na pasta screenshots/. Tire prints da interface e nomeie como indicado.

Estilização e UX
Cores:
Modo diurno: Fundo recycling.jpg, main branco translúcido (rgba(255, 255, 255, 0.9)), botões com gradientes verdes (#2e7d32 para #66bb6a), azuis (#1976d2 para #2196f3), roxos (#6a1b9a para #ab47bc), vermelhos (#d32f2f para #f44336).

Modo noturno: Fundo recycling.jpg com overlay rgba(26, 26, 26, 0.8), tarefas #333, concluídas #2e7d32, texto #e0e0e0.

Botões:
Tamanho uniforme (2rem para ações, fa-info-circle, fa-moon).

Ícones brancos com sombra e hover (scale(1.05), brightness(1.15)).

Agrupados em .actions com flexbox.

Animações:
Tarefas: slideIn ao carregar.

Concluídas: star (escala).

Mensagens: fadeIn.

Badges: bounceIn.

Excluir: shakeX no hover.

Responsividade:
Formulário em linha acima de 600px.

Título maior (2.2rem) em telas largas.

Segurança
Sanitização: sanitizeText converte entradas em texto puro, evitando XSS.

Limite: Máximo de 50 tarefas.

Confirmação: Alerta para exclusão.

Persistência: Dados no localStorage (tarefas, pontos, modo noturno).

Gamificação
Pontuação:
Adicionar: +10

Concluir: +20

Editar: +5

Excluir: -5

Desmarcar: -20

Mínimo: 0 pontos

Níveis: A cada 50 pontos, sobe um nível (ex.: 60 pontos = Nível 2).

Badges: Exibidos por 3 segundos ao alcançar novo nível.

Contador: "Nível X | Y pontos | Z/W dicas concluídas".

Possíveis Melhorias
Substituir prompt por modal estilizado para edição.

Adicionar clique no botão de regras para modal em dispositivos móveis.

Incluir botão "Limpar Tudo" para resetar tarefas e pontos.

Adicionar filtros por material (ex.: "Plásticos").

Efeitos de hover nos ícones (ex.: rotação).

Suporte offline com dependências locais.

Melhorar acessibilidade com title nos botões e suporte a teclado para popover.

Contribuição
Faça um fork do repositório.

Crie uma branch para sua feature (git checkout -b feature/nova-funcionalidade).

Commit suas mudanças (git commit -m "Adiciona nova funcionalidade").

Push para a branch (git push origin feature/nova-funcionalidade).

Abra um Pull Request no GitHub.

Siga as convenções de código (indentação, comentários claros).

Licença
Este projeto é licenciado sob a Licença MIT (LICENSE). Veja o arquivo LICENSE para detalhes.
Autor
Nome: [Seu Nome ou Equipe]

Contato: [seu-email@example.com (mailto:seu-email@example.com)] (opcional)

GitHub: [github.com/seu-usuario] (opcional)

Desenvolvido para o Desafio Hackathon. Recicle hoje, preserve o amanhã! 

### **Instruções para VSCode**

1. **Atualizar o README.md**:
   - Abra o VSCode na pasta do projeto.
   - Abra `README.md` (ou crie, se ainda não existir).
   - Copie e cole o conteúdo acima, substituindo o atual.
   - Personalize:
     - **Autor**: Adicione seu nome, e-mail ou GitHub.
     - **URL do Repositório**: Substitua `<URL_DO_REPOSITORIO>` pelo link do GitHub, se aplicável.
2. **Adicionar Capturas de Tela**:
   - Crie a pasta `screenshots` na raiz do projeto.
   - Tire prints da interface:
     - Modo diurno: página principal.
     - Modo noturno: mesma página.
     - Popover de regras: hover no botão ℹ️.
   - Salve como `light-mode.png`, `dark-mode.png`, `rules-popover.png` na pasta `screenshots`.
   - Confirme que os caminhos no `README.md` (`screenshots/light-mode.png`, etc.) estão corretos.
3. **Criar Arquivo LICENSE**:
   - No VSCode, crie um novo arquivo chamado `LICENSE`.
   - Adicione o texto da Licença MIT:
     ```text
     MIT License

     Copyright (c) 2025 [Seu Nome ou Equipe]

     Permission is hereby granted, free of charge, to any person obtaining a copy
     of this software and associated documentation files (the "Software"), to deal
     in the Software without restriction, including without limitation the rights
     to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
     copies of the Software, and to permit persons to whom the Software is
     furnished to do so, subject to the following conditions:

     The above copyright notice and this permission notice shall be included in all
     copies or substantial portions of the Software.

     THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
     IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
     FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
     AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
     LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
     OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
     SOFTWARE.
     ```
   - Salve e confirme que o link `[Licença MIT](LICENSE)` no `README.md` aponta para ele.
4. **Visualizar no VSCode**:
   - Instale a extensão "Markdown Preview Enhanced" (se ainda não tiver).
   - Clique com o botão direito em `README.md` e selecione "Markdown: Open Preview" (`Ctrl+Shift+V`).
   - Verifique links, imagens (se adicionadas) e formatação.
5. **Commit e GitHub (Opcional)**:
   - Inicialize um repositório Git no VSCode:
     - Abra o terminal (`Ctrl+``).
     - Execute:
       ```bash
       git init
       git add .
       git commit -m "Inicializa projeto com index.html, recycling.jpg e README.md"
       ```
   - Crie um repositório no GitHub.
   - Vincule e push:
     ```bash
     git remote add origin <URL_DO_REPOSITORIO>
     git push -u origin main
     ```
   - Acesse o GitHub: o `README.md` será renderizado na página inicial.

### **Adicionando Capturas de Tela**
- **Ferramenta**: Use a ferramenta de captura do sistema (ex.: Snipping Tool no Windows, `Cmd+Shift+4` no macOS).
- **Passos**:
  - Abra `index.html` no navegador.
  - Capture:
    - Modo diurno (página completa).
    - Modo noturno (clique no botão 🌙).
    - Popover de regras (hover no botão ℹ️).
  - Salve na pasta `screenshots` com os nomes indicados.
- **Teste no GitHub**: Após o push, confirme que as imagens aparecem no `README.md`.

### **Outras Sugestões**
- **Comentários no Código**: Se quiser documentação inline, posso adicionar comentários detalhados no `index.html` (ex.: `<!-- Função para alternar modo noturno -->` no JavaScript).
- **Formato Alternativo**: Posso gerar documentação em outro formato (ex.: HTML, PDF) ou criar um arquivo separado (ex.: `docs.md`).
- **Especificações**: Se precisar de um diagrama (ex.: UML da lógica) ou análise técnica (ex.: performance), avise.

### **Próximos Passos**
Por favor, confirme:
1. Se o `README.md` atualizado atende suas necessidades.
2. Se deseja adicionar algo específico (ex.: mais seções, exemplos de código, changelog).
3. Se precisa de ajuda com GitHub, capturas de tela, ou outro tipo de documentação (ex.: JSDoc no JavaScript).

Se tudo estiver ok, posso finalizar ou implementar qualquer melhoria solicitada!

