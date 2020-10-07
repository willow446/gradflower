const state = {
    offX: 24,
    offY: 32
}

makeFlower = (state) => {
    return {x: state.x, y: state.y}
}

drawFlower = (state) => {
    rect(state.x,state.y, 530)
    ellipse(state.x,state.y,10)
}