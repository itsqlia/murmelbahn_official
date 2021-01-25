//Matter.use('matter-attractors');


const Engine = Matter.Engine;
const Render = Matter.Render;
const World = Matter.World;
const Bodies = Matter.Bodies;
const Mouse = Matter.Mouse;
const MouseConstraint = Matter.MouseConstraint;
const Composites = Matter.Composites;
const Constraint = Matter.Constraint;



let blocks = []
let balls = []
let collisions = []
let wolken = []
let schanzen = []

let bullets
let spaceCount = +1
let knopfCount = 3
let direction = 0.2
let attractorActiv = false
let pendel
let klappe
let constraint1
let constraint
let portalSound
let engine
let isMagnetisch = false
let attractorActive = false


function preload() { portalSound = loadSound("lib/PortalWhoosh.mp3") }

function degToRad(deg) { return deg / 360 * (2 * PI) }

function radToDeg(rad) { return rad / (2 * PI) * 360 }


class Block {
  constructor(attrs, options) {
    this.x = attrs.x
    this.y = attrs.y
    this.w = attrs.w
    this.h = attrs.h
    this.color = attrs.color
    this.chgStatic = attrs.chgStatic
    this.visible = attrs.visible
    this.body = Matter.Bodies.rectangle(this.x + this.w / 2, this.y + this.h / 2, this.w, this.h, options)
    Matter.World.add(engine.world, [this.body])
  }


  show() {
    fill(this.color)
    noStroke()
    if (this.visible == true) { drawBody(this.body) }
  }
};

class Ball {
  constructor(attrs, options) {
    this.x = attrs.x
    this.y = attrs.y
    this.color = attrs.color
    this.size = attrs.size
    this.body = Matter.Bodies.circle(this.x, this.y, this.size / 2, options)
    Matter.World.add(engine.world, [this.body])
  }

  show() {
    fill(this.color)
    drawBody(this.body)
  }

  update() {
    if (this.attrs.chgStatic) {
      Matter.Body.setStatic(this.body, false)
    }
  }
};

function keyPressed() {

  //Enter-Tastatur
  if (keyCode === 13) {
    switch (spaceCount) {
      case 1:
        console.log('Taste 1')
        if ((balls[0].body.position.x - balls[0].body.positionPrev.x) < 0) {
          direction // circle runs to left <-
        } // use current direction and velocity for the jump
        Matter.Body.applyForce(
          balls[0].body, {
            x: balls[0].body.position.x,
            y: balls[0].body.position.y
          }, {
            x: (200 * direction) + balls[0].body.velocity.x / 100,
            y: -400
          }
        );
        console.log('Taste 2')
        balls[0].color = '#34E0EB'
        //Matter.World.remove(engine.world,blocks[])
        break;
      case 2:
        console.log('Taste 3')
        balls[0].color = '#A975FF'
        break;
      case 3:
        console.log('Taste 4')
        balls[0].color = '#EEAD0E'
      default:
        console.log('SpaceCount' + spaceCount)
    }
    spaceCount = (spaceCount + 1) % 4
  }
}

