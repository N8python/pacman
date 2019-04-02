let player, cursorts, dots, walls;
let inky, blinky;
let dist = Phaser.Math.Distance.Between;

function getKeyByValue(object, value) {
  return Object.keys(object).find(key => object[key] === value);
}
class Ghost {
  constructor(that) {
    this.that = that;
    this.sprite = that.physics.add.sprite(300, 300, "ghost");
    that.physics.add.collider(this.sprite, walls);
    this.movementDir = 1;
    this.oldXs = [];
    this.oldYs = [];
    this.stuck = false;
    this.stuckCoolDown = 0;
  }
  move() {
    this.stuckCoolDown--;
    this.oldXs.unshift(this.sprite.x);
    this.oldYs.unshift(this.sprite.y);
    if (this.oldXs.length > 20) {
      this.oldXs.pop();
    }
    if (this.oldYs.length > 20) {
      this.oldYs.pop();
    }
    let dirs = {
      right: dist(this.sprite.x + 1, this.sprite.y, player.x, player.y),
      left: dist(this.sprite.x - 1, this.sprite.y, player.x, player.y),
      up: dist(this.sprite.x, this.sprite.y - 1, player.x, player.y),
      down: dist(this.sprite.x, this.sprite.y + 1, player.x, player.y)
    }
    let dir = getKeyByValue(dirs, Math.max(...(Object.values(dirs))));
    let currentXs = this.oldXs.slice(this.oldXs.length - 5);
    let currentYs = this.oldYs.slice(this.oldYs.length - 5);
    console.log(currentXs, currentYs)
    if (currentXs.every(i => i === currentXs[0]) && currentYs.every(i => i === currentYs[0]) && this.stuckCoolDown < 1) {
      this.stuck = true;
      this.stuckCoolDown = 60;
    } else {
      this.stuck = false;
    }
    if (this.stuckCoolDown > 0) {
      if (this.stuckCoolDown > 30) {
        dir = ({
          "left": "right",
          "right": "left",
          "up": "down",
          "down": "up"
        })[dir];
      } else {
        dir = ({
          "left": "up",
          "right": "down",
          "up": "left",
          "down": "right"
        })[dir];
      }
    }
    if (dir === "right") {
      this.sprite.setVelocityX(-60);
      this.sprite.setVelocityY(0);
    } else if (dir === "left") {
      this.sprite.setVelocityX(60);
      this.sprite.setVelocityY(0);
    } else if (dir === "up") {
      this.sprite.setVelocityX(0);
      this.sprite.setVelocityY(60);
    } else if (dir === "down") {
      this.sprite.setVelocityX(0);
      this.sprite.setVelocityY(-60);
    }
  }
}
let config = {
  type: Phaser.CONFIG,
  width: 600,
  height: 600,
  physics: {
    default: 'arcade',
    arcade: {
      gravity: {
        x: 0,
        y: 0
      }
    }
  },
  scene: {
    preload,
    create,
    update
  }
}
let game = new Phaser.Game(config);

function preload() {
  this.load.spritesheet("pacman", "assets/pacmanSheet.png", {
    frameWidth: 20,
    frameHeight: 20
  })
  this.load.image("dot", "assets/dot.png");
  this.load.image("wallvertical", "assets/wallvertical.png");
  this.load.image("wallhorizontal", "assets/wallhorizontal.png");
  this.load.image("ghostbox", "assets/ghostbox.png");
  this.load.image("wallhorizontalbar", "assets/wallhorizontalbar.png");
  this.load.image("wallverticalbar", "assets/wallverticalbar.png");
  this.load.image("ghost", "assets/ghost.png")
}

