export function particles(canvasId) {
  const canvasElement = <HTMLCanvasElement>document.getElementById(canvasId),
    context = canvasElement.getContext('2d'),
    options = {
      backgroundColor: '#1b212d',
      defaultSpeed: 0.1,
      addedSpeed: 1,
      particleAmount: 30,
      iconDiameter: 50,
      iconSpriteCount: 4
    },
    sprite = document.createElement('img'),
    particles: Particle[] = [];
  let w, h;

  function resize() {
    w = canvasElement.width = window.innerWidth;
    h = canvasElement.height = window.innerHeight;
  }

  class Particle {
    x: number;
    y: number;
    speed: number;
    directionAngle: number;
    randomIconNumber: number;
    d: {
      x: number;
      y: number;
    };

    constructor(xPos, yPos) {
      this.x = xPos || Math.random() * w;
      this.y = yPos || Math.random() * h;
      this.speed = options.defaultSpeed + Math.random() * options.addedSpeed;
      this.directionAngle = Math.floor(Math.random() * 360);
      this.d = {
        x: Math.cos(this.directionAngle) * this.speed,
        y: Math.sin(this.directionAngle) * this.speed
      };
      this.randomIconNumber = Math.floor(Math.random() * options.iconSpriteCount);
    }

    update() {
      this.x += this.d.x;
      this.y += this.d.y;
      this.border();
    }

    border() {
      if (this.x >= w || this.x + options.iconDiameter <= 0) {
        this.d.x *= -1;
      }
      if (this.y >= h || this.y + options.iconDiameter <= 0) {
        this.d.y *= -1;
      }
      this.x = this.x > w ? w : this.x;
      this.y = this.y > h ? h : this.y;
    }

    draw() {
      context.drawImage(sprite, this.randomIconNumber * options.iconDiameter, 0, options.iconDiameter, options.iconDiameter, this.x, this.y, options.iconDiameter, options.iconDiameter);
    }
  }

  function init() {
    sprite.src = require('../../img/sprite.png');
    sprite.onload = () => {
      resize();
      for (let i = 0; i < options.particleAmount; i++) {
        particles.push(new Particle(null, null));
      }
      loop();
    };
  }


  function loop() {
    context.fillStyle = options.backgroundColor;
    context.fillRect(0, 0, w, h);
    const particlesLength = particles.length;
    for (let i = 0; i < particlesLength; i++) {
      particles[ i ].draw();
      particles[ i ].update();
    }
    window.requestAnimationFrame(loop);
  }

  canvasElement.addEventListener('click', (e) => {
    particles.push(new Particle(e.clientX, e.clientY));
  });
  window.addEventListener('resize', resize);


  return {
    init: init
  }
}
