const body = document.body;

document.getElementById('btn1').addEventListener('click', () => {
  body.style = `
    background-color: white;
    color: black;
    font-family: Arial, sans-serif;
  `;
});

document.getElementById('btn2').addEventListener('click', () => {
  body.style = `
    background: linear-gradient(120deg, #f6d365 0%, #fda085 100%);
    color: #333;
    font-family: 'Verdana';
  `;
});

document.getElementById('btn3').addEventListener('click', () => {
  body.style = `
    background-color: #121212;
    color: #e0e0e0;
    font-family: 'Courier New', monospace;
  `;
});

document.getElementById('btn4').addEventListener('click', () => {
  body.style = `
    background-color: #0f0f0f;
    color: #39ff14;
    font-family: 'Lucida Console', monospace;
    text-shadow: 0 0 5px #39ff14;
  `;
});

document.getElementById('btn5').addEventListener('click', () => {
  body.style = `
    background-color: #fffbe6;
    color: #2c2c2c;
    font-family: 'Press Start 2P', cursive;
  `;

  // Adiciona fonte pixelada via Google Fonts dinamicamente
  const link = document.createElement('link');
  link.href = 'https://fonts.googleapis.com/css2?family=Press+Start+2P&display=swap';
  link.rel = 'stylesheet';
  document.head.appendChild(link);
});
