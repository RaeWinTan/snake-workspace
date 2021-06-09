import {Snake} from "./snake";
import {View} from "./view";
import { Queue } from 'queue-typescript';

import {ElementRef} from '@angular/core';
class MapParent extends Snake{
  public v:View;
  public stopped:number;
  public map:number[][];
  public allPos:number[];

	constructor(n:number, pos:any,canvas: ElementRef<HTMLCanvasElement>, cellSide:number){
    super(pos, n);
    this.v = new View(canvas, n, cellSide);
    this.map = [];
		this.allPos = [];
    this.stopped = 0;
		for(var i = 0; i< n; i++){
      var row:number[] = [];
      for(var j = 0; j < n; j++){
				this.allPos.push(this.convertPos({x:i, y:j}));
				if (this.getSnakePos().has(this.convertPos({x:i, y:j}))){
					row.push(1);
					this.v.changeColour({x:i, y:j},1);
				}
        else row.push(0);
			}
      this.map.push(row);
		}
	  this.foodInit();
		this.generateFood();
	}

	setFDiff(a:number[], b:Set<number>){
		if(a.length === b.size) return -1;
		while(true){
				if(!b.has(a[this.stopped++])) return a[this.stopped - 1];
				if(this.stopped>=a.length) this.stopped = 0;
		}
	}
  foodInit(){
    //error here
    this.stopped = 0;
    this.allPos = this.allPos.sort(() => Math.random() - 0.5);
  }
	//Must be ASYNC to reduce lag
	generateFood(){
		const num = this.setFDiff(this.allPos, this.getSnakePos());
		if(num === -1) throw "Position out of range";
		const coor = this.convertNum(num);
    console.log("THE COOR IS");
    console.log(coor);
    console.log("the NUM is ");
    console.log(num);
		this.map[coor[0]][coor[1]] = 2;
		this.v.changeColour({x:coor[0], y:coor[1]}, 2);
	}

	drawSnake(delPos?:number[]){
		if(delPos){
			this.map[delPos[0]][delPos[1]] = 0;
			this.v.clearCell({x:delPos[0],y:delPos[1]});
		}
		this.map[this.headCoor.x][this.headCoor.y] = 1;
		this.v.changeColour({x:this.headCoor.x,y:this.headCoor.y},1);
	}

  redrawMap(canvas, cellSide){
    this.v = new View(canvas, this.n, cellSide);
    for (var i of this.getSnakePos()){
      var c:number[] = this.convertNum(i);
      this.v.changeColour({x:c[0], y:c[1]}, 1);
    }
    let food:number[] = this.convertNum(this.allPos[this.stopped - 1]);
    this.v.changeColour({x:food[0],y:food[1]}, 2);
  }
  moveCleanUp(){
		if(this.map[this.headCoor.x][this.headCoor.y] === 2){
			this.moveEat({x:this.headCoor.x, y:this.headCoor.y});
			this.generateFood();
			this.drawSnake();
		}else{
			var difference = this.move(this.headCoor);
			var delPos = this.convertNum(difference);
			this.drawSnake(delPos);
		}
	}

	up(){
		if (this.headCoor.x - 1 < 0) this.headCoor.x = this.n - 1;
		else --this.headCoor.x;
		this.moveCleanUp();
	}

	down(){
		if(this.headCoor.x + 1 >= this.n) this.headCoor.x = 0;
		else ++this.headCoor.x;
		this.moveCleanUp();
	}

	right(){
		if (this.headCoor.y + 1 >= this.n)this.headCoor.y = 0;
		else ++this.headCoor.y;
		this.moveCleanUp();
	}

	left(){
		if (this.headCoor.y - 1 < 0) this.headCoor.y = this.n - 1;
		else --this.headCoor.y;
		this.moveCleanUp();
	}
}


export class Map extends MapParent{
  constructor(n:number, pos:any, canvas: ElementRef<HTMLCanvasElement>, cellSide:number){
    super(n, pos, canvas, cellSide);
  }
  inBorder(tmpPos:number ,shrinkSize:number){
    let bs:any = {"rightBorder":false, "bottomBorder":false, "cornerBorder":false};
    let p:any = {"x":this.convertNum(tmpPos)[0], "y":this.convertNum(tmpPos)[1]};
    if(p.y+1 <= this.n && p.y+1 > this.n-shrinkSize ) bs["rightBorder"] = true;
    if(p.x+1 <= this.n && p.x+1 > this.n-shrinkSize ) bs["bottomBorder"] = true;
    if(bs["rightBorder"] && bs["bottomBorder"]) bs["cornerBorder"] =true;
    return bs;
  }

  upShrink(prevCPos, tmpN){
    let prevCoor:number[] = this.convertNum(prevCPos, tmpN);
    if (prevCoor[0] - 1 < 0) prevCoor[0] = tmpN - 1;
    else --prevCoor[0];
    return this.convertPos({"x":prevCoor[0],"y":prevCoor[1]}, tmpN);
  }

