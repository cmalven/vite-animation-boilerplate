
/**
 * Boilerplate module using canvas
 */

class CanvasExample {
  // Container
  container: HTMLElement | null;

  // Canvas
  canvas?: HTMLCanvasElement;
  ctx?: CanvasRenderingContext2D | null;

  // Items
  item = {
    size: 100,
    scale: 1,
  };

  // Set the size
  width = 1000;

  // Time
  lastTime = performance.now() / 1000;
  time = 0;

  // Settings
  settings = {
    scalePeriod: 5,
  };

  constructor(containerSelector = '[data-app-container]') {
    this.container = document.querySelector(containerSelector);
    if (!this.container) return;

    this.init();
  }

  init = () => {
    this.createGui();
    this.createCanvas();
    this.update();
  };

  createGui = () => {
    if (!window.APP.gui) return;

    const folder = window.APP.gui.setFolder('CanvasExample');
    folder.open();

    window.APP.gui.add(this.settings, 'scalePeriod', 0.5, 20);
  };

  createCanvas = () => {
    if (!this.container) return;

    this.canvas = document.createElement('canvas');
    this.container.appendChild(this.canvas);
    this.canvas.setAttribute('width', String(this.width));
    this.canvas.setAttribute('height', String(this.width));
    this.ctx = this.canvas.getContext('2d');
    
    // Resize
    window.addEventListener('resize', this.resize);
    this.resize();
  };

  resize = () => {
    if (!this.canvas) return;

    const winRatio = window.innerHeight / window.innerWidth;
    const height = this.width * winRatio;

    this.canvas.width = this.width;
    this.canvas.height = height;
  };

  clear = () => {
    if (!this.canvas || !this.ctx) return;
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
  };

  updateItems = () => {
    if (!this.ctx || !this.canvas) return;

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
  };

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
  };
}

export default CanvasExample;
