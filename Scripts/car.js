class Car{
    constructor(x,y,width,height,type="dummy",bestModel=null){
        this.x = x;
        this.y=y;
        this.width=width;
        this.height=height;
        this.speed=0;
        this.acceleration=0.1;
        this.friction=0.05;
        this.maxSpeed=7;
        this.damaged=false;
        this.angle=0;
        this.type = type;
        this.AI = type=='AI'?true:false;
        if(this.type!='dummy'){
            this.sensor = new Sensor(this);
            if(false){
                this.model = bestModel;
            }else{
                this.model = new Model(
                    [this.sensor.rayCount,6,4]
                );
            }
        }else{
            this.maxSpeed=Math.floor(Math.random() * 3)+1;
        }
        this.controls= new Controls(type);
    }

    update(roadBorders,traffic){
        if(!this.damaged){
            this.#move();
            this.polygon=this.#createPolygon();
            this.damaged=this.#assessDamage(roadBorders,traffic);
        }
        if(this.sensor){
            this.sensor.update(roadBorders,traffic);
            const offsets = this.sensor.readings.map(
                e=>e==null?0:1-e.offset
            );
            const outputs = Model.forwardPass(offsets,this.model);
            // console.log(outputs);
            if(this.AI){
                this.controls.down=outputs[0]>0.5;
                this.controls.up=outputs[1]>0.5;
                this.controls.right=outputs[2]>0.5;
                this.controls.left=outputs[3]>0.5;
            }
        }

    }

    #assessDamage(roadBorders,traffic){
        for(let i=0;i<roadBorders.length;i++){
            if(polysIntersect(this.polygon,roadBorders[i])){
                return true;
            }
        }
        for(let i=0;i<traffic.length;i++){
            if(polysIntersect(this.polygon,traffic[i].polygon)){
                return true;
            }
        }
        return false;
    }
    #createPolygon(){
        const points=[];
        const rad=Math.hypot(this.width,this.height)/2;
        const alpha=Math.atan2(this.width,this.height);
        points.push({
            x:this.x-Math.sin(this.angle-alpha)*rad,
            y:this.y-Math.cos(this.angle-alpha)*rad
        });
        points.push({
            x:this.x-Math.sin(this.angle+alpha)*rad,
            y:this.y-Math.cos(this.angle+alpha)*rad
        });
        points.push({
            x:this.x-Math.sin(Math.PI+this.angle-alpha)*rad,
            y:this.y-Math.cos(Math.PI+this.angle-alpha)*rad
        });
        points.push({
            x:this.x-Math.sin(Math.PI+this.angle+alpha)*rad,
            y:this.y-Math.cos(Math.PI+this.angle+alpha)*rad
        });
        return points;
    }
    
    #move(){
        if(this.type=='dummy'){
            this.speed+=this.acceleration;
            if(this.speed>this.maxSpeed){
                this.speed=this.maxSpeed;
            }
        }
        if(this.controls.up){
            this.speed+=this.acceleration;

        }
        if(this.controls.down){
            this.speed-=this.acceleration;
        }
        if(this.speed>0){
            this.speed-=this.friction;
        }
        if(this.speed<0){
            this.speed+=this.friction;
        }
        if(this.x-this.width/2<0){
            this.#reset();
        }
        if(this.x>canvas.width-this.width/2){
            this.#reset();
        }
        if (this.speed>this.maxSpeed){
            this.speed=this.maxSpeed;
        }
        if(this.speed<-this.maxSpeed){
            this.speed=-this.maxSpeed/2;
        }
        if(Math.abs(this.speed)<this.friction){
            this.speed=0;
        }
        if(this.controls.up || this.controls.down || this.speed!=0){
            
            let k = (this.speed>0)?1:-1;
            if(this.controls.left){
                // this.angle-=0.005*this.speed;
                this.angle+=0.03*k;
            }
            if(this.controls.right){
                this.angle-=0.03*k;
                // this.angle+=0.005*this.speed;
            }
        }
        this.y-=Math.cos(this.angle)*this.speed;
        this.x-=Math.sin(this.angle)*this.speed;   
    }
    
    #reset(){
        this.speed=0;
        this.angle=0;
        this.x=road.getLaneCenter(laneCount-1);
        this.y=canvas.height/2;
    }
    draw(ctx,color,drawSensor=false){
        if(this.damaged){
            ctx.fillStyle='red';
        }else{
            ctx.fillStyle=color;
        }
        ctx.beginPath();
        ctx.moveTo(this.polygon[0].x,this.polygon[0].y);
        for(let i=1;i<this.polygon.length;i++){
            ctx.lineTo(this.polygon[i].x,this.polygon[i].y);
        }
        ctx.fill();
        if(this.sensor && drawSensor){
            this.sensor.draw(ctx);
        }
    }
}