import { Curtains, Plane } from 'curtainsjs';
import vertShader from './shaders/curtainsExampleVert.glsl?raw';
import fragShader from './shaders/curtainsExampleFrag.glsl?raw';

/**
 * Boilerplate module using Curtains.js
 */

class CurtainsExample {
  constructor(options = {
    containerSelector: '[data-app-container]',
  }) {
    this.options = options;
    this.container = document.querySelector(this.options.containerSelector);

    // Mouse
    this.currentMouse = { x: 0, y: 0 };
    this.targetMouse = { x: 0, y: 0 };

    // Settings
    this.settings = {
      distortPeriod: 35,
      distortStrength: 25,
      mouseEase: 0.05,
    };

    this.init();
  }

  init = () => {
    this.createGui();
    this.createMarkup();
    this.addEventListeners();
    this.setup();
  }

  createGui = () => {
    if (!window.APP.gui) return;

    const folder = window.APP.gui.setFolder('CurtainsExample');
    folder.open();

    window.APP.gui.add(this.settings, 'distortPeriod', 10, 50);
    window.APP.gui.add(this.settings, 'distortStrength', 5, 100);
    window.APP.gui.add(this.settings, 'mouseEase', 0.001, 1);
  }

  createMarkup = () => {
    const div = document.createElement('div');
    div.classList.add('curtains-plane-container');
    div.setAttribute('data-plane-container', true);
    div.innerHTML = `
      <img src="/assets/chicago.jpg" alt="" crossorigin="" />
    `;
    document.body.appendChild(div);
  }

  setup = () => {
    this.curtains = new Curtains({
      container: this.container,
      watchScroll: false,
      pixelRatio: Math.max(1.5, window.devicePixelRatio),
    });

    const planeElement = document.querySelector('[data-plane-container]');

    const params = {
      vertexShader: vertShader,
      fragmentShader: fragShader,
      widthSegments: 20,
      heightSegments: 1,
      uniforms: {
        time: {
          name: 'uTime',
          type: '1f',
          value: 0,
        },
        mouse: {
          name: 'uMouse',
          type: '2f',
          value: [this.currentMouse.x, this.currentMouse.y],
        },
        distortPeriod: {
          name: 'uDistortPeriod',
          type: '1f',
          value: this.settings.distortPeriod,
        },
        distortStrength: {
          name: 'uDistortStrength',
          type: '1f',
          value: this.settings.distortStrength,
        },
      },
    };

    this.plane = new Plane(this.curtains, planeElement, params);

    this.plane.onRender(this.update);
  }

  addEventListeners = () => {
    document.body.addEventListener('mousemove', this.onMouseMove);
  }

  onMouseMove = evt => {
    const w = window.innerWidth;
    const h = window.innerHeight;
    this.targetMouse = {
      x: (evt.clientX / w) * 2 - 1,
      y: -(evt.clientY / h) * 2 + 1,
    };
  }

  updateMouse = () => {
    const mouseDiffX = (this.targetMouse.x - this.currentMouse.x) * this.settings.mouseEase;
    const mouseDiffY = (this.targetMouse.y - this.currentMouse.y) * this.settings.mouseEase;

    this.currentMouse.x += mouseDiffX;
    this.currentMouse.y += mouseDiffY;
  }

  update = () => {
    if (window.APP.stats) window.APP.stats.begin();

    this.plane.uniforms.time.value++;

    // Update every uniform with a matching setting
    Object.entries(this.plane.uniforms).forEach(([name]) => {
      if (this.settings[name]) {
        this.plane.uniforms[name].value = this.settings[name];
      }
    });

    // Update mouse uniform
    this.updateMouse();
    this.plane.uniforms.mouse.value = [this.currentMouse.x, this.currentMouse.y];

    if (window.APP.stats) window.APP.stats.end();
  }
}

export default CurtainsExample;