function create() {
  player = this.physics.add.sprite(300, 380, "pacman");
  player.currentDir = "None";
  cursors = this.input.keyboard.createCursorKeys();
  dots = this.physics.add.group();
  walls = this.physics.add.staticGroup();
  inky = new Ghost(this);
  walls.create(450, 200, "wallvertical");
  walls.create(400, 200, "wallhorizontal");
  walls.create(150, 200, "wallvertical");
  walls.create(200, 200, "wallhorizontal");
  walls.create(300, 100, "wallhorizontal");
  walls.create(300, 150, "wallvertical");
  walls.create(450, 350, "wallvertical");
  walls.create(150, 350, "wallvertical");
  walls.create(300, 400, "wallhorizontal");
  walls.create(300, 450, "wallvertical");
  walls.create(450, 500, "wallhorizontal");
  walls.create(150, 500, "wallhorizontal");
  walls.create(450, 100, "wallhorizontal");
  walls.create(150, 100, "wallhorizontal");
  walls.create(300, 20, "wallhorizontalbar");
  walls.create(0, 125, "wallverticalbar");
  walls.create(600, 125, "wallverticalbar");
  walls.create(300, 580, "wallhorizontalbar");
  walls.create(0, 455, "wallverticalbar");
  walls.create(600, 455, "wallverticalbar");
  walls.create(64, 455, "wallvertical");
  walls.create(64, 125, "wallvertical");
  walls.create(540, 455, "wallvertical");
  walls.create(540, 125, "wallvertical");
  let ghostbox = this.physics.add.staticSprite(300, 300, "ghostbox");
  this.physics.add.collider(player, walls);
  this.physics.add.collider(player, ghostbox);
  this.physics.add.overlap(player, dots, (player, dot) => {
    dot.destroy();
  }, null, this);
  this.physics.add.overlap(walls, dots, (wall, dot) => {
    dot.destroy();
  }, null, this);
  this.physics.add.overlap(ghostbox, dots, (wall, dot) => {
    dot.destroy();
  }, null, this);
  for (let i = 0; i < 45; i++) {
    for (let j = 0; j < 45; j++) {
      dots.create(i * 32 + 4, j * 32 + 4, "dot");
    }
  }
  this.anims.create({
    key: 'right',
    frames: this.anims.generateFrameNumbers('pacman', {
      start: 0,
      end: 1
    }),
    frameRate: 5,
    repeat: -1
  });
  this.anims.create({
    key: 'left',
    frames: this.anims.generateFrameNumbers('pacman', {
      start: 2,
      end: 3
    }),
    frameRate: 5,
    repeat: -1
  });
  this.anims.create({
    key: 'up',
    frames: this.anims.generateFrameNumbers('pacman', {
      start: 4,
      end: 5
    }),
    frameRate: 5,
    repeat: -1
  });
  this.anims.create({
    key: 'down',
    frames: this.anims.generateFrameNumbers('pacman', {
      start: 6,
      end: 7
    }),
    frameRate: 5,
    repeat: -1
  });
}

function update() {
  if (cursors.left.isDown) {
    player.currentDir = "Left";
  } else if (cursors.right.isDown) {
    player.currentDir = "Right";
  } else if (cursors.up.isDown) {
    player.currentDir = "Up";
  } else if (cursors.down.isDown) {
    player.currentDir = "Down";
  }
  switch (player.currentDir) {
    case "Left":
      player.setVelocityX(-100);
      player.setVelocityY(0);
      player.anims.play("left", true);
      break;
    case "Right":
      player.setVelocityX(100);
      player.setVelocityY(0);
      player.anims.play("right", true);
      break;
    case "Up":
      player.setVelocityY(-100);
      player.setVelocityX(0);
      player.anims.play("up", true);
      break;
    case "Down":
      player.setVelocityY(100);
      player.setVelocityX(0);
      player.anims.play("down", true);
      break;
  }
  if (player.x < 0) {
    player.x = 600;
  } else if (player.x > 600) {
    player.x = 0;
  }
  if (player.y < 0) {
    player.y = 600;
  } else if (player.y > 600) {
    player.y = 0;
  }
  inky.move();
  console.log(inky.stuck)
}
