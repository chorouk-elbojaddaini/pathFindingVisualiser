import { NgIf } from '@angular/common';
import { Injectable } from '@angular/core';
import { iif, min, windowTime } from 'rxjs';
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
 dividerArr = [];
 isAnimated:boolean;
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
  clearBoard:boolean;
  clearWalls:boolean;
  clearPath:boolean;
  ngDoCheckRunOnce:boolean=false;
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
          false,
          null,
          false,
          0,
          0,
          0,
          false,
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
        this.nodes[i][j].visitedAnimation = false;
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

 
  dijkstraAlgorithm(nodeStart: Square, nodeTarget: Square,ifIsFirst) {
    this.searching = true;
    this.board.path = [];

     this.reinitialiseQueued();
      this.visitedNode = [];
    this.queue = [];
    this.queue.push(nodeStart);

    nodeStart.queued = true;

    while (this.queue.length > 0 && this.searching) {
      this.currentBox = this.queue.shift();
  
     
         if(!ifIsFirst){
          this.currentBox.visited = true;
         }
          
          this.visitedNode.push(this.currentBox)
   

      if (this.currentBox == nodeTarget) {
        this.searching = false;
        do {
          this.board.path.push(this.currentBox);
         if(!ifIsFirst){
          this.currentBox.isPath = true;
         }
          
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
   
    return {queue:this.visitedNode,path:this.board.path};
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

  aStarSearchAlgo(nodeStart: Square, nodeTarget: Square,isAnimated) {
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
          if(!isAnimated){
            this.currentBox.isPath = true;
          }
          
          this.currentBox = this.currentBox.prior;
        } while (this.currentBox != nodeStart);
       
         break;
      }

      this.removeElement(this.openSet, this.currentBox);
      this.closedSet.push(this.currentBox);
      if(!isAnimated){
       
        this.currentBox.isClosedSet = true;
      }
      
      for (let neighbor of this.currentBox.neighbours) {
        if (!neighbor.isWall) {
          if (this.closedSet.includes(neighbor)) {
            continue;
          }
          let tmpG = this.currentBox.g + 1;
          if (!this.openSet.includes(neighbor)) {
            this.openSet.push(neighbor);
            if(!isAnimated){
             
              neighbor.isOpenSet = true;
            }
            
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
    return {closed:this.closedSet,path:this.board.path};
  }
  greedyBestFirstSearch(nodeStart:Square,nodeTarget:Square,isAnimated){
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
          if(!isAnimated){
            this.currentBox.isPath = true;
          }
          this.currentBox = this.currentBox.prior;
        } while (this.currentBox != nodeStart);
           break;
      }

      this.removeElement(this.openSet, this.currentBox);
      this.closedSet.push(this.currentBox);
      if(!isAnimated){
       
        this.currentBox.isClosedSet = true;
      }
      for (let neighbor of this.currentBox.neighbours) {
        if (!neighbor.isWall) {
          if (this.closedSet.includes(neighbor)) {
            continue;
          }
          
          if (!this.openSet.includes(neighbor)) {
            this.openSet.push(neighbor);
            if(!isAnimated){
             
              neighbor.isOpenSet = true;
            }
          } 

          neighbor.prior = this.currentBox;
         
          neighbor.h = this.heuristic(neighbor, nodeTarget);
          neighbor.f =  neighbor.h;
        }
      }
    }
    
    return {closed:this.closedSet,path:this.board.path};
  }
  breadthFirstSearch(nodeStart:Square,nodeTarget:Square,ifIsFirst){
    this.queue = [];

    this.queue.push(nodeStart);
    this.board.path = [];
    this.visitedNode = [];
    while(this.queue.length>0){
      this.currentBox = this.queue.shift();
      if(!ifIsFirst){
        this.currentBox.visited = true;
      }
      this.visitedNode.push(this.currentBox);
      if(this.currentBox == nodeTarget){
        do {
          if(!ifIsFirst){
            this.currentBox.isPath = true;
          }
          
          this.board.path.push(this.currentBox);
          this.currentBox = this.currentBox.prior;
        } while (this.currentBox != nodeStart);
        break;
      }
      
      for (let neighbor of this.currentBox.neighbours) {
        if (!this.visitedNode.includes(neighbor) && !neighbor.isWall) {
          
          neighbor.prior = this.currentBox;
            this.queue.push(neighbor);
             this.visitedNode.push(neighbor);
        }
    }
    }
    return {visited:this.visitedNode,path:this.board.path};
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
  
  

    DepthFirstSearch(nodeStart:Square,nodeTarget:Square,isAnimated){
      this.stack = [nodeStart];
      this.visitedNodeSet = [];
      this.board.path = [];
      while(this.stack.length>0){
        this.currentBox = this.stack.pop();
        if(this.visitedNodeSet.includes(this.currentBox))
          continue;
        this.visitedNodeSet.push(this.currentBox);
        if(!isAnimated){
          this.currentBox.visited =true;
        }
        if(this.currentBox == nodeTarget){
          do {
            if(!isAnimated){
              this.currentBox.isPath = true;
            }
            this.board.path.push(this.currentBox);
            this.currentBox = this.currentBox.prior;
          } while (this.currentBox != nodeStart);
          break;
        }
        
        for (let neighbor of this.currentBox.neighbours) {
          if (!this.visitedNodeSet.includes(neighbor) && !neighbor.isWall) {
              neighbor.prior = this.currentBox;
              this.stack.push(neighbor);
          }
        }
      }
      return {visited:this.visitedNodeSet,path:this.board.path};
    
  
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
    for (i =1,j; i <= (window.innerHeight / 35)-2; i++,j++) {
      console.log("i",i);
      console.log("j",j);
      if( j>= Math.trunc(window.innerWidth / 30)-2){
        break;
      }
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
  createMaze(grid,x1,y1,x2,y2,minSize){
    
   
  // Base case: if the area is too small, return
  if (x1 >= x2 || y1 >= y2 || x2 - x1 < minSize || y2 - y1 < minSize) return;

  // Randomly choose a horizontal or vertical line to divide the area
  if (Math.random() < 0.75) {
    let divider = y1 + Math.floor(Math.random() * (y2-y1-minSize+1))+minSize ;
    this.dividerArr.push(divider);
    console.log(this.dividerArr);
    // Create a passage through the divider
    let passage = x1 + Math.floor(Math.random() * (x2-x1+1 ));
    let randomNum = Math.floor(Math.random() * (x2-x1+1));
    // Fill the area above and below the divider with walls
    for (let i = x1; i <= x2; i++) {
         if(divider ==1 || divider == y2){
          break;
         }
          if( !grid[divider][i].isTargetBox && !grid[divider][i].isPerson){
            let random = Math.floor(Math.random() * 5) + 1
           
            


            grid[divider][i].isWall = true;

            
          }
           
            
            grid[divider-1][i].isWall = false
            grid[divider+1][i].isWall = false
       
            grid[divider][passage].isWall = false;
    }
    grid[divider][passage].isWall = false;
   
    // Recursively divide the area above and below the divider
    this.createMaze(grid, x1, y1, x2, divider - 1, minSize);
    this.createMaze(grid, x1, divider + 1, x2, y2, minSize);
  } else {
    let divider = x1 + Math.floor(Math.random() * (x2-x1-minSize+1))+minSize ;

    // Create a passage through the divider
    let passage = y1 + Math.floor(Math.random() * (y2-y1+1 ));
    // Fill the area above and below the divider with walls
    for (let i = y1; i <= y2; i++) {
         if(divider ==1 || divider == x2){
          break;
         }
         if(!grid[i][divider].isTargetBox  && !grid[i][divider].isPerson ){
          grid[i][divider].isWall = true;
        } 

            grid[i][divider-1].isWall = false
            grid[i][divider+1].isWall = false
       
            grid[passage][divider].isWall = false;
    }
    grid[passage][divider].isWall = false;
   
    // Recursively divide the area above and below the divider
    this.createMaze(grid, x1, y1,divider - 1,y2,minSize);
    this.createMaze(grid, divider + 1, y1, x2, y2, minSize);
  }
}
recursiveDivision(grid,x1,y1,x2,y2,minSize){
  let compteur = 0
  // Base case: if the area is too small, return
  if (x1 >= x2 || y1 >= y2 || x2 - x1 < minSize || y2 - y1 < minSize) return;

  // Randomly choose a horizontal or vertical line to divide the area
  if (Math.random() < 0.5) {
    let divider = y1 + Math.floor(Math.random() * (y2-y1-minSize+1))+minSize ;
    this.dividerArr.push(divider);
    console.log(this.dividerArr);
    // Create a passage through the divider
    let passage = x1 + Math.floor(Math.random() * (x2-x1+1 ));
    let randomNum = Math.floor(Math.random() * (x2-x1+1));
    // Fill the area above and below the divider with walls
    for (let i = x1; i <= x2; i++) {
         if(divider ==1 || divider == y2){
          break;
         }
        
          if( !grid[divider][i].isTargetBox && !grid[divider][i].isPerson ){

          
              grid[divider][i].isWall = true;
            
          
          }
           
            
            grid[divider-1][i].isWall = false
            grid[divider+1][i].isWall = false
       
            grid[divider][passage].isWall = false;
    }
    grid[divider][passage].isWall = false;
   
    // Recursively divide the area above and below the divider
    this.recursiveDivision(grid, x1, y1, x2, divider - 1, minSize);
    this.recursiveDivision(grid, x1, divider + 1, x2, y2, minSize);
  } else {
    let divider = x1 + Math.floor(Math.random() * (x2-x1-minSize+1))+minSize ;

    // Create a passage through the divider
    let passage = y1 + Math.floor(Math.random() * (y2-y1+1 ));
    // Fill the area above and below the divider with walls
    for (let i = y1; i <= y2; i++) {
         if(divider ==1 || divider == x2){
          break;
         }
         if(!grid[i][divider].isTargetBox && !grid[i][divider].isPerson ){
          
          grid[i][divider].isWall = true;
        } 

          
            
            grid[i][divider-1].isWall = false
            grid[i][divider+1].isWall = false
       
            grid[passage][divider].isWall = false;
    }
    grid[passage][divider].isWall = false;
   
    // Recursively divide the area above and below the divider
    this.recursiveDivision(grid, x1, y1,divider - 1,y2,minSize);
    this.recursiveDivision(grid, divider + 1, y1, x2, y2, minSize);
  }
}
verticalRecursive(grid,x1,y1,x2,y2,minSize){
  
  // Base case: if the area is too small, return
  if (x1 >= x2 || y1 >= y2 || x2 - x1 < minSize || y2 - y1 < minSize) return;

  // Randomly choose a horizontal or vertical line to divide the area
  if (Math.random() < 0.25) {
    let divider = y1 + Math.floor(Math.random() * (y2-y1-minSize+1))+minSize ;
    this.dividerArr.push(divider);
    console.log(this.dividerArr);
    // Create a passage through the divider
    let passage = x1 + Math.floor(Math.random() * (x2-x1+1 ));
    let randomNum = Math.floor(Math.random() * (x2-x1+1));
    // Fill the area above and below the divider with walls
    for (let i = x1; i <= x2; i++) {
         if(divider ==1 || divider == y2){
          break;
         }
          if( !grid[divider][i].isTargetBox && !grid[divider][i].isPerson ){
            grid[divider][i].isWall = true;
          }
           
            
            grid[divider-1][i].isWall = false
            grid[divider+1][i].isWall = false
       
            grid[divider][passage].isWall = false;
    }
    grid[divider][passage].isWall = false;
   
    // Recursively divide the area above and below the divider
    this.verticalRecursive(grid, x1, y1, x2, divider - 1, minSize);
    this.verticalRecursive(grid, x1, divider + 1, x2, y2, minSize);
  } else {
    let divider = x1 + Math.floor(Math.random() * (x2-x1-minSize+1))+minSize ;

    // Create a passage through the divider
    let passage = y1 + Math.floor(Math.random() * (y2-y1+1 ));
    // Fill the area above and below the divider with walls
    for (let i = y1; i <= y2; i++) {
         if(divider ==1 || divider == x2){
          break;
         }
         if(!grid[i][divider].isTargetBox  && !grid[i][divider].isPerson){
          grid[i][divider].isWall = true;
        } 

          
            
            grid[i][divider-1].isWall = false
            grid[i][divider+1].isWall = false
       
            grid[passage][divider].isWall = false;
    }
    grid[passage][divider].isWall = false;
   
    // Recursively divide the area above and below the divider
    this.verticalRecursive(grid, x1, y1,divider - 1,y2,minSize);
    this.verticalRecursive(grid, divider + 1, y1, x2, y2, minSize);
  }
}
//this is the animated version
// drawWallsInCorners(){
//   let exexuteSecond = true;

//   for (let i = 0; i < this.nodes[0].length; i++) {
//     setTimeout(()=>{
//       this.nodes[0][i].isWall = true;
//       if(i==this.nodes[0].length-1){
//         for(let i=0;i< Math.trunc(window.innerHeight / 35);i++){
//           setTimeout(()=>{
//             this.nodes[i][0].isWall = true;
//              this.nodes[i][this.nodes[i].length-1].isWall = true;
//             // if(i ==this.nodes[0].length){
//               exexuteSecond = true;
//               if(i==Math.trunc(window.innerHeight / 35)-1){
//                 for (let i = 0; i < this.nodes[0].length; i++) {
//                   setTimeout(()=>{
//                     // this.nodes[0][i].isWall = true;
//                     this.nodes[this.nodes.length-1][i].isWall = true;
//                   },100*i)
                  
//                 }
//               }
//             // }
//           },100*i)
             
//         }
//       }
//       // this.nodes[this.nodes.length-1][i].isWall = true;
//     },100*i)
    
// }
// if(exexuteSecond){
//   // console.log("hi");
//   // for(let i=0;i< Math.trunc(window.innerHeight / 35);i++){
//   //   setTimeout(()=>{
//   //     // this.nodes[i][0].isWall = true;
//   //     this.nodes[i][this.nodes[i].length-1].isWall = true;
//   //   },100*i)
       
//   // }

// }




// }

drawWallsInCorners(){
  for(let i=0;i< Math.trunc(window.innerHeight / 35);i++){
    
    this.nodes[i][0].isWall = true;
    this.nodes[i][0].treeWall = true;

      this.nodes[i][this.nodes[i].length-1].isWall = true;
      this.nodes[i][this.nodes[i].length-1].treeWall = true;
   
       
  }
  for (let i = 0; i < this.nodes[0].length; i++) {
  
      this.nodes[0][i].isWall = true;
      this.nodes[0][i].treeWall = true;
      this.nodes[this.nodes.length-1][i].isWall = true;
      this.nodes[this.nodes.length-1][i].treeWall = true;
   
    
}
}
reinitialiseWall(){
  
  for (let i = 0; i < window.innerHeight / 35; i++) {
    for (let j = 0; j < Math.trunc(window.innerWidth / 30); j++) {
      this.nodes[i][j].isWall = false;
      this.nodes[i][j].treeWall = false
    }
  }
}
reinitialisePath(){
  this.board.path = [];
  console.log("path",this.board.path);
  this.visitedNode = [];
  this.visitedNodeSet = [];
  this.openSet = [];
  this.closedSet = [];
  for (let i = 0; i < window.innerHeight / 35; i++) {
    for (let j = 0; j < Math.trunc(window.innerWidth / 30); j++) {
      this.nodes[i][j].isPath = false;
    }
  }

  
}
reinitialiseStatus(){
  for (let i = 0; i < window.innerHeight / 35; i++) {
    for (let j = 0; j < Math.trunc(window.innerWidth / 30); j++) {
      this.nodes[i][j].isOpenSet = false;
      this.nodes[i][j].isClosedSet = false;
      this.nodes[i][j].isPerson = false;
      this.nodes[i][j].visited = false;
      this.nodes[i][j].queued = false;
    
    }
  }
}
reinitialisePathStatus(){
  for (let i = 0; i < window.innerHeight / 35; i++) {
    for (let j = 0; j < Math.trunc(window.innerWidth / 30); j++) {
      this.nodes[i][j].isOpenSet = false;
      this.nodes[i][j].isClosedSet = false;
      this.nodes[i][j].visited = false;
      this.nodes[i][j].queued = false;
    
    }
  }
}
reinitialisePathVisitedStatus(){
  for (let i = 0; i < window.innerHeight / 35; i++) {
    for (let j = 0; j < Math.trunc(window.innerWidth / 30); j++) {
      this.nodes[i][j].isOpenSet = false;
      this.nodes[i][j].isClosedSet = false;
      this.nodes[i][j].visited = false;
      this.nodes[i][j].queued = false;
      this.nodes[i][j].isPath = false;
    }
  }
}


clearBoardfct(){
  for (let i = 0; i < window.innerHeight / 35; i++) {
    for (let j = 0; j < Math.trunc(window.innerWidth / 30); j++) {
      this.nodes[i][j].isStartingbox = false;
      this.nodes[i][j].isTargetBox = false;
    }
  }
    //starting box
    this.nodes[8][Math.trunc(this.numberSquares / 2) - 10].isStartingbox = true;
    this.startingBox = this.nodes[8][Math.trunc(this.numberSquares / 2) - 10];
    this.nodes[8][Math.trunc(this.numberSquares / 2) - 10].isNormal = false;
    //target box
    this.nodes[8][Math.trunc(this.numberSquares / 2) + 10].isTargetBox = true;
    this.targetBox = this.nodes[8][Math.trunc(this.numberSquares / 2) + 10];
    this.nodes[8][Math.trunc(this.numberSquares / 2) + 10].isNormal = false;
    if(this.isPerson){
      this.isPerson = !this.isPerson;
    this.ngDoCheckRunOnce = false;
    }
    this.reinitialiseWall();
    this.reinitialiseStatus();
    this.reinitialisePath();

}
}


