import Model from './Model';

class TexturedCubeModel extends Model {
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
        vertex: 'shaders/texture_LD/vertex.glsl',
        fragment: 'shaders/texture_LD/fragment.glsl'
      }
    });
  }

  draw(projectionMatrix, viewMatrix, modelMatrix, options) {
    const {
      ambientLight,
      directionalLight,
      pointLight,
      cameraPos,
      lightingModel
    } = options;
    this._drawModel({
      gl: this.gl,
      model: this.model,
      projectionMatrix,
      viewMatrix,
      modelMatrix,
      ambientLight,
      directionalLight,
      pointLight,
      cameraPos,
      lightingModel
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

export default TexturedCubeModel;
