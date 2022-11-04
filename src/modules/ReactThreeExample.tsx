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

  constructor(containerSelector = '[data-app-container]') {
    this.container = document.querySelector(containerSelector);

    this.init();
  }

  init = () => {
    this.createApp();
    this.render();
  };

  createApp = () => {
    this.root = ReactDOM.createRoot(this.container as Element);
  };

  render = () => {
    if (!this.root) return;

    this.root.render(
      <StrictMode>
        <Canvas camera={{ position: [0, 1.5, 5] }}>
          <ReactThreeExperience />
        </Canvas>,
      </StrictMode>,
    );
  };
}

export default ReactThreeExample;
