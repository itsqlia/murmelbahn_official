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
let direction = 0.2
let attractorActiv = false
let pendel
let klappe
let constraint1
let constraint
let portalSound
let engine
let isMagnetisch = true

function preload(){portalSound = loadSound("lib/PortalWhoosh.mp3")}

function degToRad(deg) {return deg / 360 * (2 * PI)}

function radToDeg(rad) {return rad / (2 * PI) * 360}


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
    Matter.World.add(engine.world, [this.body])}


  show() {
    fill(this.color)
    noStroke()
    if (this.visible == true) {drawBody(this.body)}}};

class Ball {
  constructor(attrs, options) {
    this.x = attrs.x
    this.y = attrs.y
    this.color = attrs.color
    this.size = attrs.size
    this.position = (this.x, this.y)
    this.body = Matter.Bodies.circle(this.x, this.y, this.size / 2, options)
    Matter.World.add(engine.world, [this.body])}

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
          x: (0.05 * direction) + balls[0].body.velocity.x / 100,
          y: -0.05
        }
      );
      console.log ('Taste 2')
      balls[0].color = 'black'
      break;
      case 2:
        console.log('Taste 2')
        balls[0].color = 'yellow'
        break;
      case 3:
        console.log('Taste 3')
        balls[0].color = 'green'
      default:
        console.log('SpaceCount' + spaceCount)}
    spaceCount = (spaceCount + 1) % 4}
  }

