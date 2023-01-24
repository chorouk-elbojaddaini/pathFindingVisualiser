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
  verify:boolean;
  
  constructor(public dijkstraService: DijkstraService) {}
  ngOnInit(): void {
    let wi = window.innerWidth;
    this.numberSquares = Math.trunc(wi / 30);
    
    this.getNodes();
    this.searchStartAndTarget();
    this.initialiseNodesNeighbours();
    this.board = this.dijkstraService.getBoard();
  }
  ngDoCheck(){
    this.verify = this.dijkstraService.verify;
    // console.log("hadiii verify",this.verify);

    
      this.searchStartAndTarget();
      switch(this.dijkstraService.algo){
        case 'astar':
        this.dijkstraService.reinitialisePathQueued();
        this.dijkstraService.aStarSearchAlgo(this.startingBox,this.targetBox);
        break;
        case "dijkstra" : 
        this.dijkstraService.reinitialisePathQueued();
      this.dijkstraService.dijkstraAlgorithm(this.startingBox,this.targetBox);
      break;
      

      
      
      // console.log("chosennalgo",this.dijkstraService.chosenAlgo);
      
      
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
          // console.log("hADI START F SEARCHA0",this.startingBox);
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
    if (node.isPath) {
      return 'path';
    }
    if(node.visited){
      return 'visited';
    }
    if(node.isClosedSet){
      return 'closed';
    }
    if(node.isOpenSet){
      return 'openset';
    }
    return 'normal';
  }

  mouseDown(node: Square) {
    if (node.isStartingbox) {
      this.board.mouseDown = true;
      this.startingBox = node;
      
      switch(this.dijkstraService.chosenAlgo){
        case 'A* Search':
          this.dijkstraService.aStarSearchAlgo(node, this.targetBox);
        break;
        case "Dijkstra's Algorithm" : 
        this.dijkstraService.dijkstraAlgorithm(node, this.targetBox);
        break;

      }

    

      this.board.currentNode = node;
      this.board.isSelectedNodeStart = true;
    } else if (node.isTargetBox) {
      this.board.mouseDown = true;
      this.targetBox = node;
      switch(this.dijkstraService.chosenAlgo){
        case 'A* Search':
          this.dijkstraService.aStarSearchAlgo(this.startingBox, node);
          break;
        case "Dijkstra's Algorithm" : 
        this.dijkstraService.dijkstraAlgorithm(this.startingBox, node);
        break;



      
    }
      this.board.currentNode = node;
      this.board.isSelectedNodeEnd = true;
    } else if (node.isNormal) {
      this.board.isWallDrawing = true;
    }
  }
  mouseLeave(node: Square) {
    if (this.board.mouseDown && this.board.isSelectedNodeStart) {
      node.isStartingbox = false;
    }
    if (this.board.mouseDown && this.board.isSelectedNodeEnd) {
      node.isTargetBox = false;
    }
  }
  mouseEnter(node: Square) {
    if (this.board.mouseDown && this.board.isSelectedNodeStart) {
      this.board.mouseEnter = true;
      this.board.enteredNode = node;
      if (!node.isTargetBox) {
        node.isStartingbox = true;
        this.startingBox = node;
        
          switch(this.dijkstraService.chosenAlgo){
            case 'A* Search':
              this.dijkstraService.aStarSearchAlgo(node, this.targetBox);
              break;
            case "Dijkstra's Algorithm" : 
            this.dijkstraService.dijkstraAlgorithm(node, this.targetBox);
            break;
    

      }
      }
    } else if (this.board.mouseDown && this.board.isSelectedNodeEnd) {
      this.board.mouseEnter = true;
      this.board.enteredNode = node;
      if (!node.isStartingbox) {
        node.isTargetBox = true;
        this.targetBox = node;
          switch(this.dijkstraService.chosenAlgo){
            case 'A* Search':
              this.dijkstraService.aStarSearchAlgo(this.startingBox, node);
              break;
            case "Dijkstra's Algorithm" : 
        this.dijkstraService.dijkstraAlgorithm(this.startingBox, node);
        break;
    


        
      
      
      }
      }
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
          switch(this.dijkstraService.chosenAlgo){
            case 'A* Search':
              this.dijkstraService.aStarSearchAlgo(node, this.targetBox);
              break;
            case "Dijkstra's Algorithm" : 
         this.dijkstraService.dijkstraAlgorithm(node, this.targetBox);
        break;
    

        
      
      }
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
        
        switch(this.dijkstraService.chosenAlgo){
          case 'A* Search':
            this.dijkstraService.aStarSearchAlgo(this.startingBox, node);
            break;
          case "Dijkstra's Algorithm" : 
          this.dijkstraService.dijkstraAlgorithm(this.startingBox, node);

      break;
  

      
    
    }
        
      
      }
    } else if (this.board.isWallDrawing) {
      this.board.isWallDrawing = false;
    }
  }
  addWall(node: Square) {
    if (!node.isStartingbox && !node.isTargetBox && !node.isPath) {
      node.isWall = !node.isWall;
    }
  }
}
