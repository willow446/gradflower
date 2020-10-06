var flower = function(s) {
    s.setup = function() {
        s.createCanvas(s.windowWidth,s.windowHeight)
    }

    s.draw = function() {
        s.background(75)
    }
    s.mousePressed = function() {
    }
    s.drawBranch = function(p) {
    }
}

var c = new p5(flower)