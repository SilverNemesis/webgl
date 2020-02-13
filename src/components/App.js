import React from 'react';
import Message from './Message';
import Controls from './Controls';
import SceneManager from './SceneManager';

class App extends React.Component {
  constructor(props) {
    super(props);
    this.onResize = this.onResize.bind(this);
    this.onKeyDown = this.onKeyDown.bind(this);
    this.onKeyUp = this.onKeyUp.bind(this);
    this.onClickPrevious = this.onClickPrevious.bind(this);
    this.onClickNext = this.onClickNext.bind(this);
    this.onAnimationFrame = this.onAnimationFrame.bind(this);
    this.state = {
      showControls: false,
      keys: []
    }
  }

  componentDidMount() {
    this.sceneManager = new SceneManager(this.canvas);
    this.frame = window.requestAnimationFrame(this.onAnimationFrame);
    window.addEventListener('resize', this.onResize);
    window.addEventListener('keydown', this.onKeyDown);
    window.addEventListener('keyup', this.onKeyUp);
    this.showMessage(['Press Escape to toggle menu', 'Press Page Up for previous screen', 'Press Page Down for next screen']);
  }

  componentWillUnmount() {
    window.cancelAnimationFrame(this.frame);
    window.removeEventListener('resize', this.onResize);
    window.removeEventListener('keydown', this.onKeyDown);
    window.removeEventListener('keyup', this.onKeyUp);
  }

  onResize() {
    this.sceneManager.resizeViewport();
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
      if (this.messageTimer) {
        this.cancelMessage();
      } else {
        this.setState({ showControls: !this.state.showControls });
      }
    } else if (key === 'PageUp') {
      this.sceneManager.previousScene();
    } else if (key === 'PageDown') {
      this.sceneManager.nextScene();
    }
  }

  onClickPrevious(event) {
    event.preventDefault();
    this.sceneManager.previousScene();
  }

  onClickNext(event) {
    event.preventDefault();
    this.sceneManager.nextScene();
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
        <canvas id="canvas" ref={elem => this.canvas = elem}></canvas>
        <Message message={this.state.message} />
        <Controls show={this.state.showControls}>
          <span className="left" onClick={this.onClickPrevious}>❮ PREV</span>
          <span className="right" onClick={this.onClickNext}>NEXT ❯</span>
        </Controls>
      </div>
    );
  }
}

export default App;