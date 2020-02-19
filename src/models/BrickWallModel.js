import Model from './Model';

class BrickWallModel extends Model {
  constructor(gl) {
    super(gl);
    this.gl = gl;
    this._initModel({
      gl,
      geometry: this._geometry,
      texture: {
        diffuse: 'images/Brick_Wall_017_basecolor.jpg',
        normal: 'images/Brick_Wall_017_normal.jpg',
        height: 'images/Brick_Wall_017_height.png',
        occlusion: 'images/Brick_Wall_017_ambientOcclusion.jpg'
      },
      shader: {
        vertex: 'shaders/texture_LDNOP/vertex.glsl',
        fragment: 'shaders/texture_LDNOP/fragment.glsl'
      }
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
    addSquare(b0, b1, f1, f0);  // top
    addSquare(b2, b3, f3, f2);  // bottom
  }
}

export default BrickWallModel;
