import ColorScene from '../scenes/ColorScene';
import TexturedCubeScene from '../scenes/TexturedCubeScene';
import MazeScene from '../scenes/MazeScene';
import BrickWallScene from '../scenes/BrickWallScene';
import MaterialScene from '../scenes/MaterialScene';
import RoomScene from '../scenes/RoomScene';

class SceneManager {
  constructor(canvas, onDataChange) {
    this.canvas = canvas;
    this.onDataChange = onDataChange;

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
        new ColorScene(this.gl),
        new TexturedCubeScene(this.gl),
        new MaterialScene(this.gl),
        new MazeScene(this.gl),
        new BrickWallScene(this.gl),
        new RoomScene(this.gl)
      ];
      this.sceneIndex = 0;

      for (let i = 0; i < this.scenes.length; i++) {
        const scene = this.scenes[i];
        if (scene.registerDataChange) {
          scene.registerDataChange(this.onDataChange);
        }
        scene.initScene();
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
    if (scene.forceDataChange) {
      scene.forceDataChange();
    }
    return this.scenes[this.sceneIndex];
  }

  nextScene() {
    this.sceneIndex = (this.sceneIndex + 1) % this.scenes.length;
    const scene = this.scenes[this.sceneIndex];
    if (scene.forceDataChange) {
      scene.forceDataChange();
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
    scene.drawScene(deltaTime);
  }
}

export default SceneManager;
