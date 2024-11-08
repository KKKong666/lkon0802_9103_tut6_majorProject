// Declare the variable graphicsObjects and assign it an empty array, to store the graphic objects
let graphicsObjects = [];  

// Declare the variable colourPalette to store the colour elements in an array
let colourPalette; 

// Declare the variable shadowRings and assign it an empty array, to store data   
let shadowRings = [];

//Set the initial scale size for scaling circular patterns
let scaleFactor = 1;

//Set the transition scaling speed
let targetScaleFactor = 0.5; 

//Set the transition scaling speed
let lerpSpeed = 0.05; 

//Declare the particles and assign it an empty array, to store data   
let particles = []; 

//Declare the speed value for the code that follows to change based on the time, which can be flexibly controlled
let duration = 50; 

//Declare the ducks and assign it an empty array, to store data
let ducks = [];

// Control the speed of the duck's movement
let duckSpeed = 5; 

// Boundary distance
// Us to control the bounce of the duck as it approaches the boundary
let dst = 50; 

// Minimum distance to ensure no overlap between ducks
let minDistance = 60; 

// Declare the variable waveEffect 
let waveEffect;

// Declare the variable gridLayer
let gridLayer;


function setup() {

//Create a canvas that has the same size as the browser window, using the variables windowWidth and windowHeight
  createCanvas(windowWidth, windowHeight);
  //Remove the group code, as a loop is required to generate the animated graphics
  //noLoop();
  
//Initialise Graphic Elements, such as the colours and rings
  initialiseGraphics();
  pixelDensity(1);

  // Initialise the ripple effect
  poolColour = color(44, 164, 223)
  waveEffect = new WaveEffect(80, poolColour, 3, 200);

  // Create the grid and distortion effect layer
  gridLayer = createGraphics(width, height);
  
  //Draw the distorted horizonal lines and vertical lines at the bottom of the pool 
  drawGridAndDistortion(gridLayer); 
}

