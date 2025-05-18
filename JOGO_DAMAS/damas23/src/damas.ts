const board = document.getElementById('board');
const winScreen = document.getElementById('win-screen');
const winMessage = document.getElementById('win-message');
const timeDisplay = document.getElementById('time');
const whiteCapturesDisplay = document.getElementById('whiteCaptures');
const blackCapturesDisplay = document.getElementById('blackCaptures');
const movesHistory = document.getElementById('moves-history');
const synth = window.speechSynthesis;
let cells = [], pieces = [], selected = null, currentPlayer = 'white';
let timer = 0, interval, gameEnded = false;
let whiteCaptures = 0, blackCaptures = 0;
let gameMode = '1player';
let currentTheme = 'classic';

// src/damas.ts
import { startGame, resetGame } from './game/gameLogic';
import { changeTheme } from './ui/themeManager';

// Configuração inicial (mantendo compatibilidade)
(window as any).startGame = startGame;
(window as any).resetGame = resetGame;
(window as any).changeTheme = changeTheme;

document.addEventListener('DOMContentLoaded', () => {
  startGame();
});

// Adicione no início do arquivo, com as outras funções
function announceMove(fromRow, fromCol, toRow, toCol, color) {
  const fromPos = `linha ${8 - fromRow}, coluna ${fromCol + 1}`;
  const toPos = `linha ${8 - toRow}, coluna ${toCol + 1}`;
  const message = `${color === 'white' ? 'Brancas' : 'Pretas'} moveram de ${fromPos} para ${toPos}`;
  speak(message);

  // Atualiza o histórico com ícones
  const icon = color === 'white' ? '⚪' : '🔴';
  movesHistory.innerHTML += `<div>${icon} ${message}</div>`;
  movesHistory.scrollTop = movesHistory.scrollHeight;
}

// Adicione esta função para mudar o tema
function changeTheme(theme) {
  document.body.classList.remove(currentTheme);
  document.body.classList.add(theme);
  currentTheme = theme;

  // Atualiza as cores das peças existentes
  pieces.forEach(piece => {
    if (piece.dataset.color === 'black') {
      piece.className = 'piece black-piece';
    } else {
      piece.className = 'piece';
    }
    if (piece.dataset.king === 'true') {
      piece.classList.add('king');
    }
  });
}

// Adicione um event listener para o seletor de temas
document.getElementById('theme-selector').addEventListener('change', function () {
  changeTheme(this.value);
});

function highlightValidMoves(piece) {
  // Remove destaques anteriores
  document.querySelectorAll('.valid-move').forEach(el => el.classList.remove('valid-move'));
  document.querySelectorAll('.capturable-piece').forEach(el => el.classList.remove('capturable-piece'));

  const row = Number(piece.dataset.row);
  const col = Number(piece.dataset.col);
  const color = piece.dataset.color;
  const isKing = piece.dataset.king === 'true';
  const direction = color === 'white' ? -1 : 1;
  let hasCaptures = false;

  // Verifica capturas possíveis primeiro
  const directions = isKing ? [[1, 1], [1, -1], [-1, 1], [-1, -1]] : [[direction, 1], [direction, -1]];

  for (let [dx, dy] of directions) {
    // Verifica capturas
    const captureRow = row + dx;
    const captureCol = col + dy;
    const landRow = row + 2 * dx;
    const landCol = col + 2 * dy;

    if (isInside(landRow, landCol)) {
      const middlePiece = getPieceAt(captureRow, captureCol);
      if (middlePiece && middlePiece.dataset.color !== color && !getPieceAt(landRow, landCol)) {
        getCell(landRow, landCol).classList.add('valid-move');
        middlePiece.classList.add('capturable-piece');
        hasCaptures = true;
      }
    }
  }

  // Se não houver capturas, mostra movimentos simples
  if (!hasCaptures && !isKing) {
    for (let [dx, dy] of directions) {
      const newRow = row + dx;
      const newCol = col + dy;
      if (isInside(newRow, newCol) && !getPieceAt(newRow, newCol)) {
        getCell(newRow, newCol).classList.add('valid-move');
      }
    }
  }

  // Movimentos da dama sem captura
  if (!hasCaptures && isKing) {
    for (let [dx, dy] of directions) {
      let newRow = row + dx;
      let newCol = col + dy;
      while (isInside(newRow, newCol) && !getPieceAt(newRow, newCol)) {
        getCell(newRow, newCol).classList.add('valid-move');
        newRow += dx;
        newCol += dy;
      }
    }
  }
}

function speak(text) {
  if (synth.speaking) synth.cancel();
  const utter = new SpeechSynthesisUtterance(text);
  utter.lang = 'pt-BR';
  synth.speak(utter);
}

