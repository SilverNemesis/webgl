import Model from './Model';
import { getShape } from '../lib/utility';

class ColorModel extends Model {
  constructor(gl, shapeName, colors) {
    super(gl);
    this.gl = gl;
    this.draw = this.draw.bind(this);
    this._initModel({
      gl,
      geometry: ({ addFaces }) => {
        const shape = getShape(shapeName);
        addFaces(shape.vertices, shape.faces, { colors });
      },
      shader: {
        vertex: 'shaders/color_L/vertex.glsl',
        fragment: 'shaders/color_L/fragment.glsl'
      }
    });
  }

  draw(projectionMatrix, viewMatrix, modelMatrix, lights, material) {
    this._drawModel({
      gl: this.gl,
      model: this.model,
      projectionMatrix,
      viewMatrix,
      modelMatrix,
      lights,
      material,
      lightingModel: 0
    });
  }
}

export default ColorModel;