function initialiseGraphics() {
  
//Initialize the array assigned to graphicsObjects
  graphicsObjects = [];
  
//Initialize the array assigned to shadowRings
  shadowRings = [];

//Initialize the array assigned to particles
  particles = [];
  ducks = []; 
  

// Assign the variable colourPalette an array with colors inspired by the selected artwork
  colourPalette = [
    color(245, 185, 193), 
    color(237, 170, 63),  
    color(166, 233, 156),
    color(238, 116, 178),
    color(65, 124, 180),  
    color(149, 205, 232)
  ];

  //Set the minimum distance between each ring
  const minDistance = 250;

  // Create up to 10 non-ovelapping rings
  for (let i = 0; i < 10; i++) {
    let posX, posY;
    let isOverlapping;
    let attempts = 0;
    
  //Each ring is randomly positioned so that it does not overlap with another ring, and the maximum number of attempts is set to 100.
    const maxAttempts = 100; 
  
    //Execute the loop
    do {
      
      //Random x coordinate of the centre, random y coordinate of the centre
      posX = random(100, width - 50);
      posY = random(100, height - 50);
      isOverlapping = false;

      //Loop through the values in the shadowRings array, to check whether the new shadow ring and the existing shadow ring overlap
      for (let ring of shadowRings) {
        let distance = dist(posX, posY, ring.x, ring.y);
        
        //Ensure the distance between the new ring and the existing ring is greater than a set minimum distance. 
        if (distance < minDistance) { 
          isOverlapping = true;
          
          //If not, the random centre coordinates of the ring are invalid, then skip the subsequent meaningless comparisons, to improve performance 
          break; 
        }
      }

      attempts++;
    
    //If there is overlap and there is still avaliable attempts, execute the loop
    } while (isOverlapping && attempts < maxAttempts);

    ///If the number of random attempts reaches the maximum number, and does not get a random ring which does not overlap with other rings, then stop drawing the current ring. "The continue statement breaks one iteration (in the loop)", and this quotation of this technique is from https://www.w3schools.com/js/js_break.asp

    if (attempts >= maxAttempts) continue;

    //Draw the shadow under the swimming ring
    graphicsObjects.push(new GradientRing(posX, posY, 40, 120, 80, color(6, 38, 96, 20), color(6, 38, 96, 20), color(6, 38, 96, 20)));
    
    //Draw the swimming ring Above the shadow
    shadowRings.push({ x: posX, y: posY, radius: 80 });
  }

  //Our circle is an original idea. After several iterations, we finally chose a polka dot circle to form the swimming ring.
  
  // Add corresponding main gradient ring and decorative small ring for each swimming ring
  for (let ring of shadowRings) {
    let posX = ring.x - 80;
    let posY = ring.y - 80;

    let shadowColour = random(colourPalette);
    let midColour = random(colourPalette);
    let highlightColour = random(colourPalette);

    //Draw the main gradient ring of the swimming ring
    graphicsObjects.push(new GradientRing(posX, posY, 40, 120, 80, shadowColour, midColour, highlightColour));
    
    //Draw the concentric circles inside the swimming ring
    let circleColour = random(colourPalette);
    graphicsObjects.push(new ConcentricCircles(posX, posY, 5, 40, 70, circleColour));

    let baseRadius = 80;
    let baseOpacity = 180;
    let radiusIncrement = 10;
    let opacityDecrement = 20;
    
    //Painted decorative ring
    for (let j = 0; j < 4; j++) {
      graphicsObjects.push(new DecorativeCircleRing(posX, posY, baseRadius + j * radiusIncrement, 36 + j * 6, color(255, 255, 255, baseOpacity - j * opacityDecrement)));
    }
  }
// Created and initialized five Duck objects 
// Made sure that their randomly generated positions on the screen did not overlap.
  for (let i = 0; i < 5; i++) {
    let x = random(width);
    let y = random(height);

  // The horizontal and vertical velocities, respectively, are randomly chosen to be -1 or 1
  // indicating different initial directions of motion.
    let vx = random([-1, 1]);
    let vy = random([-1, 1]);
    let duck = new Duck(x, y, vx, vy);

  // Use the isOverlapping function to check if the newly generated duck overlaps with other objects.
  // If it does, regenerate the positions x and y and create a new Duck object until you find a position that doesn't overlap.
  // Add the generated duck object, which is confirmed to be non-overlapping, to the ducks array
    while (isOverlapping(duck)) {
      x = random(width);
      y = random(height);
      duck = new Duck(x, y, vx, vy);
    }
  
  ducks.push(duck);
  }
}

