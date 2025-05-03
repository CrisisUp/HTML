function comprar(produto) {
  alert(`Você comprou: ${produto}`);
}

// Carrossel com autoplay
const slides = document.querySelectorAll(".slide");
const indicadores = document.querySelectorAll(".indicador");
let indexAtual = 0;
let intervalo;

function mostrarSlide(index) {
  slides.forEach((slide, i) => {
    slide.classList.toggle("ativo", i === index);
    slide.setAttribute("aria-hidden", i !== index);
  });
  indicadores.forEach((bolinha, i) => {
    bolinha.classList.toggle("ativo", i === index);
  });
}

function proximoSlide() {
  indexAtual = (indexAtual + 1) % slides.length;
  mostrarSlide(indexAtual);
}

function slideAnterior() {
  indexAtual = (indexAtual - 1 + slides.length) % slides.length;
  mostrarSlide(indexAtual);
}

document.querySelector(".proximo").addEventListener("click", () => {
  proximoSlide();
  reiniciarAutoPlay();
});

document.querySelector(".anterior").addEventListener("click", () => {
  slideAnterior();
  reiniciarAutoPlay();
});

function iniciarAutoPlay() {
  intervalo = setInterval(proximoSlide, 5000);
}

function reiniciarAutoPlay() {
  clearInterval(intervalo);
  iniciarAutoPlay();
}

mostrarSlide(indexAtual);
iniciarAutoPlay();
