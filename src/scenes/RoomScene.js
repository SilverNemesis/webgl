import * as mat4 from 'gl-matrix/mat4';
import { clearScreen, pickRandom } from '../lib/utility';
import { getMaterial } from '../lib/materials';
import { generateMaze, generateDungeon, getMazeBoundingSquares, getMazeStartLocation, getMazeSquareCenter } from '../lib/maze';
import { collideCircleRectangle, collideCircles } from '../lib/collision';
import RoomModel from '../models/RoomModel';
import MaterialModel from '../models/MaterialModel';

const shapes = ['tetrahedron', 'cube', 'octahedron', 'dodecahedron', 'icosahedron'];
const materials = ['gold', 'chrome', 'copper'];

class RoomScene {
  constructor(gl) {
    this.gl = gl;
    this.setOption = this.setOption.bind(this);
    this.mouseMovement = this.mouseMovement.bind(this);
    this.keyboardState = this.keyboardState.bind(this);
    this.registerDataChange = this.registerDataChange.bind(this);
    this.forceDataChange = this.forceDataChange.bind(this);
    this.initScene = this.initScene.bind(this);
    this.createMaze = this.createMaze.bind(this);
    this.createDungeon = this.createDungeon.bind(this);
    this.drawScene = this.drawScene.bind(this);
    const ambientLight = [0.1, 0.1, 0.1];
    const directionalLight = {
      color: [0.0, 0.0, 0.0],
      direction: [0.0, 0.0, 0.0]
    };
    const pointLight = {
      color: [0.6, 0.6, 0.6],
      brightness: 15.0
    };
    this.renderOptions = {
      projectionMatrix: mat4.create(),
      viewMatrix: mat4.create(),
      showDiffuseMap: true,
      showNormalMap: true,
      showAmbientOcclusionMap: true,
      showParallaxMap: false,
      parallaxHeightScale: 0.02,
      parallaxSteps: 32,
      parallaxOcclusionMapping: true,
      ambientLight,
      directionalLight,
      pointLight,
      lights: [
        {
          ambient: [Math.min(ambientLight[0] * 2.0, 1.0), Math.min(ambientLight[1] * 2.0, 1.0), Math.min(ambientLight[2] * 2.0, 1.0)],
          diffuse: pointLight.color,
          specular: [Math.min(pointLight.color[0] * 2.0, 1.0), Math.min(pointLight.color[1] * 2.0, 1.0), Math.min(pointLight.color[2] * 2.0, 1.0)]
        },
        {
          ambient: [0.0, 0.0, 0.0],
          diffuse: [0.0, 0.0, 0.0],
          specular: [0.0, 0.0, 0.0]
        }
      ],
      lightingModel: 2
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

  registerDataChange(onDataChange) {
    this.onDataChange = onDataChange;
  }

  forceDataChange() {
    this._updatePowerUpInfo(this.scene.actors);
  }

  initScene() {
    this._updateMap(this.gl, false);
  }

  createMaze() {
    this._updateMap(this.gl, false);
  }

  createDungeon() {
    this._updateMap(this.gl, true);
  }

  _updateMap(gl, dungeon) {
    this.ready = false;
    if (dungeon) {
      this.map = generateDungeon(15, 15);
    } else {
      this.map = generateMaze(11, 11);
    }
    const { location, angle, square, nextSquare } = getMazeStartLocation(this.map);
    if (this.scene) {
      if (this.scene.actors.length > 1) {
        this.scene.actors.length = 1;
      }
      this.scene.actors[0].boundingRectagles = getMazeBoundingSquares(this.map);
      this.scene.actors[0].model.update(this.map);
      this.scene.camera.location = location;
      this.scene.camera.rotations[0].angle = angle;
    } else {
      const model = new RoomModel(gl, this.map);
      this.scene = {
        actors: [
          {
            active: true,
            boundingRectagles: getMazeBoundingSquares(this.map),
            modelMatrix: mat4.create(),
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
    this._placePowerUps(this.scene, this.map, square.x, square.y, nextSquare.x, nextSquare.y);
    this.ready = true;
  }

  _placePowerUps(scene, map, sx, sy, tx, ty) {
    const { width, height, data } = map;
    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        if (data[y][x] !== 1) {
          if (x === sx && y === sy) {
            continue;
          }
          if ((x === tx && y === ty) || Math.random() < 0.2) {
            const location = getMazeSquareCenter(map, x, y, 0.4);
            scene.actors.push({
              active: true,
              boundingRadius: 0.1,
              modelMatrix: mat4.create(),
              model: new MaterialModel(this.gl, pickRandom(shapes)),
              material: getMaterial(pickRandom(materials)),
              location,
              scale: [0.15, 0.15, 0.15],
              rotations: [
                {
                  angle: 0.0,
                  axis: [1, 0, 0],
                  speed: 1.0 + Math.random()
                },
                {
                  angle: 0.0,
                  axis: [0, 1, 0],
                  speed: 2.0 + Math.random() + Math.random()
                }
              ]
            });
          }
        }
      }
    }
    this._updatePowerUpInfo(scene.actors);
  }

  _updatePowerUpInfo(actors) {
    let collected = 0;
    let total = 0;
    for (let i = 0; i < actors.length; i++) {
      const actor = actors[i];
      if (actor.boundingRadius) {
        total++;
        if (!actor.active) {
          collected++;
        }
      }
    }
    this.onDataChange({ collected, total });
  }

  drawScene(deltaTime) {
    if (!this.ready) {
      return;
    }

    const gl = this.gl;
    const scene = this.scene;
    const { projectionMatrix, viewMatrix } = this.renderOptions;
    const camera = scene.camera;

    clearScreen(gl);

    const fieldOfView = 45 * Math.PI / 180;
    const aspect = gl.canvas.clientWidth / gl.canvas.clientHeight;
    const zNear = 0.1;
    const zFar = 100.0;
    mat4.perspective(projectionMatrix, fieldOfView, aspect, zNear, zFar);

    mat4.identity(viewMatrix);
    mat4.translate(viewMatrix, viewMatrix, camera.location);
    for (let i = 0; i < camera.rotations.length; i++) {
      const rotation = camera.rotations[i];
      mat4.rotate(viewMatrix, viewMatrix, rotation.angle, rotation.axis);
    }
    mat4.invert(viewMatrix, viewMatrix)

    this.renderOptions.cameraPos = camera.location;
    this.renderOptions.pointLight.position = camera.location;
    this.renderOptions.lights[0].position = camera.location;
    this.renderOptions.lights[1].position = camera.location;

    for (let i = 0; i < scene.actors.length; i++) {
      const actor = scene.actors[i];
      if (actor.active) {
        this._renderActor(actor);
        this._animateActor(deltaTime, actor);
      }
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

    this._detectCollisions(camera, x, y, scene);
  }

  _detectCollisions(camera, x, y, scene) {
    // collision detection against map
    const cx = camera.location[0];
    const cy = camera.location[2];
    const radius = 0.2;
    const mapBounds = scene.actors[0].boundingRectagles;
    const len = mapBounds.length;
    let collision = 0;
    for (let i = 0; i < len; i++) {
      const rect = mapBounds[i];
      collision |= collideCircleRectangle(cx, cy, radius, rect.x1, rect.y1, rect.x2, rect.y2);
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

    // collision detection against power-ups
    collision = 0;
    for (let i = 0; i < scene.actors.length; i++) {
      const actor = scene.actors[i];
      if (actor.active && actor.boundingRadius) {
        if (collideCircles(cx, cy, radius, actor.location[0], actor.location[2], actor.boundingRadius)) {
          collision++;
          actor.active = false;
        }
      }
    }
    if (collision > 0) {
      this._updatePowerUpInfo(scene.actors);
    }
  }

  _renderActor(actor) {
    const { model, modelMatrix } = actor;
    mat4.identity(modelMatrix);
    mat4.translate(modelMatrix, modelMatrix, actor.location);
    if (actor.scale) {
      mat4.scale(modelMatrix, modelMatrix, actor.scale);
    }
    for (let i = 0; i < actor.rotations.length; i++) {
      const rotation = actor.rotations[i];
      mat4.rotate(modelMatrix, modelMatrix, rotation.angle, rotation.axis);
    }

    if (actor.material) {
      this.renderOptions.material = actor.material;
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

export default RoomScene;
