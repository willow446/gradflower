makeFlower = (state) => {
    return {x: state.x, y: state.y}
}

drawFlower = (state) => {
    push()
    stroke(0)
    rect(state.x,state.y, 520)
    pop()
    console.log(state.colorStack)
    console.log(state.locationStack)
    f_multiGradient(state.x-100,state.y-100, 50,50, state.colorStack, state.locationStack, 0)
}