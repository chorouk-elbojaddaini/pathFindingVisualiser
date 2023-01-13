import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CarreComponent } from './carre/carre.component';

const routes: Routes = [
  { path: '', component: CarreComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
