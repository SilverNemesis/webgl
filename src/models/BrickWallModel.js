import Model from './Model';

class BrickWallModel extends Model {
  constructor(gl) {
    super(gl);
    this.gl = gl;
    this.draw = this.draw.bind(this);
    this._initModel({
      gl,
      geometry: this._geometry,
      texture: {
        diffuse: 'images/Brick_Wall_017_basecolor.jpg',
        normal: 'images/Brick_Wall_017_normal.jpg',
        height: 'images/Brick_Wall_017_height.png'
      },
      shader: {
        vertex: 'shaders/brickwall/vertex.glsl',
        fragment: 'shaders/brickwall/fragment.glsl'
      }
    });
  }

  draw(projectionMatrix, viewMatrix, modelMatrix) {
    this._drawModel({
      gl: this.gl,
      model: this.model,
      projectionMatrix,
      viewMatrix,
      modelMatrix,
      showDiffuseMap: 1,
      showNormalMap: 1,
      parallaxHeightScale: 0.04,
      parallaxSteps: 32,
      parallaxOcclusionMapping: 1,
      ambientLight: [0.2, 0.2, 0.2],
      directionalLight: {
        color: [0.5, 0.5, 0.5],
        direction: [0.0, -1.0, 1.0]
      },
      pointLight: {
        color: [1.0, 1.0, 1.0],
        position: [0.0, 0.0, 0.0]
      },
      cameraPosition: [0.0, 0.0, 0.0]
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
