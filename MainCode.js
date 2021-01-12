const Engine = Matter.Engine;
const Render = Matter.Render;
const World = Matter.World;
const Bodies = Matter.Bodies;
const Mouse = Matter.Mouse;
const MouseConstraint = Matter.MouseConstraint;
const Composites = Matter.Composites;


let ball, engine
let blocks = []
let balls = []
let collisions = []

let bullets
let spaceCount = +1
let direction = 0.2

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
    this.position = (this.x, this.y)
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

//Enter-Tastatur
  if (keyCode === 13) {
    switch (spaceCount) {

      case 0:
        console.log('Taste 0')
        ball.color = 'black'
        break;
      case 1:
        console.log('Taste 1')
        ball.color = 'yellow'
        break;
      case 2:
        console.log('Taste 2')
        ball.color = 'green'
        break;
      case 3:
        console.log('Taste 3', ball)
        if ((ball.body.position.x - ball.body.positionPrev.x) < 0) {
          direction // circle runs right to left <-
        } // use current direction and velocity for the jump
        Matter.Body.applyForce(
          ball.body, {
            x: ball.body.position.x,
            y: ball.body.position.y
          }, {
            x: (0.05 * direction) + ball.body.velocity.x / 100,
            y: -0.05
          }
        );

      default:
        console.log('SpaceCount' + spaceCount)
    }
    spaceCount = (spaceCount + 1) % 4
  }
}

bullets = Composites.stack(500, 0, 2, 5, 3, 3, function(x, y) {
  return Bodies.circle(x, y, 50);
});

//World.add(engine.world, [bullets]);