function draw() {
  // Display the grid layer with distortion
  image(gridLayer, 0, 0);
  
  // Display the ripple effect
  waveEffect.display();

  // A double loop updates the state of each duck, draws them, and checks for and handles collisions between ducks.
  for (let i = 0; i < ducks.length; i++) {

    // Updates the duck's position and speed so that it moves across the screen.
    ducks[i].update();  
    // draw the ducks and display them on the screen.
    ducks[i].display(); 
    
    // Calculate the distance between ducks[i] and ducks[j] using the dist function.
    // If the distance is less than minDistance, the two ducks are considered to overlap or collide.
    for (let j = i + 1; j < ducks.length; j++) {
      if (dist(ducks[i].x, ducks[i].y, ducks[j].x, ducks[j].y) < minDistance) {

        // When a collision is detected, the bounce method is called to make the ducks bounce.
        // make ducks[i] bounce relative to ducks[j].
        // make ducks[j] bounce relative to ducks[i].
        ducks[i].bounce(ducks[j]); 
        ducks[j].bounce(ducks[i]); 
      }
    }
    
    for (let j = 0; j < graphicsObjects.length; j++) {
      if (graphicsObjects[j].scaleFactor < 0.8 &&
        dist(ducks[i].x, ducks[i].y, graphicsObjects[j].x - 80, graphicsObjects[j].y - 80) < 100 * graphicsObjects[j].scaleFactor + minDistance) {
        ducks[i].bounce(graphicsObjects[j]); // 反弹
        ducks[i].bounce(graphicsObjects[i]); // 反弹
  }
}
  }


// Control scaling with the sin() function
// Generates particles when the scaleFactor reaches a certain threshold.
// Particles are generated in the center of shadowRings and are updated and displayed over time.

// Uses the sin function to generate a smooth loop from 0 to 1. 
// Duration controls the period of the sin() wave.
// sin() value to the range [0, 1]
  let progress = (sin(frameCount / duration * TWO_PI ) + 1) / 2; 

  // scaleFactor varies smoothly between 0.5 and 1.
  scaleFactor = lerp(0.5, 1, progress)

  //Particle generation starts when scaleFactor is less than or equal to 0.55 and the particles array is empty.
  if (scaleFactor <= 0.55) {
    if (particles.length === 0) { 

      // The outer for loop iterates over each object in the shadowRings array 
      for (let i = 0; i < shadowRings.length; i++) {
        let centerX = shadowRings[i].x;  
        let centerY = shadowRings[i].y;
        let radius = shadowRings[i].radius;

        for (let i = 0; i < 100; i++) {
          // Generate random angle between 0 and 2π.
          let angle = random(TWO_PI); 

          // Assign a random speed between 1 and 3 to the particles.
          let speed = random(1, 3); 

          // Generate new particles around the circle
          let particle = new Particle(centerX-80, centerY-80, radius, angle, speed);
          // adds the new particle to the particles array.
          particles.push(particle);
        }
      };
    }
  }

// Filter the particles array to remove those particles where isOffScreen() returns true. 
// isOffScreen() is Particle 's method for determining if a particle is off screen.
  particles = particles.filter(function(particle) {
    return !particle.isOffScreen();
  });
  
  // Updating and drawing particles
  for (let i = 0; i < particles.length; i++) {
    particles[i].update();
    particles[i].display();
  }


  // Display each graphic object in for loop
  for (let i = 0; i < graphicsObjects.length; i++) {
    graphicsObjects[i].display(scaleFactor);
  }
} 

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  waveEffect = new WaveEffect(80, color(0, 164, 223), 3, 200);
  // This function is not used for the time being, if it is kept it will take up a lot of computer resources and may cause the animation to slow down abnormally.

  initialiseGraphics()

  // Regenerate the grid layer
  gridLayer = createGraphics(width, height);
  drawGridAndDistortion(gridLayer);


  //Applying a for loop to loop through graphicsObjects
  for (let i = 0; i < graphicsObjects.length; i++) {
    let obj = graphicsObjects[i];
    
    // Apply the instanceof operator "to test the presence of constructor.prototype in object's prototype chain." This quotation and technique is from https://canvas.sydney.edu.au/courses/60108/assignments/556120
    // Classes: GradientRing, ConcentricCircles and DecorativeCircleRing contain the prototype property
    if (obj instanceof GradientRing || obj instanceof ConcentricCircles || obj instanceof DecorativeCircleRing) {
      obj.x = map(obj.x, 0, width, 0, windowWidth);
      obj.y = map(obj.y, 0, height, 0, windowHeight);
    }
  }

  redraw(); // Redraw the canvas contents
}

// Gradient ring type
// Contains the coordinates of the center of the circle, inner and outer radii, number of circles, and gradient colors (shadow, middle, highlight)
class GradientRing {
  constructor(x, y, innerRadius, outerRadius, numRings, shadowColour, midColour, highlightColour) {
    this.x = x;
    this.y = y;
    this.innerRadius = innerRadius;
    this.outerRadius = outerRadius;
    this.numRings = numRings;
    this.colours = [shadowColour, midColour, highlightColour];
  }

  //Calculate gradient colors
  calculatecolor(t) {
    if (t < 0.5) {
      return lerpColor(this.colours[0], this.colours[1], t * 2);
    } else {
      return lerpColor(this.colours[1], this.colours[2], (t - 0.5) * 2);
    }
  }

