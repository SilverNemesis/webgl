import * as mat4 from 'gl-matrix/mat4';
import { clearScreen } from '../lib/utility'
import BrickWallModel from '../models/BrickWallModel';

class BrickWallScene {
  constructor(gl) {
    this.gl = gl;
    this.setOption = this.setOption.bind(this);
    this.initScene = this.initScene.bind(this);
    this.drawScene = this.drawScene.bind(this);
    this.renderOptions = {
      projectionMatrix: mat4.create(),
      viewMatrix: mat4.create(),
      showDiffuseMap: true,
      showNormalMap: true,
      showAmbientOcclusionMap: true,
      showParallaxMap: true,
      parallaxHeightScale: 0.04,
      parallaxSteps: 32,
      parallaxOcclusionMapping: true,
      ambientLight: [0.3, 0.3, 0.3],
      directionalLight: {
        color: [0.4, 0.4, 0.4],
        direction: [0.0, -1.0, 1.0]
      },
      pointLight: {
        color: [1.0, 1.0, 1.0],
        position: [0.0, 0.0, 0.0],
        brightness: 15.0
      },
      cameraPos: [0.0, 0.0, 0.0]
    };
    this.options = [
      {
        description: 'Brick cube with diffuse, normal, ambient occlusion, and parallax maps',
        type: 'description'
      },
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
      },
      {
        name: 'Show Parallax Map',
        id: 'showParallaxMap',
        type: 'bool'
      },
      {
        name: 'Parallax Height Scale',
        id: 'parallaxHeightScale',
        type: 'float',
        min: 0.0,
        max: 0.1
      },
      {
        name: 'Parallax Steps',
        id: 'parallaxSteps',
        type: 'int',
        min: 0,
        max: 32
      },
      {
        name: 'Use Parallax Occlusion Mapping',
        id: 'parallaxOcclusionMapping',
        type: 'bool'
      }
    ];
    for (let i = 0; i < this.options.length; i++) {
      this.options[i].value = this.renderOptions[this.options[i].id];
    }
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
    const gl = this.gl;
    const model = new BrickWallModel(gl);
    this.scene = {
      actors: [
        {
          modelMatrix: mat4.create(),
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

  drawScene(deltaTime) {
    const gl = this.gl;
    const scene = this.scene;
    const { projectionMatrix, viewMatrix } = this.renderOptions;

    clearScreen(gl);

    const fieldOfView = 45 * Math.PI / 180;
    const aspect = gl.canvas.clientWidth / gl.canvas.clientHeight;
    const zNear = 0.1;
    const zFar = 100.0;
    mat4.perspective(projectionMatrix, fieldOfView, aspect, zNear, zFar);

    mat4.identity(viewMatrix);
    mat4.translate(viewMatrix, viewMatrix, scene.camera);
    mat4.invert(viewMatrix, viewMatrix)

    for (let i = 0; i < scene.actors.length; i++) {
      const actor = scene.actors[i];
      this._renderActor(actor);
      this._animateActor(deltaTime, actor);
    }
  }

  _renderActor(actor) {
    const { model, modelMatrix } = actor;
    mat4.identity(modelMatrix);
    mat4.translate(modelMatrix, modelMatrix, actor.location);
    for (let i = 0; i < actor.rotations.length; i++) {
      const rotation = actor.rotations[i];
      mat4.rotate(modelMatrix, modelMatrix, rotation.angle, rotation.axis);
    }

    model.draw(modelMatrix, this.renderOptions);
  }

  _animateActor(deltaTime, actor) {
    for (let i = 0; i < actor.rotations.length; i++) {
      const rotation = actor.rotations[i];
      rotation.angle += deltaTime * rotation.speed;
    }
  }
}

export default BrickWallScene;
