import React from 'react';
import ColoredSquareScene from './ColoredSquareScene';
import ColoredCubeScene from './ColoredCubeScene';
import TexturedCubeScene from './TexturedCubeScene';
import LightedCubeScene from './LightedCubeScene';
import MazeScene from './MazeScene';

class App extends React.Component {
  constructor(props) {
    super(props);
    this.onClickCanvas = this.onClickCanvas.bind(this);
    this.renderCanvas = this.renderCanvas.bind(this);
    this.scenes = [
      { init: false, render: new ColoredSquareScene() },
      { init: false, render: new ColoredCubeScene() },
      { init: false, render: new TexturedCubeScene() },
      { init: false, render: new LightedCubeScene() },
      { init: false, render: new MazeScene() }
    ];
    this.sceneIndex = this.scenes.length - 1;
  }

  componentDidMount() {
    const canvas = this.canvas;
    const rect = canvas.getBoundingClientRect()
    canvas.width = rect.width;
    canvas.height = rect.height;
    this.gl = canvas.getContext('webgl');
    if (this.gl === null) {
      alert("Unable to initialize WebGL. Your browser or machine may not support it.");
    } else {
      const scene = this.scenes[this.sceneIndex];
      if (!scene.init) {
        scene.init = true;
        scene.render.initScene(this.gl);
      }
      this.frame = window.requestAnimationFrame(this.renderCanvas);
    }
  }

  componentWillUnmount() {
    window.cancelAnimationFrame(this.frame);
  }

  onClickCanvas(event) {
    event.preventDefault();
    this.sceneIndex = (this.sceneIndex + 1) % this.scenes.length;
    const scene = this.scenes[this.sceneIndex];
    if (!scene.init) {
      scene.init = true;
      scene.render.initScene(this.gl);
    }
  }

  renderCanvas(timeStamp) {
    if (!this.timeStamp) {
      this.timeStamp = timeStamp;
    }
    timeStamp *= 0.001;
    const deltaTime = timeStamp - this.timeStamp;
    this.timeStamp = timeStamp;
    const scene = this.scenes[this.sceneIndex];
    scene.render.drawScene(this.gl, deltaTime);
    this.frame = window.requestAnimationFrame(this.renderCanvas);
  }

  render() {
    return (
      <div className="screen">
        <canvas className="canvas" ref={elem => this.canvas = elem} onClick={this.onClickCanvas}></canvas>
      </div>
    );
  }
}

export default App;