function setup() {
  engine = Matter.Engine.create()
  let canvas = createCanvas(1480, 7000)

  //CODE: BALL
  portalSound = loadSound("lib/PortalWhoosh.mp3")

  balls.push(new Ball({ x:1300, y: 800, color: '#B9DEE7', size: 45, position: { x: 10, y: 1500 } }, { isStatic: false, density: 5, restitution: 0.3, friction: -0.01, label: "murmel" }))

  // CODE: WOlKEN

  let wolkeElem = document.getElementById('wolke');
  if (null != wolkeElem) {
    wolken.push(bodyFromPath(wolkeElem, 300, 250, 1.0, { color: 'white', visible: true, isStatic: true, restitution: 5 }));
    wolken.push(bodyFromPath(wolkeElem, 775, 550, 0.75, { color: 'white', visible: true, isStatic: true, restitution: 2 }));
    wolken.push(bodyFromPath(wolkeElem, 550, 500, 1.2, { color: 'white', visible: true, isStatic: true, restitution: 2 }));
    wolken.push(bodyFromPath(wolkeElem, 1200, 300, 1.0, { color: 'white', visible: true, isStatic: true, restitution: 2 }));
    wolken.push(bodyFromPath(wolkeElem, 1400, 100, 0.5, { color: 'white', visible: true, isStatic: true, restitution: 2 }));
  }

  let wolke2Elem = document.getElementById('wolke2');
  if (null != wolke2Elem) {
    wolken.push(bodyFromPath(wolke2Elem, 400, 400, 1.00, { color: 'white', visible: true, isStatic: true, restitution: 5 }));
    wolken.push(bodyFromPath(wolke2Elem, 700, 100, 0.75, { color: 'white', visible: true, isStatic: true, restitution: 5 }));
    wolken.push(bodyFromPath(wolke2Elem, 800, 250, 1.00, { color: 'white', visible: true, isStatic: true, restitution: 5 }));
    wolken.push(bodyFromPath(wolke2Elem, 1000, 200, 0.75, { color: 'white', visible: true, isStatic: true, restitution: 5 }));
  }

  //Schanze
  let schanzeElem = document.getElementById('schanze1');
  if (null != schanzeElem) {
    schanzen.push(bodyFromPath(schanzeElem, 1200, 1000, 1.25, { color: 'white', visible: true, isStatic: true }));
  }
  blocks.push(new Block({ x: 650, y: 1060, w: 30, h: 30, color: '#341B28', visible: true }, { isStatic: true }))

  //Boden
  blocks.push(new Block({ x: 200, y: 625, w: 900, h: 40, color: '#E3BB7C', visible: true }, { isStatic: true }))

  blocks.push(new Block({ x: 1350, y: 625, w: 100, h: 40, color: '#E3BB7C', visible: true }, { isStatic: true }))

  //Klappe
  blocks.push(new Block({ x: 1100, y: 625, w: 250, h: 40, color: '#EEAD0E', visible: true }, { isStatic: true }))

  blocks.push(new Block({ x: 900, y: 585, w: 100, h: 40, color: '#EEAD0E', visible: true, chgStatic: true }, { isStatic: true, airFriction: 0.15, density: 500, label: "auslöser" }))

  // klappe = Bodies.rectangle(1100, 625, 600, 20);
  // constraint = Constraint.create({
  //   pointA: {x: 400, y: 520},
  //   bodyB: catapult,
  //   stiffness: 1,
  //   length: 0
  // });
  // World.add(engine.world, [klappe, constraint]);


  // constraint1 = Constraint.create({
  //   pointA: {x: 1100, y:625},
  //   bodyB: blocks[2]
  // });
  // World.add(engine.world, constraint1);


  pendel = Matter.Bodies.circle(400, 950, 60, 30), {
    isStatic: false,
    density: 0.5
  };

  constraint2 = Constraint.create({
    pointA: { x: 500, y: 650 },
    bodyB: pendel,
    pointB: { x: 0, y: 0 }
  });
  World.add(engine.world, [pendel, constraint2]);

  Matter.Events.on(engine, 'beforeUpdate', function(event) {
//console.log(balls[0])
      attract(balls[0])

  })

  //CODE: FARBIGE BALKEN

  //Anfang - farbigen Balken
  blocks.push(new Block({ x: 180, y: 1480, w: 1050, h: 20, color: '#4F4850', visible: true }, { isStatic: true, angle: Math.PI * 0.05 }))

  //1.Balken
  blocks.push(new Block({ x: 720, y: 1785, w: 560, h: 30, color: '#34E0EB', visible: true }, { isStatic: true, angle: -Math.PI * 0.05, label: 'hürde1' }))
  blocks.push(new Block({ x: 1250, y: 1680, w: 215, h: 30, color: '#34E0EB', visible: true }, { isStatic: true, angle: -Math.PI * 0.20, label: 'hürde1' }))

  //2.Balken
  blocks.push(new Block({ x: 720, y: 2070, w: 720, h: 30, color: '#A975FF', visible: true }, { isStatic: true, angle: Math.PI * 0.05, label: 'hürde2' }))

  //3.Balken
  blocks.push(new Block({ x: 715, y: 2350, w: 730, h: 30, color: '#34E0EB', visible: true }, { isStatic: true, angle: -Math.PI * 0.05, label: 'hürde1' }))

  //4.Balken
  blocks.push(new Block({ x: 720, y: 2650, w: 720, h: 30, color: '#A975FF', visible: true }, { isStatic: true, angle: Math.PI * 0.05, label: 'hürde2' }))

  // Trennwand
  blocks.push(new Block({ x: 60, y: 2140, w: 1310, h: 20, color: '#4F4850', visible: true }, { isStatic: true, angle: -Math.PI * 2.5 }))

  //CODE: FALLENDE KÄSTCHEN & TRANSPORTMITTEL

  //graue schräge Schiene
  blocks.push(new Block({ x: 180, y: 2802, w: 1010, h: 20, color: '#4F4850', visible: true }, { isStatic: true, angle: Math.PI * 0.05 }))

  blocks.push(new Block({ x: 1340, y: 2880, w: 130, h: 20, color: '#4F4850', visible: true }, { isStatic: true, angle: -Math.PI * 0.07 }))

  //tube
  blocks.push(new Block({ x: 1110, y: 2948, w: 120, h: 20, color: '#4F4850', visible: true }, { isStatic: true, angle: -Math.PI * 2.5, restitution: 0.5 }))
  blocks.push(new Block({ x: 1290, y: 2948, w: 120, h: 20, color: '#4F4850', visible: true }, { isStatic: true, angle: -Math.PI * 2.5, restitution: 0.5 }))
  blocks.push(new Block({ x: 1149, y: 3045, w: 100, h: 20, color: '#4F4850', visible: true }, { isStatic: true, angle: -Math.PI * 2.7, restitution: 0.5 }))
  blocks.push(new Block({ x: 1272, y: 3045, w: 100, h: 20, color: '#4F4850', visible: true }, { isStatic: true, angle: Math.PI * 2.7, restitution: 0.5 }))

  blocks.push(new Block({ x: 1225, y: 3087, w: 70, h: 15, color: '#EEAD0E', visible: true }, { isStatic: true, label: "balken"}))

  //transportmittel
  blocks.push(new Block({ x: 964, y: 3210, w: 70, h: 20, color: '#4F4850', visible: true }, { isStatic: true, angle: -Math.PI * 2.5 }))
  blocks.push(new Block({ x: 1164, y: 3210, w: 70, h: 20, color: '#4F4850', visible: true }, { isStatic: true, angle: -Math.PI * 2.5 }))
  blocks.push(new Block({ x: 1064, y: 3285, w: 30, h: 210, color: '#4F4850', visible: true }, { isStatic: true, angle: -Math.PI * 2.5 }))

  //schräge schiene für den Ball
  blocks.push(new Block({ x: 950, y: 3350, w: 20, h: 350, color: '#4F4850', visible: true }, { isStatic: true, angle: -Math.PI * 0.65 }))

  //fallende Kästchen
  blocks.push(new Block({ x: 550, y: 3500, w: 50, h: 50, color: '#EEAD0E', visible: true }, { isStatic: true, airFriction: 0.15, density: 500, label: "fall" }))
  blocks.push(new Block({ x: 500, y: 3510, w: 50, h: 50, color: '#EEAD0E', visible: true }, { isStatic: true, airFriction: 0.15, density: 500, label: "fall" }))
  blocks.push(new Block({ x: 450, y: 3520, w: 50, h: 50, color: '#EEAD0E', visible: true }, { isStatic: true, airFriction: 0.15, density: 500, label: "fall" }))
  blocks.push(new Block({ x: 400, y: 3530, w: 50, h: 50, color: '#EEAD0E', visible: true }, { isStatic: true, airFriction: 0.15, density: 500, label: "fall" }))

  // blocks.push(new Block({ x: 550, y: 3300, w: 50, h: 50, color: '#EEAD0E', visible: true }, { isStatic: true, airFriction: 0.15, density: 500, label: "fall" }))
  // blocks.push(new Block({ x: 500, y: 3310, w: 50, h: 50, color: '#EEAD0E', visible: true }, { isStatic: true, airFriction: 0.15, density: 500, label: "fall" }))
  // blocks.push(new Block({ x: 450, y: 3320, w: 50, h: 50, color: '#EEAD0E', visible: true }, { isStatic: true, airFriction: 0.15, density: 500, label: "fall" }))
  // blocks.push(new Block({ x: 400, y: 3330, w: 50, h: 50, color: '#EEAD0E', visible: true }, { isStatic: true, airFriction: 0.15, density: 500, label: "fall" }))

  //ground-transparent
  blocks.push(new Block({ x: 380, y: 4070, w: 235, h: 20, color: 'black', visible: true }, { isStatic: true }))
  blocks.push(new Block({ x: 355, y: 4050, w: 50, h: 15, color: 'black', visible: true }, { isStatic: true, angle: PI / 2 }))
  blocks.push(new Block({ x: 590, y: 4050, w: 50, h: 15, color: 'black', visible: true }, { isStatic: true, angle: PI / 2 }))

  //Propeller Section

  //Röhren (links-rechts)
  blocks.push(new Block({ x: 80, y: 3810, w: 290, h: 20, color: '#4F4850', visible: true }, { isStatic: true, angle: PI / 2 }))
  blocks.push(new Block({ x: 220, y: 3800, w: 290, h:20, color: '#4F4850', visible: true }, { isStatic: true, angle: PI / 2 }))

  //drehende Platten
  blocks.push(new Block({ x: 280, y: 3755, w: 38, h: 38, color: '#B9DEE7', visible: true }, { isStatic: false }))
  blocks.push(new Block({ x: 280, y: 3875, w: 38, h: 38, color: '#B9DEE7', visible: true }, { isStatic: false }))

  //rest blocks
  blocks.push(new Block({ x: 200, y: 3990, w: 100, h: 20, color: '#4F4850', visible: true }, { isStatic: true, angle: Math.PI * 0.30 }))
  blocks.push(new Block({ x: 280, y: 4020, w: 100, h: 20, color: '#4F4850', visible: true }, { isStatic: true }))

  //Funktion für drehende Platten
  blocks.slice(31, 34).forEach((block, i) => {
    let constraint = Matter.Constraint.create({
      bodyA: block.body,
      pointB: { x: block.body.position.x, y: block.body.position.y }
    });
    Matter.World.add(engine.world, [constraint]);
  });

  //CODE: KNÖPFE

  //durchichtiger block
  blocks.push(new Block({ x: 740, y: 3800, w: 150, h: 200, color: '#4A2A2F', visible: true }, { isStatic: true, label: "kasten" }))

  //bunte Knöpfe
  blocks.push(new Block({ x: 980, y: 3980, w: 50, h: 20, color: '#34E0EB', visible: true }, { isStatic: true, label: "knopf1" }))
  blocks.push(new Block({ x: 1060, y: 3985, w: 50, h: 20, color: '#A975FF', visible: true }, { isStatic: true, label: "knopf2" }))
  blocks.push(new Block({ x: 1150, y: 3985, w: 50, h: 20, color: '#EEAD0E', visible: true }, { isStatic: true, label: "knopf3" }))

  //ground-floor
  blocks.push(new Block({ x: 615, y: 4000, w: 900, h: 25, color: '#4F4850', visible: true }, { isStatic: true, density: 5 }))

  // untere Klappen-Stack
  blocks.push(new Block({ x: 180, y: 4460, w: 1290, h: 20, color: 'black', visible: true }, { isStatic: true }))

  // Composites.stack(x,y, anzahl pro zeile, anzahl pro spalte, abstand x, abstand y)
  bullets = Composites.stack(180, 4315, 31, 3, 1, 1, function(x, y) { return Bodies.circle(x, y, 23) });

  // CODE: VIELE DREHENDE PLATTEN

  //1.Reihe
  blocks.push(new Block({ x: 300, y: 4700, w: 80, h: 80, color: '#32f4da', visible: true }, { isStatic: false }))
  blocks.push(new Block({ x: 300, y: 4900, w: 80, h: 80, color: '#32f4da', visible: true }, { isStatic: false }))
  blocks.push(new Block({ x: 300, y: 5100, w: 80, h: 80, color: '#32f4da', visible: true }, { isStatic: false }))
  blocks.push(new Block({ x: 300, y: 5300, w: 80, h: 80, color: '#32f4da', visible: true }, { isStatic: false }))

  //2.Reihe
  blocks.push(new Block({ x: 530, y: 4800, w: 80, h: 80, color: '#C879FF', visible: true }, { isStatic: false, angle: Math.PI / 4 }))
  blocks.push(new Block({ x: 530, y: 5000, w: 80, h: 80, color: '#C879FF', visible: true }, { isStatic: false, angle: Math.PI / 4 }))
  blocks.push(new Block({ x: 530, y: 5200, w: 80, h: 80, color: '#C879FF', visible: true }, { isStatic: false, angle: Math.PI / 4 }))
  blocks.push(new Block({ x: 530, y: 5400, w: 80, h: 80, color: '#C879FF', visible: true }, { isStatic: false, angle: Math.PI / 4 }))

  //3.Reihe
  blocks.push(new Block({ x: 760, y: 4700, w: 80, h: 80, color: '#32f4da', visible: true }, { isStatic: false }))
  blocks.push(new Block({ x: 760, y: 4900, w: 80, h: 80, color: '#32f4da', visible: true }, { isStatic: false }))
  blocks.push(new Block({ x: 760, y: 5100, w: 80, h: 80, color: '#32f4da', visible: true }, { isStatic: false }))
  blocks.push(new Block({ x: 760, y: 5300, w: 80, h: 80, color: '#32f4da', visible: true }, { isStatic: false }))

  //4.Reihe
  blocks.push(new Block({ x: 1020, y: 4800, w: 80, h: 80, color: '#C879FF', visible: true }, { isStatic: false, angle: Math.PI / 4 }))
  blocks.push(new Block({ x: 1020, y: 5000, w: 80, h: 80, color: '#C879FF', visible: true }, { isStatic: false, angle: Math.PI / 4 }))
  blocks.push(new Block({ x: 1020, y: 5200, w: 80, h: 80, color: '#C879FF', visible: true }, { isStatic: false, angle: Math.PI / 4 }))
  blocks.push(new Block({ x: 1020, y: 5400, w: 80, h: 80, color: '#C879FF', visible: true }, { isStatic: false, angle: Math.PI / 4 }))

  //5.Reihe
  blocks.push(new Block({ x: 1220, y: 4700, w: 80, h: 80, color: '#32f4da', visible: true }, { isStatic: false }))
  blocks.push(new Block({ x: 1220, y: 4900, w: 80, h: 80, color: '#32f4da', visible: true }, { isStatic: false }))
  blocks.push(new Block({ x: 1220, y: 5100, w: 80, h: 80, color: '#32f4da', visible: true }, { isStatic: false }))
  blocks.push(new Block({ x: 1220, y: 5300, w: 80, h: 80, color: '#32f4da', visible: true }, { isStatic: false }))

  //Funktion für drehende Platten
  blocks.slice(38, 65).forEach((block, i) => {
    let constraint = Matter.Constraint.create({ bodyA: block.body, pointB: { x: block.body.position.x, y: block.body.position.y } });
    Matter.World.add(engine.world, [constraint])
  });

  //Trichter
  blocks.push(new Block({ x: 150, y: 5790, w: 680, h: 20, color: '#4F4850', visible: true }, { isStatic: true, angle: Math.PI * 2.11 }))
  blocks.push(new Block({ x: 850, y: 5815, w: 650, h: 20, color: '#4F4850', visible: true }, { isStatic: true, angle: Math.PI * 2.91 }))

  //Portal
  portal = balls.push(new Ball({ x: 840, y: 6400, color: '#4F4850', size: 200, position: { x: 10, y: 1500 } }, { isStatic: true, restitution: 0.5 }))

  // Balken zum Orientierung
  blocks.push(new Block({ x: 1440, y: 0, w: 30, h: 7000, color: 'black', visible: true }, { isStatic: true }))
  blocks.push(new Block({ x: 180, y: 0, w: 30, h: 7000, color: 'black', visible: true }, { isStatic: true }))

  Matter.World.add(engine.world, [bullets]);
  Matter.World.add(engine.world, wolken);
  Matter.World.add(engine.world, schanzen);

  Matter.Events.on(engine, 'collisionStart', function(event) {
    const pairs = event.pairs[0];
    const bodyA = pairs.bodyA;
    const bodyB = pairs.bodyB;

    //Controls collision with durchsichtigem Block
    if (bodyA.label === "murmel" && bodyB.label === "kasten") {
    blocks[37].visible = false
    Matter.World.remove(engine.world, bodyB)
    blocks[38].visible = true
    blocks[39].visible = true
    blocks[40].visible = true
    }
    // Controls collision with Knöpfe
    if (bodyA.label === "murmel" && balls[0].color == '#34E0EB' && bodyB.label === "knopf1") {
      blocks[38].visible = false
      knopfCount --
      Matter.World.remove(engine.world, bodyB)
      if (knopfCount === 0) {
        blocks[42].visible = false
        Matter.World.remove (engine.world, blocks[43])
      }
    }
    if (bodyA.label === "murmel" && balls[0].color == '#A975FF' && bodyB.label === "knopf2") {
      blocks[39].visible = false
      knopfCount --
      Matter.World.remove(engine.world, bodyB)
      if (knopfCount === 0) {
        blocks[42].visible = false
        Matter.World.remove (engine.world, blocks[43])
      }
    }
    if (bodyA.label === "murmel" && balls[0].color == '#C879FF' && bodyB.label === "knopf3") {
      blocks[40].visible = false
      knopfCount --
      Matter.World.remove(engine.world, bodyB)
      if (knopfCount === 0) {
        blocks[42].visible = false
        Matter.World.remove (engine.world, blocks[43])
      }
    }

    // Controls collision with falling blocks
    else if (bodyA.label === "murmel" && bodyB.label === "fall") {
      Matter.Body.setStatic(bodyB, false)
    }

    // Farbige Balken
    // Türkis
    if (bodyA.label === "murmel" && balls[0].color == '#34E0EB' && bodyB.label === "hürde1") {
      Matter.World.remove(engine.world, bodyB)
    }
    //Lila
    if (bodyA.label === "murmel" && balls[0].color == '#A975FF' && bodyB.label === "hürde2") {
      Matter.World.remove(engine.world, bodyB)
      }
    //Orange
    if (bodyA.label === "murmel" && balls[0].color == '#EEAD0E' && bodyB.label === "balken") {
      Matter.World.remove(engine.world, bodyB)
    }
  });
  Matter.Engine.run(engine)

  // Matter.Events.on(engine, 'afterUpdate', function(event) {
  //   if (attractorActive) {
  //   attract();
  // }
  // });
}


