import * as mat4 from 'gl-matrix/mat4';
import { clearScreen } from '../lib/utility'
import RoomModel from '../models/RoomModel';

class RoomScene {
  constructor() {
    this.getOptions = this.getOptions.bind(this);
    this.setOption = this.setOption.bind(this);
    this.mouseMovement = this.mouseMovement.bind(this);
    this.keyboardState = this.keyboardState.bind(this);
    this.initScene = this.initScene.bind(this);
    this.drawScene = this.drawScene.bind(this);
    this.renderOptions = {
      showDiffuseMap: true,
      showNormalMap: true,
      showAmbientOcclusionMap: true,
      ambientLight: [0.2, 0.2, 0.2],
      directionalLight: {
        color: [0.4, 0.4, 0.2],
        direction: [0.0, -1.0, 1.0]
      },
      pointLight: {
        color: [0.6, 0.6, 0.6],
        position: [0.0, 1.0, 0.0]
      }
    };
    this.options = [
      {
        name: 'Show Diffuse Map',
        id: 'showDiffuseMap',
        type: 'bool'
      },
      {
        name: 'Show Normal Map',
        id: 'showNormalMap',
        type: 'bool'
      },
      {
        name: 'Show Ambient Occlusion Map',
        id: 'showAmbientOcclusionMap',
        type: 'bool'
      }
    ];
    for (let i = 0; i < this.options.length; i++) {
      this.options[i].value = this.renderOptions[this.options[i].id];
    }
    this.movement = { front: 0.0, side: 0.0 };
  }

  getOptions() {
    return this.options
  }

  setOption(name, value) {
    const option = this.options.find((option) => option.name === name);
    option.value = Number(value);
    this.renderOptions[option.id] = option.value;
  }

  mouseMovement(x, y) {
    const camera = this.scene.camera;
    camera.rotations[0].angle -= x * 0.001;
    camera.rotations[1].angle -= y * 0.001;
  }

  keyboardState(keys) {
    let front = 0.0;
    if (keys['w']) {
      front -= 1.0;
    }
    if (keys['s']) {
      front += 1.0;
    }
    let side = 0.0;
    if (keys['a']) {
      side -= 1.0;
    }
    if (keys['d']) {
      side += 1.0;
    }
    this.movement.front = front;
    this.movement.side = side;
  }

  initScene(gl) {
    const model = new RoomModel(gl);
    this.scene = {
      actors: [
        {
          model,
          location: [0.0, 0.0, 0.0],
          rotations: []
        }
      ],
      camera: {
        location: [0.0, 0.5, 0.0],
        rotations: [
          {
            angle: 0.0,
            axis: [0, 1, 0]
          },
          {
            angle: 0.0,
            axis: [1, 0, 0]
          }
        ]
      }
    };
  }

  drawScene(gl, deltaTime) {
    const scene = this.scene;
    const camera = scene.camera;

    clearScreen(gl);

    const fieldOfView = 45 * Math.PI / 180;
    const aspect = gl.canvas.clientWidth / gl.canvas.clientHeight;
    const zNear = 0.1;
    const zFar = 100.0;
    const projectionMatrix = mat4.create();
    mat4.perspective(projectionMatrix, fieldOfView, aspect, zNear, zFar);

    const viewMatrix = mat4.create();
    mat4.translate(viewMatrix, viewMatrix, camera.location);
    for (let i = 0; i < camera.rotations.length; i++) {
      const rotation = camera.rotations[i];
      mat4.rotate(viewMatrix, viewMatrix, rotation.angle, rotation.axis);
    }
    mat4.invert(viewMatrix, viewMatrix)

    this.renderOptions.cameraPos = camera.location;

    for (let i = 0; i < scene.actors.length; i++) {
      const actor = scene.actors[i];
      this._renderActor(projectionMatrix, viewMatrix, actor);
      this._animateActor(deltaTime, actor);
    }

    mat4.identity(viewMatrix);
    mat4.rotate(viewMatrix, viewMatrix, camera.rotations[0].angle, camera.rotations[0].axis);
    mat4.invert(viewMatrix, viewMatrix)

    camera.location[0] += deltaTime * this.movement.front * viewMatrix[2];
    camera.location[1] += deltaTime * this.movement.front * viewMatrix[6];
    camera.location[2] += deltaTime * this.movement.front * viewMatrix[10];

    camera.location[0] += deltaTime * this.movement.side * viewMatrix[0];
    camera.location[1] += deltaTime * this.movement.side * viewMatrix[4];
    camera.location[2] += deltaTime * this.movement.side * viewMatrix[8];
  }

  _renderActor(projectionMatrix, viewMatrix, actor) {
    const model = actor.model;

    const modelMatrix = mat4.create();
    mat4.translate(modelMatrix, modelMatrix, actor.location);
    for (let i = 0; i < actor.rotations.length; i++) {
      const rotation = actor.rotations[i];
      mat4.rotate(modelMatrix, modelMatrix, rotation.angle, rotation.axis);
    }

    model.draw(projectionMatrix, viewMatrix, modelMatrix, this.renderOptions);
  }

  _animateActor(deltaTime, actor) {
    for (let i = 0; i < actor.rotations.length; i++) {
      const rotation = actor.rotations[i];
      rotation.angle += deltaTime * rotation.speed;
    }
  }
}

export default RoomScene;
