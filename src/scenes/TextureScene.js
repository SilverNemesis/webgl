import * as mat4 from 'gl-matrix/mat4';
import { clearScreen } from '../lib/utility'
import TexturedCubeModel from '../models/TexturedCubeModel';

class TextureScene {
  constructor(gl) {
    this.gl = gl;
    this.setOption = this.setOption.bind(this);
    this.initScene = this.initScene.bind(this);
    this.drawScene = this.drawScene.bind(this);
    this.renderOptions = {
      ambientLight: [0.2, 0.2, 0.2],
      directionalLight: {
        color: [1.0, 1.0, 1.0],
        direction: [-1.0, 1.0, 0.0]
      },
      pointLight: {
        color: [1.0, 1.0, 1.0],
        position: [1.0, -1.0, 0.0],
        brightness: 25.0
      },
      cameraPos: [0.0, 0.0, 0.0],
      lightingModel: 0
    };
    this.options = [
      {
        description: 'Textured cubes with diffuse maps only with your choice of lighting',
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
    this.credits = [
      'Textures created by João Paulo',
      'link:https://3dtextures.me/about/'
    ];
  }

  setOption(option, value) {
    option.value = Number(value);
    this.renderOptions[option.id] = option.value;
  }

  initScene() {
    this.scene = {
      actors: [
        {
          model: new TexturedCubeModel(this.gl, 'images/Tiles_035_basecolor.jpg'),
          location: [-1.6, 0.0, -6.0],
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
          model: new TexturedCubeModel(this.gl, 'images/Wood_planks_011_basecolor.jpg'),
          location: [1.6, 0.0, -6.0],
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

export default TextureScene;
