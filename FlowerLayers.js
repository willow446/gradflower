let FLOWER_COLOR_ROLLS = 3

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

const f_setFlowerState = (state) => {
    f_setGradStacks(state)
    return state
}




