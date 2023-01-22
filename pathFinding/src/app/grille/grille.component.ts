import { Component } from '@angular/core';
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
  startingBox:Square;
  targetBox:Square;
  searching:boolean=true;
  queue: Square[];
  currentBox: Square;
  
  ngOnInit(): void {
    let wi = window.innerWidth;
    this.numberSquares = Math.trunc(wi / 30);
    this.board = new Board(
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
      false,[]
    );
    this.initialiseGrid();
     this.initialiseNodesNeighbours();
     
    //  this.dijkstra();
    // console.log(this.nodes);
    // console.log('hi');
    // console.log(this.numberSquares);
  }
  ngOnchange() {}
  test(node: Square) {
    // console.log(` this is i=>${node.row} ,this is j =>${node.col}`);
  }
  test2() {
    console.log('click events');
  }

  initialiseGrid() {
    this.nodes = [];
    for (let i = 0; i < window.innerHeight / 35; i++) {
      this.nodes[i] = [];
      for (let j = 0; j < Math.trunc(window.innerWidth / 30); j++) {
        this.nodes[i][j] = new Square(i, j, false, false, false, false,true,[],false,false,null,false);
      
        if (i == 8 && j == Math.trunc(this.numberSquares / 2) - 15) {
          this.nodes[i][j].isStartingbox = true;
           this.startingBox =this.nodes[i][j];
          this.nodes[i][j].isNormal = false; 
        }
        if (i == 8 && j == Math.trunc(this.numberSquares / 2) + 10) {
          this.nodes[i][j].isTargetBox = true;
         this.targetBox = this.nodes[i][j];
          this.nodes[i][j].isNormal = false; 
        }
      }
    }
  }
   initialiseNodesNeighbours(){
   
    for (let i = 0; i < window.innerHeight / 40; i++) {
      for (let j = 0; j < Math.trunc(window.innerWidth / 30); j++) {
             this.nodes[i][j].setNeighbours(this.nodes);
            //  console.log(this.nodes[i][j],this.nodes[i][j].neighbours);
      }
    }
   }
   //nrj3o neighbours machi queued 
    reinitialisePathQueued(){
      for (let i = 0; i < window.innerHeight / 40; i++) {
        for (let j = 0; j < Math.trunc(window.innerWidth / 30); j++) {
               this.nodes[i][j].queued = false;
               this.nodes[i][j].isPath = false;
    }
  }
}




   dijkstraAlgorithm(nodeStart:Square,nodeTarget:Square) {
    
     this.reinitialisePathQueued();
    console.log("hadi starting",nodeStart);
    this.queue = [];
    this.queue.push(nodeStart);
     console.log("hadi queue",this.queue);
     
    nodeStart.queued=true;
     while(this.queue.length > 0 && this.searching) {
      console.log("dakhl l while");
     this.currentBox = this.queue.shift();

     nodeStart.visited=true;
    
     if (this.currentBox == nodeTarget) {
            console.log("chorouk dkiya o rim hmara");
          this.searching = false;
          do{
            this.board.path.push(this.currentBox);
            this.currentBox.isPath = true;
            this.currentBox = this.currentBox.prior;

          }while(this.currentBox != nodeStart)
      }
      else {
        console.log("hadi elseee");
        console.log("current box",this.currentBox);
        console.log("neighbouuurs ",this.currentBox.neighbours);
        this.currentBox.neighbours.forEach(neighbour => {
          if(!neighbour.queued && !neighbour.isWall){
            neighbour.queued = true;
            neighbour.prior = this.currentBox;
            this.queue.push(neighbour);
            console.log("neighb");
          }
          // console.log("neighb",this.currentBox.neighbours);

        });
      }
    }
    console.log("pathhhhhhh",this.board.path);
    return this.board.path;
  }
  statusNode(node: Square): string {
    if (node.isStartingbox) {
      return 'start';
    }
    if (node.isTargetBox) {
      return 'target';
    }
    if(node.isWall){
      return 'wall';
    }
    if(node.isPath){
      return 'path';
    }
    return 'normal';
  }

  mouseDown(node: Square) {
    if (node.isStartingbox ) {
      this.board.mouseDown = true;
      this.searching = true;
     this.board.path = [];
     this.startingBox = node;
      this.dijkstraAlgorithm(node,this.targetBox);
  
      this.board.currentNode = node;
      this.board.isSelectedNodeStart=true;
      // console.log(`this is the MOUSE DOWN ${node.row} ${node.col}`);
    }
    else if(node.isTargetBox){
      this.board.mouseDown = true;
      this.searching = true;
      this.board.path = [];
      this.targetBox =node;
       this.dijkstraAlgorithm(this.startingBox,node);
      this.board.currentNode = node;
      this.board.isSelectedNodeEnd=true;
    }
    else if(node.isNormal){
      this.board.isWallDrawing=true
    }
    
  }
  mouseLeave(node: Square) {
    if (this.board.mouseDown && this.board.isSelectedNodeStart) {
      node.isStartingbox = false;

      

      // console.log(`this is the MOUSE LEAVE ${node.row} ${node.col}`);
    }
    if(this.board.mouseDown && this.board.isSelectedNodeEnd){
      node.isTargetBox=false;
    }
  }
  mouseEnter(node: Square) {
    if (this.board.mouseDown && this.board.isSelectedNodeStart) {
      this.board.mouseEnter = true;
      this.board.enteredNode = node;
      if(!node.isTargetBox){
        node.isStartingbox = true;
        this.searching = true;
     this.board.path = [];
     this.startingBox = node;
      this.dijkstraAlgorithm(node,this.targetBox); 
        
      }


      // console.log(`this is the MOUSE ENTER ${node.row} ${node.col}`);
    }
    else if(this.board.mouseDown && this.board.isSelectedNodeEnd){
      this.board.mouseEnter = true;
      this.board.enteredNode = node;
      if(!node.isStartingbox){
        node.isTargetBox = true;
        this.searching = true;
      this.board.path = [];
      this.targetBox =node;

       this.dijkstraAlgorithm(this.startingBox,node);
      }
     
    }
    else if(this.board.isWallDrawing){
      node.isWall = !node.isWall;

    }
     
    
  }
  mouseUp(node: Square) {
    if (this.board.mouseEnter && this.board.isSelectedNodeStart && !node.isTargetBox) {
      this.board.mouseUp = true;
      this.board.mouseEnter = false;
      this.board.mouseDown = false;
      this.board.enteredNode = node;
      this.board.isSelectedNodeStart=false;
      if(!node.isTargetBox){
        node.isStartingbox = true;
        this.searching = true;
     this.board.path = [];
     this.startingBox = node;
      this.dijkstraAlgorithm(node,this.targetBox) 

      }
      

      // console.log(`this is the MOUSE UP ${node.row} ${node.col}`);
    }
    else if(this.board.mouseEnter && this.board.isSelectedNodeEnd &&!node.isStartingbox){
      this.board.mouseUp = true;
      this.board.mouseEnter = false;
      this.board.mouseDown = false;
      this.board.enteredNode = node;
      if(!node.isStartingbox){
        node.isTargetBox = true;
        this.searching = true;
      this.board.path = [];
      this.targetBox =node;
       this.dijkstraAlgorithm(this.startingBox,node);
      }

      // console.log(`this is the MOUSE UP ${node.row} ${node.col}`);
    }
    else if(this.board.isWallDrawing){
      this.board.isWallDrawing=false;
    }
  }
  addWall(node:Square){
    if(!node.isStartingbox && !node.isTargetBox && !node.isPath){
      node.isWall = !node.isWall;
    }
   
  }
}
