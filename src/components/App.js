import React from 'react';
import ColoredSquareScene from '../scenes/ColoredSquareScene';
import ColoredCubeScene from '../scenes/ColoredCubeScene';
import TexturedCubeScene from '../scenes/TexturedCubeScene';
import LightedCubeScene from '../scenes/LightedCubeScene';
import MazeScene from '../scenes/MazeScene';
import BrickWallScene from '../scenes/BrickWallScene';
import MaterialScene from '../scenes/MaterialScene';

class App extends React.Component {
  constructor(props) {
    super(props);
    this.onResize = this.onResize.bind(this);
    this.onKeyDown = this.onKeyDown.bind(this);
    this.onKeyUp = this.onKeyUp.bind(this);
    this.onClickPrevious = this.onClickPrevious.bind(this);
    this.onClickNext = this.onClickNext.bind(this);
    this.renderCanvas = this.renderCanvas.bind(this);
    this.scenes = [
      { init: false, render: new ColoredSquareScene() },
      { init: false, render: new ColoredCubeScene() },
      { init: false, render: new TexturedCubeScene() },
      { init: false, render: new LightedCubeScene() },
      { init: false, render: new MazeScene() },
      { init: false, render: new BrickWallScene() },
      { init: false, render: new MaterialScene() }
    ];
    this.sceneIndex = this.scenes.length - 1;
    this.state = {
      showControls: false,
      keys: []
    }
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
      this.gl.viewport(0, 0, canvas.width, canvas.height);
      this.gl.enable(this.gl.CULL_FACE);
      this.gl.cullFace(this.gl.BACK);
      const scene = this.scenes[this.sceneIndex];
      if (!scene.init) {
        scene.init = true;
        scene.render.initScene(this.gl);
      }
      this.frame = window.requestAnimationFrame(this.renderCanvas);
    }
    window.addEventListener('resize', this.onResize);
    window.addEventListener('keydown', this.onKeyDown);
    window.addEventListener('keyup', this.onKeyUp);
  }

  componentWillUnmount() {
    window.cancelAnimationFrame(this.frame);
    window.removeEventListener('resize', this.onResize);
    window.removeEventListener('keydown', this.onKeyDown);
    window.removeEventListener('keyup', this.onKeyUp);
  }

  onResize() {
    const canvas = this.canvas;
    const rect = canvas.getBoundingClientRect()
    canvas.width = rect.width;
    canvas.height = rect.height;
    this.gl.viewport(0, 0, canvas.width, canvas.height);
  }

  onKeyDown(event) {
    event.preventDefault();
    if (this.state.keys.indexOf(event.key) === -1) {
      this.onKeyPress(event.key);
      this.setState({ keys: [event.key, ...this.state.keys] });
    }
  }

  onKeyUp(event) {
    event.preventDefault();
    this.setState({ keys: this.state.keys.filter((v) => v !== event.key) });
  }

  onKeyPress(key) {
    if (key === 'Escape') {
      this.setState({ showControls: !this.state.showControls });
    } else if (key === 'PageUp') {
      this.previousScene();
    } else if (key === 'PageDown') {
      this.nextScene();
    }
    else {
      console.log(key);
    }
  }

  onClickPrevious(event) {
    event.preventDefault();
    this.previousScene();
  }

  onClickNext(event) {
    event.preventDefault();
    this.nextScene();
  }

  previousScene() {
    this.sceneIndex = (this.sceneIndex - 1) % this.scenes.length;
    if (this.sceneIndex < 0) {
      this.sceneIndex = this.scenes.length - 1;
    }
    const scene = this.scenes[this.sceneIndex];
    if (!scene.init) {
      scene.init = true;
      scene.render.initScene(this.gl);
    }
  }

  nextScene() {
    this.sceneIndex = (this.sceneIndex + 1) % this.scenes.length;
    const scene = this.scenes[this.sceneIndex];
    if (!scene.init) {
      scene.init = true;
      scene.render.initScene(this.gl);
    }
  }

  renderCanvas(timeStamp) {
    timeStamp *= 0.001;
    if (!this.timeStamp) {
      this.timeStamp = timeStamp;
    }
    const deltaTime = timeStamp - this.timeStamp;
    this.timeStamp = timeStamp;
    const scene = this.scenes[this.sceneIndex];
    scene.render.drawScene(this.gl, deltaTime);
    this.frame = window.requestAnimationFrame(this.renderCanvas);
  }

  render() {
    return (
      <div className="screen">
        <canvas id="canvas" ref={elem => this.canvas = elem}></canvas>
        <div id="overlay" hidden={!this.state.showControls}>
          <span className="left" onClick={this.onClickPrevious}>❮ PREV</span>
          <span className="right" onClick={this.onClickNext}>NEXT ❯</span>
        </div>
      </div>
    );
  }
}

export default App;
