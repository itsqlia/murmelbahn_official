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
let wasser2 = []
let wasser3 = []
let wasser4 = []

let spaceCount = +1
let knopfCount = 2
let direction = 0.2
let attractorActiv = false
let pendel
let klappe
let constraint1
let constraint
let portalSound
let engine
let bullets
let hitSound
let pendelSound
let sinkenSound


//Sounds
function preload() {
  pendelSound = loadSound("lib/PortalWhoosh.mp3")
  hitSound = loadSound("lib/hit.mp3")
  sinkenSound = loadSound("lib/sinken.mp3")
}

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
};


function keyPressed(e) {
    // prevent scrolling of website with SPACE key
    if(e.keyCode == 32 && e.target == document.body) {
      e.preventDefault();
    }


  //Enter-Tastatur
  if (keyCode === 32) {
    switch (spaceCount) {
      case 1:
        console.log('Taste 1')
        if ((balls[0].body.position.x - balls[0].body.positionPrev.x) < 0) {
          direction}
        Matter.Body.applyForce(
          balls[0].body, {
            x: balls[0].body.position.x,
            y: balls[0].body.position.y
          }, {
            x: (250 * direction) + balls[0].body.velocity.x / 100,
            y: -200
          }
        );
        console.log('Taste 2')
        balls[0].color = '#34E0EB'
        break;
      case 2:
        console.log('Taste 3')
        balls[0].color = '#EEAD0E'
        break;
      case 3:
        console.log('Taste 4')
        balls[0].color = 'FFFFFF'
      default:
        console.log('SpaceCount' + spaceCount)
    }
    spaceCount = (spaceCount + 1) % 4
  }
}

