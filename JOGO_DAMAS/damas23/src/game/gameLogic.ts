// src/game/gameLogic.ts
type Player = 'white' | 'black';
type Position = { row: number; col: number };

let currentPlayer: Player = 'white';
let gameEnded = false;

export function startGame(): void {
  currentPlayer = 'white';
  gameEnded = false;
  console.log('Game started!');
}

export function resetGame(): void {
  startGame();
}