function setup() {
  engine = Matter.Engine.create()
  let canvas = createCanvas(1444, 4529)


  //durchichtiger block
  blocks.push(new Block({
    x: 500,
    y: 2130,
    w: 100,
    h: 60,
    color: '#292F36',
    visible: true
  }, {
    isStatic: true,
    angle: degToRad(3)
  }))
  //bunte Knöpfe
  blocks.push(new Block({
    x: 700,
    y: 2170,
    w: 50,
    h: 20,
    color: '#FF8A35',
    visible: true
  }, {
    isStatic: true,
    angle: degToRad(3)
  }))
  blocks.push(new Block({
    x: 800,
    y: 2175,
    w: 50,
    h: 20,
    color: '#3BF4FB',
    visible: true
  }, {
    isStatic: true,
    angle: degToRad(3)
  }))
  blocks.push(new Block({
    x: 900,
    y: 2180,
    w: 50,
    h: 20,
    color: '#C879FF',
    visible: true
  }, {
    isStatic: true,
    angle: degToRad(3)
  }))
  // untere Ebene
  blocks.push(new Block({
    x: 0,
    y: 2720,
    w: windowWidth,
    h: 20,
    color: 'black',
    visible: true
  }, {
    isStatic: true
  }))
  //seitliche Schranken
  blocks.push(new Block({
    x: 0,
    y: 400,
    w: 5,
    h: 1000,
    color: 'black'
  }, {
    isStatic: true
  }))
  blocks.push(new Block({
    x: 1920,
    y: 400,
    w: 5,
    h: 1000,
    color: 'black'
  }, {
    isStatic: true
  }))

  ball = new Ball({
    x: 250,
    y: 400,
    color: '#B5BDC7',
    size: 45
  }, {
    isStatic: false,
    restitution: 0.5,
    friction: 0
  })


  ball = new Ball({
    x: 250,
    y: 400,
    color: 'black',
    size: 45,
    position: {
      x: 10,
      y: 1500
    }
  }, {
    isStatic: false,
    restitution: 0.5,
    friction: 0
  })

  // Composites.stack(x,y, anzahl pro zeile, anzahl pro spalte, abstand x, abstand y)
  // Composites.stack(x,y, anzahl pro zeile, anzahl pro spalte, abstand x, abstand y)
  bullets = Composites.stack(0, 2602, 100, 3, 1, 1, function(x, y) {
    return Bodies.circle(x, y, 20);
  });


  //hell graue schräge Schiene
  blocks.push(new Block({
    x: 209,
    y: 1497.27,
    w: 962.,
    h: 10,
    color: 'gray'
  }, {
    isStatic: true,
    angle: Math.PI * 0.05
  }))

  //tube
  // blocks.push(new Block({
  //   x: 1225,
  //   y: 1767,
  //   w: 65,
  //   h: 9,
  //   color: 'blue'
  // }, {
  //   isStatic: true,
  //   restitution: 0.5,
  //   friction: 0
  // }))

  blocks.push(new Block({
    x: 1110,
    y: 1628,
    w: 120,
    h: 10,
    color: 'gray'
  }, {
    isStatic: true,
    angle: -Math.PI * 2.5,
    restitution: 0.5,
    friction: 0
  }))
  blocks.push(new Block({
    x: 1290,
    y: 1628,
    w: 120,
    h: 10,
    color: 'gray'
  }, {
    isStatic: true,
    angle: -Math.PI * 2.5,
    restitution: 0.5,
    friction: 0
  }))
  blocks.push(new Block({
    x: 1149,
    y: 1725,
    w: 100,
    h: 10,
    color: 'gray'
  }, {
    isStatic: true,
    angle: -Math.PI * 2.7,
    restitution: 0.5,
    friction: 0
  }))
  blocks.push(new Block({
    x: 1272,
    y: 1725,
    w: 100,
    h: 10,
    color: 'gray'
  }, {
    isStatic: true,
    angle: Math.PI * 2.7,
    restitution: 0.5,
    friction: 0
  }))

  //moving platform
  blocks.push(new Block({
    x: 964,
    y: 1890,
    w: 50,
    h: 10,
    color: 'gray'
  }, {
    isStatic: true,
    angle: -Math.PI * 2.5,
    restitution: 0.5,
    friction: 0
  }))
  blocks.push(new Block({
    x: 1164,
    y: 1890,
    w: 50,
    h: 10,
    color: 'gray'
  }, {
    isStatic: true,
    angle: -Math.PI * 2.5,
    restitution: 0.5,
    friction: 0
  }))

  blocks.push(new Block({
    x: 1064,
    y: 1895,
    w: 20,
    h: 200,
    color: 'gray'
  }, {
    isStatic: true,
    angle: -Math.PI * 2.5,
    restitution: 0.5,
    friction: 0
  }))

  //blocks
  blocks.push(new Block({
    x: 470,
    y: 1798,
    w: 50,
    h: 50,
    color: '#32f4da',
    chgStatic: true
  }, {
    isStatic: true,
    airFriction: 0.15
  }))
  blocks.push(new Block({
    x: 420,
    y: 1818,
    w: 50,
    h: 50,
    color: '#32f4da',
    chgStatic: true
  }, {
    isStatic: true,
    airFriction: 0.1
  }))
  blocks.push(new Block({
    x: 370,
    y: 1838,
    w: 50,
    h: 50,
    color: '#32f4da',
    chgStatic: true
  }, {
    isStatic: true,
    airFriction: 0.15
  }))
  blocks.push(new Block({
    x: 320,
    y: 1858,
    w: 50,
    h: 50,
    color: '#32f4da',
    chgStatic: true
  }, {
    isStatic: true,
    airFriction: 0.25
  }))

  //ground-transparent
  blocks.push(new Block({
    x: 320,
    y: 2230,
    w: 167,
    h: 10,
    color: 'black'
  }, {
    isStatic: true
  }))
  blocks.push(new Block({
    x: 300,
    y: 2205,
    w: 50,
    h: 5,
    color: 'black'
  }, {
    isStatic: true,
    angle: PI / 2
  }))
  blocks.push(new Block({
    x: 460,
    y: 2205,
    w: 50,
    h: 5,
    color: 'black'
  }, {
    isStatic: true,
    angle: PI / 2
  }))

  // ground = this.body.rect (400, height-25. 810, 25, {isStatic: true});

  //rest block
  blocks.push(new Block({
    x: 215,
    y: 2145,
    w: 100,
    h: 5,
    color: 'gray'
  }, {
    isStatic: true,
    angle: Math.PI * 0.30
  }))
  blocks.push(new Block({
    x: 290,
    y: 2184,
    w: 30,
    h: 5,
    color: 'gray'
  }, {
    isStatic: true
  }))
  blocks.push(new Block({
    x: 486,
    y: 2190,
    w: 500,
    h: 5,
    color: 'gray'
  }, {
    isStatic: true,
    angle: degToRad(3)
  }))

  //Propeller Section
  blocks.push(new Block({
    x: 130,
    y: 2000,
    w: 210,
    h: 5,
    color: 'gray'
  }, {
    isStatic: true,
    airFriction: 0.07,
    angle: PI / 2
  }))
  blocks.push(new Block({
    x: 209,
    y: 2000,
    w: 210,
    h: 5,
    color: 'gray'
  }, {
    isStatic: true,
    airFriction: 0.07,
    angle: PI / 2
  }))
  blocks.push(new Block({
    x: 261,
    y: 2040,
    w: 20,
    h: 20,
    color: 'lightgray'
  }, {
    isStatic: true,
    angle: PI / 2
  }))
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
        }
      })
    })
    // check for collision between Block and ball
    function collide(bodyBlock, bodyBall) {
      // check if bodyBlock is really a body in a Block class
      if (bodyBlock.plugin && bodyBlock.plugin.block) {
        // remember the collision for processing in 'beforeUpdate'
        collisions.push({
          hit: bodyBlock.plugin.block,
          ball: bodyBall
        })
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




World.add(engine.world, [bullets]);

let body = blocks[5].body
let constraint = Matter.Constraint.create({
  bodyA: body,
  pointB: {
    x: body.position.x,
    y: body.position.y
  }
});


World.add(engine.world, [constraint]);

Matter.Engine.run(engine)



function draw() {
  background('#4B5056');
  Matter.Body.setPosition(blocks[12].body, {
    x: 964 + Math.sin(frameCount / 100) * 280,
    y: 1880
  })
  Matter.Body.setPosition(blocks[13].body, {
    x: 1164 + Math.sin(frameCount / 100) * 280,
    y: 1880
  })
  Matter.Body.setPosition(blocks[14].body, {
    x: 1064 + Math.sin(frameCount / 100) * 280,
    y: 1895
  })


  blocks.forEach((block, i) => {
    block.show()
  });

  ball.show()
  fill('black')
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
