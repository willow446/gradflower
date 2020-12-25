let FLOWER_COLOR_ROLLS = 3;
let Y_AXIS = 0;
let X_AXIS = 1;
let F_ULEFT = 0;
let F_CENTER = 1;
let F_TRUE = 0;
let F_INVERSE = 1;
let F_DETAIL = 2;
let F_L2R = 0;
let F_R2L = 1;
let FLOWER_PALETTE = [];
let F_PETAL_LENGTH = 100;
let F_RAND = 0.1;
let F_SMALL_RAND = 10;
let F_BIG_RAND = 50;

const getRandomFromPalette = () => {
  var rando = Math.floor(Math.random(0) * FLOWER_PALETTE.length);
  return FLOWER_PALETTE[rando];
};

const f_setGradStacks = (state) => {
  t_colorStack = [];
  t_colorStack.push(getRandomFromPalette());
  t_colorStack.push(getRandomFromPalette());
  for (var i = 0; i < FLOWER_COLOR_ROLLS; i++) {
    if (randomSelectTwo()) t_colorStack.push(getRandomFromPalette());
  }
  state.colorStack = t_colorStack;
  t_locStack = [];
  for (var j = 0; j < t_colorStack.length - 2; j++) {
    t_locStack.push(parseFloat(Math.random().toFixed(2)));
  }
  state.locationStack = t_locStack.sort();
  state.locationStack.push(1);

  state.accentStack = [];
  for (let i = 0; i < state.colorStack.length; i++) {
    r = Math.random();
    c = r > 0.2 ? invertColor(state.colorStack[i]) : state.colorStack[i];
    state.accentStack.push(c);
  }
  state.detailStack = [];
  for (let i = 0; i < state.colorStack.length; i++) {
    r = Math.random();
    c = r > 0.3 ? invertColor(state.colorStack[i]) : state.colorStack[i];
    state.detailStack.push(c);
  }
  state.inverseColorStack = [];
  for (let i = 0; i < state.colorStack.length; i++) {
    c = invertColor(state.colorStack[i]);
    state.inverseColorStack.push(c);
  }
};

const f_generateZoneInfo = (state) => {
  let num_petals = Math.ceil(Math.random() * 3);
  let angles = [];
  let lengths = [];
  for (let i = 0; i < num_petals; i++) {
    angles.push(Math.random());
    lengths.push(Math.random());
  }
  angles = angles.sort();
  let inverse = randomSelectTwo();
  return {
    num_petals,
    angles,
    lengths,
    inverse,
  };
};

const f_generateZones = (state) => {
  let num_zones = 2 * Math.ceil(Math.random() * 3) + 1;
  let zone_ang = 360 / num_zones;
  let primary = f_generateZoneInfo(state);
  let secondary = f_generateZoneInfo(state);
  let sel_zone_info = [];
  for (let j = 0; j < num_zones / 2 - 1; j++) {
    Math.random() > 0.75 ? (v = 1) : (v = 0);
    sel_zone_info.push(v);
  }
  sel_zone_info.push(Math.round(Math.random()));
  for (let k = 0; k < num_zones / 2 - 1; k++) {
    sel_zone_info.push(sel_zone_info[Math.floor(num_zones / 2 - 1 - k)]);
  }
  for (let l = 0; l < sel_zone_info.length / 2; l++) {
    if (Math.random() > 0.9) {
      sel_zone_info[l] = -1;
      sel_zone_info[sel_zone_info.length - 1 - l] = -1;
    }
  }
  return {
    num_zones,
    zone_ang,
    primary,
    secondary,
    sel_zone_info,
  };
};

const f_setFlowerAttr = (state) => {
  state.zones = [];
  state.zones.push(f_generateZones());
  for (let i = 0; i < 2; i++) {
    if (randomSelectTwo()) {
      state.zones.push(f_generateZones());
    }
  }
  state.petal_length = randomG2() * F_PETAL_LENGTH + 50;
  state.inner_radius = 100 * randomG2();
};

const makeFlower = (state) => {
  f_setGradStacks(state);
  f_setFlowerAttr(state);
  return state;
};