function startTimer() {
  timer = 0;
  timeDisplay.textContent = timer;
  interval = setInterval(() => {
    timer++;
    timeDisplay.textContent = timer;
  }, 1000);
}

function stopTimer() {
  clearInterval(interval);
}

function createBoard() {
  board.innerHTML = '';
  cells = [];
  for (let i = 0; i < 64; i++) {
    const cell = document.createElement('div');
    const row = Math.floor(i / 8);
    const col = i % 8;
    cell.className = 'cell ' + ((row + col) % 2 === 0 ? 'white' : 'black');
    cell.dataset.row = row;
    cell.dataset.col = col;
    if ((row + col) % 2 !== 0) cell.addEventListener('click', () => handleCellClick(row, col));
    cells.push(cell);
    board.appendChild(cell);
  }
}

function placePieces() {
  pieces = [];
  for (let i = 0; i < 64; i++) {
    const row = Math.floor(i / 8);
    const col = i % 8;
    if ((row + col) % 2 !== 0 && row < 3) addPiece(row, col, 'black');
    if ((row + col) % 2 !== 0 && row > 4) addPiece(row, col, 'white');
  }
}

function addPiece(row, col, color) {
  const piece = document.createElement('div');
  piece.className = 'piece ' + (color === 'black' ? 'black-piece' : '');
  piece.dataset.row = row;
  piece.dataset.col = col;
  piece.dataset.color = color;
  piece.dataset.king = 'false';
  piece.addEventListener('click', (e) => {
    e.stopPropagation();
    if (gameEnded || color !== currentPlayer) return;
    if (selected) selected.classList.remove('highlight');
    selected = piece;
    selected.classList.add('highlight');
    highlightValidMoves(piece); // Adiciona esta linha
    speak(`${color === 'white' ? 'Branca' : 'Preta'} selecionada em linha ${8 - row}, coluna ${col + 1}`);
  });
  pieces.push(piece);
  getCell(row, col).appendChild(piece);
}

function getCell(row, col) {
  return cells[row * 8 + col];
}

function removePieceAt(row, col) {
  const piece = getPieceAt(row, col);
  if (piece) {
    piece.remove();
    pieces = pieces.filter(p => p !== piece);
    if (piece.dataset.color === 'white') blackCaptures++;
    else whiteCaptures++;
    whiteCapturesDisplay.textContent = whiteCaptures;
    blackCapturesDisplay.textContent = blackCaptures;
    speak(`Peça ${piece.dataset.color === 'white' ? 'branca' : 'preta'} capturada!`);
  }
}

function getPieceAt(row, col) {
  return pieces.find(p => Number(p.dataset.row) === row && Number(p.dataset.col) === col);
}

function isInside(row, col) {
  return row >= 0 && row < 8 && col >= 0 && col < 8;
}

function handleCellClick(row, col) {
  if (!selected || gameEnded) return;

  // Remove destaques
  document.querySelectorAll('.valid-move').forEach(el => el.classList.remove('valid-move'));
  document.querySelectorAll('.capturable-piece').forEach(el => el.classList.remove('capturable-piece'));

  const fromRow = Number(selected.dataset.row);
  const fromCol = Number(selected.dataset.col);
  const color = selected.dataset.color;
  const isKing = selected.dataset.king === 'true';

  const dRow = row - fromRow;
  const dCol = col - fromCol;
  const absRow = Math.abs(dRow);
  const absCol = Math.abs(dCol);

  const direction = color === 'white' ? -1 : 1;
  let valid = false;

  const target = getPieceAt(row, col);
  if (target) return;

  // Verifica se é um movimento diagonal
  if (absRow !== absCol) return;

  // Movimento da dama
  if (isKing) {
    let validPath = true;
    let stepRow = dRow / absRow;
    let stepCol = dCol / absCol;
    let r = fromRow + stepRow, c = fromCol + stepCol;
    let captured = null;

    while (r !== row && c !== col) {
      const piece = getPieceAt(r, c);
      if (piece) {
        if (piece.dataset.color === color || captured) {
          validPath = false;
          break;
        }
        captured = { row: r, col: c };
      }
      r += stepRow;
      c += stepCol;
    }

    if (validPath) {
      if (captured) {
        removePieceAt(captured.row, captured.col);
        valid = true;
      } else {
        // Movimento simples sem captura
        valid = true;
      }
    }
  }
  // Movimento de peça normal
  else {
    // Movimento simples
    if (absRow === 1 && dRow === direction) {
      valid = true;
    }
    // Captura
    else if (absRow === 2 && dRow === 2 * direction) {
      const midRow = (row + fromRow) / 2;
      const midCol = (col + fromCol) / 2;
      const middlePiece = getPieceAt(midRow, midCol);
      if (middlePiece && middlePiece.dataset.color !== color) {
        removePieceAt(midRow, midCol);
        valid = true;
      }
    }
  }

  if (valid) {
    // Remove a peça da posição original imediatamente
    getCell(fromRow, fromCol).removeChild(selected);

    // Atualiza a posição da peça
    selected.dataset.row = row;
    selected.dataset.col = col;

    // Adiciona animação suave
    selected.style.transition = 'transform 0.3s ease-in-out';
    selected.style.transform = 'translate(0, 0)';

    // Adiciona a peça na nova posição
    getCell(row, col).appendChild(selected);

    // Remove a animação após completar
    setTimeout(() => {
      selected.style.transition = '';
      selected.style.transform = '';
    }, 300);

    // Promoção a dama
    if (!isKing && ((color === 'white' && row === 0) || (color === 'black' && row === 7))) {
      selected.dataset.king = 'true';
      selected.classList.add('king');
      speak('Peça promovida a dama!');
    }

    // Registrar movimento no histórico
    announceMove(fromRow, fromCol, row, col, color);

    selected.classList.remove('highlight');
    selected = null;
    checkWin();
    currentPlayer = currentPlayer === 'white' ? 'black' : 'white';
    if (currentPlayer === 'black' && gameMode === '1player') setTimeout(aiMove, 500);
  }
}

