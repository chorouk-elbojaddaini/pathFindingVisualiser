import { Component } from '@angular/core';
import { NavbarComponent } from '../navbar/navbar.component';
import { Board } from '../shared/boardModele';
import { DijkstraService } from '../shared/pathFindingAlgorithms/dijkstra.service';
import { Square } from '../shared/squareModele';

@Component({
  selector: 'app-grille',
  templateUrl: './grille.component.html',
  styleUrls: ['./grille.component.scss'],
})
export class GrilleComponent {
  numberSquares: number;
  board: Board;
  nodes: Square[][];
  startingBox: Square;
  targetBox: Square;
  searching: boolean = true;
  queue: Square[];
  currentBox: Square;
  isPerson: boolean;
  personNode: Square;
  ngDoCheckRunOnce: boolean = false;
  ngDoCheckRunAlgo:boolean = false;
  ngDoCheckRun: boolean = false;
  previousValue:string = 'maze';
  searchingDij = true;
  flag = false
  flagBreadth = false;
  flagDepth = false;
  isSearchingBreadth = true;
  isSearchingDepth = true;
  isClosedArr :Square[] = [] ;
  isAnimating = true;
  flagAstar : boolean = false;
  flagGreedy:boolean = false;
  constructor(public dijkstraService: DijkstraService) {}
  ngOnInit(): void {
    let wi = window.innerWidth;
    this.numberSquares = Math.trunc(wi / 30);

    this.getNodes();
    this.searchStartAndTarget();
    this.initialiseNodesNeighbours();
    this.board = this.dijkstraService.getBoard();
    this.ngDoCheckRunOnce = false;
   
   
  }
  // initState(){
  //   this.searchingDij = true;
  // }
  ngDoCheck() {
    


    if(this.dijkstraService.clearPath){
      this.dijkstraService.reinitialisePathStatus();
      this.dijkstraService.reinitialisePath();
     
      this.dijkstraService.algo = null;
      this.dijkstraService.clearPath = false;
    }
    if(this.dijkstraService.clearBoard){
      this.dijkstraService.clearBoardfct();
    this.dijkstraService.algo = null;
      this.dijkstraService.clearBoard = false;
    }
    this.isPerson = this.dijkstraService.isPerson;
    if (!this.dijkstraService.ngDoCheckRunOnce && this.isPerson) {
      this.NotPersonfct();
      if(this.nodes[3][25].isWall){
        this.nodes[3][25].isWall = false;
      }
      this.nodes[3][25].isPerson = true;
      this.personNode = this.nodes[3][25];
      this.dijkstraService.ngDoCheckRunOnce = true;
    }
    if (!this.dijkstraService.ngDoCheckRunOnce && !this.isPerson) {
      this.NotPersonfct();
      this.nodes[3][25].isPerson = false;
      this.personNode = this.nodes[3][25];
      this.dijkstraService.ngDoCheckRunOnce = true;
    }
    
    this.searchStartAndTarget();
    
    switch (this.dijkstraService.algo) {
      case 'astar':
      
      this.flagBreadth = false;
      this.flagGreedy = false;
      this.flag = false;
      this.flagDepth = false;
      this.isClosedArr ;
      let closed = []
      let closedP = [];
      let someClosed = [];
      if(this.dijkstraService.isAnimated ){
          
        if(this.isPerson){
          closed= this.dijkstraService.aStarSearchAlgo(this.startingBox , this.personNode,true).closed;
          closedP = this.dijkstraService.aStarSearchAlgo(this.personNode , this.targetBox,true).closed;
          someClosed = closed.concat(closedP);
          this.board.path = this.dijkstraService.aStarSearchAlgo(this.startingBox , this.personNode,true).path.reverse();
          for(let i=0;i<someClosed.length;i++){
            this.dijkstraService.pointer = true;
            setTimeout(()=>{
              this.currentBox = someClosed[i];
              this.currentBox.visitedAnimation = true;
             
              
              if (i === someClosed.length - 1) {
            this.dijkstraService.pointer = false;
                this.flagAstar = true;
                for(let i=0;i<this.board.path.length;i++){
                  
                    this.currentBox = this.board.path[i];
                    
                    this.currentBox.isPath = true;
                  
                }
              }
            }, 100*i)
          } 

        }
        else{
          this.isClosedArr= this.dijkstraService.aStarSearchAlgo(this.startingBox , this.targetBox,true).closed;
          this.board.path = this.dijkstraService.aStarSearchAlgo(this.startingBox , this.targetBox,true).path.reverse();
         
          for(let i=0;i<this.isClosedArr.length;i++){
            this.dijkstraService.pointer = true;
           setTimeout(()=>{
             this.currentBox = this.isClosedArr[i];
             this.currentBox.visitedAnimation = true;
             
             
             if (i === this.isClosedArr.length - 1) {
               this.flagAstar = true;
            this.dijkstraService.pointer = false;
               for(let i=0;i<this.board.path.length;i++){
                 
                   this.currentBox = this.board.path[i];
                   
                   this.currentBox.isPath = true;
                 
               }
             }
           }, 100 * i)
         } 
         
         
      
        }
        this.dijkstraService.isAnimated =false;

       }  

       if(this.flagAstar){

       
        this.dijkstraService.reinitialisePathQueued();
        if (this.isPerson) {
          this.dijkstraService.aStarSearchAlgo(
            this.startingBox,
            this.personNode,
            false
          );
          if (this.board.path.length != 0) {
            this.dijkstraService.aStarSearchAlgo(
              this.personNode,
              this.targetBox,
              false
            );
          }
        } else {
          this.dijkstraService.aStarSearchAlgo(
            this.startingBox,
            this.targetBox,
            false
          );
        }
      }
        break;
      case 'dijkstra':
    
      let visited = [];
      let visitedP = [];
      let sommeVisited = [];
      this.flagGreedy = false;
      this.flagAstar = false
      this.flagBreadth = false;
      this.flagDepth = false;

      if(this.dijkstraService.isAnimated ){

        if(this.isPerson){
          visited= this.dijkstraService.dijkstraAlgorithm(this.startingBox , this.personNode,true).queue;
          visitedP = this.dijkstraService.dijkstraAlgorithm(this.personNode , this.targetBox,true).queue;
          sommeVisited = visited.concat(visitedP);
          this.board.path = this.dijkstraService.dijkstraAlgorithm(this.startingBox , this.personNode,true).path.reverse();
          for(let i=0,delay=1;i<sommeVisited.length;i++,delay++){
            this.dijkstraService.pointer = true;
            setTimeout(()=>{
              this.currentBox = sommeVisited[i];
              this.currentBox.visitedAnimation = true;
         
              if (i === sommeVisited.length - 1) {
                this.flag = true;
            this.dijkstraService.pointer = false;
                
                for(let i=0;i<this.board.path.length;i++){
                  
                    this.currentBox = this.board.path[i];
                    this.currentBox.isPath = true;
                  
                }
              }
            },100*delay)
            
          } 
          
         }
        
        else{
          visited= this.dijkstraService.dijkstraAlgorithm(this.startingBox , this.targetBox,true).queue;
          this.board.path = this.dijkstraService.dijkstraAlgorithm(this.startingBox , this.targetBox,true).path.reverse();
          for(let i=0;i<visited.length;i++){
            this.dijkstraService.pointer = true;

            setTimeout(()=>{
              this.currentBox = visited[i];
              
              this.currentBox.visitedAnimation = true;
         
              if (i === visited.length - 1) {
                this.dijkstraService.pointer = false;
                this.flag = true;
                for(let i=0;i<this.board.path.length;i++){
                  
                    this.currentBox = this.board.path[i];
                  
                    this.currentBox.isPath = true;
                  
                }
              }
            }, 32 * i)
          } 
        

        }
       
       
        
        
        this.dijkstraService.isAnimated =false;

       }
      
       if(this.flag){
         console.log("i am being executed");
        this.dijkstraService.reinitialisePathQueued();
      
         if (this.isPerson) {
           this.dijkstraService.dijkstraAlgorithm(
             this.startingBox,
             this.personNode,
             false
           );
      
           if (this.board.path.length != 0) {
             this.dijkstraService.dijkstraAlgorithm(
               this.personNode,
               this.targetBox,
               false
             );
           }
         } else {
           this.dijkstraService.dijkstraAlgorithm(
             this.startingBox,
             this.targetBox,
             false
            
           );
         } 
       
       }
        
    
        break;
      case 'greedy':
        if(this.dijkstraService.isAnimated ){
          this.flagBreadth = false;
          this.flag = false;
          this.flagAstar = false;
          this.flagDepth = false;
          this.isClosedArr ;
          let closed = []
          let closedP = [];
          let someClosed = [];
          
              
            if(this.isPerson){
              closed= this.dijkstraService.greedyBestFirstSearch(this.startingBox , this.personNode,true).closed;
              closedP = this.dijkstraService.greedyBestFirstSearch(this.personNode , this.targetBox,true).closed;
              someClosed = closed.concat(closedP);
              this.board.path = this.dijkstraService.greedyBestFirstSearch(this.startingBox , this.personNode,true).path.reverse();
              for(let i=0;i<someClosed.length;i++){
            this.dijkstraService.pointer = true;
                setTimeout(()=>{
                  this.currentBox = someClosed[i];
                  this.currentBox.isClosedSet = true;
                 
                  if (i === someClosed.length - 1) {
                   this.dijkstraService.pointer = false;

                    this.flagGreedy = true;
                    for(let i=0;i<this.board.path.length;i++){
                      
                        this.currentBox = this.board.path[i];
                        
                        this.currentBox.isPath = true;
                      
                    }
                  }
                }, 100*i)
              } 
    
            }
            else{
              this.isClosedArr= this.dijkstraService.greedyBestFirstSearch(this.startingBox , this.targetBox,true).closed;
              this.board.path = this.dijkstraService.greedyBestFirstSearch(this.startingBox , this.targetBox,true).path.reverse();
             
              for(let i=0;i<this.isClosedArr.length;i++){
            this.dijkstraService.pointer = true;
               setTimeout(()=>{
                 this.currentBox = this.isClosedArr[i];
                 this.currentBox.isClosedSet = true;
                 
                 
                 if (i === this.isClosedArr.length - 1) {
                   this.dijkstraService.pointer = false;
                   this.flagGreedy = true;
                   for(let i=0;i<this.board.path.length;i++){
                     
                       this.currentBox = this.board.path[i];
                       
                       this.currentBox.isPath = true;
                     
                   }
                 }
               }, 100 * i)
             } 
             
             
          
            }
            this.dijkstraService.isAnimated =false;
    
           }  
    
        
        //runs all the time
        if(this.flagGreedy){

       
          this.dijkstraService.reinitialisePathQueued();
          if (this.isPerson) {
            this.dijkstraService.aStarSearchAlgo(
              this.startingBox,
              this.personNode,
              false
            );
            if (this.board.path.length != 0) {
              this.dijkstraService.aStarSearchAlgo(
                this.personNode,
                this.targetBox,
                false
              );
            }
          } else {
            this.dijkstraService.aStarSearchAlgo(
              this.startingBox,
              this.targetBox,
              false
            );
          }
        }
        break;
      case 'breadth':
       
        if(this.dijkstraService.isAnimated ){
          this.flagGreedy = false;
          this.flag = false;
          this.flagDepth = false;
          this.flagAstar = false;
          this.isClosedArr ;
          let visited = []
          let visitedP = [];
          let someVisited = [];
          
              
            if(this.isPerson){
              visited= this.dijkstraService.breadthFirstSearch(this.startingBox , this.personNode,true).visited;
              visitedP = this.dijkstraService.breadthFirstSearch(this.personNode , this.targetBox,true).visited;
              someVisited= visited.concat(visitedP);
               this.board.path = this.dijkstraService.breadthFirstSearch(this.startingBox , this.personNode,true).path.reverse();
               for(let i=0;i<someVisited.length;i++){
            this.dijkstraService.pointer = true;
              setTimeout(()=>{
                 this.currentBox = someVisited[i];
                this.currentBox.visitedAnimation = true;
                 
                  
                  if (i === someVisited.length - 1) {
                    this.flagBreadth = true;
                   this.dijkstraService.pointer = false;
                 for(let i=0;i<this.board.path.length;i++){
                      
                       this.currentBox = this.board.path[i];
                        
                         this.currentBox.isPath = true;
                      
                     }
                   }
                 }, 100*i)
               } 
    
            }
            else{
              let visited= this.dijkstraService.breadthFirstSearch(this.startingBox , this.targetBox,true).visited;
          this.board.path = this.dijkstraService.breadthFirstSearch(this.startingBox , this.targetBox,true).path.reverse();
          for(let i=0;i<visited.length;i++){
            this.dijkstraService.pointer = true;
           setTimeout(()=>{
             this.currentBox = visited[i];
             console.log(this.currentBox);
             this.currentBox.visitedAnimation = true;
             if (i === visited.length - 1) {
              this.dijkstraService.pointer = false;
               this.flagBreadth = true;
               for(let i=0;i<this.board.path.length;i++){
                 
                   this.currentBox = this.board.path[i];
                   console.log(this.currentBox);
                   this.currentBox.isPath = true;
                
               }
             }
           }, 100 *i)
         } 
        }
            this.dijkstraService.isAnimated =false;
    
           }  
        if(this.flagBreadth){
         this.dijkstraService.reinitialisePathQueued();
       
          if (this.isPerson) {
            this.dijkstraService.breadthFirstSearch(
              this.startingBox,
              this.personNode,
              false
            );
       
            if (this.board.path.length != 0) {
              this.dijkstraService.breadthFirstSearch(
                this.personNode,
                this.targetBox,
                false
              );
            }
          } else {
            this.dijkstraService.breadthFirstSearch(
              this.startingBox,
              this.targetBox,
              false
             
            );
          } 
        
        }  
        

     
         break;
      case 'depth':
          if(this.dijkstraService.isAnimated ){
            this.flagGreedy = false;
            this.flag = false;
            this.flagBreadth = false;
            this.flagAstar = false;
            this.isClosedArr ;
            let visited = []
            let visitedP = [];
            let someVisited = [];
            
                
              if(this.isPerson){
                 visited= this.dijkstraService.DepthFirstSearch(this.startingBox , this.personNode,true).visited;
                visitedP = this.dijkstraService.DepthFirstSearch(this.personNode , this.targetBox,true).visited;
                 someVisited= visited.concat(visitedP);
                 this.board.path = this.dijkstraService.DepthFirstSearch(this.startingBox , this.personNode,true).path.reverse();
                for(let i=0;i<someVisited.length;i++){
            this.dijkstraService.pointer = true;
                  setTimeout(()=>{
                 this.currentBox = someVisited[i];
                  this.currentBox.visitedAnimation = true;
                   
                    
                    if (i === someVisited.length - 1) {
            this.dijkstraService.pointer = false;

                      this.flagDepth = true;
                  for(let i=0;i<this.board.path.length;i++){
                        
                     this.currentBox = this.board.path[i];
                          
                    this.currentBox.isPath = true;
                        
                      }
                    }
                 }, 1000)
                } 
      
               }
              else{
             let visited= this.dijkstraService.DepthFirstSearch(this.startingBox , this.targetBox,true).visited;
            this.board.path = this.dijkstraService.DepthFirstSearch(this.startingBox , this.targetBox,true).path.reverse();
           for(let i=0;i<visited.length;i++){
            this.dijkstraService.pointer = true;
             setTimeout(()=>{
            this.currentBox = visited[i];
              this.currentBox.visitedAnimation = true;
              if (i === visited.length - 1) {
            this.dijkstraService.pointer = false;
          this.flagDepth = true;
               for(let i=0;i<this.board.path.length;i++){
                   
                  this.currentBox = this.board.path[i];
                console.log(this.currentBox);
                    this.currentBox.isPath = true;
                  
              }
             }
           }, 100 *i)
           } 
          }
              this.dijkstraService.isAnimated =false;
      
             }  
            
         //runs all the time
        if(this.flagDepth){

            this.dijkstraService.reinitialisePathQueued();

        if (this.isPerson) {
          this.dijkstraService.DepthFirstSearch(
            this.startingBox,
            this.personNode,
            false
          );
          if (this.board.path.length != 0) {
            this.dijkstraService.DepthFirstSearch(
              this.personNode,
              this.targetBox,
              false
            );
          }
        } else {
          this.dijkstraService.DepthFirstSearch(
            this.startingBox,
            this.targetBox,
            false
          );
        }
        }
         break;
      
    }
  
    if (this.dijkstraService.mazePattern !== this.previousValue) {
      
      this.dijkstraService.reinitialiseWall();
      switch(this.dijkstraService.mazePattern){
        case 'Basic Random Maze' :
          this.dijkstraService.randomMaze();
          break;
          case 'Simple Stair Pattern' :
            this.dijkstraService.simpleStairPattern();
          break;
          case 'Recursive Division':
            this.dijkstraService.drawWallsInCorners();
            this.dijkstraService.recursiveDivision(this.nodes,1,1,Math.trunc(window.innerWidth / 30)-2, Math.trunc(window.innerHeight / 35)-2,1);
            break;
          case'Horizontal Recursive Division':
           this.dijkstraService.drawWallsInCorners();
           this.dijkstraService.createMaze(this.nodes,1,1,Math.trunc(window.innerWidth / 30)-2, Math.trunc(window.innerHeight / 35)-2,1);
           break;
           case 'Vertical Recursive Division':
           this.dijkstraService.drawWallsInCorners();
            this.dijkstraService.verticalRecursive(this.nodes,1,1,Math.trunc(window.innerWidth / 30)-2, Math.trunc(window.innerHeight / 35)-2,1);
            break;
    }
      this.previousValue = this.dijkstraService.mazePattern;
    }
   
  }
 
