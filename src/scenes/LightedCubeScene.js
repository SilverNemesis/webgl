import * as mat4 from 'gl-matrix/mat4';
import { clearScreen } from '../lib/utility'
import LightedCubeModel from '../models/LightedCubeModel';

class LightedCubeScene {
  constructor() {
    this.initScene = this.initScene.bind(this);
    this.drawScene = this.drawScene.bind(this);
    this.options = [
      {
        description: 'Textured cubes with diffuse map only, vertex lighting on left cube, fragment lighting on right cube',
        type: 'description'
      }
    ];
    this.credits = [
      'Texture from Mozilla WebGL Tutorial',
      'https://developer.mozilla.org/'
    ];
  }

  initScene(gl) {
    const model = new LightedCubeModel(gl);
    this.scene = {
      actors: [
        {
          model,
          location: [-2.0, 0.0, -5.5],
          rotation: 0.0,
          rotationSpeed: 1.0,
          perPixel: false
        },
        {
          model,
          location: [2.0, 0.0, -5.5],
          rotation: 0.0,
          rotationSpeed: 1.0,
          perPixel: true
        }
      ],
      camera: [0.0, 0.0, 0.0],
      cameraDir: [0.0, 0.0, 2.0]
    };
  }

  drawScene(gl, deltaTime) {
    const scene = this.scene;

    clearScreen(gl);

    const fieldOfView = 45 * Math.PI / 180;
    const aspect = gl.canvas.clientWidth / gl.canvas.clientHeight;
    const zNear = 0.1;
    const zFar = 100.0;
    const projectionMatrix = mat4.create();
    mat4.perspective(projectionMatrix, fieldOfView, aspect, zNear, zFar);

    const viewMatrix = mat4.create();
    mat4.translate(viewMatrix, viewMatrix, scene.camera);
    mat4.invert(viewMatrix, viewMatrix)

    for (let i = 0; i < scene.actors.length; i++) {
      const actor = scene.actors[i];
      this._renderActor(projectionMatrix, viewMatrix, actor);
      this._animateActor(deltaTime, actor);
    }

    if (scene.camera[2] > 16.0) {
      scene.camera[2] = 16.0;
      scene.cameraDir[2] = -2.0;
    } else if (scene.camera[2] < 0.0) {
      scene.camera[2] = 0.0;
      scene.cameraDir[2] = 2.0;
    }

    scene.camera[0] += scene.cameraDir[0] * deltaTime;
    scene.camera[1] += scene.cameraDir[1] * deltaTime;
    scene.camera[2] += scene.cameraDir[2] * deltaTime;
  }

  _renderActor(projectionMatrix, viewMatrix, actor) {
    const model = actor.model;

    const modelMatrix = mat4.create();
    mat4.translate(modelMatrix, modelMatrix, actor.location);
    mat4.rotate(modelMatrix, modelMatrix, actor.rotation, [0, 0, 1]);
    mat4.rotate(modelMatrix, modelMatrix, actor.rotation * 0.7, [0, 1, 0]);
    mat4.rotate(modelMatrix, modelMatrix, actor.rotation * 0.3, [1, 0, 0]);

    model.draw(projectionMatrix, viewMatrix, modelMatrix, actor.perPixel);
  }

  _animateActor(deltaTime, actor) {
    actor.rotation += deltaTime * actor.rotationSpeed;
  }
}

export default LightedCubeScene;
