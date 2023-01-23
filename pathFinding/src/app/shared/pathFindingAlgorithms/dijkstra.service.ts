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
  chosenAlgo:string;
  verify:boolean=false;
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
    []
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

  dijkstraAlgorithm(nodeStart: Square, nodeTarget: Square) {
    
    this.searching = true;
    this.board.path = [];
    
    this.reinitialisePathQueued();
  
    this.queue = [];
    this.queue.push(nodeStart);
   
    nodeStart.queued = true;
   
    while (this.queue.length > 0 && this.searching) {
     
      this.currentBox = this.queue.shift();

      nodeStart.visited = true;
      
      if (this.currentBox == nodeTarget) {
        this.searching = false;
        do {
          this.board.path.push(this.currentBox);
          this.currentBox.isPath = true;
          this.currentBox = this.currentBox.prior;
        } while (this.currentBox != nodeStart);
      } else {
        this.currentBox.neighbours.forEach((neighbour) => {
          if (!neighbour.queued && !neighbour.isWall) {
            neighbour.queued = true;
            neighbour.prior = this.currentBox;
            
            this.queue.push(neighbour);
            if (neighbour.row == 8 && neighbour.col == 42) {
            }
          }
        });
      }
     
    }

    return this.board.path;
  }
  getBoard(){
    return this.board;
  }
}
