canvas = document.getElementById("myCanvas");
const ctx=canvas.getContext("2d");
canvas.height=window.innerHeight;
canvas.width=300;
const laneCount = 3;
const road =  new Road(canvas.width/2,canvas.width*0.9,laneCount);
// const car = new Car((road.width/2)+road.laneWidth,canvas.height/2,30,50);
// const car = new Car(road.getLaneCenter(laneCount-1),canvas.height/2,30,50,"AI");
let cars=[];
if(localStorage.getItem('bestcar')){
    const bestModel = JSON.parse(localStorage.getItem('bestcar'));
    cars = generateCars(100,laneCount,bestModel);
    let bestCar = cars[0];
    bestCar.model=bestModel;
}else{
    cars = generateCars(100,laneCount);
    let bestCar = cars[0];
}
const traffic = generateTraffic(50,laneCount);


animate();
function animate(){
    for(let i=0;i<traffic.length;i++){
        traffic[i].update(road.borders,[]);
    }
    for(let i=0; i<cars.length;i++){
        cars[i].update(road.borders,traffic);
    }
    bestCar = cars.find(c=>c.y==Math.min(...cars.map(c=>c.y))); 
    // console.log(bestCar.controls);
    canvas.height=window.innerHeight;
    // road.display();
    ctx.save();
    ctx.translate(0,-bestCar.y+canvas.height*0.8);
    road.draw(ctx);
    traffic.forEach(dummycar=>{
        dummycar.draw(ctx,'blue');
    })
    ctx.globalAlpha=0.5;
    cars.forEach(car=>{
        car.draw(ctx,'black');
    });
    ctx.globalAlpha = 1;
    bestCar.draw(ctx,'pink',true);
    ctx.restore();
    requestAnimationFrame(animate);
}

function generateCars(n,laneCount,bestModel){
    let cars=[];
    for(let i=0;i<n;i++){
        let laneGenerator = Math.floor(Math.random() * laneCount);
        const car = new Car(road.getLaneCenter(laneGenerator),100,30,50,'AI',bestModel);
        cars.push(car);
    }
    return cars;
}

function generateTraffic(n,laneCount){
    const traffic = [];
    for(let i=0;i<n;i++){
        const laneGenerator = Math.floor(Math.random() * laneCount);
        const initalPos =Math.floor(Math.random() * -15000);
        console.log(initalPos,laneGenerator);
        traffic.push(new Car(road.getLaneCenter(laneGenerator),initalPos,30,50));
        // traffic.push(new Car(road.getLaneCenter(laneCount-2),-400,30,50));
    }
    return traffic;
}

function save(){
    localStorage.setItem('best3lane10sensor90angle',JSON.stringify(bestCar.model));
    let newfile = new ActiveXObject("Scripting.FileSystemObject");
    // let openFile = newfile.OpenTextFile("./testfile.txt", 1, true);
    var editFile = newfile.CreateTextFile("c:\\Demofile.txt", true);
    editFile.WriteLine(JSON.stringify(bestCar.model));
    // editFile.WriteLine('steadyAdvice');
    editFile.Close();
}
function discard(){
    localStorage.removeItem('bestcar');
}

