// ==============================================
// Controle do Menu Mobile
// ==============================================
const mobileMenuButton = document.getElementById('mobile-menu-button');
const mobileMenu = document.getElementById('mobile-menu');
let isMenuOpen = false;

mobileMenuButton.addEventListener('click', () => {
    isMenuOpen = !isMenuOpen;
    mobileMenuButton.setAttribute('aria-expanded', isMenuOpen);
    if (isMenuOpen) {
        mobileMenu.classList.remove('nav-menu-hidden');
        mobileMenuButton.innerHTML = `
                    <svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                `;
    } else {
        mobileMenu.classList.add('nav-menu-hidden');
        mobileMenuButton.innerHTML = `
                    <svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
                    </svg>
                `;
    }
});

// Fechar menu ao clicar em um item ou fora
document.addEventListener('click', (e) => {
    if (isMenuOpen && !mobileMenu.contains(e.target)) {
        if (e.target !== mobileMenuButton && !mobileMenuButton.contains(e.target)) {
            mobileMenu.classList.add('nav-menu-hidden');
            mobileMenuButton.innerHTML = `
                        <svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
                        </svg>
                    `;
            mobileMenuButton.setAttribute('aria-expanded', false);
            isMenuOpen = false;
        }
    }
});

// ==============================================
// Módulo: CarrosselState (Gerenciamento de Estado)
// ==============================================
class CarrosselState {
    constructor(slides, options = {}) {
        this.slides = slides;
        this.currentIndex = 0;
        this.interval = options.initialInterval || 5000;
        this.isPlaying = options.autoPlay !== false;
        this.observers = [];
    }

    subscribe(observer) {
        this.observers.push(observer);
    }

    notify() {
        this.observers.forEach(observer => observer.update(this));
    }

    setCurrentIndex(index) {
        this.currentIndex = index;
        this.notify();
    }

    setInterval(interval) {
        this.interval = interval;
        this.notify();
    }

    togglePlay() {
        this.isPlaying = !this.isPlaying;
        this.notify();
    }
}

// ==============================================
// Módulo: ComponentFactory (Factory Pattern)
// ==============================================
class ComponentFactory {
    static createSlide(slideData, index, isActive) {
        return {
            render: () => `
                        <div class="carrossel-slide ${isActive ? 'active' : 'hidden'} absolute inset-0 w-full h-full" 
                             aria-hidden="${!isActive}" 
                             aria-current="${isActive}" 
                             data-index="${index}"
                             role="group"
                             aria-roledescription="slide"
                             aria-label="${index + 1} de ${slideData.totalSlides}">
                            <img src="${slideData.imageSrc}" 
                                 alt="${slideData.altText}" 
                                 class="w-full h-full object-cover aspect-[16/9]"
                                 loading="lazy"
                                 width="800"
                                 height="500"
                                 onerror="this.src='data:image/svg+xml;charset=UTF-8,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 width=%22800%22 height=%22500%22 viewBox=%220 0 800 500%22%3E%3Crect fill=%22%23e5e7eb%22 width=%22800%22 height=%22500%22/%3E%3Ctext fill=%22%239ca3af%22 font-family=%22sans-serif%22 font-size=%2240%22 dy=%22.35em%22 text-anchor=%22middle%22 x=%22400%22 y=%22250%22%3EImagem não carregada%3C/text%3E%3C/svg%3E'">
                            <div class="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black/70 to-transparent">
                                <h2 class="text-white text-2xl font-bold">${slideData.title}</h2>
                                <p class="text-white/90">${slideData.description}</p>
                            </div>
                        </div>
                    `
        };
    }

    static createControls() {
        return {
            render: () => `
                        <button class="carrossel-prev absolute left-4 top-1/2 -translate-y-1/2 bg-white/30 hover:bg-white/50 text-white rounded-full p-2 backdrop-blur-sm" aria-label="Slide anterior">
                            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
                            </svg>
                        </button>
                        <button class="carrossel-next absolute right-4 top-1/2 -translate-y-1/2 bg-white/30 hover:bg-white/50 text-white rounded-full p-2 backdrop-blur-sm" aria-label="Próximo slide">
                            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
                            </svg>
                        </button>
                    `
        };
    }