const drawOuterPetals = (state) => {
  push();
  angleMode(DEGREES);
  translate(state.x, state.y);
  let sizefunction = getSizeF();
  let secondsizefunction = getSizeF();
  let pf = getPointF();
  let rootsize = 20 + Math.random() * 20;
  let t_inner_radius =
    state.inner_radius - (state.inner_radius / 2) * randomG2();
  for (let i = 0; i < state.zones.length; i++) {
    push();
    let y_axis_on = Math.random() > 0.7 ? 0 : 1;
    curr_zone = state.zones[i];
    rotate(-curr_zone.zone_ang / 2);
    for (let j = 0; j < curr_zone.num_zones; j++) {
      zone_info = curr_zone.sel_zone_info[j];
      var curr_zone_info;
      var cs;
      var sf;

      if (zone_info) {
        curr_zone_info = curr_zone.secondary;
        inv = randomSelectTwo() ? state.detailStack : state.inverseColorStack;
        cs = curr_zone_info.inverse ? inv : state.colorStack;
        sf = secondsizefunction;
      } else if (zone_info == 0) {
        curr_zone_info = curr_zone.primary;
        cs = state.colorStack;
        sf = sizefunction;
      } else {
        rotate(curr_zone.zone_ang);
        continue;
      }
      t_angles = curr_zone_info.angles;
      t_lengths = curr_zone_info.lengths;
      for (let k = 0; k < curr_zone_info.num_petals; k++) {
        strokeWeight(1);
        stroke(0);
        var angle_mesurment = t_angles[k];
        if (k > 0) {
          angle_mesurment = t_angles[k] - t_angles[k - 1];
        }
        rotate(curr_zone.zone_ang * angle_mesurment);
        //line(0, 0, 0, 300 * (t_lengths[k] + 0.35));
        f_gradRectLine(
          0,
          t_inner_radius,
          0,
          200 * (t_lengths[k] + 0.35),
          rootsize,
          rootsize,
          sf,
          pf,
          y_axis_on,
          state,
          cs,
          0.7
        );
      }
      rotate(curr_zone.zone_ang * (1 - t_angles[t_angles.length - 1]));
    }
    pop();
  }
  pop();
};

const drawInnerPedals = (state) => {
  push();
  translate(state.x, state.y);
  angleMode(DEGREES);
  let inner_num_petals = Math.floor(Math.random() * 8) + 3;
  let curl = randomG2() * 90;
  randomSelectTwo()
    ? (curl += randomG2() * 45)
    : randomSelectTwo
    ? (curl -= randomG2() * 45)
    : (curl += 0);
  let inner_ang = 360 / inner_num_petals;
  let starting_r = state.inner_radius;
  let inner_num_rings = Math.floor(Math.random() * 6) + 3;
  let inner_step = state.inner_radius / inner_num_rings;
  let starting_length = 80 * Math.random() + 10;
  let inner_length_step = (starting_length - 10) / inner_num_rings;
  let y_axis_on = randomSelectTwo() ? 1 : 0;
  state.rootsize = 10;
  let sf = randomSelectTwo() ? s_wideLeaf : s_leaveBend;
  let pf = getPointF();
  let cs = randomSelectTwo() ? state.detailStack : state.inverseColorStack;
  let w = randomSelectTwo()
    ? state.rootsize
    : (2 * 3.14 * state.inner_radius * 0.4) / (2 * inner_num_petals);
  let h = randomSelectTwo() ? state.rootsize * 1.2 : state.rootsize * 8;
  for (let i = 0; i < inner_num_rings; i++) {
    rotate(curl);
    for (let j = 0; j < inner_num_petals; j++) {
      f_gradRectLine(
        0,
        starting_r,
        0,
        starting_length,
        w / (i + 1),
        h / (i + 1),
        sf,
        pf,
        y_axis_on,
        state,
        cs,
        0.7
      );
      rotate(inner_ang);
    }
    starting_r -= inner_step;
    starting_length -= inner_length_step;
  }

  pop();
};

const innerOrnateStigma = (state) => {
  push();
  translate(state.x, state.y);
  let zone = state.zones[Math.floor(Math.random() * state.zones.length)];
  let stigma_info = zone.sel_zone_info;

  if (randomSelectTwo()) {
    stigma_info.push(Math.round(Math.random()));
    stigma_info.concat(zone.sel_zone_info);
  }
  let base_len = randomG() * state.inner_radius + 40;
  let len0 = Math.random() + 0.2;
  let len1 = Math.random() + 0.3;
  let y_axis0 = Math.round(Math.random());
  let y_axis1 = Math.round(Math.random());
  let innards = Math.floor(Math.random() * 7);
  ap1 = {
    x: 0,
    y: 0,
  };
  ap2 = {
    x: randomSelectTwo() ? 0 : (randomG() + 0.5) * 30,
    y: base_len * len0,
  };
  ac1 = {
    x: Math.random() * 25,
    y: randomG2() * 20,
  };
  ac2 = {
    x: Math.random() * 25,
    y: randomG2() * 60,
  };
  bp1 = {
    x: 0,
    y: 0,
  };
  bp2 = {
    x: randomSelectTwo() ? 0 : (randomG() + 0.5) * 30,
    y: base_len * len1,
  };
  bc1 = {
    x: Math.random() * 50,
    y: randomG2() * 20,
  };
  bc2 = {
    x: Math.random() * 50,
    y: randomG2() * 80,
  };
  for (let k = innards; k > 0; k--) {
    let m = map(k, 0, innards, 0.25, 1);
    let c1 = [ap1, ap2, ac1, ac2];
    let c2 = [bp1, bp2, bc1, bc2];
    let a = interp_curves_and_len(c1, c2, m);
    let b = interp_curves_and_len(c2, c1, m);
    for (let i = 0; i < stigma_info.length; i++) {
      if (stigma_info[i] > 0) {
        f_ornateGradLine(a[0], a[1], a[2], a[3], y_axis0, state, 1);
      } else if (stigma_info[i] == 0) {
        f_ornateGradLine(b[0], b[1], b[2], b[3], y_axis1, state, 0);
      }
      rotate(360 / stigma_info.length);
    }
  }
  pop();
};

