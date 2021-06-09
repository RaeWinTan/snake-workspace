import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DrawSnakeComponent } from './draw-snake/draw-snake.component';
import { GameComponent } from './game/game.component';

const routes: Routes = [
  { path: 'drawsnake', component: DrawSnakeComponent },
  {path:"game", component:GameComponent},
  {path:"", redirectTo:"/game", pathMatch:"full"}
];


@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
