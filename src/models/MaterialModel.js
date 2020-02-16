import Model from './Model';
import { getShape } from '../lib/utility';

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

  draw(projectionMatrix, viewMatrix, modelMatrix, cameraPos, lights, material) {
    this._drawModel({
      projectionMatrix,
      viewMatrix,
      modelMatrix,
      cameraPos,
      lights,
      material
    });
  }
}

export default MaterialModel;
