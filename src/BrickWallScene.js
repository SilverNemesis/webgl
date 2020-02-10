import * as mat4 from 'gl-matrix/mat4';
import { clearScreen } from './utility'
import BrickWallModel from './BrickWallModel';

class BrickWallScene {
  constructor() {
    this.initScene = this.initScene.bind(this);
    this.drawScene = this.drawScene.bind(this);
  }

  initScene(gl) {
    const model = new BrickWallModel(gl);
    this.scene = {
      actors: [
        {
          model,
          location: [0.0, 0.0, -5.5],
          rotations: [
            {
              angle: 0.0,
              axis: [0, 1, 0],
              speed: 0.4
            },
            {
              angle: 0.0,
              axis: [1, 0, 0],
              speed: 0.2
            }
          ]
        }
      ],
      camera: [0.0, 0.0, 0.0]
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
  }

  _renderActor(projectionMatrix, viewMatrix, actor) {
    const model = actor.model;

    const modelMatrix = mat4.create();
    mat4.translate(modelMatrix, modelMatrix, actor.location);
    for (let i = 0; i < actor.rotations.length; i++) {
      const rotation = actor.rotations[i];
      mat4.rotate(modelMatrix, modelMatrix, rotation.angle, rotation.axis);
    }

    model.draw(projectionMatrix, viewMatrix, modelMatrix);
  }

  _animateActor(deltaTime, actor) {
    for (let i = 0; i < actor.rotations.length; i++) {
      const rotation = actor.rotations[i];
      rotation.angle += deltaTime * rotation.speed;
    }
  }
}

export default BrickWallScene;
