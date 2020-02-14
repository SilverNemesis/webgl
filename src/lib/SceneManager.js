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
      { init: false, render: new LightedCubeScene() },
      { init: false, render: new MazeScene() },
      { init: false, render: new BrickWallScene() },
      { init: false, render: new MaterialScene() },
      { init: false, render: new RoomScene() }
    ];
    this.sceneIndex = this.scenes.length - 1;

    this.gl = canvas.getContext('webgl');
    if (this.gl === null) {
      alert("Unable to initialize WebGL. Your browser or machine may not support it.");
    } else {
      this.resizeViewport();
      this.gl.enable(this.gl.CULL_FACE);
      this.gl.cullFace(this.gl.BACK);
      const scene = this.scenes[this.sceneIndex];
      if (!scene.init) {
        scene.init = true;
        scene.render.initScene(this.gl);
        if (scene.render.getOptions) {
          scene.options = scene.render.getOptions();
          scene.setOption = scene.render.setOption;
        }
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

  getScene() {
    return this.scenes[this.sceneIndex];
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
      if (scene.render.getOptions) {
        scene.options = scene.render.getOptions();
        scene.setOption = scene.render.setOption;
      }
    }
    return this.scenes[this.sceneIndex];
  }

  nextScene() {
    this.sceneIndex = (this.sceneIndex + 1) % this.scenes.length;
    const scene = this.scenes[this.sceneIndex];
    if (!scene.init) {
      scene.init = true;
      scene.render.initScene(this.gl);
      if (scene.render.getOptions) {
        scene.options = scene.render.getOptions();
        scene.setOption = scene.render.setOption;
      }
    }
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
    scene.render.drawScene(this.gl, deltaTime);
  }
}

export default SceneManager;
