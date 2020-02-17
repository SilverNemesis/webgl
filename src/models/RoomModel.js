import Model from './Model';

class RoomModel extends Model {
  constructor(gl, map) {
    super(gl);
    this.gl = gl;
    this.map = map;
    this.draw = this.draw.bind(this);
    this.update = this.update.bind(this);
    this._geometry = this._geometry.bind(this);
    this._initModel({
      gl,
      geometry: this._geometry,
      textures: [
        {
          diffuse: 'images/Brick_Wall_017_basecolor.jpg',
          normal: 'images/Brick_Wall_017_normal.jpg',
          height: 'images/Brick_Wall_017_height.png',
          occlusion: 'images/Brick_Wall_017_ambientOcclusion.jpg'
        },
        {
          diffuse: 'images/Tiles_035_basecolor.jpg',
          normal: 'images/Tiles_035_normal.jpg',
          height: 'images/Tiles_035_height.png',
          occlusion: 'images/Tiles_035_ambientOcclusion.jpg'
        },
        {
          diffuse: 'images/Wood_planks_011_basecolor.jpg',
          normal: 'images/Wood_planks_011_normal.jpg',
          height: 'images/Wood_planks_011_height.png',
          occlusion: 'images/Wood_planks_011_ambientOcclusion.jpg'
        }
      ],
      shader: {
        vertex: 'shaders/texture_LDNOP/vertex.glsl',
        fragment: 'shaders/texture_LDNOP/fragment.glsl'
      }
    });
  }

  draw(projectionMatrix, viewMatrix, modelMatrix, options) {
    const {
      showDiffuseMap,
      showNormalMap,
      showAmbientOcclusionMap,
      showParallaxMap,
      parallaxHeightScale,
      parallaxSteps,
      parallaxOcclusionMapping,
      ambientLight,
      directionalLight,
      pointLight,
      cameraPos
    } = options;
    this._drawModel({
      projectionMatrix,
      viewMatrix,
      modelMatrix,
      showDiffuseMap,
      showNormalMap,
      showAmbientOcclusionMap,
      showParallaxMap,
      parallaxHeightScale,
      parallaxSteps,
      parallaxOcclusionMapping,
      ambientLight,
      directionalLight,
      pointLight,
      cameraPos
    });
  }

  update(map) {
    this.map = map;
    this._updateModel(this._geometry);
  }

  _geometry({ addSquare }) {
    const { width, height, data } = this.map;

    const check = (x, y) => {
      if (x < 0 || y < 0 || x > width - 1 || y > height - 1) {
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
        const left = x + ofs_x;
        const right = left + 1;
        const back = y + ofs_y;
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

        const f0h = [left, top + 1, front];
        const f1h = [right, top + 1, front];
        const f2h = [right, bottom + 1, front];
        const f3h = [left, bottom + 1, front];
        const b0h = [left, top + 1, back];
        const b1h = [right, top + 1, back];
        const b2h = [right, bottom + 1, back];
        const b3h = [left, bottom + 1, back];

        if (data[y][x] === 0) {
          addSquare(b2, b3, f3, f2, { bufferIndex: 1 });
          addSquare(b0, b1, f1, f0, { bufferIndex: 2 });

          if (y === 0 || data[y - 1][x] === 1) {
            addSquare(b1, b0, b3, b2);
          }

          if (x === 0 || data[y][x - 1] === 1) {
            addSquare(b0, f0, f3, b3);
          }

          if (y === height - 1 || data[y + 1][x] === 1) {
            addSquare(f0, f1, f2, f3);
          }

          if (x === width - 1 || data[y][x + 1] === 1) {
            addSquare(f1, b1, b2, f2);
          }
        }
        else if (data[y][x] === 2) {
          const neighbors = [0, 0, 0, 0, 0, 0, 0, 0, 0];

          for (let yo = -1; yo < 2; yo++) {
            for (let xo = -1; xo < 2; xo++) {
              neighbors[(yo + 1) * 3 + (xo + 1)] = check(x + xo, y + yo);
            }
          }

          addSquare(b2, b3, f3, f2, { bufferIndex: 1 });
          addSquare(b0h, b1h, f1h, f0h, { bufferIndex: 2 });

          if (neighbors[1]) {
            addSquare(b1, b0, b3, b2);
            addSquare(b1h, b0h, b3h, b2h);
          } else if (neighbors[0] && neighbors[2]) {
            addSquare(b1h, b0h, b3h, b2h);
          }

          if (neighbors[3]) {
            addSquare(b0, f0, f3, b3);
            addSquare(b0h, f0h, f3h, b3h);
          } else if (neighbors[0] && neighbors[6]) {
            addSquare(b0h, f0h, f3h, b3h);
          }

          if (neighbors[7]) {
            addSquare(f0, f1, f2, f3);
            addSquare(f0h, f1h, f2h, f3h);
          } else if (neighbors[6] && neighbors[8]) {
            addSquare(f0h, f1h, f2h, f3h);
          }

          if (neighbors[5]) {
            addSquare(f1, b1, b2, f2);
            addSquare(f1h, b1h, b2h, f2h);
          } else if (neighbors[2] && neighbors[8]) {
            addSquare(f1h, b1h, b2h, f2h);
          }
        }
      }
    }
  }
}

export default RoomModel;
