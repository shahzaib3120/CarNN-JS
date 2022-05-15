class Sensor{
    constructor(car){
        this.car = car;
        this.rayCount = 10;
        this.rayLength = 300;
        this.raySpread = Math.PI/2;
        this.rays=[];
        this.readings = [];
    }

    update(roadBorders,traffic){
        this.#castRays();
        this.readings=[];
        for (let i=0; i<this.rays.length; i++){
            this.readings.push(this.#getReadings(
                this.rays[i],
                roadBorders,
                traffic)
                );
        }
    }

    #getReadings(ray,roadBorders){
        // ray = [start,end]; start={x:x,y:y}
        // roadBorders = [
        //   [start,end],
        //   [start,end], 
        // ];
        let touches = [];
        let start1 = ray[0];
        let end1 = ray[1];
        for(let i=0; i< roadBorders.length;i++){
            let start2 = roadBorders[i][0];
            let end2 = roadBorders[i][1];
            const touch = getIntersection(start1,end1,start2,end2);
            if(touch){
                touches.push(touch);
            }
        }

        for(let i=0;i<traffic.length;i++){
            const poly=traffic[i].polygon;
            for(let j=0;j<poly.length;j++){
                const value=getIntersection(
                    ray[0],
                    ray[1],
                    poly[j],
                    poly[(j+1)%poly.length]
                );
                if(value){
                    touches.push(value);
                }
            }
        }

        if(touches.length ==0){
            return null;
        }else{
            const offsets = touches.map(e=>e.offset);
            const minOffset = Math.min(...offsets);
            return touches.find(e=>e.offset==minOffset)
        }

    }

    #castRays(){
        this.rays=[];
        for(let i =0; i<this.rayCount; i++ ){
            const rayAngle = lerp(
                -this.raySpread/2,
                this.raySpread/2,
                this.rayCount==1?1/2:i/(this.rayCount-1)
            )+this.car.angle;
            
            const start = {x:this.car.x,y:this.car.y};
            const end = {
                        x:this.car.x-Math.sin(rayAngle)*this.rayLength,
                        y:this.car.y-Math.cos(rayAngle)*this.rayLength};
            this.rays.push([start,end]);
        }
    }
    draw(ctx){
        ctx.lineWidth = 2;
        
        for(let i=0; i<this.rayCount; i++){
            let end = this.rays[i][1];
            if(this.readings[i]){
                end = this.readings[i];
            }
            ctx.beginPath();
            ctx.strokeStyle = "yellow";
            ctx.moveTo(this.rays[i][0].x,this.rays[i][0].y);
            // ctx.lineTo(this.rays[i][1].x,this.rays[i][1].y);
            ctx.lineTo(end.x,end.y);
            ctx.stroke();
            
            ctx.beginPath();
            ctx.strokeStyle = "black";
            ctx.moveTo(this.rays[i][1].x,this.rays[i][1].y);
            // ctx.lineTo(this.rays[i][1].x,this.rays[i][1].y);
            ctx.lineTo(end.x,end.y);
            ctx.stroke();
        }
    }
    
}