function setup() {
  engine = Matter.Engine.create()
  let canvas = createCanvas(1265, 7000)

// // Hit Sound
// hitSound = loadSound("lib/Clank-2.mp3")

  //CODE: BALL

  balls.push(new Ball({ x: 20, y: 0, color: 'FFFFFF', size: 35, position: { x: 10, y: 1500 } }, { isStatic: false, density: 7, restitution: 0.3, friction: -0.07, label: "murmel" }))

  // CODE: WOlKEN

  let wolkeElem = document.getElementById('wolke');
  if (null != wolkeElem) {
    wolken.push(bodyFromPath(wolkeElem, 100, 250, 1.0, { visible: true, isStatic: true, restitution: 5 }));
    wolken.push(bodyFromPath(wolkeElem, 575, 550, 0.75, { visible: true, isStatic: true, restitution: 2 }));
    wolken.push(bodyFromPath(wolkeElem, 350, 500, 1.2, { visible: true, isStatic: true, restitution: 2 }));
    wolken.push(bodyFromPath(wolkeElem, 1000, 300, 1.0, { visible: true, isStatic: true, restitution: 2 }));
    wolken.push(bodyFromPath(wolkeElem, 1200, 100, 0.5, { visible: true, isStatic: true, restitution: 2 }));
  }

  let wolke2Elem = document.getElementById('wolke2');
  if (null != wolke2Elem) {
    wolken.push(bodyFromPath(wolke2Elem, 200, 400, 1.00, { color: 'white', visible: true, isStatic: true, restitution: 5 }));
    wolken.push(bodyFromPath(wolke2Elem, 500, 100, 0.75, { color: 'white', visible: true, isStatic: true, restitution: 5 }));
    wolken.push(bodyFromPath(wolke2Elem, 600, 250, 1.00, { color: 'white', visible: true, isStatic: true, restitution: 5 }));
    wolken.push(bodyFromPath(wolke2Elem, 800, 200, 0.75, { color: 'white', visible: true, isStatic: true, restitution: 5 }));
  }

  //Schanze
  let schanzeElem = document.getElementById('schanze1');
  if (null != schanzeElem) {
    schanzen.push(bodyFromPath(schanzeElem, 1075, 1080, 1.25, { color: 'white', visible: true, isStatic: true, label: 'schanze' }));
  }
//  blocks.push(new Block({ x: 650, y: 1060, w: 30, h: 30, color: '#341B28', visible: true }, { isStatic: true }))

  //Boden + Klappe
  blocks.push(new Block({ x: 750, y: 590, w: 100, h: 30, color: '#EEAD0E', visible: true, chgStatic: true }, { isStatic: true, label: 'auslöser' }))
  blocks.push(new Block({ x: -10, y: 620, w: 1100, h: 20, color: '#E3BB7C', visible: true }, { isStatic: true }))
  blocks.push(new Block({ x: 1240, y: 620, w: 50, h: 20, color: '#E3BB7C', visible: true }, { isStatic: true }))
  blocks.push(new Block({ x: 1090, y: 620, w: 150, h: 20, color: '#EEAD0E', visible: true }, { isStatic: true, label: 'klappe' }))

  pendel = Matter.Bodies.circle(700, 1020, 80), {
    isStatic: false,
    density: 0.5
  };

  constraint2 = Constraint.create({
    pointA: { x: 720, y: 640 },
    bodyB: pendel,
    pointB: { x: 0, y: 0 }
  });
  World.add(engine.world, [pendel, constraint2]);

  //CODE: FARBIGE BALKEN

  //Anfang - farbigen Balken
  blocks.push(new Block({ x: 0, y: 1480, w: 1000, h: 20, color: '#876466', visible: true }, { isStatic: true, angle: Math.PI * 0.05 }))

  //1.Balken
  blocks.push(new Block({ x: 1150, y: 1680, w: 180, h: 20, color: '#34E0EB', visible: true }, { isStatic: true, angle: -Math.PI * 0.20 }))
  blocks.push(new Block({ x: 550, y: 1780, w: 625, h: 20, color: '#34E0EB', visible: true }, { isStatic: true, angle: -Math.PI * 0.05, label: 'hürde1' }))

  //2.Balken
  blocks.push(new Block({ x: 550, y: 2070, w: 730, h: 20, color: '#EEAD0E', visible: true }, { isStatic: true, angle: Math.PI * 0.05, label: 'hürde2' }))

  //3.Balken
  blocks.push(new Block({ x: 550, y: 2350, w: 730, h: 20, color: '#34E0EB', visible: true }, { isStatic: true, angle: -Math.PI * 0.05, label: 'hürde1' }))

  //4.Balken
  blocks.push(new Block({ x: 550, y: 2650, w: 730, h: 20, color: '#EEAD0E', visible: true }, { isStatic: true, angle: Math.PI * 0.05, label: 'hürde2' }))

  // Trennwand
  blocks.push(new Block({ x: -100, y: 2140, w: 1310, h: 20, color: '#876466', visible: true }, { isStatic: true, angle: -Math.PI * 2.5 }))

  //CODE: FALLENDE KÄSTCHEN & TRANSPORTMITTEL

  //Gerüst
  blocks.push(new Block({ x: 0, y: 2780, w: 900, h: 20, color: '#876466', visible: true }, { isStatic: true, angle: Math.PI * 0.05 }))

  //tube
  blocks.push(new Block({ x: 940, y: 3037, w: 88, h: 13, color: '#34E0EB', visible: true }, { isStatic: true, label: "balken"}))

  blocks.push(new Block({ x: 830, y: 2900, w: 120, h: 20, color: '#876466', visible: true }, { isStatic: true, angle: -Math.PI * 2.5, restitution: 0.5 }))
  blocks.push(new Block({ x: 867, y: 2993, w: 100, h: 20, color: '#876466', visible: true }, { isStatic: true, angle: -Math.PI * 2.7, restitution: 0.5 }))
  blocks.push(new Block({ x: 1000, y: 2993, w: 100, h: 20, color: '#876466', visible: true }, { isStatic: true, angle: Math.PI * 2.7, restitution: 0.5 }))
  blocks.push(new Block({ x: 1017, y: 2900, w: 120, h: 20, color: '#876466', visible: true }, { isStatic: true, angle: -Math.PI * 2.5, restitution: 0.5 }))

  blocks.push(new Block({ x: 1075, y: 2830, w: 190, h: 20, color: '#876466', visible: true }, { isStatic: true, angle: -Math.PI * 0.07 }))

  //transportmittel
  blocks.push(new Block({ x: 964, y: 3210, w: 65, h: 20, color: '#876466', visible: true }, { isStatic: true, angle: -Math.PI * 2.5 }))
  blocks.push(new Block({ x: 1164, y: 3210, w: 65, h: 20, color: '#876466', visible: true }, { isStatic: true, angle: -Math.PI * 2.5 }))
  blocks.push(new Block({ x: 1064, y: 3285, w: 25, h: 210, color: '#876466', visible: true }, { isStatic: true, angle: -Math.PI * 2.5 }))

  //schräge schiene + wrap
  blocks.push(new Block({ x: 600, y: 3350, w: 20, h: 190, color: '#876466', visible: true }, { isStatic: true, angle: -Math.PI * 0.65 }))

  blocks.push(new Block({ x: 990, y: 3300, w: 20, h: 850, color: '#876466', visible: false }, { isStatic: true, angle: Math.PI/2, label: "wrap-block" }))

  //fallende Kästchen
  blocks.push(new Block({ x: 275, y: 3530, w: 50, h: 50, color: '#B9DEE7', visible: true }, { isStatic: true, airFriction: 0.15, density: 2000, label: "fall" }))
  blocks.push(new Block({ x: 330, y: 3520, w: 50, h: 50, color: '#B9DEE7', visible: true }, { isStatic: true, airFriction: 0.15, density: 2000, label: "fall" }))
  blocks.push(new Block({ x: 385, y: 3510, w: 50, h: 50, color: '#B9DEE7', visible: true }, { isStatic: true, airFriction: 0.15, density: 2000, label: "fall" }))
  blocks.push(new Block({ x: 440, y: 3500, w: 50, h: 50, color: '#B9DEE7', visible: true }, { isStatic: true, airFriction: 0.15, density: 2000, label: "fall" }))

  //Propeller Section

  //Röhren (links-rechts)
  blocks.push(new Block({ x: -100, y: 3810, w: 290, h: 20, color: '#876466', visible: true }, { isStatic: true, angle: PI / 2 }))
  blocks.push(new Block({ x: 30, y: 3800, w: 290, h:20, color: '#876466', visible: true }, { isStatic: true, angle: PI / 2 }))

  //drehende Platten
  blocks.push(new Block({ x: 90, y: 3745, w: 40, h: 40, color: '#8A4F53', visible: true }, { isStatic: false }))
  blocks.push(new Block({ x: 90, y: 3855, w: 40, h: 40, color: '#8A4F53', visible: true }, { isStatic: false }))

  //rest blocks
  blocks.push(new Block({ x: 23, y: 3990, w: 100, h: 20, color: '#876466', visible: true }, { isStatic: true, angle: Math.PI * 0.30 }))
  blocks.push(new Block({ x: 95, y: 4025, w: 175, h: 20, color: '#876466', visible: true }, { isStatic: true }))

  //Funktion für drehende Platten
  blocks.slice(28, 32).forEach((block, i) => {
    let constraint = Matter.Constraint.create({
      bodyA: block.body,
      pointB: { x: block.body.position.x, y: block.body.position.y }
    });
    Matter.World.add(engine.world, [constraint]);
  });

  //ground-transparent
  blocks.push(new Block({ x: 225, y: 4050, w: 70, h: 20, color: 'black', visible: false }, { isStatic: true, angle: PI / 2 }))
  blocks.push(new Block({ x: 270, y: 4075, w: 240, h: 20, color: 'black', visible: false }, { isStatic: true }))
  blocks.push(new Block({ x: 470, y: 4050, w: 70, h: 20, color: 'black', visible: false }, { isStatic: true, angle: PI / 2 }))

  //CODE: KNÖPFE

  //durchichtiger block
  blocks.push(new Block({ x: 560, y: 3820, w: 150, h: 200, color: '#4A2A2F', visible: true }, { isStatic: true, label: "kasten" }))

  //bunte Knöpfe
  blocks.push(new Block({ x: 900, y: 3990, w: 100, h: 50, color: '#34E0EB', visible: false }, { isStatic: true, label: "knopf1" }))
  blocks.push(new Block({ x: 1100, y: 3990, w: 100, h:50, color: '#EEAD0E', visible: false }, { isStatic: true, label: "knopf2" }))

  //ground-floor
  blocks.push(new Block({ x: 500, y: 4020, w: 950, h: 25, color: '#876466', visible: true }, { isStatic: true, density: 5}))

  // untere Klappe-Stack
  blocks.push(new Block({ x: 0, y: 4460, w: 1260, h: 20, color: '#876466', visible: true }, { isStatic: true }))

  //2.wrap block
  blocks.push(new Block({ x: 1250, y: 3720, w: 20, h:300, color: '#876466', visible: false }, { isStatic: true, label: "return-block" }))

  // Composites.stack(x,y, anzahl pro zeile, anzahl pro spalte, abstand x, abstand y)
  bullets = Composites.stack(0, 4315, 50, 3, 1, 1, function(x, y) {return Bodies.circle(x, y, 23)});
  let bullets1 = bullets.stack

  // CODE: VIELE DREHENDE PLATTEN

  //1.Reihe
  blocks.push(new Block({ x: 100, y: 4700, w: 80, h: 80, color: '#876466', visible: true }, { isStatic: false }))
  blocks.push(new Block({ x: 100, y: 4900, w: 80, h: 80, color: '#876466', visible: true }, { isStatic: false }))
  blocks.push(new Block({ x: 100, y: 5100, w: 80, h: 80, color: '#876466', visible: true }, { isStatic: false }))
  blocks.push(new Block({ x: 100, y: 5300, w: 80, h: 80, color: '#876466', visible: true }, { isStatic: false }))

  //2.Reihe
  blocks.push(new Block({ x: 330, y: 4800, w: 80, h: 80, color: '#8A4F53', visible: true }, { isStatic: false, angle: Math.PI / 4 }))
  blocks.push(new Block({ x: 330, y: 5000, w: 80, h: 80, color: '#8A4F53', visible: true }, { isStatic: false, angle: Math.PI / 4 }))
  blocks.push(new Block({ x: 330, y: 5200, w: 80, h: 80, color: '#8A4F53', visible: true }, { isStatic: false, angle: Math.PI / 4 }))
  blocks.push(new Block({ x: 330, y: 5400, w: 80, h: 80, color: '#8A4F53', visible: true }, { isStatic: false, angle: Math.PI / 4 }))

  //3.Reihe
  blocks.push(new Block({ x: 590, y: 4700, w: 80, h: 80, color: '#876466', visible: true }, { isStatic: false }))
  blocks.push(new Block({ x: 590, y: 4900, w: 80, h: 80, color: '#876466', visible: true }, { isStatic: false }))
  blocks.push(new Block({ x: 590, y: 5100, w: 80, h: 80, color: '#876466', visible: true }, { isStatic: false }))
  blocks.push(new Block({ x: 590, y: 5300, w: 80, h: 80, color: '#876466', visible: true }, { isStatic: false }))

  //4.Reihe
  blocks.push(new Block({ x: 850, y: 4800, w: 80, h: 80, color: '#8A4F53', visible: true }, { isStatic: false, angle: Math.PI / 4 }))
  blocks.push(new Block({ x: 850, y: 5000, w: 80, h: 80, color: '#8A4F53', visible: true }, { isStatic: false, angle: Math.PI / 4 }))
  blocks.push(new Block({ x: 850, y: 5200, w: 80, h: 80, color: '#8A4F53', visible: true }, { isStatic: false, angle: Math.PI / 4 }))
  blocks.push(new Block({ x: 850, y: 5400, w: 80, h: 80, color: '#8A4F53', visible: true }, { isStatic: false, angle: Math.PI / 4 }))

  //5.Reihe
  blocks.push(new Block({ x: 1050, y: 4700, w: 80, h: 80, color: '#876466', visible: true }, { isStatic: false }))
  blocks.push(new Block({ x: 1050, y: 4900, w: 80, h: 80, color: '#876466', visible: true }, { isStatic: false }))
  blocks.push(new Block({ x: 1050, y: 5100, w: 80, h: 80, color: '#876466', visible: true }, { isStatic: false }))
  blocks.push(new Block({ x: 1050, y: 5300, w: 80, h: 80, color: '#876466', visible: true }, { isStatic: false }))

  //Funktion für drehende Platten
  blocks.slice(39, 66).forEach((block, i) => {
    let constraint = Matter.Constraint.create({ bodyA: block.body, pointB: { x: block.body.position.x, y: block.body.position.y } });
    Matter.World.add(engine.world, [constraint])
  });


  //Trichter
  blocks.push(new Block({ x: -20, y: 5790, w: 650, h: 20, color: '#876466', visible: true }, { isStatic: true, angle: Math.PI * 2.11 }))
  blocks.push(new Block({ x: 649, y: 5810, w: 650, h: 20, color: '#876466', visible: true }, { isStatic: true, angle: Math.PI * 2.91 }))

  //Wasser SVG
let wasser2Elem = document.getElementById('wasser2');
if (null != wasser2Elem){
      wasser2.push(bodyFromPath(wasser2Elem, 600, 6700, 1.0, {visible: true, isStatic: true, restitution: 5, label: "welle" }));
}
let wasser3Elem = document.getElementById('wasser3');
if (null != wasser3Elem){
  wasser3.push(bodyFromPath(wasser3Elem, 600, 6800, 1.0, {visible: true, isStatic: true, restitution: 5 }));
  }

  let wasser4Elem = document.getElementById('wasser4');
  if (null != wasser4Elem){
    wasser4.push(bodyFromPath(wasser4Elem, 600, 6900, 1.0, {visible: true, isStatic: true, restitution: 5 }));
}

  // Balken zum Orientierung
  blocks.push(new Block({ x: 0, y: 0, w: 10, h: 7000, color: 'black', visible: true }, { isStatic: true }))
  blocks.push(new Block({ x: 1260, y: 0, w: 10, h: 7000, color: 'black', visible: true }, { isStatic: true }))

  Matter.World.add(engine.world, [bullets]);
  Matter.World.add(engine.world, wolken);
  Matter.World.add(engine.world, schanzen);
  Matter.World.add(engine.world,wasser2,wasser3,wasser4)

  Matter.Events.on(engine, 'collisionStart', function(event) {
    const pairs = event.pairs[0];
    const bodyA = pairs.bodyA;
    const bodyB = pairs.bodyB;

    //Klappe oben
    if (bodyA.label === "murmel" && bodyB.label === "auslöser") {
    blocks[3].visible = false
    Matter.World.remove(engine.world, blocks[3].body)
    Matter.Body.setPosition(blocks[0].body, {x: 800, y: 620})
    }

    // Farbige Balken
    // Türkis
    if (bodyA.label === "murmel" && balls[0].color == '#34E0EB' && bodyB.label === "hürde1") {
      Matter.World.remove(engine.world, bodyB)
    }
    //Orange
    if (bodyA.label === "murmel" && balls[0].color == '#EEAD0E' && bodyB.label === "hürde2") {
      Matter.World.remove(engine.world, bodyB)
    }

    //Small türkis block
    if (bodyA.label === "murmel" && balls[0].color == '#34E0EB' && bodyB.label === "balken") {
      Matter.World.remove(engine.world, bodyB)
    }

    // Controls collision with falling blocks
    else if (bodyA.label === "murmel" && bodyB.label === "fall") {
      Matter.Body.setStatic(bodyB, false)
    }

    //wrap 1
    console.log('wrap')
    if (bodyA.label === "murmel" && bodyB.label === "wrap-block"){
    Matter.Body.setPosition(balls[0].body, {x: 980, y: 2900})}

    //Controls collision with durchsichtigem Block
    if (bodyA.label === "murmel" && bodyB.label === "kasten") {
    blocks[36].visible = false
    Matter.World.remove(engine.world, bodyB)
    blocks[37].visible = true
    blocks[38].visible = true
    }

    // Controls collision with Knöpfe
    if (bodyA.label === "murmel" && balls[0].color == '#34E0EB' && bodyB.label === "knopf1") {
        blocks[37].visible = false
        knopfCount --
        Matter.World.remove(engine.world, bodyB)
      if (knopfCount === 0) {
        blocks[40].visible = false
        Matter.World.remove (engine.world, blocks[40].body)
      }
    }

    if (bodyA.label === "murmel" && balls[0].color == '#EEAD0E' && bodyB.label === "knopf2") {
        hitSound.play();
        blocks[38].visible = false
        knopfCount --
        Matter.World.remove(engine.world, bodyB)
      if (knopfCount === 0) {
        blocks[40].visible = false
        Matter.World.remove (engine.world, blocks[40].body)
        Matter.World.remove (engine.world, blocks[39].body)
      }
    }

    //wrap 2
    console.log('return-block')
    if (bodyA.label === "murmel" && bodyB.label === "return-block"){
    Matter.Body.setPosition(balls[0].body, {x: 560, y: 3840})}

    //Sound-effects

    //Wasser
    if (bodyA.label === "murmel" && bodyB.label === "welle") {
    balls[0].color = '#094BA0'
    sinkenSound.play();

    }

    if(bodyA.label === 'murmel' && bodyB.label === 'auslöser') {
      hitSound.play();
    }
    if(bodyA.label === 'murmel' && bodyB.label === 'schanze') {
      pendelSound.play();
    }

  });

  Matter.Engine.run(engine)
}

