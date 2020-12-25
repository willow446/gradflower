const FLOWER_SIZE = 600;

// layout
const MARGIN = FLOWER_SIZE / 4;
const COLUMNS = 1;
const ROWS = 1;
const PADDING = FLOWER_SIZE / 4;
const GRIDBOX = FLOWER_SIZE + PADDING;
const START = FLOWER_SIZE / 4 + MARGIN;
let ALL_FLOWERS = [];

function saveFlower() {
  let num = Math.random() * 33;
  saveCanvas("gradflower" + num, "png");
}

function setup() {
  const totalY = 1000;
  let d = createDiv();
  d.id("canvasHolder");
  d.style("display: flex");
  d.style("flex-direction: column");
  let c = createCanvas(FLOWER_SIZE, FLOWER_SIZE);
  c.parent("canvasHolder");
  noLoop();
  angleMode(DEGREES);
  rectMode(CENTER);
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
    color(0, 0, 0),
    color(210, 247, 245),
    color(222, 215, 186),
    color(82, 81, 80),
    color(207, 151, 152),
  ];
  let horzDiv = createDiv();
  horzDiv.id("buttonHolder");
  horzDiv.parent("canvasHolder");
  horzDiv.style("display: flex");
  let save = createButton("save");
  save.parent("buttonHolder");
  save.mousePressed(saveFlower);
  let p = createDiv(
    "Refresh the page to roll a new drawing. Note: redrawing process may take up to 30 seconds"
  );
  p.parent("buttonHolder");
}

function draw() {
  clear();
  for (let x = 0; x < COLUMNS; x++) {
    for (let y = 0; y < ROWS; y++) {
      const posX = START + x * GRIDBOX;
      const posY = START + y * GRIDBOX;
      const flower = makeFlower({ x: posX, y: posY });
      ALL_FLOWERS.push(flower);
    }
  }

  ALL_FLOWERS.forEach((flower) => {
    drawFlower(flower);
  });
}
