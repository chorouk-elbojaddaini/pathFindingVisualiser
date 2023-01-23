import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Form } from '@angular/forms';
import { DijkstraService } from '../shared/pathFindingAlgorithms/dijkstra.service';
@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit {
  chosenAlgo:string;
  typeAlgorithm:FormGroup
  constructor(private fb: FormBuilder,public dijkstraService:DijkstraService) {
    this.initAlgoForm();
   }

  ngOnInit(): void {
    this.initAlgoForm();
  }
  ngDoCheck(){
    this.fct();
  }
  initAlgoForm(){
    this.typeAlgorithm = this.fb.group({
      algo: '',
    });
  }
  choseAlgorithme(){
    this.dijkstraService.verify = true;
  }
   fct(){
    this.dijkstraService.chosenAlgo =this.typeAlgorithm.value.algo;
   }
}
