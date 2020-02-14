import * as mat4 from 'gl-matrix/mat4';
import { clearScreen } from '../lib/utility'
import ColorModel from '../models/ColorModel';

class ColorScene {
  constructor() {
    this.initScene = this.initScene.bind(this);
    this.drawScene = this.drawScene.bind(this);
    this.options = [
      {
        description: 'Colored cube and dodecahedron with no lighting',
        type: 'description'
      }
    ];
  }

  initScene(gl) {
    const colors1 = [
      [0.0, 0.0, 1.0],    // Bottom face: blue
      [0.0, 1.0, 0.0],    // Top face: green
      [1.0, 0.0, 1.0],    // Left face: purple
      [1.0, 1.0, 0.0],    // Right face: yellow
      [1.0, 1.0, 1.0],    // Front face: white
      [1.0, 0.0, 0.0]     // Back face: red
    ];
    const model6 = new ColorModel(gl, 'cube', colors1);
    const colors2 = [
      [1.0, 0.0, 0.0],
      [0.0, 0.0, 1.0],
      [0.0, 1.0, 0.0],
      [1.0, 1.0, 0.0],
      [0.0, 1.0, 1.0],
      [1.0, 0.0, 1.0],
      [1.0, 0.5, 0.0],
      [0.0, 1.0, 0.5],
      [1.0, 0.0, 0.5],
      [0.5, 1.0, 0.0],
      [0.0, 0.5, 1.0],
      [0.5, 0.0, 1.0]
    ];
    const model12 = new ColorModel(gl, 'dodecahedron', colors2);
    this.scene = {
      actors: [
        {
          model: model6,
          location: [-1.6, 0.0, -6.0],
          scale: [3.0, 3.0, 3.0],
          rotations: [
            {
              angle: 0.0,
              axis: [1, 0, 0],
              speed: 1.0
            },
            {
              angle: 0.0,
              axis: [0, 1, 0],
              speed: 0.7
            }
          ]
        },
        {
          model: model12,
          location: [1.6, 0.0, -6.0],
          scale: [2.8, 2.8, 2.8],
          rotations: [
            {
              angle: 0.0,
              axis: [1, 0, 0],
              speed: 1.0
            },
            {
              angle: 0.0,
              axis: [0, 1, 0],
              speed: 0.7
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
    if (actor.scale) {
      mat4.scale(modelMatrix, modelMatrix, actor.scale);
    }
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

export default ColorScene;