  downShrink(prevCPos, tmpN){
    let prevCoor:number[] = this.convertNum(prevCPos, tmpN);
    if(prevCoor[0] + 1 >= tmpN) prevCoor[0] = 0;
    else ++prevCoor[0];
    return this.convertPos({"x":prevCoor[0],"y":prevCoor[1]}, tmpN);
  }

  rightShrink(prevCPos, tmpN){
    let prevCoor:number[] = this.convertNum(prevCPos, tmpN);
    if (prevCoor[1] + 1 >= tmpN)prevCoor[1] = 0;
    else ++prevCoor[1];
    return this.convertPos({"x":prevCoor[0],"y":prevCoor[1]}, tmpN);
  }

  leftShrink(prevCPos, tmpN){
    let prevCoor:number[] = this.convertNum(prevCPos, tmpN);
    if (prevCoor[1] - 1 < 0) prevCoor[1] = tmpN -1;
    else --prevCoor[1];
    return this.convertPos({"x":prevCoor[0],"y":prevCoor[1]}, tmpN);
  }
  shrink(shrinkSize:number){
    let tmpSPos = new Set<number>();
    let tmpQ:Queue<number> = new Queue<number>();
    let tmpN:number = this.n-shrinkSize;
    let l=this.snakeQ.length - 1;
    let tmpPos:number = this.snakeQ.dequeue();
    let prevPos:number = tmpPos;
    let prevCPos:number;
    do {
      let prevPosCpy = tmpPos;
      if (tmpQ.length === 0){
        let bs:any = this.inBorder(tmpPos, shrinkSize);
        if(bs["cornerBorder"]) tmpPos = this.convertPos({"x":tmpN-1, "y":tmpN-1}, tmpN);
        else if (bs["bottomBorder"]) tmpPos = this.convertPos({"x":tmpN-1, "y":this.convertNum(tmpPos)[1]}, tmpN);
        else if (bs["rightBorder"]) tmpPos = this.convertPos({"x":this.convertNum(tmpPos)[0], "y":tmpN-1}, tmpN);
        else tmpPos = this.convertPos({"x":this.convertNum(tmpPos)[0], "y":this.convertNum(tmpPos)[1]}, tmpN);
      } else {
        if(prevPos+1 === tmpPos || prevPos-this.n+1 === tmpPos) tmpPos = this.rightShrink(prevCPos, tmpN);
        else if (prevPos-1 === tmpPos || prevPos+this.n-1 === tmpPos) tmpPos = this.leftShrink(prevCPos, tmpN);
        else if(prevPos+(this.n*(this.n-1)) === tmpPos || prevPos-this.n === tmpPos) tmpPos = this.upShrink(prevCPos, tmpN);
        else if(prevPos-(this.n*(this.n-1)) === tmpPos || prevPos+this.n === tmpPos) tmpPos = this.downShrink(prevCPos, tmpN);
      }
      if(tmpSPos.size === tmpSPos.add(tmpPos).size) break;//when overlaps happens
      tmpQ.enqueue(tmpPos);
      prevCPos = tmpPos;
      prevPos = prevPosCpy;
      tmpPos = this.snakeQ.dequeue();
      l--;
    } while (l>-1);
    this.snakeQ = tmpQ;
    this.snakePos = tmpSPos;
    this.n= tmpN;
    this.reInitMap();
  }



  reInitMap(snakeSet?:Set<number>, snakeQueue?:Queue<number>){
    this.map = [];
    this.allPos=[];
    //perhaps at every sqrt(n^2) == n length shrink the map array. That way it is
    //efficient in amortised time
    //snakePos must change to the snakeSet thing here (if snakeSet !== undefined)
    // (if snakeStack !== undefined)
    if(snakeSet !== undefined && snakeQueue !== undefined) this.snakePos = snakeSet;
    for (let i = 0; i < this.n; i++){
      let row:number[] = [];
      for (let j = 0; j<this.n;j++){
        this.allPos.push(this.convertPos({x:i, y:j}));//part of initiating the food generatation
        if (this.snakePos.has(this.convertPos({x:i,y:j}))) row.push(1);
        else row.push(0);
      }
      this.map.push(row);
    }
    this.v.reInit(this.n);
    this.foodInit();
		this.generateFood();
    for (var i of this.getSnakePos()){
      var c:number[] = this.convertNum(i);
      this.v.changeColour({x:c[0], y:c[1]}, 1);
    }
    if(snakeSet !== undefined && snakeQueue !== undefined){
        this.snakeQ = new Queue<number>(...snakeQueue.toArray());
    }
    //here reinistialized snakeQ suing the snakeQueue
    this.headCoor = {"x":this.convertNum(this.snakeQ.tail)[0], "y":this.convertNum(this.snakeQ.tail)[1]};
  }
}
