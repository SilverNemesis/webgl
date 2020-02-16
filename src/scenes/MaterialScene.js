import * as mat4 from 'gl-matrix/mat4';
import { clearScreen, getMaterialList, getMaterial } from '../lib/utility'
import MaterialModel from '../models/MaterialModel';

class MaterialScene {
  constructor(gl) {
    this.gl = gl;
    this.setOption = this.setOption.bind(this);
    this.initScene = this.initScene.bind(this);
    this.drawScene = this.drawScene.bind(this);
    this.renderOptions = {
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
      materials: new Array(3).fill(0),
      lightingModel: 2
    };
    const materialList = getMaterialList();
    this.options = [
      {
        description: 'Various solid geometries with various materials using Phong shading',
        type: 'description'
      },
      {
        name: 'Material 1',
        type: 'select',
        options: materialList
      },
      {
        name: 'Material 2',
        type: 'select',
        options: materialList
      },
      {
        name: 'Material 3',
        type: 'select',
        options: materialList
      }
    ];

    this.setOption(this.options[1], 8);
    this.setOption(this.options[2], 10);
    this.setOption(this.options[3], 2);
  }

  setOption(option, value) {
    option.value = Number(value);
    if (option.id) {
      this.renderOptions[option.id] = option.value;
    }
    if (option.name === 'Material 1') {
      const materialName = option.options[option.value];
      this.renderOptions.materials[0] = getMaterial(materialName);
    }
    else if (option.name === 'Material 2') {
      const materialName = option.options[option.value];
      this.renderOptions.materials[1] = getMaterial(materialName);
    }
    else if (option.name === 'Material 3') {
      const materialName = option.options[option.value];
      this.renderOptions.materials[2] = getMaterial(materialName);
    }
  }

  initScene() {
    const gl = this.gl;
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
          materialIndex: 1,
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
          materialIndex: 1,
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
          materialIndex: 1,
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
          materialIndex: 1,
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
          materialIndex: 1,
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
          materialIndex: 1,
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
          materialIndex: 0,
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
          materialIndex: 0,
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
          materialIndex: 0,
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
          materialIndex: 0,
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
          materialIndex: 0,
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
          materialIndex: 0,
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
          materialIndex: 2,
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
          materialIndex: 2,
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
          materialIndex: 2,
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
          materialIndex: 2,
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
          materialIndex: 2,
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
          materialIndex: 2,
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

    this.renderOptions.cameraPos = scene.camera;

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

    this.renderOptions.material = this.renderOptions.materials[actor.materialIndex]

    model.draw(projectionMatrix, viewMatrix, modelMatrix, this.renderOptions);
  }

  _animateActor(deltaTime, actor) {
    for (let i = 0; i < actor.rotations.length; i++) {
      const rotation = actor.rotations[i];
      rotation.angle += deltaTime * rotation.speed;
    }
  }
}

export default MaterialScene;
