
/**
 * Boilerplate module using canvas
 */

class CanvasExample {
  constructor(options = {
    containerSelector: '[data-app-container]',
  }) {
    this.options = options;
    this.container = document.querySelector(this.options.containerSelector);

    // Canvas
    this.canvas = null;
    this.ctx = null;

    // Items
    this.item = {
      size: 100,
      scale: 1,
    };

    // Set the size
    this.width = 1000;

    // Time
    this.lastTime = performance.now() / 1000;
    this.time = 0;

    // Settings
    this.settings = {
      scalePeriod: 5,
    };

    this.init();
  }

  init = () => {
    this.createGui();
    this.createCanvas();
    this.update();
  }

  createGui = () => {
    if (!window.APP.gui) return;

    const folder = window.APP.gui.setFolder('CanvasExample');
    folder.open();

    window.APP.gui.add(this.settings, 'scalePeriod', 0.5, 20);
  }

  createCanvas = () => {
    this.canvas = document.createElement('canvas');
    this.container.appendChild(this.canvas);
    this.canvas.setAttribute('width', this.width);
    this.canvas.setAttribute('height', this.height);
    this.ctx = this.canvas.getContext('2d');
    
    // Resize
    window.addEventListener('resize', this.resize);
    this.resize();
  }

  resize = () => {
    const winRatio = window.innerHeight / window.innerWidth;
    const height = this.width * winRatio;

    this.canvas.width = this.width;
    this.canvas.height = height;
  };

  clear = () => {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
  };

  updateItems = () => {
    // Update scale
    const iteration = this.time + this.settings.scalePeriod;
    const amplitude = 0.3;
    const period = this.settings.scalePeriod;
    this.item.scale = 1 + amplitude * Math.sin((Math.PI * 2) * (iteration / period));

    // Draw
    this.ctx.fillStyle = 'teal';
    this.ctx.beginPath();
    this.ctx.arc(this.canvas.width / 2, this.canvas.height / 2, this.item.size * this.item.scale, 0, 2 * Math.PI);
    this.ctx.fill();
  }

  update = () => {
    if (window.APP.stats) window.APP.stats.begin();

    // Update time
    const now = performance.now() / 1000;
    this.time += now - this.lastTime;
    this.lastTime = now;

    // Update + draw
    this.clear();
    this.updateItems();

    if (window.APP.stats) window.APP.stats.end();

    window.requestAnimationFrame(this.update);
  }
}

export default CanvasExample;
