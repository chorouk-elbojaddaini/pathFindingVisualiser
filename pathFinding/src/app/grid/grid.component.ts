import { Component, ElementRef, OnInit } from '@angular/core';
import { Square } from '../shared/squareModele';

@Component({
  selector: 'app-grid',
  templateUrl: './grid.component.html',
  styleUrls: ['./grid.component.scss']
})
export class GridComponent implements OnInit {

  squares:Square[][];
  widthSquare:number=40;
  numberSquares:number;
  constructor(private elem: ElementRef) { }
  
  ngOnInit(): void {
    let widthGrid = this.elem.nativeElement.offsetWidth;
    console.log("width grid",widthGrid);
    this.numberSquares = Math.trunc(widthGrid/this.widthSquare);
    console.log("width of one squere",this.widthSquare);
    console.log("numbers squares",this.numberSquares);
    this.initialiseGrid();
    console.log(this.squares);
  }
  initialiseGrid(){
    this.squares = [];
    for(let i=0; i<this.numberSquares;i++){
      this.squares[i] = [];
      for(let j=0;j<4;j++){
       this.squares[i][j] = new Square(20,20,0,0,0);
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

      }
    }
  }

}
