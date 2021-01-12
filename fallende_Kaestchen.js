Homeworks.aufgabe = 8;
// Benedikt Groß
// Example is based on examples from: http://brm.io/matter-js/, https://github.com/shiffman/p5-matter
// Benno Stäbler: kopiert vom 02-mouse Beispiel, erweitert um komplexe Bodies und in die bekannte Struktur gebracht
// Hier ist alles mit Classes codiert

let engine
// blocks are Block class instances/objects, which can react to balls and have attributes together with a Matter body
let blocks = []
// balls are just plain Matter bodys right now
let balls = []
// collisions are needed to save
let collisions = []
let propeller
let ground
//moving plattform
let runner
let events = Matter.Events


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

  update(ball) {
    if (this.attrs.force) {
      Matter.Body.applyForce(ball, ball.position, this.attrs.force)
    }

    if (this.attrs.chgStatic) {
      Matter.Body.setStatic(this.body, false)
    }

  }

  // if (body.parts && body.parts.length > 1) {
  //   for (var p = 1; p < body.parts.length; p++) {
  //     drawVertices(body.parts[p].vertices)
  //   }
  // } else {
  //   if (body.type == "composite") {
  //     for (let b = 0; b < body.bodies.length; b++) {
  //       drawVertices(body.bodies[b].vertices)
  //     }
  //   } else {
  //     drawVertices(body.vertices)
  //   }

  show() {
    fill(this.attrs.color)
    drawBody(this.body)
  }
}

class Ball {
  constructor(attrs, options) {
    this.x = attrs.x
    this.y = attrs.y
    this.color = attrs.color
    this.size = attrs.s
    this.body = Matter.Bodies.circle(this.x, this.y, this.size / 2, options)
    Matter.World.add(engine.world, [this.body])
  }
  show() {
    fill(this.color)
    drawBody(this.body)
  }
}

function setup() {
  let canvas = createCanvas(windowWidth, windowHeight)

  // create an engine
  engine = Matter.Engine.create()

  // ball
  balls.push(new Ball ({x: 900, y: -10, s: 20, color: 'white'}, {isStatic: false, restitution: 0.5, friction: 0}))

//demo balls
balls.push(new Ball ({x: 543, y: 0, s: 20, color: 'white'}, {isStatic: false, restitution: 0.5, density:1}))

//schräge schiene
blocks.push(new Block('rect', { x: 500, y:200, w:130, h: 10, color: 'gray'}, {isStatic: true, angle: -Math.PI * 0.15}))

  //tube
  blocks.push(new Block('rect', { x: 1100, y:175, w:45, h: 9, color: 'blue'}, {isStatic: true, restitution:0.5, friction: 0}))

  blocks.push(new Block('rect', { x: 898, y:15, w:330, h: 10, color: 'gray'}, {isStatic: true, angle: -Math.PI * 1.9, restitution:0.5, friction: 0}))

blocks.push(new Block('rect', { x: 1050, y:110, w:90, h: 10, color: 'gray'}, {isStatic: true, angle: -Math.PI * 2.5, restitution:0.5, friction: 0}))
blocks.push(new Block('rect', { x: 1150, y:110, w:90, h: 10, color: 'gray'}, {isStatic: true, angle: -Math.PI * 2.5, restitution:0.5, friction: 0}))
blocks.push(new Block('rect', { x: 1064, y:163, w:40, h: 10, color: 'gray'}, {isStatic: true, angle: -Math.PI * 1.79, restitution:0.5, friction: 0}))
blocks.push(new Block('rect', { x: 1135, y:163, w:40, h: 10, color: 'gray'}, {isStatic: true, angle: -Math.PI * 1.2, restitution:0.5, friction: 0}))

//moving platform
blocks.push(new Block('rect', { x: 1070, y:280, w:20, h: 10, color: 'gray'}, {isStatic: true, angle: -Math.PI * 2.5, restitution:0.5, friction: 0}))
blocks.push(new Block('rect', { x: 1140, y:280, w:20, h: 10, color: 'gray'}, {isStatic: true, angle: -Math.PI * 2.5, restitution:0.5, friction: 0}))

blocks.push(new Block('rect', { x: 1105, y:300, w:20, h: 130, color: 'gray'}, {isStatic: true, angle: -Math.PI * 2.5, restitution:0.5, friction: 0}))

  //blocks
  blocks.push(new Block('rect', { x: 380, y: 310, w: 30, h: 30, color: '#32f4da', chgStatic: true }, { isStatic: true, airFriction: 0.15}))
  blocks.push(new Block('rect', { x: 350, y: 315, w: 30, h: 30, color: '#32f4da', chgStatic: true }, { isStatic: true, airFriction: 0.1}))
  blocks.push(new Block('rect', { x: 320, y: 319, w: 30, h: 30, color: '#32f4da', chgStatic: true }, { isStatic: true, airFriction: 0.15}))
  blocks.push(new Block('rect', { x: 290, y: 324, w: 30, h: 30, color: '#32f4da', chgStatic: true }, { isStatic: true, airFriction: 0.25}))

  //ground-transparent
  blocks.push(new Block('rect', { x: 350, y:680, w:140, h: 10, color: 'black'}, {isStatic: true}))
  // ground = this.body.rect (400, height-25. 810, 25, {isStatic: true});

  //rest block
  blocks.push(new Block('rect', { x: 240, y:640, w:95, h: 8, color: 'gray'}, {isStatic: true}))
  blocks.push(new Block('rect', { x: 285, y:660, w:35, h: 5, color: 'black'}, {isStatic: true, angle:PI/2}))
  blocks.push(new Block('rect', { x: 415, y:660, w:35, h: 5, color: 'black'}, {isStatic: true, angle:PI/2}))
  blocks.push(new Block('rect', { x: 180, y:620, w:50, h: 8, color: 'gray'}, {isStatic: true, angle: Math.PI * 0.30}))
  blocks.push(new Block('rect', { x: 465, y:640, w:100, h: 5, color: 'gray'}, {isStatic: true}))

  //Propeller Section
  blocks.push(new Block('rect', { x: 170, y: 450, w: 210, h: 5, color: 'gray'}, { isStatic: true, airFriction: 0.07, angle: PI/2}))
  blocks.push(new Block('rect', { x: 235, y: 450, w: 210, h: 5, color: 'gray'}, { isStatic: true, airFriction: 0.07, angle: PI/2}))
  blocks.push(new Block('rect', { x: 200, y:450, w:20, h:20, color: 'lightgray'}, {isStatic: true, angle:PI/2}))
  // blocks.push(new Block('rect', { x: 215, y:300, w:20, h:20, color: 'lightgray'}, {isStatic: true, angle:PI/2}))

  // blocks.push(new Block('rect', { x: 210, y:350, w:20, h:20, color: 'gray'}, {isStatic: true, angle:PI/2}))

  // propeller = this.body



  // Process collisions - check whether ball hits a Block object
  Matter.Events.on(engine, 'collisionStart', function(event) {
    let pairs = event.pairs
    pairs.forEach((pair, i) => {
      balls.forEach(ball => {
      if (ball.body == pair.bodyA) {
        collide(pair.bodyB, pair.bodyA)
      }
      if (ball.body == pair.bodyB) {
        collide(pair.bodyA, pair.bodyB)
      }})
    })
    // check for collision between Block and ball
    function collide(bodyBlock, bodyBall) {
      // check if bodyBlock is really a body in a Block class
      if (bodyBlock.plugin && bodyBlock.plugin.block) {
        // remember the collision for processing in 'beforeUpdate'
        collisions.push({ hit: bodyBlock.plugin.block, ball: bodyBall })
      }
    }
  })

  Matter.Events.on(engine, 'beforeUpdate', function(event) {
    // process collisions at the right time
    collisions.forEach((collision, i) => {
      console.log(collision.hit)
      // "inform" blocks: got hit by a ball
      collision.hit.update(collision.ball)
    });
    collisions = []
  })


  canvas.mousePressed(startEngine);

  document.addEventListener('keyup', onKeyUp)
}

