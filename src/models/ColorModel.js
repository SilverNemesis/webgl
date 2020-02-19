import Model from './Model';
import { getShape } from '../lib/shapes';

class ColorModel extends Model {
  constructor(gl, shapeName, colors) {
    super(gl);
    this.gl = gl;
    this.draw = this.draw.bind(this);
    this._initModel({
      gl,
      geometry: ({ addFaces }) => {
        const shape = getShape(shapeName);
        if (shape) {
          addFaces(shape.vertices, shape.faces, { colors });
        } else {
          alert('shape ' + shapeName + ' not found');
        }
      },
      shader: {
        vertex: 'shaders/color_L/vertex.glsl',
        fragment: 'shaders/color_L/fragment.glsl'
      }
    });
  }

  draw(projectionMatrix, viewMatrix, modelMatrix, options) {
    this._drawModel(Object.assign({ projectionMatrix, viewMatrix, modelMatrix }, options));
  }
}

export default ColorModel;
