let bg;

const arr = [];
let bubble;

var cols, rows;
var scl = 20;
var w = 1400;
var h = 1000;

var flying = 0;

var terrain = [];

let snowflakes = []; // array to hold snowflake objects

function setup() {
    createCanvas(windowWidth, windowHeight, WEBGL);
    
    bg = loadImage('images/tatasteel.jpg');

    cols = w / scl;
  rows = h / scl;

  for (var x = 0; x < cols; x++) {
    terrain[x] = [];
    for (var y = 0; y < rows; y++) {
      terrain[x][y] = 0; //specify a default value for now
    }
  }
}

function draw() {
    //Make background black
    background(bg);
  
    bubble = new Bubble();
    if (mouseX > 0 && mouseX < width && mouseY > 0 && mouseY < height) {
        bubble = new Bubble(mouseX, mouseY);
    }
  
    arr.push(bubble);
    for (let i = arr.length-1; i >= 0; i--) {
        arr[i].show();
        arr[i].update();
        if (arr[i].delete()) {
            //Delete bubble from array!
            arr.splice(1,i);
        }
    }

    flying -= 0.05;
  var yoff = flying;
  for (var y = 0; y < rows; y++) {
    var xoff = 0;
    for (var x = 0; x < cols; x++) {
      terrain[x][y] = map(noise(xoff, yoff), 0, 1, -100, 100);
      xoff += 0.2;
    }
    yoff += 0.08;
  }

  translate(0, 0);
  rotateX(PI / 3);
  fill(	0, 51, 72, 120);
  stroke(135, 206, 250, 255);
  translate(-w / 2, -h / 2);
  for (var y = 0; y < rows - 1; y++) {
    beginShape(TRIANGLE_STRIP);
    for (var x = 0; x < cols; x++) {
      vertex(x * scl, y * scl, terrain[x][y]);
      vertex(x * scl, (y + 1) * scl, terrain[x][y + 1]);
    }
    endShape();
  }
  
  let t = frameCount / 20; // update time

  // create a random number of snowflakes each frame
  for (let i = 0; i < random(1); i++) {
    snowflakes.push(new snowflake()); // append snowflake object
  }

  // loop through snowflakes with a for..of loop
  for (let flake of snowflakes) {
    flake.update(t); // update snowflake position
    flake.display(); // draw snowflake
  }
}



//Let's create a bubble class!
class Bubble {
    //Constructor will take 2 parameters: x and y position
    //Just declare them half of canvas size as default
    constructor (x = width/2,y = height/2) {
        this.x = x;
        this.y = y;
        //Bubble radius
        this.r = 10;
        //Bubble velocity
        this.vx = random(-1,1); //Left-right
        this.vy = -4; //Up
        this.color = 255;
        this.alpha = 255;
    }
    show() {
        noStroke(); //No borders on bubble
        fill(this.color, this.alpha); //Fill Ellipses
        ellipse(this.x, this.y, this.r); //Cretae Ellipses
    }
    update() {
        //Move bubbles
        this.x += this.vx;
        this.y += this.vy;
        this.alpha -= 8; //Make bubble disappear slowly
        if (this.r != 15) this.r += 1; //Make bubbles bigger
    }
    delete() {
        return (this.alpha <= 0); //If bubble disappears, return true and remove it from bubbles array.
    }
}

// snowflake class
function snowflake() {

  fill(0);
  noStroke();
  // initialize coordinates
  this.posX = 0;
  this.posY = random(-500, 0);
  this.initialangle = random(0, 2 * PI);
  this.size = random(4, 4);
 

  // radius of snowflake spiral
  // chosen so the snowflakes are uniformly spread out in area
  this.radius = sqrt(random(pow(width / 2, 2)));

  this.update = function(time) {
    // x position follows a circle
    let w = 0.05; // angular speed
    let angle = w * time + this.initialangle;
    this.posX = width / 2 + this.radius * sin(angle);
   
    // different size snowflakes fall at slightly different y speeds
    this.posY += pow(this.size, 0.5);

    // delete snowflake if past end of screen
    if (this.posY > height) {
      let index = snowflakes.indexOf(this);
      snowflakes.splice(index, 10);
    }
  };

  this.display = function() {
    ellipse(this.posX, this.posY, this.size);
  };
}