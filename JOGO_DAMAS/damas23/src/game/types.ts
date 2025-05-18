// src/game/types.ts
export type Player = 'white' | 'black';
export type Position = { row: number; col: number };

export interface Piece {
  color: Player;
  position: Position;
  isKing: boolean;
}