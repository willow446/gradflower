const randomG = () => {
  var N = 4;
  var r = 0;
  for (var i = N; i > 0; i--) {
    r += Math.random();
  }
  return (r / N) * 2 - 1;
};

const randomG2 = () => {
  var N = 4;
  var r = 0;
  for (var i = N; i > 0; i--) {
    r += Math.random();
  }
  return (r / N) * 2;
};

const invertColor = (c) => {
  let s = c.toString();
  let o_s = s.replace(/[^\d,]/g, "");
  let nums = o_s.split(",");
  var o_nums = [];
  nums.forEach((element) => {
    o_nums.push(255 - parseInt(element));
  });
  return color(o_nums[0], o_nums[1], o_nums[2]);
};

const randomSelectTwo = () => {
  const rando = random(1);
  return rando > 0.5 ? true : false;
};

const pointsOnCircle = (n, r) => {
  p = [{ x: 0, y: 0 }];
  for (let i = 0; i < n; i++) {
    let theta = Math.random() * 360;
    p.push({
      x: r * Math.sin((theta * PI) / 180),
      y: r * Math.cos((theta * PI) / 180),
    });
  }
  return p;
};

const f_getGradColor = (state, i, inverse) => {
  let c =
    inverse == 1
      ? state.accentStack
      : inverse == 2
      ? state.detailStack
      : state.colorStack;
  let loc = state.locationStack;
  if (i > 1) return;
  let j = 0;
  while (i > loc[j]) {
    j++;
  }
  let inter = !j ? map(i, 0, loc[0], 0, 1) : map(i, loc[j - 1], loc[j], 0, 1);
  let c1 = c[j];
  let c2 = c[j + 1];
  let o = lerpColor(c1, c2, inter);
  return o;
};

function f_gradBezierLine(state, p, inverse) {
  push();
  noFill();
  beginShape(TRIANGLE_STRIP);
  for (let i = 0; i < 1; i += 0.01) {
    c = f_getGradColor(state, i, inverse);
    log(c);
    stroke(c);
    strokeWeight(Math.ceil(randomG2(1)));
    let pf = cubicBezier(p[0], p[1], p[2], p[3], i);
    vertex(pf.x, pf.y);
  }
  endShape();
  pop();
}

//TODO
function f_gradLine(state, p, inverse) {
  push();
  noFill();
  beginShape(TRIANGLE_STRIP);
  for (let i = 0; i < 1; i += 0.01) {
    c = f_getGradColor(state, i, inverse);
    log(c);
    stroke(c);
    strokeWeight(0.5);
    //let pf = lerp(p[0]);
    vertex(pf.x, pf.y);
  }
  endShape();
  pop();
}

function f_gradRectLine(
  x1,
  y1,
  x2,
  y2,
  rootwidth,
  rootheight,
  sizef,
  posf,
  y_axis_on,
  state,
  cs,
  randomness
) {
  let step_size = 0;
  for (let i = 0; i < 0.9; i += 0.05) {
    ix = (x2 - x1) * posf(i) + x1;
    iy = (y2 - y1) * posf(i) + y1;
    t_w = rootwidth * sizef(i) + randomness * randomG2() * rootwidth;
    t_h =
      rootheight * randomG2() * randomness +
      dist(x1, y1, x2, y2) * (posf(i) - step_size);
    f_multiGradient(ix, iy, t_w, t_h, y_axis_on, 1, cs, state.locationStack);
    step_size = posf(i);
  }
  for (let i = 0.9; i < 1; i += 0.01) {
    ix = (x2 - x1) * posf(i) + x1;
    iy = (y2 - y1) * posf(i) + y1;
    t_w = rootwidth * sizef(i) + randomness * randomG2() * rootwidth;
    t_h =
      ((rootheight * randomG2()) / 2) * randomness +
      dist(x1, y1, x2, y2) * (posf(i) - step_size);
    f_multiGradient(ix, iy, t_w, t_h, y_axis_on, 1, cs, state.locationStack);
    step_size = posf(i);
  }
}

