import * as mat4 from 'gl-matrix/mat4';
import { clearScreen, degreesToRadians, generateMaze, getMaterialList, getMaterial } from '../lib/utility'
import MazeModel from '../models/MazeModel';

class MazeScene {
  constructor() {
    this.getOptions = this.getOptions.bind(this);
    this.setOption = this.setOption.bind(this);
    this.initScene = this.initScene.bind(this);
    this.updateScene = this.updateScene.bind(this);
    this.drawScene = this.drawScene.bind(this);
    this.totalDelta = 0.0;

    this.options = [
      {
        name: 'Material',
        type: 'select',
        options: ['useColors', ...getMaterialList()]
      },
      {
        name: 'Update Maze',
        type: 'function',
        function: this.updateScene
      }
    ];
  }

  getOptions() {
    return this.options
  }

  setOption(name, value) {
    const option = this.options.find((option) => option.name === name);
    option.value = Number(value);

    const actor = this.scene.actors[0];

    if (option.name === 'Material') {
      const materialName = option.options[option.value];
      if (materialName !== 'useColors') {
        actor.material = getMaterial(materialName);
      } else {
        actor.material = undefined;
      }
    }
  }

  initScene(gl) {
    const { size, maze } = this._generateMaze();

    const model = new MazeModel(gl, maze);
    this.scene = {
      actors: [
        {
          model,
          location: [0.0, 0.0, -2.0 * size],
          rotation: { angle: 0.0, axis: [0, 1, 0], speed: 0.5 }
        }
      ],
      camera: [0.0, 0.0, 0.0]
    };

    this.setOption('Material', 1);
  }

  updateScene() {
    const { size, maze } = this._generateMaze();
    this.scene.actors[0].location = [0.0, 0.0, -2.0 * size];
    this.scene.actors[0].model.update(maze);
  }

  _generateMaze() {
    const size = Math.floor(Math.random() * 35) * 2 + 11;
    const maze = generateMaze(size, size);
    return { size, maze };
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
  }
}

export default MazeScene;
