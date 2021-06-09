import { Queue } from 'queue-typescript';

export class Snake{
  public snakeQ:Queue<number>;
  public snakePos:Set<number>;
  public n:number;
  private pos:any;
  public headCoor:any;

  constructor(pos:any, n:number){
    this.snakeQ = new Queue<number>();
    this.snakePos = new Set<number>();
    this.n = n;
    this.headCoor = pos;

    this.snakeQ.enqueue(this.convertPos(pos));
    this.snakePos.add(this.convertPos(pos));
  }
  moveEat(pos){
	  this.headCoor = pos;
	  this.snakeQ.enqueue(this.convertPos(pos));
		this.snakePos.add(this.convertPos(pos));
	}

  convertPos(pos:any, nt?:number){
    if(nt !== undefined) {
      if (pos.x === 0) return pos.y+1;
      else return (pos.x)*nt+pos.y + 1;
    } else {
		  if (pos.x === 0) return pos.y+1;
		  else return (pos.x)*this.n+pos.y + 1;
    }
	}

  convertNum(num:number, nt?:number){
    if(nt !== undefined){
      if(num <= nt)	return [0, num-1];
    	else return num%nt > 0 ? [Math.floor(num/nt),num%nt-1]:[num/nt-1,nt-1];
    } else {
		  if(num <= this.n)	return [0, num-1];
		  else return num%this.n > 0 ? [Math.floor(num/this.n),num%this.n-1]:[num/this.n-1,this.n-1];
    }
	}
  move(pos){
    //size 2 edge case handle later
    if(this.snakeQ.length === 2){
      if(this.snakePos.has(this.convertPos(pos))) throw new Error("DIED");
    }
    var rvalue = this.snakeQ.dequeue();
    this.snakePos.delete(rvalue);
    if(this.snakePos.has(this.convertPos(pos))) throw new Error("DIED");
    this.snakeQ.enqueue(this.convertPos(pos));
    this.snakePos.add(this.convertPos(pos));
    return rvalue;
  }
  getSnakePos(){
		return this.snakePos;
	}

}
