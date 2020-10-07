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
    return state
}

const makeFlower = (state) => {
    f_setGradStacks(state)
    f_setFlowerAttr(state)
    return state
}

const drawPetals = (state) => {
}

const drawFlower = (state) => {
    console.log(state)
    push()
    stroke(0)
    rect(state.x,state.y, 520)
    pop()
    f_multiGradient(state, 400,500, Y_AXIS, F_CENTER)
    f_setRadialGrad(state.x,state.x,state.y,state.y, 100,110,100,110,state.colorStack[0],state.colorStack[1])
}