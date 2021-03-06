import * as mat4 from 'gl-matrix/mat4';
import { clearScreen, degreesToRadians } from '../lib/utility';
import { getMaterialList, getMaterial } from '../lib/materials';
import { generateMaze, generateDungeon } from '../lib/maze';
import MazeModel from '../models/MazeModel';

class MazeScene {
  constructor(gl) {
    this.gl = gl;
    this.setOption = this.setOption.bind(this);
    this.initScene = this.initScene.bind(this);
    this.createMaze = this.createMaze.bind(this);
    this.createDungeon = this.createDungeon.bind(this);
    this.drawScene = this.drawScene.bind(this);
    this.totalDelta = 0.0;

    this.renderOptions = {
      projectionMatrix: mat4.create(),
      viewMatrix: mat4.create(),
      lights: [
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
      ],
      ambientLight: [0.2, 0.2, 0.2],
      directionalLight: {
        color: [1.0, 1.0, 1.0],
        direction: [-1.0, -1.0, 0.0]
      },
      pointLight: {
        color: [1.0, 1.0, 1.0]
      },
      useMaterials: false,
      materials: new Array(3).fill(undefined),
      lightingModel: 0,
      useColors: 1
    };

    this.options = [
      {
        description: 'Random maze/dungeon geometry with colors or materials using Phong shading with your choice of lighting',
        type: 'description'
      },
      {
        name: 'Use Materials',
        id: 'useMaterials',
        type: 'bool',
        value: this.renderOptions.useMaterials
      },
      {
        name: 'Wall Material',
        type: 'select',
        options: getMaterialList()
      },
      {
        name: 'Floor Material',
        type: 'select',
        options: getMaterialList()
      },
      {
        name: 'Ceiling Material',
        type: 'select',
        options: getMaterialList()
      },
      {
        name: 'Lighting Model',
        id: 'lightingModel',
        type: 'select',
        options: ['Unlit', 'Vertex Lighting', 'Fragment Lighting'],
        value: this.renderOptions.lightingModel
      },
      {
        name: 'Create Maze',
        type: 'function',
        function: this.createMaze
      },
      {
        name: 'Create Dungeon',
        type: 'function',
        function: this.createDungeon
      }
    ];

    this.setOption(this.options[2], 0);
    this.setOption(this.options[3], 9);
    this.setOption(this.options[4], 10);

    this.credits = [
      'Maze generation is based on this article',
      'link:https://journal.stuffwithstuff.com/2014/12/21/rooms-and-mazes/'
    ]
  }

  setOption(option, value) {
    option.value = Number(value);
    if (option.id) {
      this.renderOptions[option.id] = option.value;
    }
    if (option.name === 'Wall Material') {
      const materialName = option.options[option.value];
      this.renderOptions.materials[0] = getMaterial(materialName);
    }
    if (option.name === 'Floor Material') {
      const materialName = option.options[option.value];
      this.renderOptions.materials[1] = getMaterial(materialName);
    }
    if (option.name === 'Ceiling Material') {
      const materialName = option.options[option.value];
      this.renderOptions.materials[2] = getMaterial(materialName);
    }
  }

  initScene() {
    const gl = this.gl;
    const { size, maze } = this._generateMaze();

    const model = new MazeModel(gl, maze);
    this.scene = {
      actors: [
        {
          modelMatrix: mat4.create(),
          model,
          location: [0.0, 0.0, -2.0 * size],
          rotation: { angle: 0.0, axis: [0, 1, 0], speed: 0.5 }
        }
      ],
      camera: [0.0, 0.0, 0.0]
    };
    this.renderOptions.pointLight.position = [0.0, size, -2.0 * size];
    this.renderOptions.pointLight.brightness = size * size;
  }

  createMaze() {
    const { size, maze } = this._generateMaze();
    this.scene.actors[0].location = [0.0, 0.0, -2.0 * size];
    this.scene.actors[0].model.update(maze);
    this.renderOptions.pointLight.position = [0.0, 10.0, -2.0 * size];
  }

  _generateMaze() {
    const size = Math.floor(Math.random() * 35) * 2 + 11;
    const maze = generateMaze(size, size);
    return { size, maze };
  }

  createDungeon() {
    const { size, maze } = this._generateDungeon();
    this.scene.actors[0].location = [0.0, 0.0, -2.0 * size];
    this.scene.actors[0].model.update(maze);
    this.renderOptions.pointLight.position = [0.0, 10.0, -2.0 * size];
  }

  _generateDungeon() {
    const size = Math.floor(Math.random() * 35) * 2 + 11;
    const maze = generateDungeon(size, size);
    return { size, maze };
  }

  drawScene(deltaTime) {
    const gl = this.gl;
    const scene = this.scene;
    const { projectionMatrix, viewMatrix } = this.renderOptions;

    clearScreen(gl);

    const fieldOfView = 45 * Math.PI / 180;
    const aspect = gl.canvas.clientWidth / gl.canvas.clientHeight;
    const zNear = 0.1;
    const zFar = 500.0;
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
    mat4.rotate(modelMatrix, modelMatrix, degreesToRadians(45), [1, 0, 0]);
    mat4.rotate(modelMatrix, modelMatrix, actor.rotation.angle, actor.rotation.axis);

    if (this.renderOptions.useMaterials) {
      this.renderOptions.shaderIndex = 1;
    } else {
      this.renderOptions.shaderIndex = 0;
    }

    model.draw(modelMatrix, this.renderOptions);
  }

  _animateActor(deltaTime, actor) {
    actor.rotation.angle += deltaTime * actor.rotation.speed;
  }
}

export default MazeScene;