function draw() {
  clear()

  //TRANSPORTMITTEL
  Matter.Body.setPosition(blocks[19].body, { x: 964 + Math.sin(frameCount/100) * 400, y: 3280 })
  Matter.Body.setPosition(blocks[20].body, { x: 1164 + Math.sin(frameCount/100) * 400, y: 3280 })
  Matter.Body.setPosition(blocks[21].body, { x: 1064 + Math.sin(frameCount/100) * 400, y: 3300 })

  //pendel
  stroke(128);
  strokeWeight(8);
  drawConstraint(constraint2);

  noStroke(255);
  fill('#3BF4FB');
  drawVertices(pendel.vertices);

  //Klappe
  // drawConstraint1(constraint1);


  if (frameCount % 120 == 0) {
    let direction = 1; // circle runs left to right ->
    if ((pendel.position.x - pendel.positionPrev.x) < 0) {
      direction = -1; // circle runs right to left <-
    }
    Matter.Body.applyForce(
      pendel, { x: pendel.position.x, y: pendel.position.y }, { x: (0.12 * direction) + pendel.velocity.x / 100, y: 0 });
  }
  // attractorActive = true;

  //Wolken
  fill('white');
  wolken.forEach(wolke => drawBody(wolke));

  //schanze
  fill('#341B28');
  schanzen.forEach(schanze => drawBody(schanze));

  //Blöcke
  blocks.forEach((block, i) => { block.show() });

  //Bälle
  balls.forEach((ball, i) => { ball.show() });
  fill('#B9DEE7')
  drawBodies(bullets.bodies);

}

