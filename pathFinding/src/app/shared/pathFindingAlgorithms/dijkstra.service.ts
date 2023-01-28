import { NgIf } from '@angular/common';
import { Injectable } from '@angular/core';
import { windowTime } from 'rxjs';
import { Board } from '../boardModele';
import { Particle } from '../particleModele';
import { Square } from '../squareModele';

@Injectable({
  providedIn: 'root',
})
export class DijkstraService {
  queue: Square[];
  stack: Square[];
  openSet: Square[];
  closedSet: Square[];
  currentBox: Square;
  nodes: Square[][];
  numberSquares: number = 0;
  startingBox: Square;
  targetBox: Square;
  chosenAlgo: string = null;
  mazePattern:string= null;
  mazeVerify:boolean=true;
  isPerson: boolean = false;
  algo: string;
  agents:Square[];
  visitedNode:Square[];
  visitedNodeSet;
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
    [],
    false
  );
  searching: boolean = true;
  numberParticles:number;
  particles:Particle[];
  globalBest:Square;
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
          0,
          false,
          false,
          false
        );

        if (i == 8 && j == Math.trunc(this.numberSquares / 2) - 10) {
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
    for (let i = 0; i < window.innerHeight / 35; i++) {
      for (let j = 0; j < Math.trunc(window.innerWidth / 30); j++) {
        this.nodes[i][j].queued = false;
        this.nodes[i][j].isPath = false;
        this.nodes[i][j].visited = false;
        this.nodes[i][j].isClosedSet = false;
        this.nodes[i][j].isOpenSet = false;
      }
    }
  }
  reinitialiseQueued(){
    for (let i = 0; i < window.innerHeight / 35; i++) {
      for (let j = 0; j < Math.trunc(window.innerWidth / 30); j++) {
        this.nodes[i][j].queued = false;
      }
    }
  }

  dijkstraAlgorithm(nodeStart: Square, nodeTarget: Square) {
    this.searching = true;
    this.board.path = [];

     this.reinitialiseQueued();

    this.queue = [];
    this.queue.push(nodeStart);

    nodeStart.queued = true;

    while (this.queue.length > 0 && this.searching) {
      this.currentBox = this.queue.shift();

      this.currentBox.visited = true;

      if (this.currentBox == nodeTarget) {
        this.searching = false;
        do {
          this.board.path.push(this.currentBox);
          this.currentBox.isPath = true;
          this.currentBox = this.currentBox.prior;
        } while (this.currentBox != nodeStart);
      } else {
        this.currentBox.neighbours.forEach((neighbour) => {
          if (!neighbour.queued && !neighbour.isWall ) {
            neighbour.queued = true;
            neighbour.prior = this.currentBox;

            this.queue.push(neighbour);
          }
        });
      }
    }
   
    return this.board.path;
  }
  getBoard() {
    return this.board;
  }

  removeElement(arr, element) {
    var index = arr.indexOf(element);
    if (index > -1) {
      arr.splice(index, 1);
    }
    return arr;
  }

  aStarSearchAlgo(nodeStart: Square, nodeTarget: Square) {
    //this.reinitialisePathQueued();
    this.openSet = [nodeStart];
    this.closedSet = [];
    this.board.path = [];
    nodeStart.g = 0;
    nodeStart.h = this.heuristic(nodeStart, nodeTarget);
    nodeStart.f = nodeStart.g + nodeStart.h;

    while (this.openSet.length > 0) {
      let best = 0;
      for (let i = 0; i < this.openSet.length; i++) {
        if (this.openSet[i].f < this.openSet[best].f) {
          best = i;
        }
      }
      this.currentBox = this.openSet[best];

      if (this.currentBox === nodeTarget) {

        this.board.path = [this.currentBox];
        do {
          this.board.path.push(this.currentBox);
          this.currentBox.isPath = true;
          this.currentBox = this.currentBox.prior;
        } while (this.currentBox != nodeStart);
       
        return this.board.path;
      }

      this.removeElement(this.openSet, this.currentBox);
      this.closedSet.push(this.currentBox);
      this.currentBox.isClosedSet = true;
      for (let neighbor of this.currentBox.neighbours) {
        if (!neighbor.isWall) {
          if (this.closedSet.includes(neighbor)) {
            continue;
          }
          let tmpG = this.currentBox.g + 1;
          if (!this.openSet.includes(neighbor)) {
            this.openSet.push(neighbor);
            neighbor.isOpenSet = true;
          } else if (tmpG >= neighbor.g) {
            continue;
          }

          neighbor.prior = this.currentBox;
          neighbor.g = tmpG;
          neighbor.h = this.heuristic(neighbor, nodeTarget);
          neighbor.f = neighbor.g + neighbor.h;
        }
      }
    }
    return [];
  }
  greedyBestFirstSearch(nodeStart:Square,nodeTarget:Square){
    this.openSet = [nodeStart];
    this.closedSet = [];
    this.board.path = [];
    
    nodeStart.h = this.heuristic(nodeStart, nodeTarget);
    nodeStart.f = nodeStart.h;

    while (this.openSet.length > 0) {
      let best = 0;
      for (let i = 0; i < this.openSet.length; i++) {
        if (this.openSet[i].f < this.openSet[best].f) {
          best = i;
        }
      }
      this.currentBox = this.openSet[best];

      if (this.currentBox === nodeTarget) {
        this.board.path = [this.currentBox];
        do {
          this.board.path.push(this.currentBox);
          this.currentBox.isPath = true;
          this.currentBox = this.currentBox.prior;
        } while (this.currentBox != nodeStart);
        return this.board.path;
      }

      this.removeElement(this.openSet, this.currentBox);
      this.closedSet.push(this.currentBox);
      this.currentBox.isClosedSet = true;
      for (let neighbor of this.currentBox.neighbours) {
        if (!neighbor.isWall) {
          if (this.closedSet.includes(neighbor)) {
            continue;
          }
          
          if (!this.openSet.includes(neighbor)) {
            this.openSet.push(neighbor);
            neighbor.isOpenSet = true;
          } 

          neighbor.prior = this.currentBox;
         
          neighbor.h = this.heuristic(neighbor, nodeTarget);
          neighbor.f =  neighbor.h;
        }
      }
    }
    
    return [];
  }
  breadthFirstSearch(nodeStart:Square,nodeTarget:Square){
    this.queue = [];
    this.visitedNode = [];
    this.queue.push(nodeStart);
    this.board.path = [];
    while(this.queue.length>0){
      this.currentBox = this.queue.shift();
      this.currentBox.visited = true;
      this.visitedNode.push(this.currentBox);
      if(this.currentBox == nodeTarget){
        do {
          this.currentBox.isPath = true;
          this.board.path.push(this.currentBox);
          this.currentBox = this.currentBox.prior;
        } while (this.currentBox != nodeStart);
        return this.board.path;
      }
      
      for (let neighbor of this.currentBox.neighbours) {
        if (!this.visitedNode.includes(neighbor)) {
          neighbor.prior = this.currentBox;
            this.queue.push(neighbor);
            this.visitedNode.push(neighbor);
        }
    }
    }
    return [];
  }

  swarmAlgorithm(startNode:Square,targetNode:Square){
      this.numberParticles = 20;
      this.particles = [];
      this.globalBest = startNode;
      for(let i=0;i<this.numberParticles;i++){
        this.particles[i] = new Particle(startNode,targetNode);
        console.log("hadi particle",this.particles[i]);
      }
      for (let i = 0; i < this.numberParticles; i++) {
        this.particles[i].move();
        console.log("hadi particle mnb3d mouvement",this.particles[i]);

        // check if the path found by the particle is shorter than the global best path
        if (this.particles[i].bestPosition.distance(targetNode) < this.globalBest.distance(targetNode)) {
            this.globalBest = this.particles[i].bestPosition;
        }
        if(this.globalBest == targetNode){
          console.log("wslna l target");
          break;
        }
      
    }
  }      
  
  

    DepthFirstSearch(nodeStart:Square,nodeTarget:Square){
      this.stack = [nodeStart];
      this.visitedNodeSet = new Set();
      this.board.path = [];
      while(this.stack.length>0){
        this.currentBox = this.stack.pop();
        if(this.visitedNodeSet.has(this.currentBox))
          continue;
        this.visitedNodeSet.add(this.currentBox);
        this.currentBox.visited =true;
        if(this.currentBox == nodeTarget){
          do {
            this.currentBox.isPath = true;
            this.board.path.push(this.currentBox);
            this.currentBox = this.currentBox.prior;
          } while (this.currentBox != nodeStart);
          return this.board.path.reverse();
        }
        
        for (let neighbor of this.currentBox.neighbours) {
          if (!this.visitedNodeSet.has(neighbor)) {
              neighbor.prior = this.currentBox;
              this.stack.push(neighbor);
          }
        }
      }
      return [];
    
  
  }


  heuristic(node: Square, target: Square) {
   
    return Math.abs(node.row - target.row) + Math.abs(node.col - target.col);
  }




  /*====================Mazes and patterns================*/
  randomMaze(){
    for (let i = 0; i <100; i++) {
         let x = Math.round(Math.random()*Math.trunc(window.innerHeight/35));
         let y =  Math.round(Math.random()*Math.trunc(window.innerWidth/30));
         if(x<window.innerHeight/35 && y<Math.trunc(window.innerWidth/30)){
         this.nodes[x][y].isWall = true;
         }
      }
    
  }
  simpleStairPattern(){
    let j ;
    let i;
    for ( i = Math.trunc(window.innerHeight / 35),j=0; i >= 0 ; i--,j++) {
      this.nodes[i][j].isWall = true;      
    }
    for (i =1,j; i <= window.innerHeight / 35-1; i++,j++) {
       this.nodes[i][j].isWall = true;
    }
    console.log("i b3d for 2",i);
    for (i = Math.trunc(window.innerHeight/35)-2,j; i>0; i--,j++) {
      if( j>= Math.trunc(window.innerWidth / 30)-2){
        break;
      }
      this.nodes[i][j].isWall = true;
      
    }
  }
  reinitialiseWall(){
    for (let i = 0; i < window.innerHeight / 35; i++) {
      for (let j = 0; j < Math.trunc(window.innerWidth / 30); j++) {
        this.nodes[i][j].isWall = false;
      }
    }
  }

}
