import React from 'react';
import Message from './Message';
import Controls from './Controls';
import SceneManager from '../lib/SceneManager';

class App extends React.Component {
  constructor(props) {
    super(props);
    this.onResize = this.onResize.bind(this);
    this.onKeyDown = this.onKeyDown.bind(this);
    this.onKeyUp = this.onKeyUp.bind(this);
    this.onMouseMove = this.onMouseMove.bind(this);
    this.onLockChange = this.onLockChange.bind(this);
    this.onClickCanvas = this.onClickCanvas.bind(this);
    this.onChange = this.onChange.bind(this);
    this.onClickPrevious = this.onClickPrevious.bind(this);
    this.onClickNext = this.onClickNext.bind(this);
    this.onAnimationFrame = this.onAnimationFrame.bind(this);
    this.state = {
      showControls: false
    }
    this.keys = {};
  }

  componentDidMount() {
    this.sceneManager = new SceneManager(this.canvas);
    const scene = this.sceneManager.getScene();
    const note = scene.mouseMovement ? 'Click the canvas to explore the scene' : undefined;
    this.setState({ scene, note });
    this.canvas.requestPointerLock = this.canvas.requestPointerLock || this.canvas.mozRequestPointerLock;
    this.frame = window.requestAnimationFrame(this.onAnimationFrame);
    window.addEventListener('resize', this.onResize);
    window.addEventListener('keydown', this.onKeyDown);
    window.addEventListener('keyup', this.onKeyUp);
    document.addEventListener('pointerlockchange', this.onLockChange);
    document.addEventListener('mozpointerlockchange', this.onLockChange);
    this.showMessage(['Press Escape to toggle menu', 'Press Page Up for previous screen', 'Press Page Down for next screen']);
  }

  componentWillUnmount() {
    window.cancelAnimationFrame(this.frame);
    window.removeEventListener('resize', this.onResize);
    window.removeEventListener('keydown', this.onKeyDown);
    window.removeEventListener('keyup', this.onKeyUp);
    document.removeEventListener('pointerlockchange', this.onLockChange);
    document.removeEventListener('mozpointerlockchange', this.onLockChange);
  }

  onResize() {
    this.sceneManager.resizeViewport();
  }

  onKeyDown(event) {
    event.preventDefault();
    if (!this.keys[event.key]) {
      this.onKeyPress(event.key);
      this.keys[event.key] = true;
      if (this.captureKeys) {
        this.state.scene.keyboardState(this.keys);
      }
    }
  }

  onKeyUp(event) {
    event.preventDefault();
    this.keys[event.key] = false;
    if (this.captureKeys) {
      this.state.scene.keyboardState(this.keys);
    }
  }

  onKeyPress(key) {
    if (key === 'Escape') {
      if (this.messageTimer) {
        this.cancelMessage();
      } else {
        this.setState({ showControls: !this.state.showControls });
      }
    } else if (key === 'PageUp') {
      const scene = this.sceneManager.previousScene();
      const note = scene.mouseMovement ? 'Click the canvas to explore the scene' : undefined;
      this.setState({ scene, note });
    } else if (key === 'PageDown') {
      const scene = this.sceneManager.nextScene();
      const note = scene.mouseMovement ? 'Click the canvas to explore the scene' : undefined;
      this.setState({ scene, note });
    }
  }

  onMouseMove(event) {
    this.state.scene.mouseMovement(event.movementX, event.movementY);
  }

  onLockChange(event) {
    event.preventDefault();
    if (document.pointerLockElement === this.canvas || document.mozPointerLockElement === this.canvas) {
      document.addEventListener("mousemove", this.onMouseMove);
      this.captureMouse = true;
      if (this.state.scene.keyboardState) {
        this.captureKeys = true;
      }
    } else {
      document.removeEventListener("mousemove", this.onMouseMove);
      this.captureMouse = false;
      this.captureKeys = false;
      this.forceUpdate();
    }
  }

  onClickCanvas(event) {
    event.preventDefault();
    if (this.state.scene.mouseMovement) {
      this.canvas.requestPointerLock();
      this.setState({ showControls: false, note: undefined });
    }
  }

  onChange(control, value) {
    if (value !== control.value) {
      this.state.scene.setOption(control.name, value);
      this.forceUpdate();
    }
  }

  onClickPrevious(event) {
    event.preventDefault();
    const scene = this.sceneManager.previousScene();
    const note = scene.mouseMovement ? 'Click the canvas to explore the scene' : undefined;
    this.setState({ scene, note });
  }

  onClickNext(event) {
    event.preventDefault();
    const scene = this.sceneManager.nextScene();
    const note = scene.mouseMovement ? 'Click the canvas to explore the scene' : undefined;
    this.setState({ scene, note });
  }

  showMessage(message) {
    this.setState({ message });
    this.messageTimer = setTimeout(this.clearMessage.bind(this), 10000);
  }

  clearMessage() {
    this.setState({ message: undefined });
    this.messageTimer = undefined;
  }

  cancelMessage() {
    clearTimeout(this.messageTimer);
    this.clearMessage();
  }

  onAnimationFrame(timeStamp) {
    this.sceneManager.renderScene(timeStamp);
    this.frame = window.requestAnimationFrame(this.onAnimationFrame);
  }

  render() {
    return (
      <div className="screen">
        <canvas id="canvas" ref={elem => this.canvas = elem} onClick={this.onClickCanvas}></canvas>
        {this.state.note ? (<div id="note">{this.state.note}</div>) : null}
        <Message message={this.state.message} />
        <Controls show={this.state.showControls} onClickPrevious={this.onClickPrevious} onClickNext={this.onClickNext} onChange={this.onChange} options={this.state.scene ? this.state.scene.options : undefined} />
      </div>
    );
  }
}

export default App;
