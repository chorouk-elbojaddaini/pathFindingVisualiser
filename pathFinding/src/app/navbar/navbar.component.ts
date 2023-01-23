import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Form } from '@angular/forms';
@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit {
  chosenAlgo:string;
  typeAlgorithm:FormGroup
  constructor(private fb: FormBuilder) {
    this.initAlgoForm();
   }

  ngOnInit(): void {
    this.initAlgoForm();
  }
  initAlgoForm(){
    this.typeAlgorithm = this.fb.group({
      algo: '',
    });
  }
  choseAlgorithme(){
    this.chosenAlgo = this.typeAlgorithm.value.algo;
    console.log(this.chosenAlgo);
  }

}