   NotPersonfct(){
    for (let i = 0; i < window.innerHeight / 35; i++) {
      for (let j = 0; j < Math.trunc(window.innerWidth / 30); j++) {
        this.nodes[i][j].isPerson = false;
      }
    }
   }
  getNodes() {
    this.nodes = this.dijkstraService.initialiseGrid();
  }
  initialiseNodesNeighbours() {
    for (let i = 0; i < window.innerHeight / 35; i++) {
      for (let j = 0; j < Math.trunc(window.innerWidth / 30); j++) {
        this.nodes[i][j].setNeighbours(this.nodes);
      }
    }
  }
  searchStartAndTarget() {
    let wi = window.innerWidth;
    this.numberSquares = Math.trunc(wi / 30);
    for (let i = 0; i < window.innerHeight / 35; i++) {
      for (let j = 0; j < Math.trunc(window.innerWidth / 30); j++) {
        if (this.nodes[i][j].isStartingbox) {
          this.startingBox = this.nodes[i][j];
        }
        if (this.nodes[i][j].isTargetBox) {
          this.targetBox = this.nodes[i][j];
        }
      }
    }
  }

  reinitialisePathQueued() {
    for (let i = 0; i < window.innerHeight / 35; i++) {
      for (let j = 0; j < Math.trunc(window.innerWidth / 30); j++) {
        this.nodes[i][j].queued = false;
        this.nodes[i][j].isPath = false;
      }
    }
  }