  // Show gradient ring
  // The scaleFactor is used for scaling, to resize all the circles.
  // Step controls the radius spacing between the rings so that each ring's radius increment is the same distance away.
  // The rings will be dynamically scaled up or down according to the scaleFactor value.
  display(scaleFactor) {
    let step = (this.outerRadius - this.innerRadius) / this.numRings;
    for (let r = this.innerRadius; r <= this.outerRadius; r += step) {
      let t = map(r, this.innerRadius, this.outerRadius, 0, 1);
      //Set border color
      stroke(this.calculatecolor(t));
      strokeWeight(5);
      noFill();
      ellipse(this.x, this.y, r * 2* scaleFactor, r * 2* scaleFactor);
    }
  }
}

// Concentric circles
class ConcentricCircles {
  constructor(x, y, numCircles, minRadius, maxRadius, strokeColour) {
    this.x = x;
    this.y = y;
    this.numCircles = numCircles;
    this.minRadius = minRadius;
    this.maxRadius = maxRadius;
    this.strokeColour = strokeColour;
  }

  // Display concentric circles
  // The rings will be dynamically scaled up or down according to the scaleFactor value.
  display(scaleFactor) {
    noFill();
    stroke(this.strokeColour);
    strokeWeight(2);
    for (let i = 0; i < this.numCircles; i++) {
      //Calculate the radius of the current circle
      let radius = map(i, 0, this.numCircles - 1, this.minRadius, this.maxRadius);
      ellipse(this.x, this.y, radius * 2* scaleFactor, radius * 2* scaleFactor);
    }
  }
}

// Decorative small rings
class DecorativeCircleRing {
  constructor(x, y, radius, numCircles, fillColour) {
    this.x = x;
    this.y = y;
    this.radius = radius;
    this.numCircles = numCircles;
    this.fillColour = fillColour;
    //The angle interval of each small circle
    this.angleStep = TWO_PI / this.numCircles;
  }

  // Display the decorative ring
  // The rings will be dynamically scaled up or down according to the scaleFactor value.
  display(scaleFactor) {
    fill(this.fillColour);
    noStroke();
    for (let i = 0; i < this.numCircles; i++) {
      let angle = i * this.angleStep;
      let x = this.x + this.radius * cos(angle)* scaleFactor;
      let y = this.y + this.radius * sin(angle)* scaleFactor;
      ellipse(x, y, 6* scaleFactor, 6* scaleFactor);
    }
  }
}

// A Particle class is defined to represent a particle. 
// Particles have properties such as position, movement angle, speed, size and transparency, and contain methods for updating, displaying and determining whether they are off-screen.
class Particle {
  constructor(centerX, centerY, radius, angle, speed) {
    this.x = centerX + cos(angle) * radius;
    this.y = centerY + sin(angle) * radius;
    this.angle = angle;
    this.speed = speed;
    this.size = random(3, 8);
    this.alpha = 255; //Transparency of particles
  }

// The particle moves along the angle direction.
// alculate the horizontal and vertical displacement respectively.
  update() {
    this.x += cos(this.angle) * this.speed;
    this.y += sin(this.angle) * this.speed;

    // The transparency of the particle is gradually reduced, giving a “dissipated” effect.
    this.alpha -= 5;
  }

  display() {
    noStroke();
    fill(255, 255, 255, this.alpha);
    ellipse(this.x, this.y, this.size, this.size);
  }

  // Determine if the particle has completely disappeared.
  // Return true means the particle is completely transparent (alpha <= 0), it is considered “off screen”.
  isOffScreen() {
    return this.alpha <= 0;
  }
}

// Defines a Duck class for creating and controlling the behavior of the duck
// Including movement, speed changes, boundary collision detection, and displaying the rotation angle of the duck.
class Duck {
  constructor(x, y, vx, vy) {

    // the initial position of the duck.
    this.x = x; 
    this.y = y; 
    // the direction of the duck's initial speed.
    // multiplied by duckSpeed to control the amount of speed.
    this.vx = vx * duckSpeed; 
    this.vy = vy * duckSpeed; 
    this.maxSpeed = 5;

    // The current angle of rotation of the duck, used to orient the duck to the direction of motion when displayed.
    this.currentAngle = 0; 

    // Controls the smoothness of the duck's rotation, which affects the speed at which the duck turns.
    this.smoothness = 0.1; 
  }

