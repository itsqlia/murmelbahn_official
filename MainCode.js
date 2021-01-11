Homeworks.aufgabe = 8;

/* !!!!!PROBLEME!!!!!:
1. Ball kann nicht springen
2. Ball kann noch nicht zu seinem OG Zustand zurück
3. Alle Bälle reagieren mit keyPressed
*/
///////////////

const Engine = Matter.Engine;
const Render = Matter.Render;
const World = Matter.World;
const Bodies = Matter.Bodies;
const Mouse = Matter.Mouse;
const MouseConstraint = Matter.MouseConstraint;
const Composites = Matter.Composites;

// let ball = []
// let engine
let ball, engine
let blocks = []
let bullets
let spaceCount = +1
let direction = 0.21

function degToRad(deg) {
  return deg / 360 * (2 * PI)
}

function radToDeg(rad) {
  return rad / (2 * PI) * 360
}


class Block {
  constructor(attrs, options) {
    this.x = attrs.x
    this.y = attrs.y
    this.w = attrs.w
    this.h = attrs.h
    this.color = attrs.color
    this.visible = attrs.visible
    this.body = Matter.Bodies.rectangle(this.x + this.w / 2, this.y + this.h / 2, this.w, this.h, options)
    Matter.World.add(engine.world, [this.body])
  }


  show() {
    fill(this.color)
    noStroke()
    drawBody(this.body)
    // rect(this.x, this.y, this.w, this.h)
  }
};

class Ball {
  constructor(attrs, options) {
    this.x = attrs.x
    this.y = attrs.y
    this.color = attrs.color
    this.size = attrs.size
    this.position = (this.x, this.y )
    this.body = Matter.Bodies.circle(this.x, this.y, this.size / 2, options)
    Matter.World.add(engine.world, [this.body])
  }

  show() {
    fill(this.color)
    drawBody(this.body)
    // ellipse(this.pos.x, this.pos.y, this.size, this.size);
  }
}

  function keyPressed() {

    if (keyCode === 32) {
      switch (spaceCount) {

      case 0:
        console.log('Leertaste 0')
        ball.color = 'black'
            break;
      case 1:
          console.log('Leertaste 1')
          ball.color = 'yellow'
            break;
      case 2:
          console.log('Leertaste 2')
          ball.color = 'green'
            break;
      case 3:
          console.log('Leertaste 3',ball)
          if ((ball.body.position.x - ball.body.positionPrev.x) < 0) {
            direction // circle runs right to left <-
          }// use current direction and velocity for the jump
          Matter.Body.applyForce(
            ball.body,
            {x: ball.body.position.x, y: ball.body.position.y},
            {x: (0.01 * direction) + ball.body.velocity.x/100, y: -0.05}
          );

        default:
          console.log('SpaceCount' + spaceCount)
      }
      spaceCount = (spaceCount + 1) % 4
    }
  }



/*function keyPressed() {
  ball.keyPressed(keyCode)
  switch (keyCode) {
    case 32:
      console.log("Farbe");

    default:
      console.log("KeyCode ist: " + keyCode)
  }
}*/

bullets = Composites.stack(500, 0, 2, 5, 3, 3, function(x, y) {
  return Bodies.circle(x, y, 50);
});

//World.add(engine.world, [bullets]);


