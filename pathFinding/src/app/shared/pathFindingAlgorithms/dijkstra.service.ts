import { NgIf } from '@angular/common';
import { Injectable } from '@angular/core';
import { Board } from '../boardModele';
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
        console.log("open set ++++++++++++",this.openSet);
        console.log("closed sset==========",this.closedSet);
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
    this.agents =[];
    this.agents.push(startNode);
    this.visitedNode = [];
    let shortestPathLength = Infinity;
    let shortestPath=[];
    let pathLenght;
    let compteur = 0;
    while(this.agents.length>0  && compteur<2){
      this.currentBox = this.agents.shift();
      this.visitedNode.push(this.currentBox);
      this.currentBox.visited = true;
      console.log("thes agents",this.agents);
      console.log("current box",this.currentBox);
      // if(this.currentBox == targetNode){
      //   this.board.path = [];
      //   do {
      //     this.currentBox.isPath = true;
      //     this.board.path.push(this.currentBox);
      //     this.currentBox = this.currentBox.prior;
      //   } while (this.currentBox != startNode);

      //   if( this.board.path.length <shortestPathLength){
      //     shortestPath = this.board.path.slice();
      //     shortestPathLength = shortestPath.length;
      //   }
      // }
      for (let neighbor of this.currentBox.neighbours) {
        if (!neighbor.visited) {
           // neighbor.prior = this.currentBox;
            this.agents.push(neighbor);
        }
      }
    compteur++;

    }
    return shortestPath;
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
}
