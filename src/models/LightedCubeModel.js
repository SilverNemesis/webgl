import Model from './Model';

class LightedCubeModel extends Model {
  constructor(gl) {
    super(gl);
    this.gl = gl;
    this.draw = this.draw.bind(this);
    this._initModel({
      gl,
      geometry: this._geometry,
      texture: {
        diffuse: 'images/cubetexture.png'
      },
      shader: {
        vertex: 'shaders/color_L/vertex.glsl',
        fragment: 'shaders/color_L/fragment.glsl'
      }
    });
  }

  draw(projectionMatrix, viewMatrix, modelMatrix, perPixel) {
    this._drawModel({
      gl: this.gl,
      model: this.model,
      projectionMatrix,
      viewMatrix,
      modelMatrix,
      ambientLight: [0.3, 0.3, 0.3],
      directionalLight: {
        color: [0.5, 0.5, 0.5],
        direction: [0.0, 1.0, 0.0]
      },
      pointLight: {
        color: [0.7, 0.7, 0.7],
        position: [0.0, 0.0, 0.0]
      },
      cameraPosition: [0.0, 0.0, 0.0],
      perPixel
    });
  }

  _geometry({ addSquare }) {
    const f0 = [-1, -1, 1];
    const f1 = [1, -1, 1];
    const f2 = [1, 1, 1];
    const f3 = [-1, 1, 1];
    const b0 = [-1, -1, -1];
    const b1 = [1, -1, -1];
    const b2 = [1, 1, -1];
    const b3 = [-1, 1, -1];
    addSquare(f0, f1, f2, f3);  // front
    addSquare(b1, b0, b3, b2);  // back
    addSquare(b0, f0, f3, b3);  // left
    addSquare(f1, b1, b2, f2);  // right
    addSquare(b0, b1, f1, f0);  // bottom
    addSquare(b2, b3, f3, f2);  // top
  }
}

export default LightedCubeModel;
