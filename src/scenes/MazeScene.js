import * as mat4 from 'gl-matrix/mat4';
import { clearScreen, degreesToRadians, generateMaze, getMaterialList, getMaterial } from '../lib/utility'
import MazeModel from '../models/MazeModel';

class MazeScene {
  constructor() {
    this.initScene = this.initScene.bind(this);
    this.drawScene = this.drawScene.bind(this);
    this.totalDelta = 0.0;
  }

  initScene(gl) {
    const { size, maze, material } = this._generateMaze();
    const model = new MazeModel(gl, maze);
    this.scene = {
      actors: [
        {
          model,
          location: [0.0, 0.0, -2.0 * size],
          rotation: { angle: 0.0, axis: [0, 1, 0], speed: 0.5 },
          material
        }
      ],
      camera: [0.0, 0.0, 0.0]
    };
  }

  _generateMaze() {
    const size = Math.floor(Math.random() * 35) * 2 + 11;
    const maze = generateMaze(size, size);
    let material = undefined;
    if (Math.random() < 0.8) {
      const materials = getMaterialList();
      material = getMaterial(materials[Math.floor(Math.random() * materials.length)]);
    }
    return { size, maze, material };
  }

  drawScene(gl, deltaTime) {
    const scene = this.scene;

    clearScreen(gl);

    const fieldOfView = 45 * Math.PI / 180;
    const aspect = gl.canvas.clientWidth / gl.canvas.clientHeight;
    const zNear = 0.1;
    const zFar = 500.0;
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
    mat4.rotate(modelMatrix, modelMatrix, degreesToRadians(45), [1, 0, 0]);
    mat4.rotate(modelMatrix, modelMatrix, actor.rotation.angle, actor.rotation.axis);

    if (actor.material) {
      const lights = [
        {
          position: [10.0, -10.0, 0.0],
          ambient: [0.2, 0.2, 0.2],
          diffuse: [0.5, 0.5, 0.5],
          specular: [0.9, 0.9, 0.9]
        },
        {
          position: [-10.0, 10.0, 0.0],
          ambient: [0.2, 0.2, 0.2],
          diffuse: [0.5, 0.5, 0.5],
          specular: [0.9, 0.9, 0.9]
        }
      ];

      model.draw(projectionMatrix, viewMatrix, modelMatrix, 1, lights, actor.material);
    } else {
      model.draw(projectionMatrix, viewMatrix, modelMatrix);
    }
  }

  _animateActor(deltaTime, actor) {
    actor.rotation.angle += deltaTime * actor.rotation.speed;
    this.totalDelta += deltaTime;
    if (this.totalDelta >= 3.0) {
      this.totalDelta -= 3.0;
      const { size, maze, material } = this._generateMaze();
      actor.material = material;
      actor.location[2] = -2.0 * size;
      actor.model.update(maze);
    }
  }
}

export default MazeScene;