  statusNode(node: Square): string {
    if (node.isStartingbox) {
      return 'start';
    }
    if (node.isTargetBox) {
      return 'target';
    }
    if (node.isWall && !node.treeWall) {
      return 'wall';
    }
   
    if(node.treeWall && node.isWall){
      return 'treeWall';
    }
 
    if (node.isPath && !node.isPerson) {
      return 'path';
    }
    if (node.visited && !node.isPerson) {
      return 'visited';
    }
    if (node.visitedAnimation && !node.isPerson) {
      return 'visitedAnimation';
    }
    
    if (node.isClosedSet && !node.isPerson) {
      return 'closed';
    }
    // if (node.isOpenSet && !node.isPerson) {
    //   return 'openset';
    // }
    if (node.isPerson) {
      return 'person';
    }
    return 'normal';
  }
  
  mouseDown(node: Square) {
    if(!this.dijkstraService.pointer){
      if (node.isStartingbox) {
        this.board.mouseDown = true;
        this.startingBox = node;
  
     
  
        this.board.currentNode = node;
        this.board.isSelectedNodeStart = true;
      } else if (node.isTargetBox) {
        this.board.mouseDown = true;
        this.targetBox = node;
  
     
        this.board.currentNode = node;
        this.board.isSelectedNodeEnd = true;
      } else if (node.isPerson && !node.isTargetBox) {
        this.board.mouseDown = true;
        this.personNode = node;
        
        this.board.currentNode = node;
        this.board.isSelectedNodePerson = true;
        this.board.isSelectedNodeEnd = false;
      } else if (node.isNormal) {
        this.board.isWallDrawing = true;
      }
    }
    
  }
  mouseLeave(node: Square) {
    if (this.board.mouseDown && this.board.isSelectedNodeStart) {
      node.isStartingbox = false;
    }
    if (this.board.mouseDown && this.board.isSelectedNodeEnd) {
      this.board.isSelectedNodePerson = false;
      node.isTargetBox = false;
    }
    if (this.board.mouseDown && this.board.isSelectedNodePerson) {
      this.board.isSelectedNodeEnd = false;
      this.nodes[3][25].isPerson = false;
      node.isPerson = false;
    }
  }
  mouseEnter(node: Square) {
    if (this.board.mouseDown && this.board.isSelectedNodeStart) {
      this.board.mouseEnter = true;
      this.board.enteredNode = node;
      if (!node.isTargetBox) {
        node.isStartingbox = true;
        this.startingBox = node;

       
      }
    } else if (this.board.mouseDown && this.board.isSelectedNodeEnd) {
      this.board.mouseEnter = true;
      this.board.enteredNode = node;
      if (!node.isStartingbox) {
        node.isTargetBox = true;
        this.targetBox = node;

      }
    } else if (
      this.board.mouseDown &&
      this.board.isSelectedNodePerson &&
      !this.board.isSelectedNodeEnd
    ) {
      this.board.mouseEnter = true;
      this.board.isSelectedNodeEnd = false;
      this.board.enteredNode = node;
      node.isPerson = true;
      this.personNode = node;
      
    } else if (this.board.isWallDrawing && !node.isPath) {
      node.isWall = !node.isWall;
    }
  }
  mouseUp(node: Square) {
    if (
      this.board.mouseEnter &&
      this.board.isSelectedNodeStart &&
      !node.isTargetBox
    ) {
      this.board.mouseUp = true;
      this.board.mouseEnter = false;
      this.board.mouseDown = false;
      this.board.enteredNode = node;
      this.board.isSelectedNodeStart = false;
      if (!node.isTargetBox) {
        node.isStartingbox = true;
        this.startingBox = node;

       
      }
    } else if (
      this.board.mouseEnter &&
      this.board.isSelectedNodeEnd &&
      !node.isStartingbox
    ) {
      this.board.mouseUp = true;
      this.board.mouseEnter = false;
      this.board.mouseDown = false;
      this.board.enteredNode = node;
      if (!node.isStartingbox) {
        node.isTargetBox = true;
        this.targetBox = node;

      
      }
    } else if (this.board.mouseEnter && this.board.isSelectedNodePerson) {
      this.board.mouseUp = true;
      this.board.mouseEnter = false;
      this.board.mouseDown = false;
      this.board.enteredNode = node;
      node.isPerson = true;
      this.personNode = node;

    } else if (this.board.isWallDrawing) {
      this.board.isWallDrawing = false;
    }
  }
  addWall(node: Square) {
    if (
      !node.isStartingbox &&
      !node.isTargetBox &&
      !node.isPath &&
      !node.isPerson
    ) {
      node.isWall = !node.isWall;
     
    }
  }
}
