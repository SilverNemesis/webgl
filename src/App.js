import React from 'react';
import ColoredSquareScene from './ColoredSquareScene';

class App extends React.Component {
  constructor(props) {
    super(props);
    this.renderCanvas = this.renderCanvas.bind(this);
    this.scene = new ColoredSquareScene();
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
      this.scene.initScene(this.gl);
      this.frame = window.requestAnimationFrame(this.renderCanvas);
    }
  }

  componentWillUnmount() {
    window.cancelAnimationFrame(this.frame);
  }

  renderCanvas(timeStamp) {
    if (!this.timeStamp) {
      this.timeStamp = timeStamp;
    }
    timeStamp *= 0.001;
    const deltaTime = timeStamp - this.timeStamp;
    this.timeStamp = timeStamp;
    this.scene.drawScene(this.gl, deltaTime);
    this.frame = window.requestAnimationFrame(this.renderCanvas);
  }

  render() {
    return (
      <div className="screen">
        <canvas className="canvas" ref={elem => this.canvas = elem}></canvas>
      </div>
    );
  }
}

export default App;
