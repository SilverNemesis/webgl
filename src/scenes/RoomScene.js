import * as mat4 from 'gl-matrix/mat4';
import { clearScreen, degreesToRadians, generateMaze } from '../lib/utility'
import RoomModel from '../models/RoomModel';

class RoomScene {
  constructor(gl) {
    this.gl = gl;
    this.setOption = this.setOption.bind(this);
    this.mouseMovement = this.mouseMovement.bind(this);
    this.keyboardState = this.keyboardState.bind(this);
    this.initScene = this.initScene.bind(this);
    this.updateScene = this.updateScene.bind(this);
    this.drawScene = this.drawScene.bind(this);
    this.renderOptions = {
      showDiffuseMap: true,
      showNormalMap: true,
      showAmbientOcclusionMap: true,
      showParallaxMap: true,
      parallaxHeightScale: 0.02,
      parallaxSteps: 32,
      parallaxOcclusionMapping: true,
      ambientLight: [0.1, 0.1, 0.1],
      directionalLight: {
        color: [0.0, 0.0, 0.0],
        direction: [0.0, 0.0, 0.0]
      },
      pointLight: {
        color: [0.6, 0.6, 0.6],
        position: [0.0, 1.0, 0.0]
      }
    };
    this.options = [
      {
        description: 'Explorable random maze geometry with diffuse, normal, ambient occlusion, and parallax maps',
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
      },
      {
        name: 'Update Geometry',
        type: 'function',
        function: this.updateScene
      }
    ];
    for (let i = 0; i < this.options.length; i++) {
      this.options[i].value = this.renderOptions[this.options[i].id];
    }
    this.credits = [
      'Textures created by João Paulo',
      'link:https://3dtextures.me/about/',
      '',
      'Maze generation is based on this article',
      'link:https://journal.stuffwithstuff.com/2014/12/21/rooms-and-mazes/'
    ];
    this.movement = { front: 0.0, side: 0.0 };
  }

  setOption(option, value) {
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

  initScene() {
    this._updateMap(this.gl);
  }

  updateScene() {
    this._updateMap(this.gl);
  }

  _updateMap(gl) {
    this.ready = false;
    this.map = generateMaze(11, 11);
    this.mapBounds = this._createMapBounds(this.map);
    const { location, angle } = this._findStartLocation(this.map);
    if (this.scene) {
      this.scene.actors[0].model.update(this.map);
      this.scene.camera.location = location;
      this.scene.camera.rotations[0].angle = angle;
    } else {
      const model = new RoomModel(gl, this.map);
      this.scene = {
        actors: [
          {
            model,
            location: [0.0, 0.0, 0.0],
            rotations: []
          }
        ],
        camera: {
          location,
          rotations: [
            {
              angle,
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
    this.ready = true;
  }

  _createMapBounds(map) {
    const { width, height, data } = map;
    const mapBounds = [];
    const ofs_x = -width / 2;
    const ofs_z = -height / 2;
    for (let z = 0; z < height; z++) {
      for (let x = 0; x < width; x++) {
        if (data[z][x] === 1) {
          mapBounds.push({ x1: x + ofs_x, y1: z + ofs_z, x2: x + ofs_x + 1, y2: z + ofs_z + 1 });
        }
      }
    }
    return mapBounds;
  }

  _collideRectangles(r1, r2) {
    if (r1.x2 <= r2.x1 || r1.x1 >= r2.x2 || r1.y2 <= r2.y1 || r1.y1 >= r2.y2) {
      return false;
    }
    return true;
  }

  _collideCircleRectangle(cx, cy, radius, x1, y1, x2, y2) {
    const epsilon = 0.1;
    let type = 0;
    let testX = cx;
    let testY = cy;
    if (cx < x1 - epsilon) {
      type |= 1;
      testX = x1;
    } else if (cx > x2 + epsilon) {
      type |= 1;
      testX = x2;
    }
    if (cy < y1 - epsilon) {
      type |= 2;
      testY = y1;
    } else if (cy > y2 + epsilon) {
      type |= 2;
      testY = y2;
    }
    const distX = cx - testX;
    const distY = cy - testY;
    const distance = (distX * distX) + (distY * distY);
    if (distance <= radius * radius) {
      return type;
    }
    return 0;
  }

  _findStartLocation(map) {
    const { width, height, data } = map;
    const isSolid = (x, y) => {
      if (x < 0 || x >= width || y < 0 || y >= height) {
        return true;
      }
      if (data[y][x] === 1) {
        return true;
      }
      return false;
    }
    const ofs_x = -width / 2;
    const ofs_y = -height / 2;
    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        if (data[y][x] !== 1) {
          let angle = 0.0;
          const matrix = [];
          for (let r = -1; r < 2; r++) {
            for (let c = -1; c < 2; c++) {
              if (isSolid(x + c, y + r)) {
                matrix.push('1');
              } else {
                matrix.push('0');
              }
            }
          }
          if (matrix[0] === '0') {
            angle = -45.0;
          } else if (matrix[2] === '0') {
            angle = 45.0;
          } else if (matrix[6] === '0') {
            angle = -225.0;
          } else if (matrix[8] === '0') {
            angle = 225.0;
          } else if (matrix[3] === '0') {
            angle = 90.0;
          } else if (matrix[5] === '0') {
            angle = -90.0;
          } else if (matrix[7] === '0') {
            angle = 180.0;
          }
          return { location: [x + ofs_x + 0.5, 0.5, y + ofs_y + 0.5], angle: degreesToRadians(angle) };
        }
      }
    }
    return { location: [0.0, 0.5, 0.0] };
  }

  drawScene(deltaTime) {
    if (!this.ready) {
      return;
    }

    const gl = this.gl;
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
    this.renderOptions.pointLight.position = camera.location;

    for (let i = 0; i < scene.actors.length; i++) {
      const actor = scene.actors[i];
      this._renderActor(projectionMatrix, viewMatrix, actor);
      this._animateActor(deltaTime, actor);
    }

    mat4.identity(viewMatrix);
    mat4.rotate(viewMatrix, viewMatrix, camera.rotations[0].angle, camera.rotations[0].axis);
    mat4.invert(viewMatrix, viewMatrix)

    const x = camera.location[0];
    const y = camera.location[2];

    camera.location[0] += deltaTime * this.movement.front * viewMatrix[2];
    camera.location[1] += deltaTime * this.movement.front * viewMatrix[6];
    camera.location[2] += deltaTime * this.movement.front * viewMatrix[10];

    camera.location[0] += deltaTime * this.movement.side * viewMatrix[0];
    camera.location[1] += deltaTime * this.movement.side * viewMatrix[4];
    camera.location[2] += deltaTime * this.movement.side * viewMatrix[8];

    const cx = camera.location[0];
    const cy = camera.location[2];
    const radius = 0.3;
    const mapBounds = this.mapBounds;
    const len = mapBounds.length;
    let collision = 0;
    for (let i = 0; i < len; i++) {
      const rect = mapBounds[i];
      collision |= this._collideCircleRectangle(cx, cy, radius, rect.x1, rect.y1, rect.x2, rect.y2);
    }
    if (collision !== 0) {
      if (collision === 1) {
        camera.location[0] = x;
      } else if (collision === 2) {
        camera.location[2] = y;
      } else {
        camera.location[0] = x;
        camera.location[2] = y;
      }
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

export default RoomScene;
