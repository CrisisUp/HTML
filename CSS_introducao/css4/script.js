document.addEventListener('DOMContentLoaded', function() {
    // Set default checked states
    document.getElementById('ideal-orbit-size').checked = true;
    document.getElementById('one-year-per-minute').checked = true;
    document.getElementById('threedee').checked = true;

    // Orbit size controls
    document.getElementById('correct-orbit-size').addEventListener('change', function() {
        if (this.checked) {
            document.querySelectorAll('.sun-orbit').forEach(orbit => {
                const scale = getCorrectOrbitScale(orbit.classList[1]);
                orbit.style.transform = `translate(-50%, -50%) scale(${scale})`;
            });
        }
    });

    document.getElementById('ideal-orbit-size').addEventListener('change', function() {
        if (this.checked) {
            document.querySelectorAll('.sun-orbit').forEach(orbit => {
                orbit.style.transform = 'translate(-50%, -50%) scale(1)';
            });
        }
    });

    // Velocity controls
    document.getElementById('real-time').addEventListener('change', function() {
        if (this.checked) {
            updateOrbitSpeeds(10);
        }
    });

    document.getElementById('one-year-per-minute').addEventListener('change', function() {
        if (this.checked) {
            updateOrbitSpeeds(1);
        }
    });

    document.getElementById('one-year-per-second').addEventListener('change', function() {
        if (this.checked) {
            updateOrbitSpeeds(60);
        }
    });

    // Helper functions
    function getCorrectOrbitScale(planetClass) {
        const scales = {
            'mercury-orbit': 0.4,
            'venus-orbit': 0.7,
            'earth-orbit': 1,
            'mars-orbit': 1.5,
            'jupiter-orbit': 5.2,
            'saturn-orbit': 9.5,
            'uranus-orbit': 19.2,
            'neptun-orbit': 30.1
        };
        return scales[planetClass] || 1;
    }

    function updateOrbitSpeeds(multiplier) {
        const planets = {
            'mercury-orbit': 4,
            'venus-orbit': 10,
            'earth-orbit': 16,
            'mars-orbit': 30,
            'jupiter-orbit': 100,
            'saturn-orbit': 200,
            'uranus-orbit': 400,
            'neptun-orbit': 600
        };

        Object.entries(planets).forEach(([planet, speed]) => {
            const element = document.querySelector(`.${planet}`);
            element.style.animationDuration = `${speed / multiplier}s`;
        });
    }
});