import * as mat4 from 'gl-matrix/mat4';
import { clearScreen } from '../lib/utility'
import BrickWallModel from '../models/BrickWallModel';

class BrickWallScene {
  constructor() {
    this.setOption = this.setOption.bind(this);
    this.initScene = this.initScene.bind(this);
    this.drawScene = this.drawScene.bind(this);
    this.renderOptions = {
      showDiffuseMap: true,
      showNormalMap: true,
      showAmbientOcclusionMap: true,
      showParallaxMap: true,
      parallaxHeightScale: 0.04,
      parallaxSteps: 32,
      parallaxOcclusionMapping: true
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

    model.draw(projectionMatrix, viewMatrix, modelMatrix, this.renderOptions);
  }

  _animateActor(deltaTime, actor) {
    for (let i = 0; i < actor.rotations.length; i++) {
      const rotation = actor.rotations[i];
      rotation.angle += deltaTime * rotation.speed;
    }
  }
}

export default BrickWallScene;
