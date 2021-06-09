import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { SnakegameAngularComponent } from './snakegame-angular.component';



@NgModule({
  declarations: [
    SnakegameAngularComponent
  ],
  imports: [
    FormsModule
  ],
  exports: [
  SnakegameAngularComponent
  ]
})
export class SnakegameAngularModule { }
