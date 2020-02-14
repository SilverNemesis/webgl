import Model from './Model';
import { getShape } from '../lib/utility';

class ColoredModel extends Model {
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
        vertex: 'shaders/color/vertex.glsl',
        fragment: 'shaders/color/fragment.glsl'
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
      material
    });
  }
}

export default ColoredModel;
