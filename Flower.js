let FLOWER_COLOR_ROLLS = 3
let Y_AXIS = 0
let X_AXIS = 1
let F_ULEFT = 0
let F_CENTER = 1
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
}

const f_setFlowerAttr = (state) => {
    state.offX = randomG() * 100
    state.offY = randomG() * 100
    state.centerX = state.x + state.offX
    state.centerY = state.y + state.offY

    state.horz_petals = Math.ceil(Math.abs(randomG()*4 + 3))
    state.top_pedals = Math.ceil(Math.abs(randomG()*4))
    state.bot_pedals = Math.ceil(Math.abs(randomG()*4))

    state.horz_petals_off = Math.ceil(randomG()*90)+30
    state.horz_petals_ind_off = Math.ceil(randomG()* 180/state.horz_petals)

    state.top_pedals_ind_off = Math.ceil(randomG()* 90/state.top_petals)
    state.bot_pedals_ind_off = Math.ceil(randomG()* 180/state.bot_petals)

    state.curl = 10
    state.pedal_size = 40
    state.branch_length = 60
    state.l_side = false
    console.log(state);

    return state
}

const makeFlower = (state) => {
    f_setGradStacks(state)
    f_setFlowerAttr(state)
    return state
}

const drawSidePedals = (state) => {
    push()
    let o_curl = state.curl
    let curl_incr = Math.abs(randomG()*5)
    translate(state.centerX,state.centerY)
    console.log(state.l_side);
    if (state.l_side) {
        scale(-1,1)
    }
    //ellipse(0,0,10)
    //get points
    push()
    noFill()
    points = []
    for(let i = 0; i<state.horz_petals; i++) {
        let p = [{x:0,y:0}]
        let branch_x = 0
        let branch_y = 30*(state.horz_petals-i)
        for(let i = 0; i<3; i++) {
            branch_x += randomG()*state.branch_length + state.branch_length/(i+1)
            branch_y += randomG()*15 - i*state.curl
            p.push({x: branch_x, y: branch_y})
            //ellipse(branch_x,branch_y, 5)
        }
        points.push(p)
        state.curl += 15 + curl_incr
    }
    state.curl = o_curl

    pop()

    //draw curves using points
    for(let i = 0; i < points.length; i++) {
        //beginShape()
        p = points[i]
        for(let j = 0; j < 1; j+=0.02) {
            pf = cubicBezier(p[0],p[1],p[2],p[3],j)
            //vertex(pf.x,pf.y)
            t_w = state.pedal_size*randomG2()/(4*j+1)
            t_h = state.pedal_size*randomG2()/(4*j+1)
            f_multiGradient(pf.x,pf.y,t_w,t_h,Y_AXIS,F_ULEFT,state.colorStack,state.locationStack)
        }
        //endShape()
    }
    pop()
}

const drawPetals = (state) => {
    //draw right side pedals
    drawSidePedals(state)
    state.l_side = true
    //draw left side pedals
    drawSidePedals(state)
}

const drawFlower = (state) => {
    console.log(state)
    push()
    stroke(0)
    rect(state.x,state.y, 520)
    pop()
    //f_multiGradient(state.x,state.y,400,500,Y_AXIS,F_CENTER,state.colorStack,state.locationStack)
    drawPetals(state)
    push()
    translate(state.x,state.y)
    f_multiGradient(-520/2,520/2+7,520,20,X_AXIS,F_ULEFT,state.colorStack,state.locationStack)
    pop()
}