function draw() {
  clear()

  // follow the ball by scrolling the window
  scrollFollow(balls[0]);

  //TRANSPORTMITTEL
  Matter.Body.setPosition(blocks[18].body, { x: 700 + Math.sin(frameCount/90) * 350, y: 3240 })
  Matter.Body.setPosition(blocks[19].body, { x: 900 + Math.sin(frameCount/90) * 350, y: 3240 })
  Matter.Body.setPosition(blocks[20].body, { x: 800 + Math.sin(frameCount/90) * 350, y: 3260 })

  //pendel
  stroke(128);
  strokeWeight(8);
  drawConstraint(constraint2);

  noStroke(255);
  fill('#3BF4FB');
  drawVertices(pendel.vertices);


  if (frameCount % 80 == 0) {
    let direction = 1.5; // circle runs left to right ->
    if ((pendel.position.x - pendel.positionPrev.x) < 0) {
      direction = -1.5; // circle runs right to left <-
    }
    Matter.Body.applyForce(
      pendel, { x: pendel.position.x, y: pendel.position.y }, { x: (0.52 * direction) + pendel.velocity.x / 100, y: 0 });
  }

  //Wolken
  fill('white');
  wolken.forEach(wolke => drawBody(wolke));

  //schanze
  fill('#5B3033');
  schanzen.forEach(schanze => drawBody(schanze));


//Wasser2
fill('#6795DA')
wasser2.forEach(wasser2 => drawBody(wasser2));

//Wasser3
fill('#094BA0')
wasser3.forEach(wasser3 => drawBody(wasser3));

//Wasser4
fill('#6795DA')
wasser4.forEach(wasser4 => drawBody(wasser4));

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

function scrollFollow(matterObj) {
  if (insideViewport(matterObj) == false) {
    const $element = $('html, body');
    if ($element.is(':animated') == false) {
      $element.animate({
        scrollLeft: balls[0].body.position.x,
        scrollTop: balls[0].body.position.y
      }, 1000);
    }
  }
}

function insideViewport(matterObj) {
const x = balls[0].body.position.x;
const y = balls[0].body.position.y;
const pageXOffset = window.pageXOffset || document.documentElement.scrollLeft;
const pageYOffset  = window.pageYOffset || document.documentElement.scrollTop;
if (x >= pageXOffset && x <= pageXOffset + windowWidth &&
  y >= pageYOffset && y <= pageYOffset + windowHeight) {
return true;
} else {
return false;
}
}
