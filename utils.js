function lerp(A,B,t){
    return A+(B-A)*t;
}

// function getIntersection(start1,end1,start2,end2){
//     x1=start1.x;
//     y1=start1.y;
//     x2=end1.x;
//     y2=end1.y;

//     m1 = (y2-y1)/(x2-x1);
//     c1 = y1-x1*m1;

//     a1=start2.x;
//     b1=start2.y;
//     a2=end2.x;
//     b2=end2.y;

//     m2 = (b2-b1)/(a2-a1);
//     c2 = b1-a1*m2;
//     const  X = (c1-c2)/(m2-m1);
//     const Y = m1*X+c1;
//     const dist = Math.sqrt(Math.pow(Y-y1,2)+Math.pow(X-x1,2));
//     console.log(X,Y);
//     if (X && Y){
//         return {
//             x:X,
//             y:Y,
//             offset:dist
//         }
//     }
//     else{
//         return null
//     }

// }

function getIntersection(A,B,C,D){ 
    const tTop=(D.x-C.x)*(A.y-C.y)-(D.y-C.y)*(A.x-C.x);
    const uTop=(C.y-A.y)*(A.x-B.x)-(C.x-A.x)*(A.y-B.y);
    const bottom=(D.y-C.y)*(B.x-A.x)-(D.x-C.x)*(B.y-A.y);
    
    if(bottom!=0){
        const t=tTop/bottom;
        const u=uTop/bottom;
        if(t>=0 && t<=1 && u>=0 && u<=1){
            return {
                x:lerp(A.x,B.x,t),
                y:lerp(A.y,B.y,t),
                offset:t
            }
        }
    }

    return null;
}

function polysIntersect(poly1, poly2){
    for(let i=0;i<poly1.length;i++){
        for(let j=0;j<poly2.length;j++){
            const touch=getIntersection(
                poly1[i],
                poly1[(i+1)%poly1.length],
                poly2[j],
                poly2[(j+1)%poly2.length]
            );
            if(touch){
                return true;
            }
        }
    }
    return false;
}