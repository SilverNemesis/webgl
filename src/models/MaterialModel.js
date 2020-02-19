import Model from './Model';
import { getShape } from '../lib/shapes';

class MaterialModel extends Model {
  constructor(gl, shapeName) {
    super(gl);
    this.gl = gl;
    this.draw = this.draw.bind(this);
    this._initModel({
      gl,
      geometry: ({ addFaces }) => {
        const shape = getShape(shapeName);
        addFaces(shape.vertices, shape.faces);
      },
      shader: {
        vertex: 'shaders/material_L/vertex.glsl',
        fragment: 'shaders/material_L/fragment.glsl'
      }
    });
  }
}

export default MaterialModel;
