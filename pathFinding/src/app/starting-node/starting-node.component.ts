import { Component } from '@angular/core';

@Component({
  selector: 'app-starting-node',
  templateUrl: './starting-node.component.html',
  styleUrls: ['./starting-node.component.scss']
})
export class StartingNodeComponent {
  getCoordonates(square){
    console.log(square);
  }
}
