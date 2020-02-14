import Model from './Model';

class MazeModel extends Model {
  constructor(gl, maze) {
    super(gl);
    this.gl = gl;
    this.draw = this.draw.bind(this);
    this.update = this.update.bind(this);
    this._geometry = this._geometry.bind(this);
    this.maze = maze;
    this._initModel({
      gl,
      geometry: this._geometry,
      shaders: [
        {
          vertex: 'shaders/color_L/vertex.glsl',
          fragment: 'shaders/color_L/fragment.glsl'
        },
        {
          vertex: 'shaders/material_L/vertex.glsl',
          fragment: 'shaders/material_L/fragment.glsl'
        }
      ]
    });
  }

  draw(projectionMatrix, viewMatrix, modelMatrix, shaderIndex, lights, material) {
    this._drawModel({
      gl: this.gl,
      model: this.model,
      projectionMatrix,
      viewMatrix,
      modelMatrix,
      shaderIndex,
      lights,
      material,
      lightingModel: 0
    });
  }

  update(maze) {
    this.maze = maze;
    this._updateModel(this._geometry);
  }

  _geometry({ addSquare }) {
    const maze = this.maze;

    const floorColor = [.2, .2, .2];
    const ceilingColor = [.7, .7, .7];
    const wallColor_Back = [.5, 0, .5];
    const wallColor_Front = [0, .5, 0];
    const wallColor_Left = [.5, 0, 0];
    const wallColor_Right = [0, .0, .5];

    const ofs_x = -maze.width / 2;
    const ofs_y = -maze.height / 2;
    for (let y = 0; y < maze.height; y++) {
      for (let x = 0; x < maze.width; x++) {
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

        if (maze.data[y][x] === 0) {
          addSquare(b2, b3, f3, f2, { color: floorColor });
        } else {
          addSquare(b1, b0, f0, f1, { color: ceilingColor });

          if (y === 0 || maze.data[y - 1][x] === 0) {
            addSquare(b0, b1, b2, b3, { color: wallColor_Back });
          }

          if (x === 0 || maze.data[y][x - 1] === 0) {
            addSquare(f0, b0, b3, f3, { color: wallColor_Left });
          }

          if (y === maze.height - 1 || maze.data[y + 1][x] === 0) {
            addSquare(f1, f0, f3, f2, { color: wallColor_Front });
          }

          if (x === maze.width - 1 || maze.data[y][x + 1] === 0) {
            addSquare(b1, f1, f2, b2, { color: wallColor_Right });
          }
        }
      }
    }
  }
}

export default MazeModel;
