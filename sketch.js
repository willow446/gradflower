const FLOWER_SIZE = 500

// layout
const MARGIN = FLOWER_SIZE / 2
const COLUMNS = 2
const ROWS = 6
const PADDING = FLOWER_SIZE * 0.1
const GRIDBOX = FLOWER_SIZE + PADDING
const START = (FLOWER_SIZE / 4) + MARGIN

let FLOWER_PALETTE
ALL_FLOWERS = []

function setup() {
  const totalY = START-START/4 + GRIDBOX * ROWS
  createCanvas(windowWidth, totalY)
  noLoop()
  angleMode(DEGREES)
  rectMode(CENTER)
  FLOWER_PALETTE = [
    color(13, 87, 34),
    color(130, 13, 34),
    color(129, 197, 240),
    color(243, 245, 233),
    color(245, 174, 32),
    color(44, 21, 74),
    color(4, 140, 86),
    color(186, 53, 0),
    color(250, 240, 240),
    color(255, 203, 31),
    color(6, 82, 148),
    color(38, 43, 51),
    color(31, 26, 26),
    color(0,0,0)
  ]
}

function draw() {
  // go to a point on the screen and draw a crystal
  // continue to do this until we run out of room
  for (let x = 0; x < COLUMNS; x++) {
    for (let y = 0; y < ROWS; y++) {
      const posX = START + (x * GRIDBOX)
      const posY = START-START/4 + (y * GRIDBOX)
      const flower = makeFlower({x: posX, y: posY})
      ALL_FLOWERS.push(flower)
    }
  }

  ALL_FLOWERS.forEach(flower => {
    f_setFlowerState(flower)
    drawFlower(flower)
  })
}