import regl from 'regl';
import vertShader from './shaders/regl_example_vert.glsl?raw';
import fragShader from './shaders/regl_example_frag.glsl?raw';

/**
 * Boilerplate module using regl
 */

class ReglExample {
  constructor(options = {
    containerSelector: '[data-app-container]',
  }) {
    this.options = options;
    this.container = document.querySelector(this.options.containerSelector);

    // Pixel ratio
    this.pixelRatio = Math.min(1.5, window.devicePixelRatio);

    // Regl
    this.regl = regl({
      container: this.container,
      pixelRatio: this.pixelRatio,
    });

    // Time
    this.lastTime = performance.now() / 1000;
    this.time = 0;

    // Settings
    this.settings = {
      scalePeriod: 5,
    };

    // Size
    this.resolution = { width: 0, height: 0 };

    // Mouse
    this.mouse = { x: 0, y: 0 };

    this.init();
  }

  init = () => {
    this.createGui();
    this.addEventListeners();
    this.createRegl();
  };

  createGui = () => {
    if (!window.APP.gui) return;

    const folder = window.APP.gui.setFolder('ReglExample');
    folder.open();

    window.APP.gui.add(this.settings, 'scalePeriod', 0.5, 20);
  };

  addEventListeners = () => {
    window.addEventListener('resize', this.onResize);
    window.addEventListener('mousemove', this.onMouseMove);
    window.dispatchEvent(new Event('resize'));
  };

  createRegl = () => {
    const meshSize = 2;

    this.draw = this.regl({
      vert: vertShader,
      frag: fragShader,

      attributes: {
        position: this.createMeshVertices(meshSize),
      },

      uniforms: {
        time: this.regl.prop('time'),
        resolution: this.regl.prop('resolution'),
        mouse: this.regl.prop('mouse'),
      },

      count: meshSize*meshSize*6,
    });

    this.regl.frame(this.update);
  };

  createMeshVertices = (size) => {
    return new Array(size*size).fill(0).reduce((acc, val, idx) => {
      const unitSize = 2 / size;
      const idxX = idx % size;
      const idxY = Math.floor(idx / size);
      const x = -1 + idxX * unitSize;
      const y = -1 + idxY * unitSize;

      return acc.concat([
        [x, y],
        [x, y + unitSize],
        [x + unitSize, y],

        [x + unitSize, y],
        [x, y + unitSize],
        [x + unitSize, y + unitSize],
      ]);
    }, []);
  };

  onResize = () => {
    this.resolution = { width: this.container.offsetWidth * this.pixelRatio, height: this.container.offsetHeight * this.pixelRatio };
  };

  onMouseMove = (evt) => {
    this.mouse = { x: evt.clientX, y: evt.clientY };
  };

  update = ({ tick }) => {
    if (window.APP.stats) window.APP.stats.begin();

    // Update time
    const now = performance.now() / 1000;
    this.time += now - this.lastTime;
    this.lastTime = now;

    this.regl.clear({
      color: [0, 0, 0, 1],
    });

    this.draw({
      time: this.time,
      resolution: [this.resolution.width, this.resolution.height],
      mouse: [this.mouse.x / this.container.offsetWidth, 1 - (this.mouse.y / this.container.offsetHeight)],
    });

    if (window.APP.stats) window.APP.stats.end();
  };
}

export default ReglExample;
