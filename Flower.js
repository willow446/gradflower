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
  let inner_num_petals = Math.floor(Math.random() * 12) + 3;
  let curl = (randomG2() * 60) / inner_num_petals + 10;
  let inner_ang = 360 / inner_num_petals;
  let starting_r = state.inner_radius;
  let inner_num_rings = Math.floor(Math.random() * 6) + 3;
  let inner_step = state.inner_radius / inner_num_rings;
  let starting_length = 60 * Math.random() + 30;
  let inner_length_step = (starting_length - 10) / inner_num_rings;
  let y_axis_on = randomSelectTwo() ? 1 : 0;
  state.rootsize = 10;
  let sf = randomSelectTwo() ? s_wideLeaf : s_leaveBend;
  let pf = getPointF();
  let cs = randomSelectTwo() ? state.detailStack : state.inverseColorStack;
  for (let i = 0; i < inner_num_rings; i++) {
    rotate(curl);
    for (let j = 0; j < inner_num_petals; j++) {
      f_gradRectLine(
        0,
        starting_r,
        0,
        starting_length,
        state.rootsize / (inner_num_rings / 2),
        state.rootsize / (inner_num_rings / 8),
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

const assymetricEllipses = (state) => {
  let top_num = Math.floor(Math.random() * 3) + 1;
  let bot_num = Math.floor(Math.random() * 3) + 1;
  let top_ang = top_num / 180;
  let bot_ang = bot_num / 180;
};

const drawInnerComponents = (state) => {
  drawInnerPedals(state);
  for (let i = 0; i < 2; i++) {
    if (randomSelectTwo()) {
      state.inner_radius = state.inner_radius / 2;
      console.log("bang");
      drawInnerPedals(state);
    }
  }
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
