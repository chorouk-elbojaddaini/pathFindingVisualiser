import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { GrilleComponent } from './grille/grille.component';

const routes: Routes = [
  { path: '', component: GrilleComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
