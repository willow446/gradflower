let PALETTE = []

const state = {
  sides: 3,
  stepsOut: 8,
  thinStroke: 1,
  thickStroke: 3
}

const setState = (state) => {
  state.numShapes = state.sides,
  state.angle = 360 / state.numShapes,
  state.singleStep = (CRYSTAL_SIZE / 2) / state.stepsOut,
  state.layerColor = getRandomFromPalette()
  return state
}
