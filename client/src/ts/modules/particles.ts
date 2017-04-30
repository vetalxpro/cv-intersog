export function particles(canvasId) {
  const canvasElement = <HTMLCanvasElement>document.getElementById(canvasId),
    canvas = canvasElement.getContext('2d'),
    options = {
      backgroundColor: '#1b212d',
      particleColor: '#fcfcfc',
      defaultSpeed: 0.1,
      addedSpeed: 1,
      defaultRadius: 1,
      addedRadius: 1,
      particleAmount: 40,
      communicationRadius: 150,
      lineWidth: 0.5,
      lineColor: 'rgba(255,255,255,opacity)'
    },
    particles: Particle[] = [];
  let w = canvasElement.width = window.innerWidth,
    h = canvasElement.height = window.innerHeight;
  class Particle {
    x: number;
    y: number;
    speed: number;
    directionAngle: number;
    radius: number;
    color: string;
    d: {
      x: number;
      y: number;
    };

    constructor(xPos, yPos, options) {
      this.x = xPos || Math.random() * w;
      this.y = yPos || Math.random() * h;
      this.speed = options.defaultSpeed + Math.random() * options.addedSpeed;
      this.directionAngle = Math.floor(Math.random() * 360);
      this.color = options.particleColor;
      this.radius = options.defaultRadius + Math.random() * options.addedRadius;
      this.d = {
        x: Math.cos(this.directionAngle) * this.speed,
        y: Math.sin(this.directionAngle) * this.speed
      };
    }

    update() {
      this.x += this.d.x;
      this.y += this.d.y;
      this.border();
    }

    border() {
      if (this.x >= w || this.x <= 0) {
        this.d.x *= -1;
      }
      if (this.y >= h || this.y <= 0) {
        this.d.y *= -1;
      }
      this.x > w ? this.x = w : this.x;
      this.x < 0 ? this.x = 0 : this.x;
      this.y > h ? this.y = h : this.y;
      this.y < 0 ? this.y = 0 : this.y;
    }

    draw() {
      canvas.beginPath();
      canvas.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
      canvas.closePath();
      canvas.fillStyle = this.color;
      canvas.fill();
    }
  }

  function checkDistance(x1, y1, x2, y2) {
    const x = x2 - x1,
      y = y2 - y1;
    return Math.sqrt((x * x) + (y * y));
  }

  function setup() {
    for (let i = 0; i < options.particleAmount; i++) {
      particles.push(new Particle(null, null, options));
    }
    loop();
  }


  function communicatePoints(point, parent) {
    for (let i = 0; i < parent.length; i++) {
      const distance = checkDistance(point.x, point.y, parent[ i ].x, parent[ i ].y);
      const opacity = 1 - distance / options.communicationRadius;
      if (opacity > 0) {
        canvas.lineWidth = options.lineWidth;
        canvas.strokeStyle = options.lineColor.replace('opacity', opacity + '');
        canvas.beginPath();
        canvas.moveTo(point.x, point.y);
        canvas.lineTo(parent[ i ].x, parent[ i ].y);
        canvas.closePath();
        canvas.stroke();
      }
    }
  }

  function loop() {
    canvas.fillStyle = options.backgroundColor;
    canvas.fillRect(0, 0, w, h);
    const particlesLength = particles.length;
    for (let i = 0; i < particlesLength; i++) {
      particles[ i ].update();
      particles[ i ].draw();
      communicatePoints(particles[ i ], particles);
    }
    window.requestAnimationFrame(loop);
  }

  canvasElement.addEventListener('click', (e) => {
    particles.push(new Particle(e.pageX, e.pageY, options));
  });
  window.addEventListener('resize', () => {
    w = canvasElement.width = window.innerWidth;
    h = canvasElement.height = window.innerHeight;
  });

  return {
    init: setup
  }
}