function setup() {
  engine = Matter.Engine.create()
  let canvas = createCanvas(1480, 7000)

//CODE: BALL
 portalSound = loadSound("lib/PortalWhoosh.mp3")

 balls.push(new Ball({x: 700, y: 3500, color: 'black', size: 45, position: {x: 10,y: 1500}},{isStatic: false, restitution: 0.5, label:"murmel"}))

  // CODE: WOlKEN & PENDEL

  let wolkeElem = document.getElementById('wolke');
  if (null != wolkeElem) {
    wolken.push(bodyFromPath(wolkeElem, 300, 250, 1.0, { color: 'white', visible: true, isStatic: true, restitution: 2}));
    wolken.push(bodyFromPath(wolkeElem, 775, 550, 0.75, { color: 'white', visible: true, isStatic: true, restitution: 2 }));
    wolken.push(bodyFromPath(wolkeElem, 550, 500, 1.2, { color: 'white', visible: true, isStatic: true, restitution: 2}));
    wolken.push(bodyFromPath(wolkeElem, 1200, 300, 1.0, { color: 'white', visible: true, isStatic: true, restitution: 2}));
    wolken.push(bodyFromPath(wolkeElem, 1400, 100, 0.5, { color: 'white', visible: true, isStatic: true, restitution: 2}));
  }

  let wolke2Elem = document.getElementById('wolke2');
  if (null != wolke2Elem) {
    wolken.push(bodyFromPath(wolke2Elem, 400, 400, 1.00, { color: 'white', visible: true, isStatic: true }));
    wolken.push(bodyFromPath(wolke2Elem, 700, 100, 0.75, { color: 'white', visible: true, isStatic: true }));
    wolken.push(bodyFromPath(wolke2Elem, 800, 250, 1.00, { color: 'white', visible: true, isStatic: true }));
    wolken.push(bodyFromPath(wolke2Elem, 1000, 200, 0.75, { color: 'white', visible: true, isStatic: true }));
  }


  let schanzeElem = document.getElementById('schanze1');
  if (null != schanzeElem) {
    schanzen.push(bodyFromPath(schanzeElem, 1200, 1000, 1.25, { color: 'white', visible: true, isStatic: true, friction: 0.0 }));
    //schanzen.push(bodyFromPath(schanzeElem, 350, 230, 1.0, { color: 'white', visible: true, isStatic: true, friction: 0.0 }));
  }
  //Boden
  blocks.push(new Block({x: 200, y: 625, w: 900, h: 40, color: 'grey', visible: true}, {isStatic: true}))

  blocks.push(new Block({x: 1350, y: 625, w: 100, h: 40, color: 'grey', visible: true}, {isStatic: true}))

  //Klappe
  // klappe = Bodies.rectangle(1100, 625, 600, 20);
  // constraint = Constraint.create({
  //   pointA: {x: 400, y: 520},
  //   bodyB: catapult,
  //   stiffness: 1,
  //   length: 0
  // });
  // World.add(engine.world, [klappe, constraint]);

  blocks.push(new Block({x: 1100, y: 625, w: 250, h: 40, color: '#C879FF', visible: true}, {isStatic: true}))

  // constraint1 = Constraint.create({
  //   pointA: {x: 1100, y:625},
  //   bodyB: blocks[2]
  // });
  // World.add(engine.world, constraint1);

  blocks.push(new Block({x: 900, y: 585, w: 100, h: 40, color: '#C879FF', visible: true, chgStatic: true}, {isStatic: true, airFriction: 0.15, density: 500, label: "auslöser"}))

  //pendel

  pendel = Matter.Bodies.circle(400, 950, 60, 30), {
    isStatic: false,
    density: 0.5
  };

  constraint2 = Constraint.create({
     pointA: {x: 500,y: 650},
    bodyB: pendel,
    pointB: {x: 0,y: 0}
  });
  World.add(engine.world, [pendel, constraint2]);

  //CODE: FARBIGE BALKEN

  //Anfang - farbigen Balken
  blocks.push(new Block({x: 180, y: 1480, w: 1050, h: 20, color: 'gray', visible: true}, {isStatic: true,angle: Math.PI * 0.05}))

  //GELB
  blocks.push(new Block({x: 700, y: 1780, w: 580, h: 30, color: 'yellow', visible: true}, {isStatic: true, angle: -Math.PI * 0.05}))
  blocks.push(new Block({x: 1250, y: 1680, w: 215, h: 30, color: 'yellow', visible: true}, {isStatic: true, angle: -Math.PI * 0.20}))

  //GRÜN
  blocks.push(new Block({x: 720, y: 2070, w: 720, h: 30, color: 'green', visible: true}, {isStatic: true, angle: Math.PI * 0.05}))

  //GELB
  blocks.push(new Block({x: 720, y: 2350, w: 720, h: 30, color: 'yellow', visible: true}, {isStatic: true, angle: -Math.PI * 0.05}))

  //GRÜN
  blocks.push(new Block({x: 720, y: 2650, w: 720, h: 30, color: 'green', visible: true}, {isStatic: true, angle: Math.PI * 0.05}))

  // Trennwand
  blocks.push(new Block({x: 60, y: 2150, w: 1300, h: 20, color: 'grey', visible: true}, {isStatic: true,angle: -Math.PI * 2.5}))

  //CODE: FALLENDE KÄSTCHEN & TRANSPORTMITTEL

  //graue schräge Schiene
  blocks.push(new Block({x: 180, y: 2802, w: 1010, h: 20, color: 'gray', visible: true}, {isStatic: true, angle: Math.PI * 0.05}))

  blocks.push(new Block({x: 1340, y: 2890, w: 130, h: 20, color: 'gray', visible: true}, {isStatic: true}))

  //tube
  blocks.push(new Block({x: 1225, y: 3087, w: 70, h: 15, color: 'blue', visible: true}, {isStatic: true}))

  blocks.push(new Block({x: 1110, y: 2948, w: 120, h: 20, color: 'grey', visible: true}, {isStatic: true, angle: -Math.PI * 2.5, restitution: 0.5}))
  blocks.push(new Block({x: 1290, y: 2948, w: 120, h: 20, color: 'grey', visible: true}, {isStatic: true, angle: -Math.PI * 2.5, restitution: 0.5}))
  blocks.push(new Block({x: 1149, y: 3045, w: 100, h: 20, color: 'grey', visible: true}, {isStatic: true, angle: -Math.PI * 2.7, restitution: 0.5}))
  blocks.push(new Block({x: 1272, y: 3045, w: 100, h: 20, color: 'gray', visible: true}, {isStatic: true, angle: Math.PI * 2.7, restitution: 0.5}))

  //moving platform
  blocks.push(new Block({x: 964, y: 3210, w: 50, h: 10, color: 'gray', visible: true}, {isStatic: true, angle: -Math.PI * 2.5}))
  blocks.push(new Block({x: 1164, y: 3210, w: 50, h: 10, color: 'gray', visible: true}, {isStatic: true, angle: -Math.PI * 2.5}))
  blocks.push(new Block({x: 1064, y: 3215, w: 20, h: 200, color: 'gray', visible: true}, {isStatic: true, angle: -Math.PI * 2.5}))

  //schräge schiene für den Ball
  blocks.push(new Block({x: 750, y: 3100, w: 20, h: 150, color: 'grey', visible: true}, {isStatic: true, angle: -Math.PI * 0.65}))

  //fallende Kästchen
  blocks.push(new Block({x: 550, y: 3300, w: 50, h: 50, color: '#32f4da', visible: true, chgStatic: true}, {isStatic: true, airFriction: 0.15, density: 500, label: "fall1"}))
  blocks.push(new Block({x: 500, y: 3310, w: 50, h: 50, color: '#32f4da', visible: true, chgStatic: true}, {isStatic: true, airFriction: 0.15, density: 500, label: "fall2"}))
  blocks.push(new Block({x: 450, y: 3320, w: 50, h: 50, color: '#32f4da', visible: true, chgStatic: true}, {isStatic: true, airFriction: 0.15, density: 500, label: "fall3"}))
  blocks.push(new Block({x: 400, y: 3330, w: 50, h: 50, color: '#32f4da', visible: true, chgStatic: true}, {isStatic: true, airFriction: 0.15, density: 500, label: "fall4"}))

  //demo-Ball
  // balls.push(new Ball({x: 550, y: 3000, color: 'black', size: 45, position: {x: 10, y: 1500}}, {isStatic: false, restitution: 0.5}))

  //ground-transparent (later: color change to - #4B5056!)
  blocks.push(new Block({x: 380, y: 3800, w: 235, h: 10, color: 'black', visible: true}, {isStatic: true}))
  blocks.push(new Block({x: 355, y: 3780, w: 50, h: 5, color: 'black', visible: true}, {isStatic: true, angle: PI / 2}))
  blocks.push(new Block({x: 590, y: 3780, w: 50, h: 5, color: 'black', visible: true}, {isStatic: true, angle: PI / 2}))

  //Propeller Section

  //Röhren (links-rechts)
  blocks.push(new Block({x: 110, y: 3550, w: 250, h: 10, color: 'grey', visible: true}, {isStatic: true, angle: PI / 2}))
  blocks.push(new Block({x: 240, y: 3550, w: 250, h: 10, color: 'grey', visible: true}, {isStatic: true, angle: PI / 2}))

  //drehende Platten
  blocks.push(new Block({x: 285, y: 3475, w: 38, h: 38, color: 'lightblue', visible: true}, {isStatic: false}))
  blocks.push(new Block({x: 285, y: 3575, w: 38, h: 38, color: 'lightblue', visible: true}, {isStatic: false}))

  //rest blocks
  blocks.push(new Block({x: 215, y: 3710, w: 100, h: 10, color: 'grey', visible: true}, {isStatic: true, angle: Math.PI * 0.30}))
  blocks.push(new Block({x: 290, y: 3750, w: 90, h: 10, color: 'grey', visible: true}, {isStatic: true}))

  //Funktion für drehende Platten
  blocks.slice(31, 35).forEach((block, i) => {
    let constraint = Matter.Constraint.create({
      bodyA: block.body,
      pointB: {x: block.body.position.x, y: block.body.position.y}});
    Matter.World.add(engine.world, [constraint]);
  });

  //CODE: KNÖPFE

  //durchichtiger block
  blocks.push(new Block({x: 700, y: 3550, w: 150, h: 200, color: '#292F36', visible: true}, {isStatic: true, label: "kasten"}))

  //bunte Knöpfe
  blocks.push(new Block({x: 820, y: 3738, w: 50, h: 20, color: '#FF8A35', visible: false}, {isStatic: true}))
  blocks.push(new Block({x: 910, y: 3735, w: 50, h: 20, color: '#32f4da', visible: false}, {isStatic: true}))
  blocks.push(new Block({x: 1000, y: 3735, w: 50, h: 20, color: '#C879FF', visible: false}, {isStatic: true}))

  //ground-floor
  blocks.push(new Block({x: 615, y: 3755, w: 500, h: 10, color: 'gray', visible: true}, {isStatic: true}))

  // untere Klappen-Stack
  blocks.push(new Block({x: 180, y: 4060, w: 630, h: 20, color: 'black', visible: true}, {isStatic: true}))

  blocks.push(new Block({x: 810, y: 4060, w: 630, h: 20, color: 'black', visible: true}, {isStatic: true}))

  // Composites.stack(x,y, anzahl pro zeile, anzahl pro spalte, abstand x, abstand y)
  bullets = Composites.stack(180, 3922, 31, 3, 1, 1, function(x, y) {return Bodies.circle(x, y, 23)});

  // CODE: VIELE DREHENDE PLATTEN

  //1.Reihe
  blocks.push(new Block({x: 300, y: 4300, w: 80, h: 80, color: '#32f4da', visible: true}, {isStatic: false}))
  blocks.push(new Block({x: 300, y: 4500, w: 80, h: 80, color: '#32f4da', visible: true}, {isStatic: false}))
  blocks.push(new Block({x: 300, y: 4700, w: 80, h: 80, color: '#32f4da', visible: true}, {isStatic: false}))
  blocks.push(new Block({x: 300, y: 4900, w: 80, h: 80, color: '#32f4da', visible: true}, {isStatic: false}))

  //2.Reihe
  blocks.push(new Block({x: 530, y: 4400, w: 80, h: 80, color: '#C879FF', visible: true}, {isStatic: false, angle: Math.PI / 4}))
  blocks.push(new Block({x: 530, y: 4600, w: 80, h: 80, color: '#C879FF', visible: true}, {isStatic: false, angle: Math.PI / 4}))
  blocks.push(new Block({x: 530, y: 4800, w: 80, h: 80, color: '#C879FF', visible: true}, {isStatic: false, angle: Math.PI / 4}))
  blocks.push(new Block({x: 530, y: 5000, w: 80, h: 80, color: '#C879FF', visible: true}, {isStatic: false, angle: Math.PI / 4}))

  //3.Reihe
  blocks.push(new Block({x: 760, y: 4300, w: 80, h: 80, color: '#32f4da', visible: true}, {isStatic: false}))
  blocks.push(new Block({x: 760, y: 4500, w: 80, h: 80, color: '#32f4da', visible: true}, {isStatic: false}))
  blocks.push(new Block({x: 760, y: 4700, w: 80, h: 80, color: '#32f4da', visible: true}, {isStatic: false}))
  blocks.push(new Block({x: 760, y: 4900, w: 80, h: 80, color: '#32f4da', visible: true}, {isStatic: false}))

  //4.Reihe
  blocks.push(new Block({x: 1020, y: 4400, w: 80, h: 80, color: '#C879FF', visible: true}, {isStatic: false, angle: Math.PI / 4}))
  blocks.push(new Block({x: 1020, y: 4600, w: 80, h: 80, color: '#C879FF', visible: true}, {isStatic: false, angle: Math.PI / 4}))
  blocks.push(new Block({x: 1020, y: 4800, w: 80, h: 80, color: '#C879FF', visible: true}, {isStatic: false, angle: Math.PI / 4}))
  blocks.push(new Block({x: 1020, y: 5000, w: 80, h: 80, color: '#C879FF', visible: true}, {isStatic: false, angle: Math.PI / 4}))

  //5.Reihe
  blocks.push(new Block({x: 1220, y: 4300, w: 80, h: 80, color: '#32f4da', visible: true}, {isStatic: false}))
  blocks.push(new Block({x: 1220, y: 4500, w: 80, h: 80, color: '#32f4da', visible: true}, {isStatic: false}))
  blocks.push(new Block({x: 1220, y: 4700, w: 80, h: 80, color: '#32f4da', visible: true}, {isStatic: false}))
  blocks.push(new Block({x: 1220, y: 4900, w: 80, h: 80, color: '#32f4da', visible: true}, {isStatic: false}))

  //Funktion für drehende Platten
  blocks.slice(38,65).forEach((block, i) => {
  let constraint = Matter.Constraint.create({bodyA: block.body, pointB: { x: block.body.position.x , y: block.body.position.y }});
  Matter.World.add(engine.world, [constraint])});

  //Trichter
  blocks.push(new Block({x: 150, y: 5390, w: 680, h: 20, color: 'gray', visible: true}, {isStatic: true, angle: Math.PI * 2.11}))
  blocks.push(new Block({x: 850, y: 5415, w: 650, h: 20, color: 'gray', visible: true}, {isStatic: true, angle: Math.PI * 2.91}))

  //Portal
  portal =balls.push(new Ball({x: 840, y: 6000, color: 'yellow', size: 200,position: {x: 10, y: 1500}}, {isStatic: true, restitution: 0.5}))

  blocks.push(new Block({x: 850, y: 5415, w: 650, h: 20, color: 'gray', visible: true}, {isStatic: true, angle: Math.PI * 2.91}))

  // Balken zum Orientierung
  blocks.push(new Block({x: 1440, y: 0, w: 30, h: 7000, color: 'black', visible: true}, {isStatic: true}))
  blocks.push(new Block({x: 180, y: 0, w: 30, h: 7000, color: 'black', visible: true}, {isStatic: true}))

  // Process collisions - check whether ball hits a Block object
  // Matter.Events.on(engine, 'collisionStart', function(event) {
  //   var pairs = event.pairs
  //   pairs.forEach((pair, i) => {
  //     if (balls.includes(pair.bodyA)) {collide(pair.bodyB, pair.bodyA)}
  //     if (balls.includes(pair.bodyB)) {collide(pair.bodyA, pair.bodyB)}})
  //     // check for collision between Block and ball
  //   function collide(bodyBlock, bodyBall) {
  //     // check if bodyBlock is really a body in a Block class
  //     if (bodyBlock.plugin && bodyBlock.plugin.block) {
  //       // remember the collision for processing in 'beforeUpdate'
  //       collisions.push({ hit: bodyBlock.plugin.block, ball: bodyBall })}}
  // })

  Matter.World.add(engine.world, [bullets]);
  Matter.World.add(engine.world, wolken);
  Matter.World.add(engine.world, schanzen);

  Matter.Events.on(engine, 'collisionStart', function(event) {
    const pairs = event.pairs[0];
    const bodyA = pairs.bodyA;
    const bodyB = pairs.bodyB;
    if (bodyA.label === "kasten" || bodyB.label === "kasten") {
    blocks[35].visible = false
    }
  });
  Matter.Events.on(engine, 'collisionStart', function(event) {
    const pairs = event.pairs[0];
    const bodyA = pairs.bodyA;
    const bodyB = pairs.bodyB;
    if (bodyA.label === "kasten" || bodyB.label === "kasten") {
      blocks[36].visible = true, blocks[37].visible = true, blocks[38].visible = true
    }
  });
  Matter.Events.on(engine, 'collisionStart', function(event) {
    const pairs = event.pairs[0];
    const bodyA = pairs.bodyA;
    const bodyB = pairs.bodyB;
    if (bodyA.label === "fall1" || bodyB.label === "fall1") {
    // blocks[22].isStatic = false
    blocks[22].color = 'red'
    }
  });
  Matter.Events.on(engine, 'collisionStart', function(event) {
    const pairs = event.pairs[0];
    const bodyA = pairs.bodyA;
    const bodyB = pairs.bodyB;
    if (bodyA.label === "auslöser" || bodyB.label === "auslöser") {
    blocks[2].color = 'red'
    }
  });

  Matter.Engine.run(engine)

  Matter.Events.on(engine, 'beforeUpdate', function(event) {
  // process collisions at the right time
    collisions.forEach((collision, i) => {
      if (collision.hit.plugin.force) {Matter.Body.applyForce(collision.ball, collision.ball.position, collision.hit.plugin.force)}
      if (collision.hit.plugin.chgStatic) {console.log(collision.hit)
        Matter.Body.setStatic(collision.hit, false)}});
    collisions = []})

    // canvas.mousePressed(startEngine);

    // document.addEventListener('keyup', onKeyUp)
}

