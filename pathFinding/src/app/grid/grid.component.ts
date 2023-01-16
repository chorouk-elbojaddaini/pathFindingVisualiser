import { Component, ElementRef, OnInit } from '@angular/core';
import { Square } from '../shared/squareModele';

@Component({
  selector: 'app-grid',
  templateUrl: './grid.component.html',
  styleUrls: ['./grid.component.scss']
})
export class GridComponent implements OnInit {

  squares:Square[][];
  widthSquare:number=42;
  numberSquares:number;
  constructor(private elem: ElementRef) { }
 /* details(x:Square){
    console.log(x.boxNumber,x.x,x.y,x.isStartingbox);
    }
    
  */
  ngOnInit(): void {
    let widthGrid = 1230;
    let wi = window.innerWidth;
    console.log("hadi wi ",wi);
    console.log("width grid",widthGrid);
    this.numberSquares = Math.trunc(wi/this.widthSquare);
    console.log("width of one squere",this.widthSquare);
    console.log("numbers squares",this.numberSquares);
    //this.initialiseGrid();
    console.log(this.squares);
  }
  /*initialiseGrid(){
    this.squares = [];
    for(let i=0; i<this.numberSquares*10;i++){
      this.squares[i] = [];
      for(let j=0;j<4;j++){
       this.squares[i][j] = new Square(20,20,0,0,0,false,false,false,false);
        this.squares[i][j].boxNumber=i+1;
       if(j==0){
        this.squares[i][j].x=1;
        this.squares[i][j].y=1;
       }
       if(j==1){
        this.squares[i][j].x=1;
        this.squares[i][j].y=2;
       }
       if(j==2){
        this.squares[i][j].x=2;
        this.squares[i][j].y=1;
       }
       if(j==3){
        this.squares[i][j].x=2;
        this.squares[i][j].y=2;
       }
         if(this.squares[i][j].boxNumber==this.startingBox() && this.squares[i][j].x==1 && this.squares[i][j].y==1){
                  this.squares[i][j].isStartingbox =true;
         }
         if(this.squares[i][j].boxNumber==this.targetBox() && this.squares[i][j].x==1 && this.squares[i][j].y==1){
          this.squares[i][j].isTargetBox = true;
        }
      }
    }
  }*/
  startingBox(){
      return this.numberSquares*10/2 - this.numberSquares/2 - 5;
  }
  targetBox(){
    return this.numberSquares*10/2 - this.numberSquares/2 + 5;
  }
  drawStartingTargetBox(val:Square) {
  
    if (val.isStartingbox == true) {
      return 'startingBox';
    }else if(val.isTargetBox == true){
      return 'targetBox';
    }else{
      return 'wall';
    }
  }
  stateOfSquare(square:Square){
   
  }
}
