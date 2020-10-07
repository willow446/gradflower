const FLOWER_SIZE = 500

// layout
const MARGIN = FLOWER_SIZE / 2
const COLUMNS = 2
const ROWS = 6
const PADDING = FLOWER_SIZE * 0.1
const GRIDBOX = FLOWER_SIZE + PADDING
const START = (FLOWER_SIZE / 4) + MARGIN

ALL_FLOWERS = []

function setup() {
  const totalY = START-START/4 + GRIDBOX * ROWS
  createCanvas(windowWidth, totalY)

  PALETTE = [
    color(255, 52, 154), // pink
    color(4, 0, 152) // blue
  ]

  noLoop()
  angleMode(DEGREES)
  rectMode(CENTER)
}

function draw() {
  // go to a point on the screen and draw a crystal
  // continue to do this until we run out of room
  for (let x = 0; x < COLUMNS; x++) {
    for (let y = 0; y < ROWS; y++) {
      const posX = START + (x * GRIDBOX)
      const posY = START-START/4 + (y * GRIDBOX)
      const flower = makeFlower({x: posX, y: posY})
      console.log(flower)
      ALL_FLOWERS.push(flower)
    }
  }

  ALL_FLOWERS.forEach(flower => {
    drawFlower(flower)
  })
}