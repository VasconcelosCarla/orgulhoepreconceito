const Engine = Matter.Engine;
const World = Matter.World;
const Bodies = Matter.Bodies;
const Constraint = Matter.Constraint;

var engine, world, backgroundImg;
var canvas, angle, tower, ground, cannon;
var balls = [];
var invaders = [];

var score = 0;

var invaderAnimation = [];
var invaderSpritedata, invaderSpritesheet;

var deadAnimation = [];
var deadSpritedata, deadSpritesheet;

function preload() {
  backgroundImg = loadImage("./assets/fundo2.png");
  towerImage = loadImage("./assets/tower.png");
  gramaImagem = loadImage("./assets/grama2.png");
  invaderSpritedata = loadJSON("./assets/ZombieWalker/walker.json");
  invaderSpritesheet = loadImage("./assets/ZombieWalker/walker.png");

  deadSpritedata = loadJSON("./assets/deadZumbie/dead1.json")
  deadSpritesheet = loadImage("./assets/deadZumbie/dead1.png")
  
}

function setup() {
  canvas = createCanvas(1200, 600);
  engine = Engine.create();
  world = engine.world;
  angleMode(DEGREES)
  angle = 15
  

  ground = Bodies.rectangle(0, height - 1, width * 2, 1, { isStatic: true });
  World.add(world, ground);

  tower = Bodies.rectangle(390, 350, 160, 330, { isStatic: true });
  World.add(world, tower);

  grama = Bodies.rectangle(390, 510, 280, 130, { isStatic: true });
  World.add(world, grama);

  cannon = new Cannon(400, 110, 130, 100, angle);

  var invaderFrames = invaderSpritedata.frames;
  for (var i = 0; i<invaderFrames.length; i++){
    var pos = invaderFrames[i].position;
    var img = invaderSpritesheet.get(pos.x, pos.y, pos.w, pos.h);
    invaderAnimation.push(img);  
  }

  var deadFrames = deadSpritedata.frames;
  for (var i = 0; i<deadFrames.length; i++){
    var pos = deadFrames[i].position;
    var img = deadSpritesheet.get(pos.x, pos.y, pos.w, pos.h)
    deadAnimation.push(img)

  }
}

function draw() {
  background(189);
  image(backgroundImg, 0, 0, width, height);

  Engine.update(engine);

  push();
  translate(ground.position.x, ground.position.y);
  fill("brown");
  rectMode(CENTER);
  rect(0, 0, width * 2, 1);
  pop();

  cannon.display();

  push();
  translate(tower.position.x, tower.position.y);
  rotate(tower.angle);
  imageMode(CENTER);
  image(towerImage, 0, 0, 160, 330);
  pop();

  push();
  translate(grama.position.x, grama.position.y);
  rotate(grama.angle);
  imageMode(CENTER);
  image(gramaImagem, 0, 0, 280, 130);
  pop();
  
  showInvaders();

  for (var i = 0; i < balls.length; i++) {
    showCannonBalls(balls[i], i);
    collisionWithInvader(i);
  }

}

function collisionWithInvader(index) {
  for (var i = 0; i < invaders.length; i++) {
    if (balls[index] !== undefined && invaders[i] !== undefined) {
      var collision = Matter.SAT.collides(balls[index].body, invaders[i].body);

      if (collision.collided) {
        invaders[i].remove(i);

        Matter.World.remove(world, balls[index].body);
        delete balls[index];
      }
    }
  }
}

function keyPressed() {
  if (keyCode === DOWN_ARROW) {
    var cannonBall = new CannonBall(cannon.x, cannon.y);
    cannonBall.trajectory = [];
    Matter.Body.setAngle(cannonBall.body, cannon.angle);
    balls.push(cannonBall);
  }
}

function showCannonBalls(ball, index) {
  if (ball) {
    ball.display();
    if (ball.body.position.x >= width || ball.body.position.y >= height - 50) {
      ball.remove(index);
    }
  }
}

function showInvaders() {
  if (invaders.length > 0) {
    if (
      invaders[invaders.length - 1] === undefined ||
      invaders[invaders.length - 1].body.position.x < width - 300
    ) {
      var positions = [-40, -60, -70, -20];
      var position = random(positions);
      var invader = new Invaders(
        width, 
        height - 100, 
        70, 
        100, 
        position,
        invaderAnimation
      );

      invaders.push(invader);
    }

    for (var i = 0; i < invaders.length; i++) {
      if (invaders[i]) {
        Matter.Body.setVelocity(invaders[i].body, {
          x: -0.9,
          y: 0
        });

        invaders[i].display();
        invaders[i].animate();
      } else {
        invaders[i];
      }
    }
  } else {
    var invader = new Invaders(width, height - 60, 70, 100, -60, invaderAnimation);
    invaders.push(invader);
  }
}

function keyReleased() {
  if (keyCode === DOWN_ARROW) {
    balls[balls.length - 1].shoot();
  }
}
