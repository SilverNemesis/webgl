import ColoredCubeScene from '../scenes/ColoredCubeScene';
import TexturedCubeScene from '../scenes/TexturedCubeScene';
import LightedCubeScene from '../scenes/LightedCubeScene';
import MazeScene from '../scenes/MazeScene';
import BrickWallScene from '../scenes/BrickWallScene';
import MaterialScene from '../scenes/MaterialScene';
import RoomScene from '../scenes/RoomScene';

class SceneManager {
  constructor(canvas) {
    this.canvas = canvas;

    this.resizeViewport = this.resizeViewport.bind(this);
    this.getScene = this.getScene.bind(this);
    this.previousScene = this.previousScene.bind(this);
    this.nextScene = this.nextScene.bind(this);
    this.renderScene = this.renderScene.bind(this);

    this.scenes = [
      { init: false, render: new ColoredCubeScene() },
      { init: false, render: new TexturedCubeScene() },
      { init: false, render: new MaterialScene() },
      { init: false, render: new MazeScene() },
      { init: false, render: new LightedCubeScene() },
      { init: false, render: new BrickWallScene() },
      { init: false, render: new RoomScene() }
    ];
    this.sceneIndex = 0;

    this.gl = canvas.getContext('webgl');
    if (this.gl === null) {
      alert("Unable to initialize WebGL. Your browser or machine may not support it.");
    } else {
      this.resizeViewport();
      this.gl.enable(this.gl.CULL_FACE);
      this.gl.cullFace(this.gl.BACK);
      for (let i = 0; i < this.scenes.length; i++) {
        this.initScene(this.scenes[i]);
      }
    }
  }

  resizeViewport() {
    const canvas = this.canvas;
    const rect = canvas.getBoundingClientRect()
    canvas.width = rect.width;
    canvas.height = rect.height;
    this.gl.viewport(0, 0, canvas.width, canvas.height);
  }

  initScene(scene) {
    if (!scene.init) {
      scene.init = true;
      scene.render.initScene(this.gl);
      if (scene.render.options) {
        scene.options = scene.render.options;
        scene.setOption = scene.render.setOption;
      }
      if (scene.render.credits) {
        scene.credits = scene.render.credits;
      }
      if (scene.render.mouseMovement) {
        scene.mouseMovement = scene.render.mouseMovement;
      }
      if (scene.render.keyboardState) {
        scene.keyboardState = scene.render.keyboardState;
      }
    }
  }

  getScene() {
    return this.scenes[this.sceneIndex];
  }

  previousScene() {
    this.sceneIndex = (this.sceneIndex - 1) % this.scenes.length;
    if (this.sceneIndex < 0) {
      this.sceneIndex = this.scenes.length - 1;
    }
    const scene = this.scenes[this.sceneIndex];
    this.initScene(scene);
    return this.scenes[this.sceneIndex];
  }

  nextScene() {
    this.sceneIndex = (this.sceneIndex + 1) % this.scenes.length;
    const scene = this.scenes[this.sceneIndex];
    this.initScene(scene);
    return this.scenes[this.sceneIndex];
  }

  renderScene(timeStamp) {
    timeStamp *= 0.001;
    if (!this.timeStamp) {
      this.timeStamp = timeStamp;
    }
    const deltaTime = timeStamp - this.timeStamp;
    this.timeStamp = timeStamp;
    const scene = this.scenes[this.sceneIndex];
    scene.fps = Math.round(1.0 / deltaTime);
    scene.render.drawScene(this.gl, deltaTime);
  }
}

export default SceneManager;
