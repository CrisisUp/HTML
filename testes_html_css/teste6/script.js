document.addEventListener("DOMContentLoaded", () => {
  const botaoNoticias = document.getElementById("toggleNoticias");
  const artigos = document.querySelectorAll("#noticias article");

  botaoNoticias.addEventListener("click", () => {
    artigos.forEach(article => {
      article.style.display = article.style.display === "none" ? "block" : "none";
    });

    botaoNoticias.textContent =
      artigos[0].style.display === "none"
        ? "Mostrar Notícias"
        : "Ocultar Notícias";
  });

  // Modo Escuro
  const botaoModoEscuro = document.getElementById("modoEscuroBtn");
  botaoModoEscuro.addEventListener("click", () => {
    document.body.classList.toggle("dark-mode");
    botaoModoEscuro.textContent = document.body.classList.contains("dark-mode")
      ? "Desativar Modo Escuro"
      : "Ativar Modo Escuro";
  });

  // Validação de Formulário
  const form = document.getElementById("formContato");
  const status = document.getElementById("mensagemStatus");

  form.addEventListener("submit", (e) => {
    e.preventDefault();

    const nome = form.nome.value.trim();
    const email = form.email.value.trim();
    const mensagem = form.mensagem.value.trim();

    if (!nome || !email || !mensagem) {
      status.textContent = "Por favor, preencha todos os campos.";
      status.style.color = "red";
    } else {
      status.textContent = "Mensagem enviada com sucesso!";
      status.style.color = "green";
      form.reset();
    }
  });

  function revelarAoScroll() {
    const elementos = document.querySelectorAll('.reveal');
    const alturaJanela = window.innerHeight;

    elementos.forEach(el => {
      const distanciaTopo = el.getBoundingClientRect().top;
      if (distanciaTopo < alturaJanela - 50) {
        el.classList.add('visible');
      } else {
        el.classList.remove('visible');
      }
    });
  }

  // Executa no scroll e no carregamento
  window.addEventListener('scroll', revelarAoScroll);
  window.addEventListener('load', revelarAoScroll);

});
