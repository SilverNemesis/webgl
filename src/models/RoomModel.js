import Model from './Model';

class RoomModel extends Model {
  constructor(gl) {
    super(gl);
    this.gl = gl;
    this.draw = this.draw.bind(this);
    this._initModel({
      gl,
      geometry: this._geometry,
      textures: [
        {
          diffuse: 'images/Brick_Wall_017_basecolor.jpg',
          normal: 'images/Brick_Wall_017_normal.jpg',
          occlusion: 'images/Brick_Wall_017_ambientOcclusion.jpg'
        },
        {
          diffuse: 'images/Tiles_035_basecolor.jpg',
          normal: 'images/Tiles_035_normal.jpg',
          occlusion: 'images/Tiles_035_ambientOcclusion.jpg'
        }
      ],
      shader: {
        vertex: 'shaders/texture_LDNO/vertex.glsl',
        fragment: 'shaders/texture_LDNO/fragment.glsl'
      }
    });
  }

  draw(projectionMatrix, viewMatrix, modelMatrix, options) {
    const {
      showDiffuseMap,
      showNormalMap,
      showAmbientOcclusionMap,
      parallaxHeightScale,
      parallaxSteps,
      parallaxOcclusionMapping,
      ambientLight,
      directionalLight,
      pointLight,
      cameraPosition
    } = options;
    this._drawModel({
      gl: this.gl,
      model: this.model,
      projectionMatrix,
      viewMatrix,
      modelMatrix,
      showDiffuseMap,
      showNormalMap,
      showAmbientOcclusionMap,
      parallaxHeightScale,
      parallaxSteps,
      parallaxOcclusionMapping,
      ambientLight,
      directionalLight,
      pointLight,
      cameraPosition
    });
  }

  _geometry({ addSquare }) {
    const width = 4;
    const height = 4;
    const data = [
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0]
    ]
    const ofs_x = -width / 2;
    const ofs_z = -height / 2;
    for (let z = 0; z < height; z++) {
      for (let x = 0; x < width; x++) {
        const left = x + ofs_x;
        const right = left + 1;
        const back = z + ofs_z;
        const front = back + 1;
        const top = 1;
        const bottom = 0;

        const f0 = [left, top, front];
        const f1 = [right, top, front];
        const f2 = [right, bottom, front];
        const f3 = [left, bottom, front];
        const b0 = [left, top, back];
        const b1 = [right, top, back];
        const b2 = [right, bottom, back];
        const b3 = [left, bottom, back];

        if (data[z][x] === 0) {
          addSquare(b2, b3, f3, f2, { bufferIndex: 1 });

          if (z === 0 || data[z - 1][x] !== 0) {
            addSquare(b1, b0, b3, b2);
          }

          if (x === 0 || data[z][x - 1] !== 0) {
            addSquare(b0, f0, f3, b3);
          }

          if (z === height - 1 || data[z + 1][x] !== 0) {
            addSquare(f0, f1, f2, f3);
          }

          if (x === width - 1 || data[z][x + 1] !== 0) {
            addSquare(f1, b1, b2, f2);
          }
        }
      }
    }
  }
}

export default RoomModel;
