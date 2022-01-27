import r from 'regl';
const regl = r();

/**
 * Boilerplate module using regl
 */

class ReglExample {
  constructor(options = {
    containerSelector: '[data-app-container]',
  }) {
    this.options = options;
    this.container = document.querySelector(this.options.containerSelector);

    // Canvas
    this.canvas = null;

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
    this.createRegl();
  };

  createGui = () => {
    if (!window.APP.gui) return;

    const folder = window.APP.gui.setFolder('ReglExample');
    folder.open();

    window.APP.gui.add(this.settings, 'scalePeriod', 0.5, 20);
  };

  createCanvas = () => {
    this.canvas = document.createElement('canvas');
    this.container.appendChild(this.canvas);
  };

  createRegl = () => {
    this.draw = regl({
      frag: `
        precision mediump float;
        uniform vec4 color;
        void main () {
          gl_FragColor = color;
        }
     `,

      vert: `
        precision mediump float;
        attribute vec2 position;
        void main () {
          gl_Position = vec4(position, 0, 1);
        }
      `,

      attributes: {
        position: [
          [-1, -1],
          [-1, 1],
          [1, -1],
        ],
      },

      uniforms: {
        color: regl.prop('color'),
      },

      count: 3,
    });

    regl.frame(this.update);
  };

  update = ({ tick }) => {
    if (window.APP.stats) window.APP.stats.begin();

    // Update time
    const now = performance.now() / 1000;
    this.time += now - this.lastTime;
    this.lastTime = now;

    regl.clear({
      color: [0, 0, 0, 1],
    });

    this.draw({
      color: [
        Math.sin(0.02 * (0.001 * tick)),
        Math.cos(0.02 * (0.02 * tick)),
        Math.sin(0.02 * (0.3 * tick)),
        1,
      ],
    });

    if (window.APP.stats) window.APP.stats.end();
  };
}

export default ReglExample;