function aiMove() {
  if (gameEnded) return;

  // Limpa destaques
  document.querySelectorAll('.valid-move').forEach(el => el.classList.remove('valid-move'));
  document.querySelectorAll('.capturable-piece').forEach(el => el.classList.remove('capturable-piece'));

  const blackPieces = pieces.filter(p => p.dataset.color === 'black');
  const possibleMoves = [];

  // Coleta todos os movimentos possíveis
  for (let piece of blackPieces) {
    const row = Number(piece.dataset.row);
    const col = Number(piece.dataset.col);
    const isKing = piece.dataset.king === 'true';
    const directions = isKing ? [[1, 1], [1, -1], [-1, 1], [-1, -1]] : [[1, 1], [1, -1]];

    // Verifica capturas
    for (let [dx, dy] of directions) {
      const r = row + 2 * dx, c = col + 2 * dy;
      if (isInside(r, c)) {
        const midRow = row + dx, midCol = col + dy;
        const middlePiece = getPieceAt(midRow, midCol);
        if (middlePiece && middlePiece.dataset.color === 'white' && !getPieceAt(r, c)) {
          possibleMoves.push({
            piece,
            to: [r, c],
            capture: [midRow, midCol],
            priority: 3, // Prioridade alta para capturas
            isKing
          });
        }
      }
    }

    // Se não houver capturas, verifica movimentos normais
    if (possibleMoves.length === 0) {
      for (let [dx, dy] of directions) {
        const r = row + dx, c = col + dy;
        if (isInside(r, c) && !getPieceAt(r, c)) {
          const priority = isKing ? 1 : (r === 0 ? 2 : 0); // Prioridade para promover peças
          possibleMoves.push({
            piece,
            to: [r, c],
            priority,
            isKing
          });
        }
      }
    }
  }

  if (possibleMoves.length > 0) {
    // Ordena por prioridade (capturas primeiro, depois promoções)
    possibleMoves.sort((a, b) => b.priority - a.priority);

    // Pega os melhores movimentos
    const bestMoves = possibleMoves.filter(m => m.priority === possibleMoves[0].priority);

    // Escolhe aleatoriamente entre os melhores
    const move = bestMoves[Math.floor(Math.random() * bestMoves.length)];
    selected = move.piece;

    // Destaque visual para a jogada da IA
    selected.classList.add('highlight');
    setTimeout(() => {
      handleCellClick(move.to[0], move.to[1]);
      selected.classList.remove('highlight');
    }, 500);
  }
}

function checkWin() {
  const white = pieces.filter(p => p.dataset.color === 'white');
  const black = pieces.filter(p => p.dataset.color === 'black');
  if (white.length === 0 || black.length === 0) {
    gameEnded = true;
    stopTimer();
    const winner = white.length > 0 ? 'Brancas' : 'Pretas';
    winMessage.textContent = `${winner} venceram!`;
    winScreen.style.display = 'block';
    speak(`${winner} venceram o jogo!`);
  }
}

function startGame() {
  gameMode = document.getElementById('game-mode').value;
  winScreen.style.display = 'none';
  movesHistory.innerHTML = '';
  gameEnded = false;
  whiteCaptures = 0;
  blackCaptures = 0;
  whiteCapturesDisplay.textContent = 0;
  blackCapturesDisplay.textContent = 0;
  stopTimer();
  startTimer();
  createBoard();
  placePieces();
  currentPlayer = 'white';
  speak('Jogo iniciado. Jogador branco começa.');
}

function resetGame() {
  stopTimer();
  startGame();
}

// Inicia o jogo quando a página carrega
window.onload = startGame;