const drawCenter = (state) => {
  push();
  translate(state.x, state.y);
  c1 = state.colorStack[Math.floor(Math.random() * state.colorStack.length)];
  c2 = state.colorStack[Math.floor(Math.random() * state.colorStack.length)];
  if (c1 === c2)
    c2 = state.colorStack[Math.floor(Math.random() * state.colorStack.length)];
  f_setRadialGrad(
    0,
    0,
    0,
    0,
    0,
    state.inner_radius + Math.random() * 50,
    0,
    state.inner_radius + Math.random() * 50,
    c1,
    c2
  );
  pop();
};

const drawHairs = (state) => {
  push();
  translate(state.x, state.y);
  let num_hairs = Math.floor(Math.random() * 10) + 20;
  let hair_ang = 360 / num_hairs;
  let hair_len = Math.floor(Math.random() * 20) + 10;
  let ran = Math.floor(Math.random() * 3);
  let start = state.inner_radius / 2 + (randomG2() * state.inner_radius) / 2;
  let end = start + hair_len;
  for (let i = 0; i < num_hairs; i++) {
    f_gradLine(0, start, 0, end, 2, state, ran);
    rotate(hair_ang);
  }
  let c1 = randomSelectTwo()
    ? state.colorStack[Math.floor(Math.random() * state.colorStack.length)]
    : state.accentStack[Math.floor(Math.random() * state.accentStack.length)];
  let c2 = randomSelectTwo()
    ? state.colorStack[Math.floor(Math.random() * state.colorStack.length)]
    : state.accentStack[Math.floor(Math.random() * state.accentStack.length)];
  if (c1 === c2)
    c2 = state.colorStack[Math.floor(Math.random() * state.colorStack.length)];
  f_setRadialGrad(
    0,
    0,
    0,
    0,
    0,
    2 * start - hair_len,
    0,
    2 * start - hair_len,
    c1,
    c2
  );
  pop();
};

const drawInnerComponents = (state) => {
  state.inner_radius *= 0.7;
  if (randomSelectTwo()) drawHairs(state);
  state.inner_radius / 2;
  if (randomSelectTwo()) drawHairs(state);
  drawInnerPedals(state);
  for (let i = 0; i < 2; i++) {
    if (randomSelectTwo()) {
      state.inner_radius = state.inner_radius / 2;
      drawInnerPedals(state);
      state.inner_radius *= 2;
    }
  }
  if (randomSelectTwo()) innerOrnateStigma(state);
  if (randomSelectTwo()) innerOrnateStigma(state);
};

const drawFilaments = (state) => {
  push();
  translate(state.x, state.y);
  let fil_cnt = randomG2() * 6;
  for (let j = 0; j < fil_cnt; j++) {
    let p = [{ x: 0, y: 0 }];
    let branch_x = 0;
    let branch_y = 0;
    for (let i = 3; i > 0; i--) {
      branch_x += randomG() * randomG2() * 50;
      branch_y += (randomG2() - 0.3) * randomG2() * 25 - randomG2() * 15;
      p.push({ x: branch_x, y: branch_y });
    }
    f_gradBezierLine(state, p, F_DETAIL);
  }
  pop();
};

const drawFlower = (state) => {
  angleMode(DEGREES);
  //console.log(state)
  push();
  stroke(255);
  noFill();
  rect(state.x, state.y, 520);
  pop();
  //f_multiGradient(state.x,state.y,400,500,Y_AXIS,F_CENTER,state.colorStack,state.locationStack)
  push();
  drawOuterPetals(state);
  pop();
  drawInnerComponents(state);
  push();
  //translate(state.x,state.y)
  //f_multiGradient(-520/2,520/2+7,520,20,X_AXIS,F_ULEFT,state.colorStack,state.locationStack)
  pop();
};
