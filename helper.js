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

function f_setRadialGrad(x1,x2,y1,y2,ra1,ra2,rb1,rb2,c1,c2) {
    push()
    noFill()
    for(let i = 1; i > 0; i -= .02) {
        let inter_x = lerp(x1,x2,i)
        let inter_y = lerp(y1,y2,i)
        let inter_ra = lerp(ra1, ra2, i)
        let inter_rb = lerp(rb1, rb2, i)
        let c = lerpColor(c1,c2,i)
        strokeWeight(3)
        stroke(c)
        ellipse(inter_x,inter_y,inter_ra,inter_rb)
    }
    pop()
}

function f_multiRadialGrad(state,ra,rb,i) {
    push()
    pop()
}

function f_multiGradient(state, w, h, axis, center) {
    push()
    if (center) translate(-w/2, -h/2)
    noFill();
    let done = 0.0
    let x = state.x
    let y = state.y
    let cs = state.colorStack
    let ls = state.locationStack
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
    pop()
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