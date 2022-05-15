class Road{
    constructor(x,width,laneCount=3){
        this.x=x;
        this.width=width;
        this.laneCount = laneCount;
        this.left = x-this.width/2;
        this.right= x+this.width/2;
        const infinity=10000*2;
        this.top = -infinity;
        this.bottom = 200;
        this.laneWidth = this.width/this.laneCount;
        const topLeft       = {x:this.left,y:this.top};
        const topRight      = {x:this.right,y:this.top};
        const bottomLeft    = {x:this.left,y:this.bottom};
        const bottomRight   = {x:this.right,y:this.bottom};

        this.borders=[
            [topLeft,bottomLeft],
            [topRight, bottomRight]
        ];
    }
    draw(ctx){
        for(let i =1; i<this.laneCount; i++){
            ctx.lineWidth=5;
            ctx.setLineDash([20,20]);
            ctx.strokeStyle="white";
            // const x = lerp(this.left,this.right,i/this.laneCount);
            ctx.beginPath();
            // console.log(this.laneWidth);
            ctx.moveTo(this.left+this.laneWidth*i,this.top);
            ctx.lineTo(this.left+this.laneWidth*i,this.bottom);
            ctx.stroke();
        }

        //borders
        this.borders.forEach(border=>{
            ctx.lineWidth=3;
            ctx.setLineDash([]);
            ctx.strokeStyle="yellow";
            ctx.beginPath();

            ctx.moveTo(border[0].x,border[0].y);
            ctx.lineTo(border[1].x,border[1].y);
            ctx.stroke();
        });
    }

    getLaneCenter(laneIndex){
        return (this.laneWidth/2)+laneIndex*this.laneWidth+(canvas.width-this.width)/2;
    }

}
