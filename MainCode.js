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
    if (this.visible == true){
      drawBody(this.body)
    }
  }
};

// class Polygons
// constructor(attrs, options) {
//   this.x = attrs.x
//   this.y = attrs.y
//   this.color = attrs.color
//   this.size = attrs.size
//   this.visible = attrs.visible
//   this.body = Matter.Bodies.polygon(this.x, this.y, this.size/2, options)
//   Matter.World.add(engine.world, [this.body])
// }


// show() {
//   fill(this.color)
//   noStroke()
//   if (this.visible == true){
//     drawBody(this.body)
//   }
// };

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
  }
};



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



function setup() {
  engine = Matter.Engine.create()
  let canvas = createCanvas(1444, 7000)

//CODE: BALL

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

//CODE: WOlKEN & PENDEL

  /*WOlKEN DEF
  let wolke = document.getElementById('wolke');
  if (null != wolke) {
    blocks.push(bodyFromPath(wolke, 200, 150, 1.0, { color: 'white', visible:true, isStatic: true, friction: 0.0 } }));
  }*/

//Wolken Demo
  blocks.push(new Block({
    x: 200,
    y: 130,
    w: 200,
    h: 100,
    color: 'white',
    visible: true,
    chgStatic: true
  }, {
    isStatic: true,
    airFriction: 0.15,
    density: 500,
  }))

  blocks.push(new Block({
    x: 650,
    y: 150,
    w: 200,
    h: 100,
    color: 'white',
    visible: true,
    chgStatic: true
  }, {
    isStatic: true,
    airFriction: 0.15,
    density: 500,
  }))

  blocks.push(new Block({
    x: 200,
    y: 650,
    w: 1050,
    h: 10,
    color: 'red',
    visible: true,
    chgStatic: true
  }, {
    isStatic: true,
    airFriction: 0.15,
    density: 500,
  }))

//Pendel-Demo
  blocks.push(new Block({
    x: 400,
    y: 755,
    w: 200,
    h: 10,
    color: 'blue',
    visible: true,
    chgStatic: true
  }, {
    isStatic: true,
    airFriction: 0.15,
    density: 500,
    angle: Math.PI * 2.5
  }))

//CODE: FARBIGE BALKEN

  //Anfang - farbigen Balken
  blocks.push(new Block({
    x: 180,
    y: 1480,
    w: 1050,
    h: 20,
    color: 'gray',
    visible: true
  }, {
    isStatic: true,
    angle: Math.PI * 0.05
  }))
//GELB
  blocks.push(new Block({
    x: 180,
    y: 1825,
    w: 1100,
    h: 20,
    color: 'yellow',
    visible: true
  }, {
    isStatic: true,
    angle: -Math.PI * 0.05
  }))
  blocks.push(new Block({
    x: 1250,
    y: 1680,
    w: 215,
    h: 20,
    color: 'yellow',
    visible: true
  }, {
    isStatic: true,
    angle: -Math.PI * 0.20
  }))
  //GRÜN
  blocks.push(new Block({
    x: 180,
    y: 2175,
    w: 1260,
    h: 20,
    color: 'green',
    visible: true
  }, {
    isStatic: true,
    angle: Math.PI * 0.05
  }))
  //GELB
  blocks.push(new Block({
    x: 180,
    y: 2485,
    w: 1260,
    h: 20,
    color: 'yellow',
    visible: true
  }, {
    isStatic: true,
    angle: -Math.PI * 0.05
  }))

//CODE: FALLENDE KÄSTCHEN & TRANSPORTMITTEL

  //graue schräge Schiene
  blocks.push(new Block({
    x: 180,
    y: 2802,
    w: 1010,
    h: 20,
    color: 'gray',
    visible: true
  }, {
    isStatic: true,
    angle: Math.PI * 0.05
  }))

  blocks.push(new Block({
    x: 1340,
    y: 2890,
    w: 130,
    h: 20,
    color: 'gray',
    visible: true
  }, {
    isStatic: true,
  }))

  //tube
  blocks.push(new Block({
    x: 1225,
    y: 3087,
    w: 70,
    h: 15,
    color: 'blue',
    visible: true
  }, {
    isStatic: true,
    restitution: 0.5,
    friction: 0
  }))

  blocks.push(new Block({
    x: 1110,
    y: 2948,
    w: 120,
    h: 20,
    color: 'grey',
    visible: true
  }, {
    isStatic: true,
    angle: -Math.PI * 2.5,
    restitution: 0.5,
    friction: 0
  }))
  blocks.push(new Block({
    x: 1290,
    y: 2948,
    w: 120,
    h: 20,
    color: 'grey',
    visible: true
  }, {
    isStatic: true,
    angle: -Math.PI * 2.5,
    restitution: 0.5,
    friction: 0
  }))
  blocks.push(new Block({
    x: 1149,
    y: 3045,
    w: 100,
    h: 20,
    color: 'grey',
    visible: true
  }, {
    isStatic: true,
    angle: -Math.PI * 2.7,
    restitution: 0.5,
    friction: 0
  }))
  blocks.push(new Block({
    x: 1272,
    y: 3045,
    w: 100,
    h: 20,
    color: 'gray',
    visible: true
  }, {
    isStatic: true,
    angle: Math.PI * 2.7,
    restitution: 0.5,
    friction: 0
  }))

  //Moving platform
  blocks.push(new Block({
    x: 964,
    y: 3210,
    w: 50,
    h: 10,
    color: 'gray',
    visible: true
  }, {
    isStatic: true,
    angle: -Math.PI * 2.5,
  }))
  blocks.push(new Block({
    x: 1164,
    y: 3210,
    w: 50,
    h: 10,
    color: 'gray',
    visible: true
  }, {
    isStatic: true,
    angle: -Math.PI * 2.5,
  }))

  blocks.push(new Block({
    x: 1064,
    y: 3215,
    w: 20,
    h: 200,
    color: 'gray',
    visible: true
  }, {
    isStatic: true,
    angle: -Math.PI * 2.5,
  }))

  //schräge schiene für den Ball
  blocks.push(new Block({
    x: 750,
    y: 3100,
    w: 20,
    h: 150,
    color: 'grey',
    visible: true
  }, {
    isStatic: true,
    angle: -Math.PI * 0.65,
  }))

  //fallende Kästchen
  blocks.push(new Block({
    x: 550,
    y: 3300,
    w: 50,
    h: 50,
    color: '#32f4da',
    visible: true
  }, {
    isStatic: true,
    plugin: { chgStatic: true },
    airFriction: 0.15,
    density: 500,
  }))
  blocks.push(new Block({
    x: 500,
    y: 3310,
    w: 50,
    h: 50,
    color: '#32f4da',
    visible: true
  }, {
    isStatic: true,
    plugin: { chgStatic: true },
    airFriction: 0.15,
    density: 500,
  }))
  blocks.push(new Block({
    x: 450,
    y: 3320,
    w: 50,
    h: 50,
    color: '#32f4da',
    visible: true,
  }, {
    isStatic: true,
    plugin: { chgStatic: true},
    airFriction: 0.15,
    density: 500,
  }))
  blocks.push(new Block({
    x: 400,
    y: 3330,
    w: 50,
    h: 50,
    color: '#32f4da',
    visible: true,
  }, {
    isStatic: true,
    plugin: { chgStatic: true },
    airFriction: 0.15,
    density: 500,
  }))

// //Ball-Demo
//   ball = new Ball({
//     x: 570,
//     y: 3100,
//     color: 'black',
//     size: 45,
//     position: {
//       x: 10,
//       y: 1500
//     }
//   }, {
//     isStatic: false,
//     restitution: 0.5,
//     friction: 0
//   })

  //ground-transparent (later: color change to - #4B5056!) (Block [23])
  blocks.push(new Block({
    x: 380,
    y: 3800,
    w: 235,
    h: 10,
    color: 'black',
    visible: true
  }, {
    isStatic: true
  }))
  blocks.push(new Block({
    x: 355,
    y: 3780,
    w: 50,
    h: 5,
    color: 'black',
    visible: true
  }, {
    isStatic: true,
    angle: PI / 2
  }))
  blocks.push(new Block({
    x: 590,
    y: 3780,
    w: 50,
    h: 5,
    color: 'black',
    visible: true
  }, {
    isStatic: true,
    angle: PI / 2
  }))

  //Propeller Section

  //Röhren (links-rechts)
  blocks.push(new Block({
    x: 110,
    y: 3550,
    w: 250,
    h: 10,
    color: 'grey',
    visible: true
  }, {
    isStatic: true,
    airFriction: 0.07,
    angle: PI / 2
  }))
  blocks.push(new Block({
    x: 230,
    y: 3550,
    w: 250,
    h: 10,
    color: 'grey',
    visible: true
  }, {
    isStatic: true,
    airFriction: 0.07,
    angle: PI / 2
  }))

  //drehende Platten
    blocks.push(new Block({
      x: 275,
      y: 3575,
      w: 38,
      h: 38,
      color: 'lightblue',
      visible: true
    }, {isStatic:false}))

    blocks.push(new Block({
      x: 275,
      y: 3475,
      w: 38,
      h: 38,
      color: 'lightblue',
      visible: true
    }, {
      isStatic: false,
    }))


  //rest blocks
  blocks.push(new Block({
    x: 215,
    y: 3710,
    w: 100,
    h: 10,
    color: 'grey',
    visible: true
  }, {
    isStatic: true,
    angle: Math.PI * 0.30
  }))

  blocks.push(new Block({
    x: 290,
    y: 3750,
    w: 90,
    h: 10,
    color: 'grey',
    visible: true
  }, {
    isStatic: true
  }))

//Funktion für drehende Platten
  blocks.slice(29, 31).forEach((block, i) => {
    let constraint = Matter.Constraint.create({
      bodyA: block.body,
      pointB: { x: block.body.position.x , y: block.body.position.y }
    });
    Matter.World.add(engine.world, [constraint]);
});

//CODE: KNÖPFE

  //durchichtiger block
  blocks.push(new Block({
    x: 650,
    y: 3700,
    w: 100,
    h: 60,
    color: '#292F36',
    visible: true
  }, {
    isStatic: true,
    // angle: degToRad(3)
  }))
  //bunte Knöpfe
  blocks.push(new Block({
    x: 820,
    y: 3738,
    w: 50,
    h: 20,
    color: '#FF8A35',
    visible: false
  }, {
    isStatic: true,
    // angle: degToRad(3)
  }))
  blocks.push(new Block({
    x: 910,
    y: 3735,
    w: 50,
    h: 20,
    color: '#32f4da',
    visible: false
  }, {
    isStatic: true,
    // angle: degToRad(3)
  }))
  blocks.push(new Block({
    x: 1000,
    y: 3735,
    w: 50,
    h: 20,
    color: '#C879FF',
    visible: false
  }, {
    isStatic: true,
    // angle: degToRad(3)
  }))
  //ground-floor
    blocks.push(new Block({
      x: 615,
      y: 3755,
      w: 500,
      h: 10,
      color: 'gray',
      visible: true
    }, {
      isStatic: true,
      // angle: degToRad(3)
    }))

  // untere Ebene-Stack
  // blocks.push(new Block({
  //   x: 180,
  //   y: 4060,
  //   w: 1700,
  //   h: 20,
  //   color: 'black',
  //   visible: true
  // }, {
  //   isStatic: true
  // }))

  //seitliche Schranken

  // blocks.push(new Block({
  //   x: 180,
  //   y: 3920,
  //   w: 5,
  //   h: 1500,
  //   color: 'black',
  //   visible: true
  // }, {
  //   isStatic: true
  // }))

  // blocks.push(new Block({
  //   x: windowWidth,
  //   y: 3920,
  //   w: 5,
  //   h: 1500,
  //   color: 'yellow',
  //   visible: true
  // }, {
  //   isStatic: true
  // }))

  // Composites.stack(x,y, anzahl pro zeile, anzahl pro spalte, abstand x, abstand y)
  bullets = Composites.stack(180, 3922, 100, 3, 1, 1, function(x, y) {
    return Bodies.circle(x, y, 23);
  });

// CODE: VIELE DREHENDE PLATTEN

//1.Reihe

  blocks.push(new Block({
    x: 300,
    y: 4300,
    w: 80,
    h: 80,
    color: '#32f4da',
    visible: true,
  }, {
    isStatic: false,
    restitution: 0
  }))

  blocks.push(new Block({
    x: 300,
    y: 4500,
    w: 80,
    h: 80,
    color: '#32f4da',
    visible: true
  }, {
    isStatic: false,
    restitution: 0
  }))

  blocks.push(new Block({
    x: 300,
    y: 4700,
    w: 80,
    h: 80,
    color: '#32f4da',
    visible: true
  }, {
    isStatic: false,
    restitution: 0
  }))

  blocks.push(new Block({
    x: 300,
    y: 4900,
    w: 80,
    h: 80,
    color: '#32f4da',
    visible: true
  }, {
    isStatic: false,
    restitution: 0
  }))

  //2.Reihe

  blocks.push(new Block({
    x: 530,
    y: 4400,
    w: 80,
    h: 80,
    color: '#C879FF',
    visible: true,
  }, {
    isStatic: false,
    restitution: 0,
    angle: Math.PI/4
  }))

  blocks.push(new Block({
    x: 530,
    y: 4600,
    w: 80,
    h: 80,
    color: '#C879FF',
    visible: true,
  }, {
    isStatic: false,
    restitution: 0,
    angle: Math.PI/4
  }))

  blocks.push(new Block({
    x: 530,
    y: 4800,
    w: 80,
    h: 80,
    color: '#C879FF',
    visible: true,
  }, {
    isStatic: false,
    restitution: 0,
    angle: Math.PI/4
  }))

  blocks.push(new Block({
    x: 530,
    y: 5000,
    w: 80,
    h: 80,
    color: '#C879FF',
    visible: true,
  }, {
    isStatic: false,
    restitution: 0,
    angle: Math.PI/4
  }))

//3.Reihe
  blocks.push(new Block({
    x: 760,
    y: 4300,
    w: 80,
    h: 80,
    color: '#32f4da',
    visible: true,
  }, {
    isStatic: false,
    restitution: 0
  }))

  blocks.push(new Block({
    x: 760,
    y: 4500,
    w: 80,
    h: 80,
    color: '#32f4da',
    visible: true,
  }, {
    isStatic: false,
    restitution: 0
  }))

  blocks.push(new Block({
    x: 760,
    y: 4700,
    w: 80,
    h: 80,
    color: '#32f4da',
    visible: true,
  }, {
    isStatic: false,
    restitution: 0
  }))

  blocks.push(new Block({
    x: 760,
    y: 4900,
    w: 80,
    h: 80,
    color: '#32f4da',
    visible: true,
  }, {
    isStatic: false,
    restitution: 0
  }))

  //4.Reihe

  blocks.push(new Block({
    x: 1020,
    y: 4400,
    w: 80,
    h: 80,
    color: '#C879FF',
    visible: true,
  }, {
    isStatic: false,
    restitution: 0,
    angle: Math.PI/4
  }))

  blocks.push(new Block({
    x: 1020,
    y: 4600,
    w: 80,
    h: 80,
    color: '#C879FF',
    visible: true,
  }, {
    isStatic: false,
    restitution: 0,
    angle: Math.PI/4
  }))

  blocks.push(new Block({
    x: 1020,
    y: 4800,
    w: 80,
    h: 80,
    color: '#C879FF',
    visible: true,
  }, {
    isStatic: false,
    restitution: 0,
    angle: Math.PI/4
  }))

  blocks.push(new Block({
    x: 1020,
    y: 5000,
    w: 80,
    h: 80,
    color: '#C879FF',
    visible: true,
  }, {
    isStatic: false,
    restitution: 0,
    angle: Math.PI/4
  }))

  //5.Reihe

  blocks.push(new Block({
    x: 1220,
    y: 4300,
    w: 80,
    h: 80,
    color: '#32f4da',
    visible: true,
  }, {
    isStatic: false,
    restitution: 0
  }))

  blocks.push(new Block({
    x: 1220,
    y: 4500,
    w: 80,
    h: 80,
    color: '#32f4da',
    visible: true,
  }, {
    isStatic: false,
    restitution: 0
  }))

  blocks.push(new Block({
    x: 1220,
    y: 4700,
    w: 80,
    h: 80,
    color: '#32f4da',
    visible: true,
  }, {
    isStatic: false,
    restitution: 0
  }))

  blocks.push(new Block({
    x: 1220,
    y: 4900,
    w: 80,
    h: 80,
    color: '#32f4da',
    visible: true,
  }, {
    isStatic: false,
    restitution: 0
  }))


  //Funktion für drehende Platten
    blocks.slice(38, 59).forEach((block, i) => {
      let constraint = Matter.Constraint.create({
        bodyA: block.body,
        pointB: { x: block.body.position.x , y: block.body.position.y }
      });
      Matter.World.add(engine.world, [constraint]);

      //Ball-Demo
        ball = new Ball({
          x: 780,
          y: 4100,
          color: 'black',
          size: 45,
          position: {
            x: 10,
            y: 1500
          }
        }, {
          isStatic: false,
          restitution: 0.5,
          friction: 0,
          airFriction: 1
        })

//Trichter
blocks.push(new Block({
  x: 150,
  y: 5390,
  w: 680,
  h: 20,
  color: 'gray',
  visible: true
}, {
  isStatic: true,
  angle: Math.PI * 2.11
}))

blocks.push(new Block({
  x: 850,
  y: 5415,
  w: 650,
  h: 20,
  color: 'gray',
  visible: true
}, {
  isStatic: true,
  angle: Math.PI * 2.91
}))

//Portal

Matter.Bodies.circle(550, 5000, 20);

World.add(engine.world, [circle])
});

// Balken zum Orientierung
  blocks.push(new Block({
    x: 1440,
    y: 0,
    w: 10,
    h: 7000,
    color: 'black',
    visible: true
  }, {
    isStatic: true,

  }))
  blocks.push(new Block({
    x: 180,
    y: 0,
    w: 10,
    h: 7000,
    color: 'black',
    visible: true
  }, {
    isStatic: true,

  }))

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

Matter.World.add(engine.world, [bullets]);

  Matter.Events.on(engine, 'beforeUpdate', function(event) {
      // process collisions at the right time
      collisions.forEach((collision, i) => {
        if (collision.hit.plugin.force) {
          Matter.Body.applyForce(collision.ball, collision.ball.position, collision.hit.plugin.force)
        }
        if (collision.hit.plugin.chgStatic) {
          console.log(collision.hit)
          Matter.Body.setStatic(collision.hit, false)
        }
      });
      collisions = []
    })

  canvas.mousePressed(startEngine);

  document.addEventListener('keyup', onKeyUp)

  Matter.Engine.run(engine)
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
  background('#4B5056');

  //TRANSPORTMITTEL
  Matter.Body.setPosition(blocks[16].body, {
    x: 964 + Math.sin(frameCount / 100) * 280,
    y: 3270
  })
  Matter.Body.setPosition(blocks[17].body, {
    x: 1164 + Math.sin(frameCount / 100) * 280,
    y: 3270
  })
  Matter.Body.setPosition(blocks[18].body, {
    x: 1064 + Math.sin(frameCount / 100) * 280,
    y: 3285
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
