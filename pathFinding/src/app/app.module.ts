import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import {DragDropModule} from '@angular/cdk/drag-drop';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { CarreComponent } from './carre/carre.component';
import { BigCarreComponent } from './big-carre/big-carre.component';
import { GridComponent } from './grid/grid.component';
import { GrilleComponent } from './grille/grille.component';

@NgModule({
  declarations: [
    AppComponent,
    CarreComponent,
    BigCarreComponent,
    GridComponent,
    GrilleComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    DragDropModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
