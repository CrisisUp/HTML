document.addEventListener("DOMContentLoaded", () => {
    const botao = document.getElementById("toggleNoticias");
    const artigos = document.querySelectorAll("#noticias article");
  
    botao.addEventListener("click", () => {
      artigos.forEach(article => {
        article.style.display = article.style.display === "none" ? "block" : "none";
      });
  
      botao.textContent =
        artigos[0].style.display === "none"
          ? "Mostrar Notícias"
          : "Ocultar Notícias";
    });
  });
  