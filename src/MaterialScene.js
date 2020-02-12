import * as mat4 from 'gl-matrix/mat4';
import { clearScreen, getMaterial } from './utility'
import MaterialModel from './MaterialModel';

class MaterialScene {
  constructor() {
    this.initScene = this.initScene.bind(this);
    this.drawScene = this.drawScene.bind(this);
  }

  initScene(gl) {
    const model4 = new MaterialModel(gl, 'tetrahedron');
    const model6 = new MaterialModel(gl, 'cube');
    const model8 = new MaterialModel(gl, 'octahedron');
    const model10 = new MaterialModel(gl, 'pentagonaltrapezohedron');
    const model12 = new MaterialModel(gl, 'dodecahedron');
    const model20 = new MaterialModel(gl, 'icosahedron');

    this.scene = {
      actors: [
        {
          model: model4,
          material: getMaterial('gold'),
          location: [-3.75, 0.0, -8.0],
          rotations: [
            {
              angle: 0.0,
              axis: [0, 1, 0],
              speed: 0.8
            },
            {
              angle: 0.0,
              axis: [1, 0, 0],
              speed: 0.4
            }
          ]
        },
        {
          model: model6,
          material: getMaterial('gold'),
          location: [-2.25, 0.0, -8.0],
          rotations: [
            {
              angle: 0.0,
              axis: [0, 1, 0],
              speed: 0.8
            },
            {
              angle: 0.0,
              axis: [1, 0, 0],
              speed: 0.4
            }
          ]
        },
        {
          model: model8,
          material: getMaterial('gold'),
          location: [-0.75, 0.0, -8.0],
          rotations: [
            {
              angle: 0.0,
              axis: [0, 1, 0],
              speed: 0.8
            },
            {
              angle: 0.0,
              axis: [1, 0, 0],
              speed: 0.4
            }
          ]
        },
        {
          model: model10,
          material: getMaterial('gold'),
          location: [0.75, 0.0, -8.0],
          rotations: [
            {
              angle: 0.0,
              axis: [0, 1, 0],
              speed: 0.8
            },
            {
              angle: 0.0,
              axis: [1, 0, 0],
              speed: 0.4
            }
          ]
        },
        {
          model: model12,
          material: getMaterial('gold'),
          location: [2.25, 0.0, -8.0],
          rotations: [
            {
              angle: 0.0,
              axis: [0, 1, 0],
              speed: 0.8
            },
            {
              angle: 0.0,
              axis: [1, 0, 0],
              speed: 0.4
            }
          ]
        },
        {
          model: model20,
          material: getMaterial('gold'),
          location: [3.75, 0.0, -8.0],
          rotations: [
            {
              angle: 0.0,
              axis: [0, 1, 0],
              speed: 0.8
            },
            {
              angle: 0.0,
              axis: [1, 0, 0],
              speed: 0.4
            }
          ]
        },
        {
          model: model4,
          material: getMaterial('chrome'),
          location: [-3.75, 2.0, -8.0],
          rotations: [
            {
              angle: 0.0,
              axis: [0, 1, 0],
              speed: 0.8
            },
            {
              angle: 0.0,
              axis: [1, 0, 0],
              speed: 0.4
            }
          ]
        },
        {
          model: model6,
          material: getMaterial('chrome'),
          location: [-2.25, 2.0, -8.0],
          rotations: [
            {
              angle: 0.0,
              axis: [0, 1, 0],
              speed: 0.8
            },
            {
              angle: 0.0,
              axis: [1, 0, 0],
              speed: 0.4
            }
          ]
        },
        {
          model: model8,
          material: getMaterial('chrome'),
          location: [-0.75, 2.0, -8.0],
          rotations: [
            {
              angle: 0.0,
              axis: [0, 1, 0],
              speed: 0.8
            },
            {
              angle: 0.0,
              axis: [1, 0, 0],
              speed: 0.4
            }
          ]
        },
        {
          model: model10,
          material: getMaterial('chrome'),
          location: [0.75, 2.0, -8.0],
          rotations: [
            {
              angle: 0.0,
              axis: [0, 1, 0],
              speed: 0.8
            },
            {
              angle: 0.0,
              axis: [1, 0, 0],
              speed: 0.4
            }
          ]
        },
        {
          model: model12,
          material: getMaterial('chrome'),
          location: [2.25, 2.0, -8.0],
          rotations: [
            {
              angle: 0.0,
              axis: [0, 1, 0],
              speed: 0.8
            },
            {
              angle: 0.0,
              axis: [1, 0, 0],
              speed: 0.4
            }
          ]
        },
        {
          model: model20,
          material: getMaterial('chrome'),
          location: [3.75, 2.0, -8.0],
          rotations: [
            {
              angle: 0.0,
              axis: [0, 1, 0],
              speed: 0.8
            },
            {
              angle: 0.0,
              axis: [1, 0, 0],
              speed: 0.4
            }
          ]
        },
        {
          model: model4,
          material: getMaterial('obsidian'),
          location: [-3.75, -2.0, -8.0],
          rotations: [
            {
              angle: 0.0,
              axis: [0, 1, 0],
              speed: 0.8
            },
            {
              angle: 0.0,
              axis: [1, 0, 0],
              speed: 0.4
            }
          ]
        },
        {
          model: model6,
          material: getMaterial('obsidian'),
          location: [-2.25, -2.0, -8.0],
          rotations: [
            {
              angle: 0.0,
              axis: [0, 1, 0],
              speed: 0.8
            },
            {
              angle: 0.0,
              axis: [1, 0, 0],
              speed: 0.4
            }
          ]
        },
        {
          model: model8,
          material: getMaterial('obsidian'),
          location: [-0.75, -2.0, -8.0],
          rotations: [
            {
              angle: 0.0,
              axis: [0, 1, 0],
              speed: 0.8
            },
            {
              angle: 0.0,
              axis: [1, 0, 0],
              speed: 0.4
            }
          ]
        },
        {
          model: model10,
          material: getMaterial('obsidian'),
          location: [0.75, -2.0, -8.0],
          rotations: [
            {
              angle: 0.0,
              axis: [0, 1, 0],
              speed: 0.8
            },
            {
              angle: 0.0,
              axis: [1, 0, 0],
              speed: 0.4
            }
          ]
        },
        {
          model: model12,
          material: getMaterial('obsidian'),
          location: [2.25, -2.0, -8.0],
          rotations: [
            {
              angle: 0.0,
              axis: [0, 1, 0],
              speed: 0.8
            },
            {
              angle: 0.0,
              axis: [1, 0, 0],
              speed: 0.4
            }
          ]
        },
        {
          model: model20,
          material: getMaterial('obsidian'),
          location: [3.75, -2.0, -8.0],
          rotations: [
            {
              angle: 0.0,
              axis: [0, 1, 0],
              speed: 0.8
            },
            {
              angle: 0.0,
              axis: [1, 0, 0],
              speed: 0.4
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

    model.draw(projectionMatrix, viewMatrix, modelMatrix, lights, actor.material);
  }

  _animateActor(deltaTime, actor) {
    for (let i = 0; i < actor.rotations.length; i++) {
      const rotation = actor.rotations[i];
      rotation.angle += deltaTime * rotation.speed;
    }
  }
}

export default MaterialScene;