  update() {

   // Randomly change the speed direction of the duck every 120 frames.
   // Generate a random angle, convert it to vx and vy
   // Make the duck move in the new random direction with maxSpeed.
   // Update the duck's position
    if (frameCount % 50 === 0) {
      let angle = random(TWO_PI); 
      this.vx = cos(angle) * this.maxSpeed;
      this.vy = sin(angle) * this.maxSpeed;
    }

    
    this.x += this.vx;
    this.y += this.vy;

    // If the duck is close to the edge of the screen (less than dst or more than the width of the screen minus dst )
    // Reverse the direction of the speed.
    if (this.x < dst) {
      this.vx = 1; // 
    } else if (this.x > width - dst) {
      this.vx = -1; //
    }

    if (this.y < dst) {
      this.vy = 1; // 
    } else if (this.y > height - dst) {
      this.vy = -1; // 
    }

    // Use atan2 to calculate the target angle targetAngle of the duck's direction of motion.
    let targetAngle = atan2(this.vy, this.vx);

    // Update currentAngle with lerp to bring the duck's steering closer to the target angle, with controlled by smoothness..
    this.currentAngle = lerp(this.currentAngle, targetAngle, this.smoothness);
  }

  display() {
    push();
    translate(this.x, this.y);
    // Rotate the coordinate system to align the duck's orientation with currentAngle. 
    // HALF_PI is used to adjust the orientation to align with the direction of movement.
    rotate(this.currentAngle + HALF_PI); 
    this.drawDuck(); 
    pop();
  }

  // draw duck shape
  drawDuck() {
    fill(255, 219, 56); // body
    stroke(246, 205, 52);  
    strokeWeight(4);
    ellipse(0, 0, 60, 80); 

    fill(255, 120, 42); // mouth
    stroke(255, 51, 26); // mouth
    strokeWeight(2);
    ellipse(0, -15, 30, 35); 

    fill(255, 219, 56); // small body
    stroke(246, 205, 52); 
    strokeWeight(4);
    ellipse(0, 0, 40, 45); 

    fill(0); // eyes
    noStroke();
    ellipse(-6, -12, 6, 6); // left eye
    ellipse(6, -12, 6, 6); // right eye
  }

  // Allow the ducks to bounce in the event of a collision
  // Check the two ducks are not overlapping.
  bounce(otherDuck) { // Use to the bouncing of two ducks after a collision.

    // angle: calculate the angle between the current duck ( this ) and the other duck ( otherDuck ). 
    // atan2 function is used to calculate the angle from otherDuck to this in order to determine the direction of the bounce.
    let angle = atan2(this.y - otherDuck.y, this.x - otherDuck.x);
    
    // adjusts the current duck's speed to a value that corresponds to the direction of the angle.
    // changes the duck's speed away from the otherDuck. 
    // duckSpeed determines the amount of speed that will result from the rebound.
    this.vx = cos(angle) * duckSpeed;
    this.vy = sin(angle) * duckSpeed;
  }
}

// make sure that new ducks don't overlap with other ducks when generating their positions.
// Use to check if the specified duck is overlapping with other ducks in the existing ducks list.
// Iterates over all ducks otherDuck and checks the distance between duck and otherDuck.
function isOverlapping(duck) {
  for (let otherDuck of ducks) {

    //use the dist function to calculate the distance between duck and otherDuck.
    // If the distance is less than minDistance, the two ducks overlap, so return true.
    // If no overlap is found at the end of the loop, false is returned.
    if (dist(duck.x, duck.y, otherDuck.x, otherDuck.y) < minDistance) {
      return true; 
    }
  }
  return false; 
}