function onKeyUp(evt) {
  switch (evt.key) {
    case ' ':
      startEngine()
      evt.preventDefault()
      break
  }
}

function startEngine() {
  if (0 == engine.timing.timestamp) {
    Matter.Engine.run(engine)
    userStartAudio()
  }
}

function draw() {
  background(0)
  noStroke()
  Matter.Body.setPosition(blocks[7].body, {x:860 +Math.sin(frameCount/100)* 280, y: 280 })
  Matter.Body.setPosition(blocks[8].body, {x:740 +Math.sin(frameCount/100)* 280, y: 280 })
  Matter.Body.setPosition(blocks[9].body, {x:800 +Math.sin(frameCount/100)* 280, y: 300 })




  blocks.forEach(block => block.show())
  fill(255, 0, 255)
  balls.forEach(ball => ball.show())
}

function drawConstraint(constraint) {
  let posA = { x: 0, y: 0 }
  if (constraint.bodyA) {
    posA = constraint.bodyA.position
  }
  let posB = { x: 0, y: 0 }
  if (constraint.bodyB) {
    posB = constraint.bodyB.position
  }
  line(
    posA.x + constraint.pointA.x,
    posA.y + constraint.pointA.y,
    posB.x + constraint.pointB.x,
    posB.y + constraint.pointB.y
  )
}

function drawBody(body) {
  if (body.parts && body.parts.length > 1) {
    body.parts.filter((part, i) => i > 0).forEach((part, i) => {
      drawVertices(part.vertices)
    })
  } else {
    if (body.type == "composite") {
      body.bodies.forEach((body, i) => {
        drawVertices(body.vertices)
      })
    } else {
      drawVertices(body.vertices)
    }
  }
}

function drawVertices(vertices) {
  beginShape()
  vertices.forEach((vert, i) => {
    vertex(vert.x, vert.y)
  })
  endShape(CLOSE)
}
