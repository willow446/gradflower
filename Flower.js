let FLOWER_COLOR_ROLLS = 3
let Y_AXIS = 0
let X_AXIS = 1
let F_ULEFT = 0
let F_CENTER = 1
let F_TRUE = 0
let F_INVERSE = 1
let F_DETAIL = 2
let F_L2R = 0
let F_R2L = 1
let FLOWER_PALETTE = []

const getRandomFromPalette = () => {
    var rando = Math.floor(Math.random(0)*FLOWER_PALETTE.length)
    return FLOWER_PALETTE[rando]
}

const f_setGradStacks = (state) => {
    t_colorStack = []
    t_colorStack.push(getRandomFromPalette())
    t_colorStack.push(getRandomFromPalette())
    for (var i = 0; i < FLOWER_COLOR_ROLLS; i++) {
        if (randomSelectTwo()) t_colorStack.push(getRandomFromPalette())
    }
    state.colorStack = t_colorStack
    t_locStack = []
    for (var j = 0; j < t_colorStack.length-2; j++) {
        t_locStack.push(parseFloat(Math.random().toFixed(2)))
    }
    state.locationStack = t_locStack.sort()
    state.locationStack.push(1)

    state.accentStack = []
    for(let i = 0; i < state.colorStack.length; i++) {
        r = Math.random()
        c = (r > 0.2) ? invertColor(state.colorStack[i]) : state.colorStack[i]
        state.accentStack.push(c)
    }
    state.detailStack = []
    for(let i = 0; i < state.colorStack.length; i++) {
        r = Math.random()
        c = (r > 0.3) ? invertColor(state.colorStack[i]) : state.colorStack[i]
        state.detailStack.push(c)
    }
}

const f_setFlowerAttr = (state) => {
    state.offX = randomG() * 100
    state.offY = randomG() * 100
    state.centerX = state.x + state.offX
    state.centerY = state.y + state.offY

    state.horz_petals = Math.ceil(Math.abs(randomG2()*2 + 2))
    state.top_pedals = Math.ceil(Math.abs(randomG()*4))
    state.bot_pedals = Math.ceil(Math.abs(randomG()*4))

    state.horz_petals_off = Math.ceil(randomG()*90)+30
    state.horz_petals_ind_off = Math.ceil(randomG()* 180/state.horz_petals)

    state.top_pedals_ind_off = Math.ceil(randomG()* 90/state.top_petals)
    state.bot_pedals_ind_off = Math.ceil(randomG()* 180/state.bot_petals)

    state.pedal_sizef = getSizeF()
    state.pedal_pointf = getPointF()

    state.curl = 10
    state.pedal_size = 40
    state.bulb_size = 25
    state.bulb_radius = 30*randomG2()
    state.branch_length = 15*randomG2() + 15
    state.l_side = false

    return state
}

const makeFlower = (state) => {
    f_setGradStacks(state)
    f_setFlowerAttr(state)
    return state
}

const drawFlowerBase = (state) => {
    push()
    noFill()
    translate(state.centerX, state.centerY+20)
    let bulb_cnt = randomG2()*4
    for(let j = 0; j<bulb_cnt; j++) {
        p = pointsOnCircle(3,80)
        for(let i = 0; i<p.length; i++) {
            p[i].x *= 1.7
            p[i].y = p[i].y*0.7 + 20
        }
        f_bezierRectGrad(state,p,state.bulb_size*2,F_CENTER,F_TRUE,s_linearRet,p_linearRet)
    }
    ellipse(0,0,10)
    pop()
}

const drawSideThinPedals = (state) => {
    push()
    let o_curl = state.curl
    let curl_incr = Math.abs(randomG()*5)
    translate(state.centerX,state.centerY)
    if (state.l_side) {
        scale(-1,1)
    }
    //ellipse(0,0,10)
    //get points
    noFill()
    points = []
    for(let i = 0; i<state.horz_petals; i++) {
        let p = [{x:0,y:0}]
        let branch_x = 0
        let branch_y = 30*(state.horz_petals-i)
        let branch_var = Math.random() + 1
        let branch_length = state.branch_length/(branch_var*Math.abs(Math.ceil(i-state.horz_petals/2))) + 10
        for(let i = 0; i<3; i++) {
            branch_x += randomG()*branch_length + 1.5*branch_length
            branch_y += randomG()*15 - i*state.curl
            p.push({x: branch_x, y: branch_y})
            //ellipse(branch_x,branch_y, 5)
        }
        points.push(p)
        state.curl += 15 + curl_incr
    }
    state.curl = o_curl
    state.points = points
    for(let i = points.length-1; i >= 0; i--) {
        p = state.points[i]
        f_bezierRectGrad(state,p,state.pedal_size,F_ULEFT,F_TRUE,state.pedal_sizef,state.pedal_pointf)
    }
    pop()
}

const drawThinPetals = (state) => {
    //draw right side pedals
    drawSideThinPedals(state)
    state.l_side = true
    //draw left side pedals
    drawSideThinPedals(state)
}

const drawBulb = (state) => {
    push()
    translate(state.centerX, state.centerY)
    let bulb_cnt = randomG2()*4
    for(let j = 0; j<bulb_cnt; j++) {
        p = pointsOnCircle(3,state.bulb_radius)
        f_bezierRectGrad(state,p,state.bulb_size*2,F_CENTER,F_INVERSE,s_linearRet,p_posBend)
    }
    pop()
}

const drawFilaments = (state) => {
    push()
    translate(state.centerX, state.centerY)
    let fil_cnt = randomG2()*6
    for(let j = 0; j<fil_cnt; j++) {
        let p = [{x:0,y:0}]
        let branch_x = 0
        let branch_y = 0
        for(let i = 3; i>0; i--) {
            branch_x += randomG()*randomG2()*50
            branch_y += (randomG()-0.3)*randomG2()*25 - randomG2()*15
            p.push({x: branch_x, y: branch_y})
        }
        f_gradBezierLine(state,p,F_DETAIL)
    }
    pop()
}

const drawFlower = (state) => {
    //console.log(state)
    push()
    stroke(0)
    rect(state.x,state.y, 520)
    pop()
    //f_multiGradient(state.x,state.y,400,500,Y_AXIS,F_CENTER,state.colorStack,state.locationStack)
    drawFlowerBase(state)
    drawThinPetals(state)
    drawBulb(state)
    drawFilaments(state)
    push()
    //translate(state.x,state.y)
    //f_multiGradient(-520/2,520/2+7,520,20,X_AXIS,F_ULEFT,state.colorStack,state.locationStack)
    pop()
}