    static createIndicators(count, activeIndex) {
        return {
            render: () => {
                let indicators = '';
                for (let i = 0; i < count; i++) {
                    indicators += `
                                <button class="carrossel-indicator w-3 h-3 rounded-full ${i === activeIndex ? 'bg-white' : 'bg-white/50'} hover:bg-white/80 transition" 
                                        data-index="${i}" 
                                        aria-label="Ir para slide ${i + 1}"
                                        ${i === activeIndex ? 'aria-current="true"' : ''}>
                                </button>
                            `;
                }
                return `
                            <div class="absolute bottom-4 left-0 right-0 flex justify-center gap-2">
                                ${indicators}
                            </div>
                        `;
            }
        };
    }

    static createTimerControls(initialTime) {
        return {
            render: () => `
                        <div class="bg-white p-4 rounded-xl shadow-lg mt-4">
                            <div class="flex items-center justify-between">
                                <label class="text-gray-700 font-medium">Tempo por slide: <span class="carrossel-time-display">${initialTime / 1000}</span>s</label>
                                <input type="range" min="2" max="10" value="${initialTime / 1000}" 
                                       class="carrossel-time-range w-32 h-2 bg-blue-100 rounded-lg appearance-none cursor-pointer"
                                       aria-label="Ajustar tempo de exibição dos slides">
                            </div>
                        </div>
                    `
        };
    }
}

// ==============================================
// Módulo: CarrosselView (Observer)
// ==============================================
class CarrosselView {
    constructor(containerId, state) {
        this.container = document.getElementById(containerId);
        this.state = state;
        this.autoPlayInterval = null;
        this.render();
        this.setupEventListeners();
        this.state.subscribe(this);
    }

    update(state) {
        this.updateSlides(state);
        this.updateIndicators(state);
        this.updateAutoPlay(state);
    }

    render() {
        // Adiciona totalSlides a cada slideData
        const slidesWithTotal = this.state.slides.map(slide => ({
            ...slide,
            totalSlides: this.state.slides.length
        }));

        const slidesHTML = slidesWithTotal.map((slide, index) =>
            ComponentFactory.createSlide(slide, index, index === this.state.currentIndex).render()
        ).join('');

        const controls = ComponentFactory.createControls().render();
        const indicators = ComponentFactory.createIndicators(
            this.state.slides.length,
            this.state.currentIndex
        ).render();
        const timerControls = ComponentFactory.createTimerControls(
            this.state.interval
        ).render();

        this.container.innerHTML = `
                    <div class="carrossel-container relative overflow-hidden rounded-xl shadow-lg bg-white mb-6" 
                         role="region" 
                         aria-label="Carrossel de imagens"
                         aria-roledescription="carrossel">
                        <div class="carrossel-slides relative h-64 md:h-96">
                            ${slidesHTML}
                        </div>
                        ${controls}
                        ${indicators}
                    </div>
                    ${timerControls}
                `;

        // Pré-carrega as próximas imagens
        this.preloadImages();
    }

    preloadImages() {
        const nextIndex = (this.state.currentIndex + 1) % this.state.slides.length;
        const img = new Image();
        img.src = this.state.slides[nextIndex].imageSrc;
    }

    updateSlides(state) {
        document.querySelectorAll('.carrossel-slide').forEach((slide, index) => {
            const isActive = index === state.currentIndex;
            slide.classList.toggle('active', isActive);
            slide.classList.toggle('hidden', !isActive);
            slide.setAttribute('aria-hidden', !isActive);
            slide.setAttribute('aria-current', isActive ? 'true' : 'false');

            // Atualiza o rótulo do slide
            slide.setAttribute('aria-label', `${index + 1} de ${state.slides.length}`);
        });

        // Pré-carrega a próxima imagem quando o slide muda
        this.preloadImages();
    }

