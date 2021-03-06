import React from 'react';
import Message from './Message';
import Controls from './Controls';
import Credits from './Credits';
import SceneManager from '../lib/SceneManager';

const exploreNotes = ['Click the canvas to explore the scene'];
const movementNotes = ['Use the mouse to look', 'Use the WASD keys to move around'];

class App extends React.Component {
  constructor(props) {
    super(props);
    this.onResize = this.onResize.bind(this);
    this.onKeyDown = this.onKeyDown.bind(this);
    this.onKeyUp = this.onKeyUp.bind(this);
    this.onMouseMove = this.onMouseMove.bind(this);
    this.onDataChange = this.onDataChange.bind(this);
    this.onLockChange = this.onLockChange.bind(this);
    this.onClickCanvas = this.onClickCanvas.bind(this);
    this.onChange = this.onChange.bind(this);
    this.onClickPrevious = this.onClickPrevious.bind(this);
    this.onClickNext = this.onClickNext.bind(this);
    this.onClickMessage = this.onClickMessage.bind(this);
    this.onAnimationFrame = this.onAnimationFrame.bind(this);
    this.state = {
      showControls: false
    }
    this.keys = {};
  }

  componentDidMount() {
    this.sceneManager = new SceneManager(this.canvas, this.onDataChange);
    const scene = this.sceneManager.getScene();
    const notes = scene.mouseMovement ? exploreNotes : undefined;
    this.setState({ scene, notes, sceneData: undefined });
    this.canvas.requestPointerLock = this.canvas.requestPointerLock || this.canvas.mozRequestPointerLock;
    document.exitPointerLock = document.exitPointerLock || document.mozExitPointerLock;
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

  cancelLock() {
    this.captureMouse = false;
    this.captureKeys = false;
    document.exitPointerLock();
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
      this.cancelLock();
      this.setState({ sceneData: undefined });
      const scene = this.sceneManager.previousScene();
      const notes = scene.mouseMovement ? exploreNotes : undefined;
      this.setState({ scene, notes });
    } else if (key === 'PageDown') {
      this.cancelLock();
      this.setState({ sceneData: undefined });
      const scene = this.sceneManager.nextScene();
      const notes = scene.mouseMovement ? exploreNotes : undefined;
      this.setState({ scene, notes });
    }
  }

  onMouseMove(event) {
    if (this.captureMouse) {
      this.state.scene.mouseMovement(event.movementX, event.movementY);
    }
  }

  onDataChange(sceneData) {
    this.setState({ sceneData });
  }

  onLockChange(event) {
    event.preventDefault();
    if (document.pointerLockElement === this.canvas || document.mozPointerLockElement === this.canvas) {
      document.addEventListener("mousemove", this.onMouseMove);
      this.captureMouse = true;
      if (this.state.scene.keyboardState) {
        this.captureKeys = true;
      }
      this.setState({ notes: movementNotes });
    } else {
      document.removeEventListener("mousemove", this.onMouseMove);
      this.captureMouse = false;
      this.captureKeys = false;
      this.setState({ notes: undefined });
    }
  }

  onClickCanvas(event) {
    event.preventDefault();
    if (this.state.scene.mouseMovement) {
      this.canvas.requestPointerLock();
      this.setState({ showControls: false, notes: undefined });
    }
  }

  onChange(option, value) {
    if (value !== option.value) {
      this.state.scene.setOption(option, value);
      this.forceUpdate();
    }
  }

  onClickPrevious(event) {
    event.preventDefault();
    this.cancelLock();
    this.setState({ sceneData: undefined });
    const scene = this.sceneManager.previousScene();
    const notes = scene.mouseMovement ? exploreNotes : undefined;
    this.setState({ scene, notes });
  }

  onClickNext(event) {
    event.preventDefault();
    this.cancelLock();
    this.setState({ sceneData: undefined });
    const scene = this.sceneManager.nextScene();
    const notes = scene.mouseMovement ? exploreNotes : undefined;
    this.setState({ scene, notes });
  }

  onClickMessage(event) {
    event.preventDefault();
    if (this.messageTimer) {
      this.cancelMessage();
    }
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
        <div id="note">
          {this.state.notes ? (this.state.notes.map((note, key) => (<div key={key}>{note}</div>))) : null}
          {this.state.sceneData && this.state.sceneData.total ? (<div>{this.state.sceneData.collected}/{this.state.sceneData.total} power-ups collected</div>) : null}
        </div>
        <Message message={this.state.message} onClick={this.onClickMessage} />
        <Controls show={this.state.showControls} onClickPrevious={this.onClickPrevious} onClickNext={this.onClickNext} onChange={this.onChange} options={this.state.scene ? this.state.scene.options : undefined} />
        <Credits show={this.state.showControls} credits={this.state.scene ? this.state.scene.credits : undefined} />
      </div>
    );
  }
}

export default App;
