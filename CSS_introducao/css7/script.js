document.addEventListener('DOMContentLoaded', () => {
    // Constantes de configuração
    const CONFIG = {
        astronomicalUnit: 100,         // 1 UA em pixels
        earthOrbitPeriod: 30,         // Segundos para uma órbita terrestre (velocidade 1x)
        scaleFactor: 0.8,             // Fator de escala para caber na tela
        minSpeed: 0.03125,            // 1/32x
        maxSpeed: 128,                // 128x
        minZoom: 0.1,                 // 0.1x
        maxZoom: 15,                  // 15x
        basePlanetSize: 12,           // Tamanho base para Terra (px)
        baseMoonSize: 3,              // Tamanho base para Lua (px)
        timeStep: 1 / 60,             // Passo de tempo para 60 FPS
        notificationDuration: 2500     // Duração da notificação (ms)
    };

    // Dados astronômicos precisos dos planetas
    const PLANET_DATA = {
        mercury: {
            name: "Mercúrio",
            semiMajorAxis: 0.387,
            eccentricity: 0.206,
            inclination: 7.0,
            orbitalPeriod: 0.2408,    // anos
            rotationPeriod: 58.6,     // dias
            diameter: 4879,           // km
            color: '#A9A9A9',
            texture: 'https://i.imgur.com/Z7UkXqk.jpg'
        },
        venus: {
            name: "Vênus",
            semiMajorAxis: 0.723,
            eccentricity: 0.007,
            inclination: 3.4,
            orbitalPeriod: 0.6152,
            rotationPeriod: 243,
            diameter: 12104,
            color: '#E6C229',
            texture: 'https://i.imgur.com/7VJbTqM.jpg'
        },
        earth: {
            name: "Terra",
            semiMajorAxis: 1.0,
            eccentricity: 0.017,
            inclination: 0.0,
            orbitalPeriod: 1.0,
            rotationPeriod: 1.0,
            diameter: 12742,
            color: '#1DA1F2',
            texture: 'https://i.imgur.com/6ZJ4Q9X.jpg',
            moon: {
                name: "Lua",
                semiMajorAxis: 0.00257,   // ~384,400 km em UA
                eccentricity: 0.0549,
                orbitalPeriod: 0.0748,    // anos (27.3 dias)
                diameter: 3474,
                color: '#DDD'
            }
        },
        mars: {
            name: "Marte",
            semiMajorAxis: 1.524,
            eccentricity: 0.093,
            inclination: 1.9,
            orbitalPeriod: 1.8808,
            rotationPeriod: 1.03,
            diameter: 6779,
            color: '#E05A1A',
            texture: 'https://i.imgur.com/3YK5Y4w.jpg'
        },
        jupiter: {
            name: "Júpiter",
            semiMajorAxis: 5.203,
            eccentricity: 0.048,
            inclination: 1.3,
            orbitalPeriod: 11.862,
            rotationPeriod: 0.41,
            diameter: 139820,
            color: '#E3B04B',
            texture: 'https://i.imgur.com/3QZ2Z2Z.jpg'
        },
        saturn: {
            name: "Saturno",
            semiMajorAxis: 9.537,
            eccentricity: 0.056,
            inclination: 2.5,
            orbitalPeriod: 29.457,
            rotationPeriod: 0.45,
            diameter: 116460,
            color: '#F1D592',
            texture: 'https://i.imgur.com/4QZ2Z2Z.jpg'
        },
        uranus: {
            name: "Urano",
            semiMajorAxis: 19.191,
            eccentricity: 0.046,
            inclination: 0.8,
            orbitalPeriod: 84.017,
            rotationPeriod: 0.72,
            diameter: 50724,
            color: '#D1E7E7',
            texture: 'https://i.imgur.com/5QZ2Z2Z.jpg'
        },
        neptune: {
            name: "Netuno",
            semiMajorAxis: 30.069,
            eccentricity: 0.010,
            inclination: 1.8,
            orbitalPeriod: 164.791,
            rotationPeriod: 0.67,
            diameter: 49244,
            color: '#5B5BDF',
            texture: 'https://i.imgur.com/6QZ2Z2Z.jpg'
        }
    };

    // Estado da simulação
    const state = {
        isPaused: false,
        speedFactor: 1,
        zoomLevel: 1,
        animationId: null,
        simulationTime: 0,
        lastTimestamp: 0
    };

    // Cache de elementos DOM
    const dom = {
        solarSystem: document.querySelector('.solar-system'),
        sun: document.querySelector('.sun'),
        planets: document.querySelectorAll('.planet'),
        pauseBtn: document.getElementById('pause-btn'),
        speedUpBtn: document.getElementById('speed-up'),
        slowDownBtn: document.getElementById('slow-down'),
        speedDisplay: document.getElementById('speed-display'),
        zoomInBtn: document.getElementById('zoom-in'),
        zoomOutBtn: document.getElementById('zoom-out'),
        resetViewBtn: document.getElementById('reset-view'),
        planetInfo: document.getElementById('planet-info'),
        notification: document.getElementById('notification')
    };

    // Inicialização
    init();

    function init() {
        setupOrbits();
        setupEventListeners();
        setupPlanetTextures();
        startAnimation();
    }

    function setupOrbits() {
        dom.planets.forEach(planet => {
            const planetName = planet.classList[1];
            const data = PLANET_DATA[planetName];

            // Tamanho proporcional baseado no diâmetro real
            const size = calculatePlanetSize(planetName);
            planet.style.width = `${size}px`;
            planet.style.height = `${size}px`;

            // Configurar órbita elíptica
            const orbitPath = planet.querySelector('.orbit-path');
            const semiMajorAxis = data.semiMajorAxis * CONFIG.astronomicalUnit * CONFIG.scaleFactor;
            const semiMinorAxis = semiMajorAxis * Math.sqrt(1 - Math.pow(data.eccentricity, 2));

            orbitPath.style.width = `${semiMajorAxis * 2}px`;
            orbitPath.style.height = `${semiMinorAxis * 2}px`;
            orbitPath.style.left = `-${semiMajorAxis}px`;
            orbitPath.style.top = `-${semiMinorAxis}px`;

            // Configurar rotação do planeta
            const planetSurface = planet.querySelector('.planet-surface');
            setRotationAnimation(planetSurface, data.rotationPeriod);

            // Configurar lua da Terra
            if (planetName === 'earth') {
                const moon = planet.querySelector('.moon');
                const moonSize = calculateMoonSize();
                moon.style.width = `${moonSize}px`;
                moon.style.height = `${moonSize}px`;
            }
        });
    }

    function setupEventListeners() {
        // Controles
        dom.pauseBtn.addEventListener('click', togglePause);
        dom.speedUpBtn.addEventListener('click', () => adjustSpeed(2));
        dom.slowDownBtn.addEventListener('click', () => adjustSpeed(0.5));
        dom.zoomInBtn.addEventListener('click', () => adjustZoom(1.2));
        dom.zoomOutBtn.addEventListener('click', () => adjustZoom(0.8));
        dom.resetViewBtn.addEventListener('click', resetView);

        // Informações dos planetas
        dom.sun.addEventListener('mouseenter', () => showPlanetInfo('sun'));
        dom.sun.addEventListener('mouseleave', hidePlanetInfo);

        dom.planets.forEach(planet => {
            planet.addEventListener('mouseenter', () => showPlanetInfo(planet.classList[1]));
            planet.addEventListener('mouseleave', hidePlanetInfo);
        });

        // Atalhos de teclado
        document.addEventListener('keydown', handleKeyPress);
    }

    function setupPlanetTextures() {
        document.querySelectorAll('.planet-surface').forEach(surface => {
            surface.addEventListener('error', function () {
                const planet = this.parentElement;
                const planetName = planet.classList[1];
                const color = PLANET_DATA[planetName].color;
                this.style.background = `radial-gradient(circle at 30% 30%, ${color}, ${darkenColor(color, 40)})`;
            });
        });
    }

    function startAnimation() {
        state.lastTimestamp = performance.now();
        state.animationId = requestAnimationFrame(animate);
    }

    function animate(timestamp) {
        // Calcular delta time para animação suave independente de FPS
        const deltaTime = (timestamp - state.lastTimestamp) / 1000;
        state.lastTimestamp = timestamp;

        if (!state.isPaused) {
            state.simulationTime += deltaTime * state.speedFactor;
            updatePlanetPositions();
        }

        state.animationId = requestAnimationFrame(animate);
    }

    function updatePlanetPositions() {
        const centerX = window.innerWidth / 2;
        const centerY = window.innerHeight / 2;

        dom.planets.forEach(planet => {
            const planetName = planet.classList[1];
            const data = PLANET_DATA[planetName];

            // Calcular posição na órbita elíptica
            const semiMajorAxis = data.semiMajorAxis * CONFIG.astronomicalUnit * CONFIG.scaleFactor;
            const meanAnomaly = (2 * Math.PI * state.simulationTime) / (data.orbitalPeriod * CONFIG.earthOrbitPeriod);
            const eccentricAnomaly = solveKeplersEquation(meanAnomaly, data.eccentricity);

            // Coordenadas elípticas
            const x = semiMajorAxis * (Math.cos(eccentricAnomaly) - data.eccentricity);
            const y = semiMajorAxis * Math.sqrt(1 - Math.pow(data.eccentricity, 2)) * Math.sin(eccentricAnomaly);

            // Aplicar inclinação orbital
            const inclinedY = y * Math.cos(data.inclination * Math.PI / 180);

            // Posicionar planeta relativo ao Sol
            planet.style.left = `${centerX + x}px`;
            planet.style.top = `${centerY + inclinedY}px`;

            // Rotação do planeta
            planet.style.transform = `rotate(${state.simulationTime * 0.1}deg)`;

            // Mover a lua da Terra
            if (planetName === 'earth') {
                updateMoonPosition(planet, data.moon, centerX + x, centerY + inclinedY);
            }
        });
    }

    function updateMoonPosition(planet, moonData, planetX, planetY) {
        const moon = planet.querySelector('.moon');
        const moonMeanAnomaly = (2 * Math.PI * state.simulationTime) / (moonData.orbitalPeriod * CONFIG.earthOrbitPeriod);
        const moonEccentricAnomaly = solveKeplersEquation(moonMeanAnomaly, moonData.eccentricity);

        const moonX = moonData.semiMajorAxis * CONFIG.astronomicalUnit * CONFIG.scaleFactor *
            (Math.cos(moonEccentricAnomaly) - moonData.eccentricity);
        const moonY = moonData.semiMajorAxis * CONFIG.astronomicalUnit * CONFIG.scaleFactor *
            Math.sqrt(1 - Math.pow(moonData.eccentricity, 2)) *
            Math.sin(moonEccentricAnomaly);

        moon.style.left = `${moonX}px`;
        moon.style.top = `${moonY}px`;
    }

    function solveKeplersEquation(meanAnomaly, eccentricity, precision = 1e-10) {
        // Método de Newton-Raphson para resolver a equação de Kepler
        let eccentricAnomaly = meanAnomaly;
        let delta;

        do {
            delta = eccentricAnomaly - eccentricity * Math.sin(eccentricAnomaly) - meanAnomaly;
            eccentricAnomaly -= delta / (1 - eccentricity * Math.cos(eccentricAnomaly));
        } while (Math.abs(delta) > precision);

        return eccentricAnomaly;
    }

    function calculatePlanetSize(planetName) {
        // Tamanho proporcional baseado no diâmetro real (escala logarítmica)
        const baseDiameter = PLANET_DATA.earth.diameter;
        const planetDiameter = PLANET_DATA[planetName].diameter;
        const scaleFactor = Math.log10(planetDiameter / baseDiameter + 1) + 1;

        return CONFIG.basePlanetSize * scaleFactor * Math.min(state.zoomLevel, 3);
    }

    function calculateMoonSize() {
        return CONFIG.baseMoonSize * Math.min(state.zoomLevel, 3);
    }

    function setRotationAnimation(element, rotationPeriod) {
        const duration = (rotationPeriod * 5) / state.speedFactor;
        element.style.animation = `rotate ${duration}s linear infinite`;
    }

    function togglePause() {
        state.isPaused = !state.isPaused;
        dom.pauseBtn.textContent = state.isPaused ? '▶' : '⏸';

        if (state.isPaused) {
            cancelAnimationFrame(state.animationId);
            showNotification('Simulação pausada');
        } else {
            state.lastTimestamp = performance.now();
            state.animationId = requestAnimationFrame(animate);
            showNotification('Simulação retomada');
        }

        // Pausar/retomar rotações
        document.querySelectorAll('.planet-surface').forEach(surface => {
            surface.style.animationPlayState = state.isPaused ? 'paused' : 'running';
        });
    }

    function adjustSpeed(factor) {
        state.speedFactor *= factor;
        state.speedFactor = Math.max(CONFIG.minSpeed, Math.min(state.speedFactor, CONFIG.maxSpeed));

        updateSpeedDisplay();
        adjustRotationSpeeds(factor);
        showNotification(`Velocidade: ${formatSpeed(state.speedFactor)}`);
    }

    function updateSpeedDisplay() {
        dom.speedDisplay.textContent = `${formatSpeed(state.speedFactor)}`;
    }

    function formatSpeed(speed) {
        if (speed >= 1) {
            return `${speed.toFixed(3)}x`;
        } else {
            return `1/${Math.round(1 / speed)}x`;
        }
    }

    function adjustRotationSpeeds(factor) {
        document.querySelectorAll('.planet-surface').forEach(surface => {
            const currentDuration = parseFloat(surface.style.animationDuration || '10s');
            surface.style.animationDuration = `${currentDuration / factor}s`;
        });
    }

    function adjustZoom(factor) {
        state.zoomLevel *= factor;
        state.zoomLevel = Math.max(CONFIG.minZoom, Math.min(state.zoomLevel, CONFIG.maxZoom));

        document.documentElement.style.setProperty('--zoom-level', state.zoomLevel);
        updatePlanetSizes();
        showNotification(`Zoom: ${state.zoomLevel.toFixed(1)}x`);
    }

    function updatePlanetSizes() {
        dom.planets.forEach(planet => {
            const planetName = planet.classList[1];
            const size = calculatePlanetSize(planetName);
            planet.style.width = `${size}px`;
            planet.style.height = `${size}px`;

            if (planetName === 'earth') {
                const moonSize = calculateMoonSize();
                planet.querySelector('.moon').style.width = `${moonSize}px`;
                planet.querySelector('.moon').style.height = `${moonSize}px`;
            }
        });
    }

    function resetView() {
        state.zoomLevel = 1;
        document.documentElement.style.setProperty('--zoom-level', state.zoomLevel);
        updatePlanetSizes();
        showNotification('Visualização resetada');
    }

    function showPlanetInfo(planetName) {
        let info;

        if (planetName === 'sun') {
            info = dom.sun.getAttribute('data-info');
        } else {
            const data = PLANET_DATA[planetName];
            info = `${data.name}\nDiâmetro: ${data.diameter.toLocaleString()} km\n` +
                `Distância média do Sol: ${(data.semiMajorAxis * 149.6).toLocaleString()} milhões km\n` +
                `Período orbital: ${formatOrbitalPeriod(data.orbitalPeriod)}`;

            if (planetName === 'earth') {
                const moon = data.moon;
                info += `\n\n${moon.name}\nDiâmetro: ${moon.diameter.toLocaleString()} km\n` +
                    `Distância da Terra: ${(moon.semiMajorAxis * 149600000).toLocaleString()} km`;
            }
        }

        dom.planetInfo.textContent = info;
    }

    function formatOrbitalPeriod(period) {
        if (period < 1) {
            return `${Math.round(period * 365)} dias`;
        } else if (period < 20) {
            return `${period.toFixed(1)} anos`;
        } else {
            return `${Math.round(period)} anos`;
        }
    }

    function hidePlanetInfo() {
        dom.planetInfo.textContent = 'Passe o mouse sobre um corpo celeste';
    }

    function showNotification(message) {
        dom.notification.textContent = message;
        dom.notification.classList.add('show');

        setTimeout(() => {
            dom.notification.classList.remove('show');
        }, CONFIG.notificationDuration);
    }

    function handleKeyPress(e) {
        switch (e.key) {
            case ' ':
                togglePause();
                break;
            case 'ArrowUp':
                adjustSpeed(2);
                break;
            case 'ArrowDown':
                adjustSpeed(0.5);
                break;
            case '+':
                adjustZoom(1.2);
                break;
            case '-':
                adjustZoom(0.8);
                break;
            case '0':
                resetView();
                break;
        }
    }

    function darkenColor(color, percent) {
        // Converter hex para RGB
        const r = parseInt(color.substr(1, 2), 16);
        const g = parseInt(color.substr(3, 2), 16);
        const b = parseInt(color.substr(5, 2), 16);

        // Escurecer
        const amt = Math.round(2.55 * percent);
        const newR = Math.max(0, r - amt);
        const newG = Math.max(0, g - amt);
        const newB = Math.max(0, b - amt);

        // Converter de volta para hex
        return `#${((newR << 16) | (newG << 8) | newB).toString(16).padStart(6, '0')}`;
    }
});