    updateIndicators(state) {
        document.querySelectorAll('.carrossel-indicator').forEach((indicator, index) => {
            const isActive = index === state.currentIndex;
            indicator.classList.toggle('bg-white', isActive);
            indicator.classList.toggle('bg-white/50', !isActive);
            indicator.setAttribute('aria-current', isActive ? 'true' : 'false');
        });
    }

    updateAutoPlay(state) {
        clearInterval(this.autoPlayInterval);
        if (state.isPlaying) {
            this.autoPlayInterval = setInterval(() => {
                const nextIndex = (this.state.currentIndex + 1) % this.state.slides.length;
                this.state.setCurrentIndex(nextIndex);
            }, state.interval);
        }
    }

    setupEventListeners() {
        // Navegação
        this.container.addEventListener('click', (e) => {
            if (e.target.closest('.carrossel-next')) {
                const nextIndex = (this.state.currentIndex + 1) % this.state.slides.length;
                this.state.setCurrentIndex(nextIndex);
            } else if (e.target.closest('.carrossel-prev')) {
                const prevIndex = (this.state.currentIndex - 1 + this.state.slides.length) % this.state.slides.length;
                this.state.setCurrentIndex(prevIndex);
            } else if (e.target.closest('.carrossel-indicator')) {
                const index = parseInt(e.target.closest('.carrossel-indicator').getAttribute('data-index'));
                this.state.setCurrentIndex(index);
            }
        });

        // Controle de tempo
        this.container.addEventListener('input', (e) => {
            if (e.target.classList.contains('carrossel-time-range')) {
                const newTime = parseInt(e.target.value) * 1000;
                this.state.setInterval(newTime);
                document.querySelector('.carrossel-time-display').textContent = newTime / 1000;
            }
        });

        // Teclado e mouse
        document.addEventListener('keydown', (e) => {
            if (e.key === 'ArrowRight') {
                const nextIndex = (this.state.currentIndex + 1) % this.state.slides.length;
                this.state.setCurrentIndex(nextIndex);
            } else if (e.key === 'ArrowLeft') {
                const prevIndex = (this.state.currentIndex - 1 + this.state.slides.length) % this.state.slides.length;
                this.state.setCurrentIndex(prevIndex);
            } else if (e.key === ' ') {
                e.preventDefault(); // Evita scroll acidental
                this.state.togglePlay();
            }
        });

        this.container.querySelector('.carrossel-container')?.addEventListener('mouseenter', () => {
            if (this.state.isPlaying) {
                this.state.togglePlay();
            }
        });

        this.container.querySelector('.carrossel-container')?.addEventListener('mouseleave', () => {
            if (!this.state.isPlaying) {
                this.state.togglePlay();
            }
        });

        // Pausar quando a janela perde o foco
        window.addEventListener('blur', () => {
            if (this.state.isPlaying) {
                this.state.togglePlay();
            }
        });

        window.addEventListener('focus', () => {
            if (!this.state.isPlaying) {
                this.state.togglePlay();
            }
        });
    }
}

// ==============================================
// Inicialização do Carrossel
// ==============================================
// Usando imagens placeholder genéricas que existem
const slidesData = [
    {
        imageSrc: '../james-unsplash.jpg',
        altText: 'Paisagem natural com montanhas e rio',
        title: 'Belezas Naturais',
        description: 'Explore paisagens deslumbrantes ao redor do mundo'
    },
    {
        imageSrc: '../jimmy-unsplash.jpg',
        altText: 'Vista aérea de uma cidade movimentada',
        title: 'Vida Urbana',
        description: 'Descubra a energia das grandes cidades'
    },
    {
        imageSrc: '../karl-unsplash.jpg',
        altText: 'Tecnologia moderna e dispositivos eletrônicos',
        title: 'Inovação Tecnológica',
        description: 'As últimas tendências em tecnologia'
    }
];

const carrosselState = new CarrosselState(slidesData, {
    autoPlay: true,
    initialInterval: 5000
});

const carrosselView = new CarrosselView('meu-carrossel', carrosselState);