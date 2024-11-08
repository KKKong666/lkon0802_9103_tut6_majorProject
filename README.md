lkon0802_9103_tut6_majorProject
# Creative coding major project introduction

## Part 1: Interactive description
This work generates animated effects based on time, and the user does not need to make any interactive input to see the animated work.

## Part 2: Artwork Details
### 1. Selection method
Individual Code Selection Direction  
**Time-Based: Employ timers and events for animation.**
### 2. Animation element
In order to differentiate my work from the animations produced by the other team members, I will focus on **circular main patterns and add other animated elements** to enrich the group's base work. Instead of animating the background elements, i.e. the ripple pattern and the grid pattern.  

**2.1 “Swimming ring” pattern**  
This element consists of a number of circles together, through the time control of the scale of each element dynamic changes, has achieved the swimming circle in the work (top view perspective) from the top down to the animation effect.  

**2.2 “Swimming ring” shadow pattern**  
Shadows are animated with time and with the size of the swimming ring pattern.  

**2.3 Splash pattern**  
Generate animated particle elements with time, and with the swimming ring's movement state, to reach the swimming ring falling to the water surface to form the animated effect of water splash.  

**2.4 “Swimming duck” pattern**  
Randomly generate duck elements in the water consisting of basic shapes, and change the duck's movement state with time, including movement direction, rotation time, etc.
### 3. Artwork Inspiration
**3.1 Selected Basic Artworks**  
The group's work focuses on restoring the most important elements of an artwork - the circle, and the blue background of the painting.
In addition to what is described in the design documentbut, a closer look reveals that there are small circles around each wheel, which inspired me to create a particle effect of splashing water *(I chose not to use simple concentric circles, but to use a lot of round particles to form a bigger circle together to realize the ripple effect, for the same reason)*.  

![An image of fortune wheels](image/Pacita_Abad_Wheels_of_fortune.jpg)  
*Image1: image of fortune wheels*  

**3.2 Objects dropped in water**  
In the real world, when an item falls into the water, it will surely drive the water surface to produce animation effects, which makes me consider to increase the water surface animation when I do the dynamic effect of the “swimming ring” falling to the water surface. 

![An image of a music streaming platforms](image/swimming_splash_water.jpeg)  
*Image2: Swimming ring falling into the water*

**3.3 Water park**    
Many water park pools have ducks made of rubber, and to some extent, ducks are representative of swimming pool toys, which inspired me to add a new element of animated ducks to my artwork *(it should be noted that I needed to graphically draw a top-down view of the ducks)*.  

![An image of a music streaming platforms](image/swimming_duck.jpg)  
*Image3: Swimming duck toys*

## Part 3: Coding Technique description
### 1. Main Techniques
Individual part of the code, almost completely apply the classroom knowledge, the main & key use of technology include the following  

**1.1 Basic graphics**  
The reference work almost exclusively uses circular elements, so all patterns in my work consist only of circles/ellipses, using the ability to use basic shapes such as colors, gradients, strokes, and scale changes. 

**1.2 FrameCount with sin()**  
- frameCount is a built-in variable in p5.js that represents the number of frames since the start of the program. sin() is used to calculate the sine value.
- By combining the frameCount and sin() functions, I've created a swimming ring and duck animation.  

**1.3 Particle effects**  
- The particle system is realized by creating several particle objects (Particle class). 
- Under certain conditions (e.g., when the graphic scale is close to 0.5), particles are generated to simulate a splash effect, which enhances visual animation and richness.  

**1.4 map() and lerp()**  
- map() is used to map a value from one range to another, it does not involve transition or interpolation, just a linear conversion of values.
- lerp() is used to linearly interpolate between two values to produce a transition from one value to another. It is used to compute smooth transitions.
- I use this technique to optimize motion effects so that animation effects look smooth.
### 2. Technical challenges
Trying to get all the objects in the artwork to move in a way that is consistent with real-world motion was a challenge, and I dealt with a lot of overlap and collision issues, but as a result I learned a new function to deal with the complexity of object collisions that both shortened the code and achieved the desired results. 

- [**atan2 function**](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/atan2): A function that calculates the angle (relative to the x-axis) from the origin (0,0) to a given point (x, y). Unlike the regular atan function, atan2 takes into account the quadrant of the (x, y) point and returns the correct angle value, which is more accurate than atan

In my work, I use
- **atan2()** to calculate the angle (direction) between the current duck (this) and another duck (otherDuck).
## Thanks
Thanks to the world of coding for the inspiration, thought and fun.  
![An image of coding](image/coding.jpg)  
*Image4: creative coding*  

Thanks to the following websites and tutorials for inspiration  
https://openprocessing.org/
https://developer.mozilla.org/en-US/
https://p5js.org/
https://happycoding.io/tutorials/p5js/
https://www.youtube.com/@TheCodingTrain
https://www.youtube.com/@codecademy
