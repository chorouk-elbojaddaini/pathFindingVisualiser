import { Injectable } from '@angular/core';
import { Board } from '../boardModele';
import { Square } from '../squareModele';

@Injectable({
  providedIn: 'root',
})
export class DijkstraService {
  queue: Square[];
  currentBox: Square;
  nodes: Square[][];
  numberSquares: number = 0;
  startingBox: Square;
  targetBox: Square;
  board = new Board(
    window.innerWidth,
    this.numberSquares * 3,
    null,
    null,
    false,
    false,
    false,
    false,
    false,
    false,
    false,
    null
  );
  searching: boolean = true;
  constructor() {}
  getNodes() {
    this.initialiseGrid();
    return this.nodes;
  }
  initialiseGrid() {
    console.log(0);

    let wi = window.innerWidth;
    this.numberSquares = Math.trunc(wi / 30);
    this.nodes = [];
    for (let i = 0; i < window.innerHeight / 35; i++) {
      this.nodes[i] = [];
      for (let j = 0; j < Math.trunc(window.innerWidth / 30); j++) {
        this.nodes[i][j] = new Square(
          i,
          j,
          false,
          false,
          false,
          false,
          true,
          [],
          false,
          false,
          null,
          false
        );

        if (i == 8 && j == Math.trunc(this.numberSquares / 2) - 15) {
          this.nodes[i][j].isStartingbox = true;
          this.startingBox = this.nodes[i][j];

          this.nodes[i][j].isNormal = false;
        }
        if (i == 8 && j == Math.trunc(this.numberSquares / 2) + 10) {
          this.nodes[i][j].isTargetBox = true;
          this.targetBox = this.nodes[i][j];

          this.nodes[i][j].isNormal = false;
        }
      }
    }
    return this.nodes;
  }

  reinitialisePathQueued() {
    for (let i = 0; i < window.innerHeight / 40; i++) {
      for (let j = 0; j < Math.trunc(window.innerWidth / 30); j++) {
        this.nodes[i][j].queued = false;
        this.nodes[i][j].isPath = false;
      }
    }
  }
}
