const randomG = () => {
    var N = 4
    var r = 0
    for(var i = N; i > 0; i --){
        r += Math.random()
    }
    return (r / N)*2 - 1
}

const randomSelectTwo = () => {
    const rando = random(1)
    return rando > 0.5 ? true : false
}

const getRandomFromPalette = () => {
    var rando = Math.floor(Math.random(0)*FLOWER_PALETTE.length)
    return FLOWER_PALETTE[rando]
}

function f_setGradient(x, y, w, h, c1, c2, axis) {
  noFill();
  if (axis === 0) {
    // Top to bottom gradient
    for (let i = y; i <= y + h; i+= 0.1) {
      let inter = map(i, y, y + h, 0, 1);
      let c = lerpColor(c1, c2, inter);
      stroke(c);
      line(x, i, x + w, i);
    }
  } else if (axis === 1) {
    // Left to right gradient
    for (let i = x; i <= x + w; i+= 0.1) {
      let inter = map(i, x, x + w, 0, 1);
      let c = lerpColor(c1, c2, inter);
      stroke(c);
      line(i, y, i, y + h);
    }
  }
}

function f_multiGradient(x, y, w, h, cs, ls, axis) {
    noFill();
    let done = 0.0
    // Top to bottom gradient
    if (axis === 0) {
        for (let i = 0; i < cs.length-1; i++ ) {
            var h2 = (i == 0) ? ls[0]*h : (ls[i] - ls[i-1])*h
            f_setGradient(x,y+done*h,w,h2,cs[i],cs[i+1],0)
            done = ls[i]
        }
    } else if (axis === 1) {
        for (let i = 0; i < cs.length-1; i++ ) {
            var w2 = (i == 0) ? ls[0]*w : (ls[i] - ls[i-1])*w
            f_setGradient(x+done*w,y,w2,h,cs[i],cs[i+1],1)
            done = ls[i]
        }
    }
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