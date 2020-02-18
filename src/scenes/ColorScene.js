import * as mat4 from 'gl-matrix/mat4';
import { clearScreen } from '../lib/utility'
import ColorModel from '../models/ColorModel';

class ColorScene {
  constructor(gl) {
    this.gl = gl;
    this.setOption = this.setOption.bind(this);
    this.initScene = this.initScene.bind(this);
    this.drawScene = this.drawScene.bind(this);
    this.renderOptions = {
      ambientLight: [0.2, 0.2, 0.2],
      directionalLight: {
        color: [0.0, 0.0, 0.0],
        direction: [0.0, 0.0, 0.0]
      },
      pointLight: {
        color: [1.0, 1.0, 1.0],
        position: [0.0, 0.0, 0.0],
        brightness: 25.0
      },
      cameraPos: [0.0, 0.0, 0.0],
      lightingModel: 0
    };
    this.options = [
      {
        description: 'Colored dodecahedron and icosahedron with your choice of lighting',
        type: 'description'
      },
      {
        name: 'Lighting Model',
        id: 'lightingModel',
        type: 'select',
        options: ['Unlit', 'Vertex Lighting', 'Fragment Lighting'],
        value: this.renderOptions.lightingModel
      }
    ];
  }

  setOption(option, value) {
    option.value = Number(value);
    this.renderOptions[option.id] = option.value;
  }

  initScene() {
    const gl = this.gl;

    const colors = [
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
      [0.5, 0.0, 1.0],
      [1.0, 0.5, 0.5],
      [0.5, 1.0, 0.5],
      [0.5, 0.5, 1.0],
      [1.0, 1.0, 0.5],
      [1.0, 0.5, 1.0],
      [0.5, 1.0, 1.0],
      [0.5, 0.5, 0.5],
      [1.0, 1.0, 1.0]
    ];

    const model1 = new ColorModel(gl, 'dodecahedron', colors);
    const model2 = new ColorModel(gl, 'icosahedron', colors);

    this.scene = {
      actors: [
        {
          model: model1,
          location: [-1.6, 0.0, -6.0],
          scale: [2.8, 2.8, 2.8],
          rotations: [
            {
              angle: 0.0,
              axis: [1, 0, 0],
              speed: 0.4
            },
            {
              angle: 0.0,
              axis: [0, 1, 0],
              speed: 0.2
            }
          ]
        },
        {
          model: model2,
          location: [1.6, 0.0, -6.0],
          scale: [2.8, 2.8, 2.8],
          rotations: [
            {
              angle: 0.0,
              axis: [1, 0, 0],
              speed: 0.4
            },
            {
              angle: 0.0,
              axis: [0, 1, 0],
              speed: 0.2
            }
          ]
        }
      ],
      camera: [0.0, 0.0, 0.0]
    };
  }

  drawScene(deltaTime) {
    const gl = this.gl;
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

    model.draw(projectionMatrix, viewMatrix, modelMatrix, this.renderOptions);
  }

  _animateActor(deltaTime, actor) {
    for (let i = 0; i < actor.rotations.length; i++) {
      const rotation = actor.rotations[i];
      rotation.angle += deltaTime * rotation.speed;
    }
  }
}

export default ColorScene;