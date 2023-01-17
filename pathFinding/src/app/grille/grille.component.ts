import { AfterViewInit, Component, ElementRef, ViewChild } from '@angular/core';
import { Square } from '../shared/squareModele';
@Component({
  selector: 'app-grille',
  templateUrl: './grille.component.html',
  styleUrls: ['./grille.component.scss'],
})
export class GrilleComponent implements AfterViewInit {
  ngAfterViewInit(): void {
    // const {x, y} = this.carreElement.nativeElement.getBoundingClientRect();
    //console.log({x,y});
  }
  squares: Square[];
  numberSquares: number;
  widthSquare = 20;
  // @ViewChild('square') carreElement: ElementRef;

  ngOnInit(): void {
    let wi = window.innerWidth;

    this.numberSquares = Math.trunc(wi / this.widthSquare);
    console.log('this is number squares');
    console.log(this.numberSquares);
    this.initialiseGrid();
    console.log(this.squares);
  }

  initialiseGrid() {
    this.squares = [];
    for (let i = 0; i < this.numberSquares * 18; i++) {
      this.squares[i] = new Square(20, 20, 0, 0, false, false, false, false);
      this.squares[i].x = i * 20 + 10;
      this.squares[i].y = i * 20 + 10;
      this.squares[i].width = 20;
      this.squares[i].height = 20;
      this.squares[i].isStartingbox = false;
      this.squares[i].isTargetBox = false;
      this.squares[i].isBomb = false;
      this.squares[i].isWall = false;
    }
  }
  getCoordonates(square) {
    console.log(square);
  }
  collision() {}
  getPosition(el) {
    let x = 0;
    let y = 0;
    while (el && !isNaN(el.offsetLeft) && !isNaN(el.offsetTop)) {
      x += el.offsetLeft - el.scrollLeft;
      y += el.offsetTop - el.scrollTop;
      el = el.offsetParent;
    }
    return { top: y, left: x };
  }
  onDragEnded(event) {
    let element = event.source.getRootElement();
    let boundingClientRect = element.getBoundingClientRect();
    let parentPosition = this.getPosition(element);
    console.log(
      'x: ' + (boundingClientRect.x ),
      'y: ' + (boundingClientRect.y )
    );
  }
}
