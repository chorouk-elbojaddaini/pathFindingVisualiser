import { NgIf } from '@angular/common';
import { Injectable } from '@angular/core';
import { Board } from '../boardModele';
import { Square } from '../squareModele';

@Injectable({
  providedIn: 'root',
})
export class DijkstraService {
  queue: Square[];
  openSet:Square[];
  closedSet:Square[];
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
          false,
          0,
          0,
          0
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
  aStarSearchAlgo(nodeStart,nodeTarget){
    this.board.path = [];
    this.openSet = [];
    this.closedSet = [];
    this.openSet.push(nodeStart);
     while(this.openSet.length>0){
      let best = 0;
      for(let i=0;i<this.openSet.length;i++){
        if(this.openSet[i].f <= this.openSet[best].f){
          best = i;
        }
      }
      this.currentBox = this.openSet[best];
      if(this.currentBox == nodeTarget){
         while(this.currentBox.prior){
          this.board.path.push(this.currentBox);
          this.currentBox = this.currentBox.prior;
          this.currentBox.isPath = true;
          console.log("boooooaaard pathhh",this.board.path);
          
         }
         
      }
      this.removeElement(this.openSet,this.currentBox);
      this.closedSet.push(this.currentBox);
      this.currentBox.neighbours.forEach((neighbour) =>{
        let tmpG ;
           if(!this.closedSet.includes(neighbour)){
            tmpG = neighbour.g + 1 ;
            if(this.openSet.includes(neighbour)){
              if(tmpG < neighbour.g){
                neighbour.g = tmpG;
              }
            }else{
                neighbour.g = tmpG;
                this.openSet.push(neighbour);
            }
           }
           neighbour.h = this.heuristic(neighbour,nodeTarget);
           neighbour.f = neighbour.g + neighbour.h;
           neighbour.prior = this.currentBox;
      })
    }
    return this.board.path;
  }
   removeElement(arr, element) {
    var index = arr.indexOf(element);
    if (index > -1) {
      arr.splice(index, 1);
    }
    return arr;
  }

  heuristic(elmt,target){
    let distance = Math.abs(elmt.row-target.row) + Math.abs(elmt.col-target.col);
    return distance
  }
  

}
