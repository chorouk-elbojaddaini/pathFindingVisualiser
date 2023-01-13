import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-carre',
  templateUrl: './carre.component.html',
  styleUrls: ['./carre.component.scss']
})
export class CarreComponent implements OnInit {
  @Input() width:number;
  @Input() height:number;
  x:number;
  y:number;
  boxNumber :number;
  

  constructor() { }

  ngOnInit(): void {
  }

}
