const randomSelectTwo = () => {
    const rando = random(1)
    return rando > 0.5 ? true : false
}

const getRandomFromPalette = () => {
    var rando = Math.floor(Math.random(0)*PALETTE.length)
    return PALETTE[rando]
}

const randomG = () => {
    var N = 4
    var r = 0
    for(var i = N; i > 0; i --){
        r += Math.random()
    }
    return (r / N)*2 - 1
}

function quadBezier(p0,p1,p2, t) {
    pFinal = {};
    pFinal.x = Math.pow(1 - t, 2) * p0.x + 
               (1 - t) * 2 * t * p1.x + 
               t * t * p2.x;
    pFinal.y = Math.pow(1 - t, 2) * p0.y + 
               (1 - t) * 2 * t * p1.y + 
               t * t * p2.y;
    return pFinal;
}

function cubicBezier(p0,p1,p2,p3, t) {
    pFinal = {};
    pFinal.x = Math.pow(1 - t, 3) * p0.x + 
               Math.pow(1 - t, 2) * 3 * t * p1.x + 
               (1 - t) * 3 * t * t * p2.x + 
               t * t * t * p3.x;
    pFinal.y = Math.pow(1 - t, 3) * p0.y + 
               Math.pow(1 - t, 2) * 3 * t * p1.y + 
               (1 - t) * 3 * t * t * p2.y + 
               t * t * t * p3.y;
    return pFinal;
}

function sigmoid(z) {
    return 1 / (1 + Math.exp(-z));
}

function groupMidpoint(p0,p1) {
    xsum = 0
    ysum = 0
    for(var i = 0; i < p0.length; i++) {
        xsum += p0[i].x + p1[i].x
        ysum += p0[i].y + p1[i].y
    }
    p = {
        x: xsum / (p0.length + p1.length),
        y: ysum / (p0.length + p1.length)
    }
    return p
}