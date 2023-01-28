import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import {DragDropModule} from '@angular/cdk/drag-drop';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { CarreComponent } from './carre/carre.component';
import { BigCarreComponent } from './big-carre/big-carre.component';
import { GridComponent } from './grid/grid.component';
import { GrilleComponent } from './grille/grille.component';
import { StartingNodeComponent } from './starting-node/starting-node.component';
import { NavbarComponent } from './navbar/navbar.component';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
@NgModule({
  declarations: [
    AppComponent,
    CarreComponent,
    BigCarreComponent,
    GridComponent,
    GrilleComponent,
    StartingNodeComponent,
    NavbarComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    DragDropModule,
    ReactiveFormsModule,
    FormsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
