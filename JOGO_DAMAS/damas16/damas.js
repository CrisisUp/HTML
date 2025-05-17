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
  const fromRow = Number(selected.dataset.row);
  const fromCol = Number(selected.dataset.col);
  const color = selected.dataset.color;
  const isKing = selected.dataset.king === 'true';

  const dRow = row - fromRow;
  const dCol = col - fromCol;

  const direction = color === 'white' ? -1 : 1;
  let valid = false;

  const target = getPieceAt(row, col);
  if (target) return;

  // Movimento normal ou captura simples
  if (isKing || dRow === direction || dRow === 2 * direction) {
    const absRow = Math.abs(dRow);
    const absCol = Math.abs(dCol);

    if (absRow === 1 && absCol === 1) {
      valid = true;
    }

    if (absRow === 2 && absCol === 2) {
      const midRow = (row + fromRow) / 2;
      const midCol = (col + fromCol) / 2;
      const middlePiece = getPieceAt(midRow, midCol);
      if (middlePiece && middlePiece.dataset.color !== color) {
        removePieceAt(midRow, midCol);
        valid = true;
      }
    }
  }

  // Movimento da dama
  if (isKing && absRow === absCol && absRow > 0) {
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
        captured = {row: r, col: c};
      }
      r += stepRow;
      c += stepCol;
    }
    
    if (validPath && (!captured || absRow > 1)) {
      if (captured) removePieceAt(captured.row, captured.col);
      valid = true;
    }
  }

  if (valid) {
    getCell(fromRow, fromCol).removeChild(selected);
    selected.dataset.row = row;
    selected.dataset.col = col;
    getCell(row, col).appendChild(selected);

    // Promoção a dama
    if ((color === 'white' && row === 0) || (color === 'black' && row === 7)) {
      selected.dataset.king = 'true';
      selected.classList.add('king');
      speak('Peça promovida a dama!');
    }

    // Registrar movimento no histórico
    const moveText = `${color === 'white' ? 'Brancas' : 'Pretas'} moveram de (${fromCol+1},${8-fromRow}) para (${col+1},${8-row})`;
    movesHistory.innerHTML += `<div>${moveText}</div>`;
    movesHistory.scrollTop = movesHistory.scrollHeight;

    selected.classList.remove('highlight');
    selected = null;
    checkWin();
    currentPlayer = currentPlayer === 'white' ? 'black' : 'white';
    if (currentPlayer === 'black' && gameMode === '1player') setTimeout(aiMove, 500);
  }
}

function aiMove() {
  if (gameEnded) return;
  
  // Primeiro verifica capturas obrigatórias
  const blackPieces = pieces.filter(p => p.dataset.color === 'black');
  const captureMoves = [];
  
  for (let piece of blackPieces) {
    const row = Number(piece.dataset.row);
    const col = Number(piece.dataset.col);
    const isKing = piece.dataset.king === 'true';
    const directions = isKing ? [[1,1],[1,-1],[-1,1],[-1,-1]] : [[1,1],[1,-1]];
    
    for (let [dx, dy] of directions) {
      const r = row + 2*dx, c = col + 2*dy;
      if (isInside(r, c)) {
        const midRow = row + dx, midCol = col + dy;
        const middlePiece = getPieceAt(midRow, midCol);
        if (middlePiece && middlePiece.dataset.color === 'white' && !getPieceAt(r, c)) {
          captureMoves.push({piece, to: [r, c], capture: [midRow, midCol]});
        }
      }
    }
  }
  
  if (captureMoves.length > 0) {
    const move = captureMoves[Math.floor(Math.random() * captureMoves.length)];
    selected = move.piece;
    handleCellClick(move.to[0], move.to[1]);
    return;
  }
  
  // Se não houver capturas, faz movimento normal
  for (let piece of blackPieces) {
    const row = Number(piece.dataset.row);
    const col = Number(piece.dataset.col);
    const isKing = piece.dataset.king === 'true';
    const directions = isKing ? [[1,1],[1,-1],[-1,1],[-1,-1]] : [[1,1],[1,-1]];
    
    // Tenta mover para frente
    for (let [dx, dy] of directions) {
      const r = row + dx;
      const c = col + dy;
      if (isInside(r, c) && !getPieceAt(r, c)) {
        selected = piece;
        handleCellClick(r, c);
        return;
      }
    }
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