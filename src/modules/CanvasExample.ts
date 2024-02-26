
/**
 * Boilerplate module using canvas
 */

type MousePosition = { x: number, y: number }

type Window = {
  ratio: number,
  width: number,
  height: number,
}

class CanvasExample {
  // Container
  container: HTMLElement | null;

  // Canvas
  canvas?: HTMLCanvasElement;
  ctx?: CanvasRenderingContext2D | null;

  // Window ratio
  window: Window = {
    ratio: 0,
    width: 0,
    height: 0,
  };

  // Items
  item = {
    size: 100,
    scale: 1,
  };

  // Set the size
  width = 1000;

  targetMouse: MousePosition = { x: 0, y: 0 };
  currentMouse: MousePosition = { x: 0, y: 0 };

  // Time
  lastTime = performance.now() / 1000;
  time = 0;

  // Settings
  settings = {
    mouseEase: 0.3,
    scalePeriod: 5,
  };

  constructor(containerSelector = '[data-app-container]') {
    this.container = document.querySelector(containerSelector);

    this.init();
  }

  init = () => {
    this.createGui();
    this.addEventListeners();
    this.createCanvas();
    this.update();
  };
  
  addEventListeners = () => {
    window.addEventListener('mousemove', this.onMouseMove);
  };
  
  onMouseMove = (evt: MouseEvent) => {
    this.targetMouse = { x: evt.pageX, y: evt.pageY };
  };

  createGui = () => {
    if (!window.APP.gui) return;

    const folder = window.APP.gui.setFolder('CanvasExample');
    folder.open();

    window.APP.gui.add(this.settings, 'mouseEase', 0.01, 0.8);
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

    this.window.width = window.innerWidth;
    this.window.height = window.innerHeight;
    this.window.ratio = this.window.height / this.window.width;
    const height = this.width * this.window.ratio;

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
    this.ctx.arc(this.mouseToCanvas().x, this.mouseToCanvas().y, this.item.size * this.item.scale, 0, 2 * Math.PI);
    this.ctx.fill();
  };
  
  updateMouse = () => {
    const diffX = (this.targetMouse.x - this.currentMouse.x) * this.settings.mouseEase;
    const diffY = (this.targetMouse.y - this.currentMouse.y) * this.settings.mouseEase;
    this.currentMouse.x += diffX;
    this.currentMouse.y += diffY;
  };

  mouseToCanvas = (): { x: number, y: number } => {
    if (!this.canvas) return { x: 0, y: 0 };
    const ratioX = this.canvas.width / this.window.width;
    const ratioY = this.canvas.height / this.window.height;
    return {
      x: this.currentMouse.x * ratioX,
      y: this.currentMouse.y * ratioY,
    };
  };

  update = () => {
    if (window.APP.stats) window.APP.stats.begin();

    // Update time
    const now = performance.now() / 1000;
    this.time += now - this.lastTime;
    this.lastTime = now;

    // Update + draw
    this.clear();
    this.updateMouse();
    this.updateItems();

    if (window.APP.stats) window.APP.stats.end();

    window.requestAnimationFrame(this.update);
  };
}

export default CanvasExample;
