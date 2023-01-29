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
        
        this.dijkstraService.reinitialisePathQueued();
        if (this.isPerson) {
          this.dijkstraService.aStarSearchAlgo(
            this.startingBox,
            this.personNode
          );
          if (this.board.path.length != 0) {
            this.dijkstraService.aStarSearchAlgo(
              this.personNode,
              this.targetBox
            );
          }
        } else {
          this.dijkstraService.aStarSearchAlgo(
            this.startingBox,
            this.targetBox
          );
        }

        break;
      case 'dijkstra':
      
        this.dijkstraService.reinitialisePathQueued();

        if (this.isPerson) {
          this.dijkstraService.dijkstraAlgorithm(
            this.startingBox,
            this.personNode
          );

          if (this.board.path.length != 0) {
            this.dijkstraService.dijkstraAlgorithm(
              this.personNode,
              this.targetBox
            );
          }
        } else {
          this.dijkstraService.dijkstraAlgorithm(
            this.startingBox,
            this.targetBox
          );
        } 
    
        break;
      case 'greedy':
        this.dijkstraService.reinitialisePathQueued();

        if (this.isPerson) {
          this.dijkstraService.greedyBestFirstSearch(
            this.startingBox,
            this.personNode
          );
          if (this.board.path.length != 0) {
            this.dijkstraService.greedyBestFirstSearch(
              this.personNode,
              this.targetBox
            );
          }
        } else {
          this.dijkstraService.greedyBestFirstSearch(
            this.startingBox,
            this.targetBox
          );
        }
        break;
      case 'breadth':
        this.dijkstraService.reinitialisePathQueued();

        if (this.isPerson) {
          this.dijkstraService.breadthFirstSearch(
            this.startingBox,
            this.personNode
          );
          if (this.board.path.length != 0) {
            this.dijkstraService.breadthFirstSearch(
              this.personNode,
              this.targetBox
            );
          }
        } else {
          this.dijkstraService.breadthFirstSearch(
            this.startingBox,
            this.targetBox
          );
        }
        break;
        case 'depth':
        this.dijkstraService.reinitialisePathQueued();

        if (this.isPerson) {
          this.dijkstraService.DepthFirstSearch(
            this.startingBox,
            this.personNode
          );
          if (this.board.path.length != 0) {
            this.dijkstraService.DepthFirstSearch(
              this.personNode,
              this.targetBox
            );
          }
        } else {
          this.dijkstraService.DepthFirstSearch(
            this.startingBox,
            this.targetBox
          );
        }
        break;
      case 'swarm':
        this.dijkstraService.reinitialisePathQueued();

        if (this.isPerson) {
          this.dijkstraService.swarmAlgorithm(
            this.startingBox,
            this.personNode
          );
          if (this.board.path.length != 0) {
            this.dijkstraService.swarmAlgorithm(
              this.personNode,
              this.targetBox
            );
          }
        } else {
          this.dijkstraService.swarmAlgorithm(this.startingBox, this.targetBox);
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
    if (node.isWall) {
      return 'wall';
    }
    if (node.isPath && !node.isPerson) {
      return 'path';
    }
    if (node.visited && !node.isPerson) {
      return 'visited';
    }
    if (node.isClosedSet && !node.isPerson) {
      return 'closed';
    }
    if (node.isOpenSet && !node.isPerson) {
      return 'openset';
    }
    if (node.isPerson) {
      return 'person';
    }
    return 'normal';
  }

  mouseDown(node: Square) {
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