function setup() {
  engine = Matter.Engine.create()
  let canvas = createCanvas(windowWidth, windowHeight)

  //schiefe Ebene
  blocks.push(new Block({
    x: 200,
    y: 500,
    w: 800,
    h: 30,
    color: 'black'
  }, {
    isStatic: true,
    angle: degToRad(3)
  }))
  //durchichtiger block
  blocks.push(new Block({
    x: 300,
    y: 437,
    w: 80,
    h: 50,
    color: 'noColor'
  }, {
    isStatic: true,
    angle: degToRad(3)
  }))
  //bunte Knöpfe
  blocks.push(new Block({
    x: 500,
    y: 447,
    w: 80,
    h: 50,
    color: 'blue'
  }, {
    isStatic: true,
    angle: degToRad(3)
  }))
  blocks.push(new Block({
    x: 650,
    y: 455,
    w: 80,
    h: 50,
    color: 'yellow'
  }, {
    isStatic: true,
    angle: degToRad(3)
  }))
  blocks.push(new Block({
    x: 800,
    y: 462,
    w: 50,
    h: 20,
    color: 'red'
  }, {
    isStatic: true,
    angle: degToRad(3)
  }))
  // Box
  blocks.push(new Block({
    x: 1200,
    y: 400,
    w: 400,
    h: 30,
    color: 'black'
  }, {
    isStatic: true,
  }))
  blocks.push(new Block({
    x: 1200,
    y: 50,
    w: 30,
    h: 350,
    color: 'grey'
  }, {
    isStatic: true,
  }))
  blocks.push(new Block({
    x: 1570,
    y: 50,
    w: 30,
    h: 350,
    color: 'grey'
  }, {
    isStatic: true,
  }))


  ball = new Ball({
    x: 250,
    y: 400,
    color: 'black',
    size: 45,
    position: {x: 10,y:10}
  }, {
    isStatic: false,
    restitution: 0.5,
    friction: 0
  })
   /*ball2 = new Ball ({
    x: 250,
    y: 400,
    color: 'black',
    size: 50
  }), {
    isStatic: false,
    restitution: 0.5,
    friction: 0 */
    // Composites.stack(x,y, anzahl pro zeile, anzahl pro spalte, abstand x, abstand y)
    bullets = Composites.stack(1300, 50, 5, 6, 1, 1, function(x, y) {
      return Bodies.circle(x, y, 20);
    });

  //schräge schiene
  blocks.push(new Block(  { x: 500, y:200, w:130, h: 10, color: 'gray'}, {isStatic: true, angle: -Math.PI * 0.15}))

    //tube
    blocks.push(new Block(  { x: 1100, y:175, w:45, h: 9, color: 'blue'}, {isStatic: true, restitution:0.5, friction: 0}))

    blocks.push(new Block(  { x: 898, y:15, w:330, h: 10, color: 'gray'}, {isStatic: true, angle: -Math.PI * 1.9, restitution:0.5, friction: 0}))

  blocks.push(new Block(  { x: 1050, y:110, w:90, h: 10, color: 'gray'}, {isStatic: true, angle: -Math.PI * 2.5, restitution:0.5, friction: 0}))
  blocks.push(new Block(  { x: 1150, y:110, w:90, h: 10, color: 'gray'}, {isStatic: true, angle: -Math.PI * 2.5, restitution:0.5, friction: 0}))
  blocks.push(new Block(  { x: 1064, y:163, w:40, h: 10, color: 'gray'}, {isStatic: true, angle: -Math.PI * 1.79, restitution:0.5, friction: 0}))
  blocks.push(new Block(  { x: 1135, y:163, w:40, h: 10, color: 'gray'}, {isStatic: true, angle: -Math.PI * 1.2, restitution:0.5, friction: 0}))

  //moving platform
  blocks.push(new Block(  { x: 1070, y:280, w:20, h: 10, color: 'gray'}, {isStatic: true, angle: -Math.PI * 2.5, restitution:0.5, friction: 0}))
  blocks.push(new Block(  { x: 1140, y:280, w:20, h: 10, color: 'gray'}, {isStatic: true, angle: -Math.PI * 2.5, restitution:0.5, friction: 0}))

  blocks.push(new Block(  { x: 1105, y:300, w:20, h: 130, color: 'gray'}, {isStatic: true, angle: -Math.PI * 2.5, restitution:0.5, friction: 0}))

    //blocks
    blocks.push(new Block( { x: 380, y: 310, w: 50, h: 50, color: '#32f4da', chgStatic: true }, { isStatic: true, airFriction: 0.15}))
    blocks.push(new Block( { x: 350, y: 315, w: 40, h: 40, color: '#32f4da', chgStatic: true }, { isStatic: true, airFriction: 0.1}))
    blocks.push(new Block(  { x: 320, y: 319, w: 30, h: 30, color: '#32f4da', chgStatic: true }, { isStatic: true, airFriction: 0.15}))
    blocks.push(new Block(  { x: 290, y: 324, w: 30, h: 30, color: '#32f4da', chgStatic: true }, { isStatic: true, airFriction: 0.25}))

    //ground-transparent
    blocks.push(new Block( { x: 350, y:680, w:140, h: 10, color: 'black'}, {isStatic: true}))
    // ground = this.body.rect (400, height-25. 810, 25, {isStatic: true});

    //rest block
    blocks.push(new Block( { x: 240, y:640, w:95, h: 8, color: 'gray'}, {isStatic: true}))
    blocks.push(new Block( { x: 285, y:660, w:35, h: 5, color: 'black'}, {isStatic: true, angle:PI/2}))
    blocks.push(new Block( { x: 415, y:660, w:35, h: 5, color: 'black'}, {isStatic: true, angle:PI/2}))
    blocks.push(new Block( { x: 180, y:620, w:50, h: 8, color: 'gray'}, {isStatic: true, angle: Math.PI * 0.30}))
    blocks.push(new Block( { x: 465, y:640, w:100, h: 5, color: 'gray'}, {isStatic: true}))

    //Propeller Section
    blocks.push(new Block( { x: 170, y: 450, w: 210, h: 5, color: 'gray'}, { isStatic: true, airFriction: 0.07, angle: PI/2}))
    blocks.push(new Block( { x: 235, y: 450, w: 210, h: 5, color: 'gray'}, { isStatic: true, airFriction: 0.07, angle: PI/2}))
    blocks.push(new Block( { x: 200, y:450, w:20, h:20, color: 'lightgray'}, {isStatic: true, angle:PI/2}))
    // blocks.push(new Block('rect', { x: 215, y:300, w:20, h:20, color: 'lightgray'}, {isStatic: true, angle:PI/2}))

    // blocks.push(new Block('rect', { x: 210, y:350, w:20, h:20, color: 'gray'}, {isStatic: true, angle:PI/2}))

    // propeller = this.body






  World.add(engine.world, [bullets]);

  let body = blocks[5].body
  let constraint = Matter.Constraint.create({
    bodyA: body,
    pointB: {
      x: body.position.x,
      y: body.position.y
    }
  });


  Matter.World.add(engine.world, [constraint]);

  Matter.Engine.run(engine)
}


function draw() {
  background('#4B5056');

  blocks.forEach((block, i) => {
    block.show()
  });

  ball.show()
fill('pink')
  drawBodies(bullets.bodies);
}

function drawBodies(bodies) {
  for (let i = 0; i < bodies.length; i++) {
    drawVertices(bodies[i].vertices);
  }
}


function drawBody(body) {
  if (body.parts && body.parts.length > 1) {
    for (var p = 1; p < body.parts.length; p++) {
      drawVertices(body.parts[p].vertices)
    }
  } else {
    if (body.type == "composite") {
      for (let b = 0; b < body.bodies.length; b++) {
        drawVertices(body.bodies[b].vertices)
      }
    } else {
      drawVertices(body.vertices)
    }
  }
}

function drawVertices(vertices) {
  beginShape()
  for (var i = 0; i < vertices.length; i++) {
    vertex(vertices[i].x, vertices[i].y)
  }
  endShape(CLOSE)
}
