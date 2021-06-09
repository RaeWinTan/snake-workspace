import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { CommonModule } from '@angular/common';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule } from '@angular/forms';
import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { DrawSnakeComponent } from './draw-snake/draw-snake.component';
import { GameComponent } from './game/game.component';

import {AngularMouseTextboxModule} from 'angular-mouse-textbox';
import { AngularResizeElementModule } from 'angular-resize-element';
import { ToastrModule } from 'ngx-toastr';
import { Queue } from 'queue-typescript';

import { SnakegameAngularModule } from "snakegame-angular";

@NgModule({
  declarations: [
    AppComponent,
    DrawSnakeComponent,
    GameComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    AngularMouseTextboxModule,
    AngularResizeElementModule,
    BrowserAnimationsModule,
    ToastrModule.forRoot(),
    FormsModule,
    SnakegameAngularModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