// Functions for drawing meshes and distortion effects
function drawGridAndDistortion(layer) {
  layer.background(173, 216, 230);
  layer.stroke(100, 150, 200);
  layer.strokeWeight(2);
  let gridSize = 40;
  
  for (let x = 0; x < width; x += gridSize) {
    layer.beginShape();
    for (let y = 0; y <= height; y += gridSize) {
      // Use the noise function to generate the offset of the x-axis to create a distortion effect
      let offsetX = noise(x * 0.1, y * 0.1) * 10 - 5;
      layer.vertex(x + offsetX, y);
    }
    layer.endShape();
  }

  for (let y = 0; y < height; y += gridSize) {
    layer.beginShape();
    for (let x = 0; x <= width; x += gridSize) {
      // Use the noise function to generate the offset of the y-axis to create a distortion effect
      let offsetY = noise(x * 0.1, y * 0.1) * 10 - 5;
      layer.vertex(x, y + offsetY);
    }
    layer.endShape();
  }
}


// Original ripple effect implementation using Worley Noise from Kazuki Umeda
// Source: https://www.youtube.com/watch?app=desktop&v=kUexPZMIwuA
// GitHub: https://github.com/Creativeguru97/YouTube_tutorial/blob/master/Play_with_noise/waterSurface/sketch.js
// Modified for additional features and integration into project

// Point class representing each feature point
class Point {
  constructor(x, y) {
    // Store the position as a vector
    this.position = createVector(x, y);
  }
}

// WaveEffect class responsible for generating and displaying ripples
class WaveEffect {
  constructor(numPoints, bgColour, step, transparency) {
    this.points = [];
    // Spacing between calculated points in the ripple effect
    this.step = step;
    // Transparency of the ripple layer
    this.transparency = transparency;
    // Background colour of the pool effect
    this.bgColour = bgColour;
    // Generate random feature points within the canvas
    for (let i = 0; i < numPoints; i++) {
      let x = random(width);
      let y = random(height);
      this.points.push(new Point(x, y));
    }

    // Create a graphics layer for the wave effect
    this.waveLayer = createGraphics(width, height);
    // Set pixel density to 1 for consistency
    this.waveLayer.pixelDensity(1);
    this.generateWaveLayer();
  }

  
  // Function to generate the ripple effect on the wave layer
  generateWaveLayer() {
    // Clear the layer to remove any previous drawings
    this.waveLayer.clear();
    this.waveLayer.loadPixels();

    // Iterate over the canvas in steps to create the wave pattern
    for (let x = 0; x < width; x += this.step) {
      for (let y = 0; y < height; y += this.step) {
        
        // Find the minimum distance from the current position to any feature point
        let minDist = Infinity; 
        for (let point of this.points) {
          let d = (x - point.position.x) ** 2 + (y - point.position.y) ** 2;
          if (d < minDist) minDist = d;
        }

        // Calculate noise value based on the distance to the nearest feature point
        let noiseVal = Math.sqrt(minDist);
        
        // Calculate colour values for each channel based on the distance and pool background colour
        let colR = this.wavecolour(noiseVal, red(this.bgColour), 14, 2.5);
        let colG = this.wavecolour(noiseVal, green(this.bgColour), 21, 2.7);
        let colB = this.wavecolour(noiseVal, blue(this.bgColour), 30, 2.7);

        // Apply the calculated colour to each pixel within the current step
        for (let dx = 0; dx < this.step; dx++) {
          for (let dy = 0; dy < this.step; dy++) {
            let px = x + dx;
            let py = y + dy;
            // Ensure stay within canvas boundaries
            if (px < width && py < height) {
              
              // Calculate pixel array index
              let index = (px + py * width) * 4; 
              this.waveLayer.pixels[index + 0] = colR; // Red channel
              this.waveLayer.pixels[index + 1] = colG; // Green channel
              this.waveLayer.pixels[index + 2] = colB; // Blue channel
              this.waveLayer.pixels[index + 3] = this.transparency; // Alpha channel
            }
          }
        }
      }
    }

    // Apply all changes to the pixels array
    this.waveLayer.updatePixels();
  }

  // Function to calculate colour based on distance and colour channel properties from Kazuki Umeda
  wavecolour(distance, base, a, e) {
    return constrain(base + Math.pow(distance / a, e), 0, 255); // Constrain result to valid colour range
  }

  // Function to display the generated ripple effect layer on the canvas
  display() {
    image(this.waveLayer, 0, 0);
  }
}