// function onKeyUp(evt) {
//   switch (evt.key) {
//     case ' ':
//       startEngine()
//       evt.preventDefault()
//       break}}

// function startEngine() {
//   if (0 == engine.timing.timestamp) {
//     Matter.Engine.run(engine)
//     userStartAudio()
//   }}

function draw() {
  background('#4B5056');

  //TRANSPORTMITTEL
  Matter.Body.setPosition(blocks[18].body, {x: 964 + Math.sin(frameCount / 100) * 280, y: 3270})
  Matter.Body.setPosition(blocks[19].body, {x: 1164 + Math.sin(frameCount / 100) * 280, y: 3270})
  Matter.Body.setPosition(blocks[20].body, {x: 1064 + Math.sin(frameCount / 100) * 280, y: 3285})

  //pendel
  stroke(128);
  strokeWeight(8);
  drawConstraint(constraint2);

  noStroke(255);
  fill('#3BF4FB');
  drawVertices(pendel.vertices);

  //Klappe
  // drawConstraint1(constraint1);

  Body = pendel
  // if (frameCount % 120 == 0){
  //   console.log(frameCount);
  //   let direction = 1; // circle runs left to right ->
  //   if ((pendel.body.position.x - pendel.body.positionPrev.x) < 0) {
  //     direction = -1; // circle runs right to left <-
  //     }
  //     Body.applyForce (
  //     pendel,
  //     {x:pendel.position.x, y: pendel.position.y},
  //     {x: (0.01 * direction) + pendel.velocity.x/100});}

  //Wolken
  fill('white');
  wolken.forEach(wolke => drawBody(wolke));

  //schanze
  // body.show(schanze);
  //schanze.show()
  fill('white');
  schanzen.forEach(schanze => drawBody(schanze));

  //Blöcke
  blocks.forEach((block, i) => {block.show()});

  //Bälle
  balls.forEach((ball, i) => {ball.show()});
  fill('black')
  drawBodies(bullets.bodies);

  //Balken FARBIG
  //if ((block[] && ball[0])== color:'yellow')
  // ?????Wie definieren??????
}