function f_setGradient(x, y, w, h, c1, c2, axis) {
  noFill();
  if (!axis) {
    // Top to bottom gradient
    for (let i = y; i <= y + h; i += 0.1) {
      let inter = map(i, y, y + h, 0, 1);
      let c = lerpColor(c1, c2, inter);
      stroke(c);
      line(x, i, x + w, i);
    }
  } else if (axis) {
    // Left to right gradient
    for (let i = x; i <= x + w; i += 0.1) {
      let inter = map(i, x, x + w, 0, 1);
      let c = lerpColor(c1, c2, inter);
      stroke(c);
      line(i, y, i, y + h);
    }
  }
}

function f_setRadialGrad(x1, y1, x2, y2, ra1, ra2, rb1, rb2, c1, c2) {
  push();
  noFill();
  for (let i = 1; i > 0; i -= 0.02) {
    let inter_x = lerp(x1, x2, i);
    let inter_y = lerp(y1, y2, i);
    let inter_ra = lerp(ra1, ra2, i);
    let inter_rb = lerp(rb1, rb2, i);
    let c = lerpColor(c1, c2, i);
    strokeWeight(3);
    stroke(c);
    ellipse(inter_x, inter_y, inter_ra, inter_rb);
  }
  pop();
}

function f_multiRadialGrad(state, ra, rb, i) {
  push();
  pop();
}

function f_multiGradient(x, y, w, h, axis, center, cs, ls) {
  push();
  if (center) translate(-w / 2, -h / 2);
  noFill();
  let done = 0.0;
  // Top to bottom gradient
  if (axis === 0) {
    for (let i = 0; i < cs.length - 1; i++) {
      var h2 = i == 0 ? ls[0] * h : (ls[i] - ls[i - 1]) * h;
      f_setGradient(x, y + done * h, w, h2, cs[i], cs[i + 1], 0);
      done = ls[i];
    }
  } else if (axis === 1) {
    for (let i = 0; i < cs.length - 1; i++) {
      var w2 = i == 0 ? ls[0] * w : (ls[i] - ls[i - 1]) * w;
      f_setGradient(x + done * w, y, w2, h, cs[i], cs[i + 1], 1);
      done = ls[i];
    }
  }
  pop();
}

function f_bezierRectGrad(state, p, size, center, inverse, sizef, pointf) {
  //draw curves using points
  let cs = inverse ? state.accentStack : state.colorStack;
  let j = 0.01;
  while (j < 1) {
    pf = cubicBezier(p[0], p[1], p[2], p[3], pointf(j));
    t_w = size * randomG2() * sizef(j);
    t_h = size * randomG2() * sizef(j);
    f_multiGradient(
      pf.x,
      pf.y,
      t_w,
      t_h,
      Y_AXIS,
      center,
      cs,
      state.locationStack
    );
    j += 0.03;
  }
}

function quadBezier(p0, p1, p2, t) {
  pFinal = {};
  pFinal.x = Math.pow(1 - t, 2) * p0.x + (1 - t) * 2 * t * p1.x + t * t * p2.x;
  pFinal.y = Math.pow(1 - t, 2) * p0.y + (1 - t) * 2 * t * p1.y + t * t * p2.y;
  return pFinal;
}

function cubicBezier(p0, p1, p2, p3, t) {
  pFinal = {};
  pFinal.x =
    Math.pow(1 - t, 3) * p0.x +
    Math.pow(1 - t, 2) * 3 * t * p1.x +
    (1 - t) * 3 * t * t * p2.x +
    t * t * t * p3.x;
  pFinal.y =
    Math.pow(1 - t, 3) * p0.y +
    Math.pow(1 - t, 2) * 3 * t * p1.y +
    (1 - t) * 3 * t * t * p2.y +
    t * t * t * p3.y;
  return pFinal;
}

function sigmoid(z) {
  return 1 / (1 + Math.exp(-z));
}

function groupMidpoint(p0, p1) {
  xsum = 0;
  ysum = 0;
  for (var i = 0; i < p0.length; i++) {
    xsum += p0[i].x + p1[i].x;
    ysum += p0[i].y + p1[i].y;
  }
  p = {
    x: xsum / (p0.length + p1.length),
    y: ysum / (p0.length + p1.length),
  };
  return p;
}
