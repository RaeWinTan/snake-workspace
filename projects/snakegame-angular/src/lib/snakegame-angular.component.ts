import {  OnChanges,SimpleChanges, ViewChild,ElementRef,AfterViewInit , Input, Component, Output, EventEmitter, OnInit, DoCheck } from '@angular/core';
import { Queue } from 'queue-typescript';


import {Snake} from "./objs/snake";
import {View} from "./objs/view";
import {Map} from "./objs/map";


@Component({
  selector: 'snakegame-angular',
  template: `
  <canvas #snakeId    (keydown)="controlKey($event)" tabindex="0">
          </canvas>


    `,
  styles: [
  ]
})
export class SnakegameAngularComponent implements AfterViewInit,OnChanges, OnInit, DoCheck{
  title = "HELLOW RORLD";
  show:boolean = true;
  changesCalled:number = 0;
  id:number;
  v:View;
  s:Snake;
  m:Map;
  //p:boolean = true;
  keyBoard:string;
  controls:any= {"ArrowUp":"up", "ArrowDown":"down", "ArrowRight":"right", "ArrowLeft":"left"};

  @Input() x: number;
  @Output() xChange = new EventEmitter<number>();
  @Input() y: number;
  @Output() yChange = new EventEmitter<number>();
  //Size(THIS ONE DO LAST)
  @Input() n:number;
  @Input() nChange = new EventEmitter<number>();
  //cell size()
  @Input() cellSide: number;
  @Input() cellSideChange = new EventEmitter<number>();
  //Preview to start of the game

  //Keyboard Controls (DONE FOR NOW LATER DO ERROR HANDLING AND SOME CLEAN UP )
  @Input() up: string = "ArrowUp";
  @Output() upChange = new EventEmitter<number>();
  @Input() down: string = "ArrowDown";
  @Output() downChange = new EventEmitter<number>();
  @Input() left: string = "ArrowLeft";
  @Output() leftChange = new EventEmitter<number>();
  @Input() right: string = "ArrowRight";
  @Output() rightChange = new EventEmitter<number>();
  //speed

  @Input() speed:number;
  @Output() speedChange = new EventEmitter<number>();

  //pauseStart
  @Input() p: string;
  @Output() pChange = new EventEmitter<string>();
  @Output() death =new EventEmitter<void>();

  //Edit and preview
  @Input() snakeQueue:Queue<number> = new Queue<number>();
  @Input() snakeSet:Set<number> = new Set<number>();
  @Input() usePreview:boolean = false;
  @Output() usePreviewChange = new EventEmitter<boolean>();


  @ViewChild('snakeId') canvas: ElementRef<HTMLCanvasElement>

  ngOnInit(){

  }

  controlKey(e: KeyboardEvent){
    if(e.key in this.controls) this.keyBoard = this.controls[e.key];
  }
  test(){
    this.show = !this.show;
  }
  ngDoCheck(){

  }
  ngOnChanges(changes: SimpleChanges){

    if(this.changesCalled>0 &&( (("x" in changes) && changes["x"].currentValue !==null)  || (("y" in changes) && changes["y"].currentValue !==null) )){
      this.restart();
      return;
    }

    //this.changesCalled>0 && && changes["speed"].currentValue !==null)
    if( "speed" in changes  ) {
      if(changes["speed"].currentValue ===null) this.speed=500;
      this.changeSpeed();
    }
    if(this.changesCalled>0 && (("cellSide" in changes) && changes["cellSide"].currentValue !==null) ){
      this.changeCellSide();
    }
    if("p" in changes){
      if(this.p === "pause") this.pause();
      else if(this.p==="start") this.start();


    }



    if(this.changesCalled>0 && (("n" in changes) && changes["n"].currentValue !== null)) {
      this.changeN();
    }
    for (const propName in changes) {
      this.controlChanges(changes, propName);
    }
    this.changesCalled++;
  }

  changeN(){
    this.m.shrink(this.m.n - this.n);
  }

  controlChanges(changes:SimpleChanges, propName){
    if("up" === propName||"down" === propName||"left" === propName||"right" === propName){
        delete this.controls[Object.keys(this.controls).find(key => this.controls[key] === propName)];
        this.controls[changes[propName].currentValue] = propName;
    }
  }

  pause(){
    this.p="pause";
    this.pChange.emit(this.p);
    clearInterval(this.id);
  }

  changeSpeed(){
    if(this.p==="start"){
      this.pause();
      this.start();
    }
    this.speedChange.emit(this.speed);
  }

  restart(){
    this.show=true;

    this.ngAfterViewInit();

  }

  start(){
    this.p = "start";
    this.pChange.emit(this.p);
    this.id = setInterval(()=>{
      try{
        this.movement(this.keyBoard);
      }catch(err){
        if(err.message==="DIED"){
          this.death.emit();
          this.p = "pause";
          this.pChange.emit(this.p);
          this.usePreview = false;
          this.usePreviewChange.emit(this.usePreview);
          this.restart();
        }
      }
    }, 1000/this.speed);
  }

  stop(){
    clearInterval(this.id);
  }

  changeCellSide(){
    this.m.redrawMap(this.canvas, this.cellSide);
  }

  ngAfterViewInit(){
    if (this.x >= this.n || this.x < 0 || this.x === null){
      this.x = 0;
      this.xChange.emit(this.x);
    }
    if (this.y >= this.n || this.y < 0 || this.y === null){
      this.y = 0;
      this.yChange.emit(this.y);
    }

    this.m = new Map(this.n, {x:this.x, y:this.y}, this.canvas,this.cellSide);
    if(this.usePreview){
      this.m.reInitMap(this.snakeSet, this.snakeQueue);
      this.usePreview = false;
      this.usePreviewChange.emit(this.usePreview);
    }
    this.keyBoard = "up";
 }

 movement(keyBoard:string){
   if(keyBoard==="up") this.m.up();
   if(keyBoard==="down") this.m.down();
   if(keyBoard==="left") this.m.left();
   if(keyBoard==="right") this.m.right();
 }


}