function bodyFromPath(path, x, y, scale, options) {
  let body = Matter.Bodies.fromVertices(0, 0, Matter.Vertices.scale(Matter.Svg.pathToVertices(path, 10), scale, scale), options);
  Matter.Body.setPosition(body, { x: x, y: y });
  return body;
}

function drawConstraint(constraint) {
  const offsetA = constraint.pointA;
  let posA = {x: 0, y: 0};
  if (constraint.bodyA) {posA = constraint.bodyA.position;}
  const offsetB = constraint.pointB;
  let posB = {x: 0, y: 0};
  if (constraint.bodyB) {posB = constraint.bodyB.position;}
  line(posA.x + offsetA.x, posA.y + offsetA.y, posB.x + offsetB.x, posB.y + offsetB.y);}

// //Portal
// function attract(){
//   let force ={x:(portal.body.position.x- balls[0].body.position.x) *1e-6, y:(portal.body.position.y- balls[0].body.position.y) *1e-6}
//   Body.applyForce(balls[0].body.position, force)}

function attract(ball) {
  if (isMagnetisch) {
    let force = {
      x: (pendel.body.position.x - ball[0].body.position.x) * 1e-3,
      y: (pendel.body.position.y - ball[0].body.position.y) * 1e-3,
    }
    console.log(force)
    //Matter.Body.applyForce(ball, ball.position, Matter.Vector.neg(force));
    Matter.Body.applyForce(ball[0].body, ball[0].body.position, force)
  }
}

function drawBodies(bodies) {
  for (let i = 0; i < bodies.length; i++) {drawVertices(bodies[i].vertices);}}

function drawBody(body) {
  if (body.parts && body.parts.length > 1) {
    for (var p = 1; p < body.parts.length; p++) {drawVertices(body.parts[p].vertices)}}
  else {
    if (body.type == "composite") {
      for (let b = 0; b < body.bodies.length; b++) {drawVertices(body.bodies[b].vertices)}}
  else {drawVertices(body.vertices)}}}

function drawVertices(vertices) {
  beginShape()
  for (var i = 0; i < vertices.length; i++) {vertex(vertices[i].x, vertices[i].y)}
  endShape(CLOSE)
}
