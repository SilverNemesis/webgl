import Model from './Model';
import { getShape } from './utility';

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
        vertex: 'shaders/material/vertex.glsl',
        fragment: 'shaders/material/fragment.glsl'
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

export default MaterialModel;
