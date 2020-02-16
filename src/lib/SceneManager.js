import ColorScene from '../scenes/ColorScene';
import TexturedCubeScene from '../scenes/TexturedCubeScene';
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

    this.gl = canvas.getContext('webgl');
    if (this.gl === null) {
      alert("Unable to initialize WebGL. Your browser or machine may not support it.");
    } else {
      this.resizeViewport();
      this.gl.enable(this.gl.CULL_FACE);
      this.gl.cullFace(this.gl.BACK);
      this.scenes = [
        { init: false, render: new ColorScene(this.gl) },
        { init: false, render: new TexturedCubeScene(this.gl) },
        { init: false, render: new MaterialScene(this.gl) },
        { init: false, render: new MazeScene(this.gl) },
        { init: false, render: new BrickWallScene(this.gl) },
        { init: false, render: new RoomScene(this.gl) }
      ];
      this.sceneIndex = 0;

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
      scene.render.initScene();
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
    scene.render.drawScene(deltaTime);
  }
}

export default SceneManager;
