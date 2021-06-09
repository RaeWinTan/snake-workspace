
import {ElementRef} from '@angular/core';
export class View{

  private colourCode:any = {
   0:"#FFFFFF",
   1:"#000000",
   2:"#FF0000"
 }
  private ctx: CanvasRenderingContext2D;
  private n:number;
  public cellSide:number;
  private canvas: ElementRef<HTMLCanvasElement>;
  constructor(canvas, n, cellSide){
    this.canvas = canvas;
    this.n = n;
    this.cellSide = cellSide;
    //settting the ctx right
    this.canvas.nativeElement.width = this.n * this.cellSide;
    this.canvas.nativeElement.height = this.n * this.cellSide;

    this.ctx = this.canvas.nativeElement.getContext("2d");
  }
  reInit(n){
    this.n = n;
    //settting the ctx right
    this.canvas.nativeElement.width = this.n * this.cellSide;
    this.canvas.nativeElement.height = this.n * this.cellSide;

    this.ctx = this.canvas.nativeElement.getContext("2d");
  }

  changeColour(pos, colourNum){
    this.ctx.fillStyle = this.colourCode[colourNum];
    this.ctx.fillRect(pos.y*this.cellSide, pos.x*this.cellSide, this.cellSide, this.cellSide);
  }

  clearCell(pos){
    this.ctx.clearRect(pos.y*this.cellSide, pos.x*this.cellSide, this.cellSide, this.cellSide);
    this.ctx.beginPath();
  }
  

}
