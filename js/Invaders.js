class Invaders {
  constructor(x, y, width, height, invasorPos, invaderAnimation) {
  
    this.animation = invaderAnimation;
    this.speed = 0.05;
    this.body = Bodies.rectangle(x, y, width, height);
    this.width = width;
    this.height = height;
    this.invasorPosition = invasorPos;
    this.image = loadImage("./assets/Idle1.png");

    World.add(world, this.body);
  }
  animate(){
  this.speed +=0.05;
}
  remove(index) {
    this.animation = deadAnimation;
    this.speed=0.05;
    this.width=120;
    this.height=120;
    this.isBroken=true;
    setTimeout(() => {
      Matter.World.remove(world, invaders[index].body);
      delete invaders[index];
    }, 3000);
  }

  display() {
    var angle = this.body.angle;
    var pos = this.body.position;
    var index = floor(this.speed % this.animation.length);

    push();
    translate(pos.x, pos.y);
    rotate(angle);
    imageMode(CENTER);
    image(this.animation[index], 0, this.invasorPosition, this.width, this.height);
    pop();
  }
}
