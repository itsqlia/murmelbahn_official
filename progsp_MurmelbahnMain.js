Homeworks.aufgabe = 8;
/* !!!!!PROBLEME!!!!!:
1. Ball kann nicht springen
2. Ball kann noch nicht zu seinem OG Zustand zurück
3. Alle Bälle reagieren mit keyPressed
*/


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
  constructor(type, attrs, options) {
    this.type = type
    this.attrs = attrs
    this.options = options
    this.options.plugin = { block: this, update: this.update }
    switch (this.type) {
      case 'rect':
        this.body = Matter.Bodies.rectangle(attrs.x, attrs.y, attrs.w, attrs.h, this.options)
        break
      case 'circle':
        this.body = Matter.Bodies.circle(attrs.x, attrs.y, attrs.s)
        break
      case 'parts':
        this.body = Matter.Body.create(this.options)
        Matter.Body.setPosition(this.body, this.attrs)
        break
      case 'points':
        let shape = Matter.Vertices.create(attrs.points, Matter.Body.create({}))
        this.body = Matter.Bodies.fromVertices(0, 0, shape, this.options)
        Matter.Body.setPosition(this.body, this.attrs)
        break
      case 'path':
        let path = document.getElementById(attrs.elem)
        if (null != path) {
          this.body = Matter.Bodies.fromVertices(0, 0, Matter.Vertices.scale(Matter.Svg.pathToVertices(path, 10), this.attrs.scale, this.attrs.scale), this.options)
          Matter.Body.setPosition(this.body, this.attrs)
        }
        break
      case 'group':
        this.body = Matter.Composites.stack(this.attrs.x, this.attrs.y, this.attrs.cols, this.attrs.rows, this.attrs.colGap, this.attrs.rowGap, this.attrs.create)
        break
    }
    Matter.World.add(engine.world, [this.body])
  }

  constrainTo(block) {
    let constraint
    if (block) {
      constraint = Matter.Constraint.create({
        bodyA: this.body,
        bodyB: block.body
      })
    } else {
      constraint = Matter.Constraint.create({
        bodyA: this.body,
        pointB: { x: this.body.position.x, y: this.body.position.y }
      })
    }
    Matter.World.add(engine.world, [constraint])
    constraints.push(constraint)
  }


  show() {
    fill(this.color)
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
            {x: (0.01 * direction) + ball.body.velocity.x/100, y: -0.02}
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
    w: 80,
    h: 50,
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
    size: 25,
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
    return Bodies.circle(x, y, 30);
  });

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
  background(255, 50);

  blocks.forEach((block, i) => {
    block.show()
  });

  ball.show()

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
