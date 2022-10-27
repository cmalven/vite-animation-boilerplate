import ReactDOM from 'react-dom/client';
import React, { StrictMode } from 'react';
import { Canvas } from '@react-three/fiber';
import ReactThreeExperience from './components/ReactThreeExperience';

/**
 * Boilerplate module using React Three Fiber
 */

class ReactThreeExample {
  // Container
  container: Element | null;

  // React
  root?: ReactDOM.Root | null;

  // Settings
  settings = {
    scalePeriod: 1000,
  };

  constructor(containerSelector = '[data-app-container]') {
    this.container = document.querySelector(containerSelector);

    this.init();
  }

  init = () => {
    this.createGui();
    this.createApp();
    this.render();
  };

  createGui = () => {
    if (!window.APP.gui) return;

    const folder = window.APP.gui.setFolder('ReactThreeExample');
    folder.open();

    window.APP.gui.add(this.settings, 'scalePeriod', 0.5, 20);
  };

  createApp = () => {
    this.root = ReactDOM.createRoot(this.container as Element);
  };

  render = () => {
    if (!this.root) return;

    this.root.render(
      <StrictMode>
        <Canvas>
          <ReactThreeExperience />
        </Canvas>,
      </StrictMode>,
    );
  };
}

export default ReactThreeExample;
