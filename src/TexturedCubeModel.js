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
        vertex: 'shaders/texturedcube/vertex.glsl',
        fragment: 'shaders/texturedcube/fragment.glsl'
      }
    });
  }

  draw(projectionMatrix, viewMatrix, modelMatrix) {
    this._drawModel({
      gl: this.gl,
      model: this.model,
      projectionMatrix,
      viewMatrix,
      modelMatrix
    });
  }

  _geometry({ addSquare }) {
    const f0 = [-1, -1, 1];
    const f1 = [1, 1, 1];
    const f2 = [-1, 1, 1];
    const f3 = [1, -1, 1];
    const b0 = [-1, -1, -1];
    const b1 = [1, 1, -1];
    const b2 = [-1, 1, -1];
    const b3 = [1, -1, -1];
    addSquare(f0, f1, f2, f3);  // front
    addSquare(b3, b2, b1, b0);  // back
    addSquare(b0, f2, b2, f0);  // left
    addSquare(f3, b1, f1, b3);  // right
    addSquare(b0, f3, f0, b3);  // bottom
    addSquare(b1, f2, f1, b2);  // top
  }
}

export default TexturedCubeModel;
