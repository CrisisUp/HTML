function comprar(produto) {
  alert(`Você comprou: ${produto}`);
}

// Carrossel
const slides = document.querySelectorAll(".slide");
let indexAtual = 0;

function mostrarSlide(index) {
  slides.forEach((slide, i) => {
    slide.classList.toggle("ativo", i === index);
    slide.setAttribute("aria-hidden", i !== index);
  });
}

document.querySelector(".proximo").addEventListener("click", () => {
  indexAtual = (indexAtual + 1) % slides.length;
  mostrarSlide(indexAtual);
});

document.querySelector(".anterior").addEventListener("click", () => {
  indexAtual = (indexAtual - 1 + slides.length) % slides.length;
  mostrarSlide(indexAtual);
});

// Inicializa o primeiro slide
mostrarSlide(indexAtual);
