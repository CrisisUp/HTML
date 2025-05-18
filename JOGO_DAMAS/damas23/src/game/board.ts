// src/game/board.ts
import { Player, Position } from './types';

export class Board {
  private cells: (Piece | null)[][] = [];

  constructor() {
    this.initializeBoard();
  }

  private initializeBoard(): void {
    // Lógica de inicialização (com tipos)
  }

  public movePiece(from: Position, to: Position): boolean {
    // Lógica de movimento (tipada)
    return true;
  }
}