function bodyFromPath(path, x, y, scale, options) {
  let body = Matter.Bodies.fromVertices(0, 0, Matter.Vertices.scale(Matter.Svg.pathToVertices(path, 10), scale, scale), options);
  Matter.Body.setPosition(body, { x: x, y: y });
  return body;
}

function drawConstraint(constraint) {
  const offsetA = constraint.pointA;
  let posA = { x: 0, y: 0 };
  if (constraint.bodyA) { posA = constraint.bodyA.position; }
  const offsetB = constraint.pointB;
  let posB = { x: 0, y: 0 };
  if (constraint.bodyB) { posB = constraint.bodyB.position; }
  line(posA.x + offsetA.x, posA.y + offsetA.y, posB.x + offsetB.x, posB.y + offsetB.y);
}

 //Portal
// function attract(){
//   let force ={x:(portal.body.position.x- balls[0].body.position.x) *1e-6, y:(portal.body.position.y- balls[0].body.position.y) *1e-6}
//   Body.applyForce(balls[0].body.position, force)}

function attract(ball) {
  if (isMagnetisch = true) {
    let force = {
      x: (pendel.position.x - ball.body.position.x) * 1e-3,
      y: (pendel.position.y - ball.body.position.y) * 1e-3,
    }
    // console.log(force)
    //Matter.Body.applyForce(ball, ball.position, Matter.Vector.neg(force));
    Matter.Body.applyForce(ball.body, ball.body.position, force)
  }
}
    // let collided = Matter.SAT.collides(balls[0], pendel);
    //     if (collided.collided) {  Matter.World.remove(engine.world,balls[0]);
    //     balls[0].color = "";
    //      }

function drawBodies(bodies) {
  for (let i = 0; i < bodies.length; i++) { drawVertices(bodies[i].vertices); }
}

function drawBody(body) {
  if (body.parts && body.parts.length > 1) {
    for (var p = 1; p < body.parts.length; p++) { drawVertices(body.parts[p].vertices) }
  } else {
    if (body.type == "composite") {
      for (let b = 0; b < body.bodies.length; b++) { drawVertices(body.bodies[b].vertices) }
    } else { drawVertices(body.vertices) }
  }
}

function drawVertices(vertices) {
  beginShape()
  for (var i = 0; i < vertices.length; i++) { vertex(vertices[i].x, vertices[i].y) }
  endShape(CLOSE)
}
