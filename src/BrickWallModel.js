import * as mat4 from 'gl-matrix/mat4';
import * as vec3 from 'gl-matrix/vec3';
import { loadTexture, initShaderProgram } from './utility'

class BrickWallModel {
  constructor(gl) {
    this.gl = gl;
    this.draw = this.draw.bind(this);
    const shaderProgram = this._initShaders(gl);
    this.model = {
      shader: {
        program: shaderProgram,
        attribLocations: {
          vertexPosition: gl.getAttribLocation(shaderProgram, 'vert_pos'),
          vertexTangent: gl.getAttribLocation(shaderProgram, 'vert_tang'),
          vertexBitangent: gl.getAttribLocation(shaderProgram, 'vert_bitang'),
          textureCoord: gl.getAttribLocation(shaderProgram, 'vert_uv')
        },
        uniformLocations: {
          modelMatrix: gl.getUniformLocation(shaderProgram, 'model_mtx'),
          viewMatrix: gl.getUniformLocation(shaderProgram, 'view_mtx'),
          normalMatrix: gl.getUniformLocation(shaderProgram, 'norm_mtx'),
          projectionMatrix: gl.getUniformLocation(shaderProgram, 'proj_mtx'),
          textureNormal: gl.getUniformLocation(shaderProgram, 'tex_norm'),
          textureDiffuse: gl.getUniformLocation(shaderProgram, 'tex_diffuse'),
          showTexture: gl.getUniformLocation(shaderProgram, 'show_texture'),
          cameraPosition: gl.getUniformLocation(shaderProgram, 'camera_pos'),
          ambientLight: gl.getUniformLocation(shaderProgram, 'ambient_color'),
          directionalLight: {
            direction: gl.getUniformLocation(shaderProgram, 'diffuse_dir'),
            color: gl.getUniformLocation(shaderProgram, 'diffuse_color')
          },
          pointLight: {
            position: gl.getUniformLocation(shaderProgram, 'point_pos'),
            color: gl.getUniformLocation(shaderProgram, 'point_color')
          }
        }
      },
      buffers: this._initBuffers(gl),
      texture: {
        diffuse: loadTexture(gl, 'images/Brick_Wall_017_basecolor.jpg'),
        normal: loadTexture(gl, 'images/Brick_Wall_017_normal.jpg')
      }
    }
  }

  draw(projectionMatrix, viewMatrix, modelMatrix) {
    const gl = this.gl;
    const { buffers, texture } = this.model;

    const shader = this.model.shader;

    {
      const numComponents = 3;
      const type = gl.FLOAT;
      const normalize = false;
      const stride = 0;
      const offset = 0;
      gl.bindBuffer(gl.ARRAY_BUFFER, buffers.position);
      gl.vertexAttribPointer(shader.attribLocations.vertexPosition, numComponents, type, normalize, stride, offset);
      gl.enableVertexAttribArray(shader.attribLocations.vertexPosition);
    }

    {
      const numComponents = 3;
      const type = gl.FLOAT;
      const normalize = false;
      const stride = 0;
      const offset = 0;
      gl.bindBuffer(gl.ARRAY_BUFFER, buffers.tangent);
      gl.vertexAttribPointer(shader.attribLocations.vertexTangent, numComponents, type, normalize, stride, offset);
      gl.enableVertexAttribArray(shader.attribLocations.vertexTangent);
    }

    {
      const numComponents = 3;
      const type = gl.FLOAT;
      const normalize = false;
      const stride = 0;
      const offset = 0;
      gl.bindBuffer(gl.ARRAY_BUFFER, buffers.bitangent);
      gl.vertexAttribPointer(shader.attribLocations.vertexBitangent, numComponents, type, normalize, stride, offset);
      gl.enableVertexAttribArray(shader.attribLocations.vertexBitangent);
    }

    {
      const numComponents = 2;
      const type = gl.FLOAT;
      const normalize = false;
      const stride = 0;
      const offset = 0;
      gl.bindBuffer(gl.ARRAY_BUFFER, buffers.textureCoord);
      gl.vertexAttribPointer(shader.attribLocations.textureCoord, numComponents, type, normalize, stride, offset);
      gl.enableVertexAttribArray(shader.attribLocations.textureCoord);
    }

    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, buffers.indices);

    const normalMatrix = mat4.create();
    mat4.invert(normalMatrix, modelMatrix);
    mat4.transpose(normalMatrix, normalMatrix);

    gl.useProgram(shader.program);
    gl.uniformMatrix4fv(shader.uniformLocations.projectionMatrix, false, projectionMatrix);
    gl.uniformMatrix4fv(shader.uniformLocations.modelMatrix, false, modelMatrix);
    gl.uniformMatrix4fv(shader.uniformLocations.viewMatrix, false, viewMatrix);
    gl.uniformMatrix4fv(shader.uniformLocations.normalMatrix, false, normalMatrix);

    gl.uniform1i(shader.uniformLocations.showTexture, 1);

    gl.uniform3f(shader.uniformLocations.ambientLight, 0.2, 0.2, 0.2);

    const direction = vec3.fromValues(0.0, 1.0, 0.0);
    vec3.normalize(direction, direction);
    gl.uniform3f(shader.uniformLocations.directionalLight.color, 1.0, 1.0, 1.0);
    gl.uniform3fv(shader.uniformLocations.directionalLight.direction, direction);

    gl.uniform3f(shader.uniformLocations.pointLight.color, 1.0, 1.0, 1.0);
    gl.uniform3f(shader.uniformLocations.pointLight.position, 0.0, 0.0, 0.0);

    gl.uniform3f(shader.uniformLocations.cameraPosition, 0.0, 0.0, 0.0);

    {
      gl.activeTexture(gl.TEXTURE0);
      gl.bindTexture(gl.TEXTURE_2D, texture.normal);
      gl.uniform1i(shader.uniformLocations.textureNormal, 0);

      gl.activeTexture(gl.TEXTURE1);
      gl.bindTexture(gl.TEXTURE_2D, texture.diffuse);
      gl.uniform1i(shader.uniformLocations.textureDiffuse, 1);

      const vertexCount = buffers.vertexCount;
      const type = gl.UNSIGNED_SHORT;
      const offset = 0;
      gl.drawElements(gl.TRIANGLES, vertexCount, type, offset);
    }
  }

  _initShaders(gl) {
    const vsSource = `
      precision highp float;

      attribute vec3 vert_pos;
      attribute vec3 vert_tang;
      attribute vec3 vert_bitang;
      attribute vec2 vert_uv;
      
      uniform vec3 camera_pos;
      uniform vec3 point_pos;
      uniform vec3 diffuse_dir;
      uniform mat4 norm_mtx;
      uniform mat4 model_mtx;
      uniform mat4 view_mtx;
      uniform mat4 proj_mtx;
      
      varying vec2 frag_uv;
      varying vec3 ts_light_pos;
      varying vec3 ts_view_pos;
      varying vec3 ts_frag_pos;
      varying vec3 ts_diffuse_dir;
      
      mat3 transpose(in mat3 inMatrix)
      {
          vec3 i0 = inMatrix[0];
          vec3 i1 = inMatrix[1];
          vec3 i2 = inMatrix[2];
      
          mat3 outMatrix = mat3(
              vec3(i0.x, i1.x, i2.x),
              vec3(i0.y, i1.y, i2.y),
              vec3(i0.z, i1.z, i2.z)
          );
      
          return outMatrix;
      }
      
      void main(void)
      {
          frag_uv = vert_uv;

          vec3 t = normalize(mat3(norm_mtx) * vert_tang);
          vec3 b = normalize(mat3(norm_mtx) * vert_bitang);
          mat3 tbn = transpose(mat3(t, b, normalize(mat3(norm_mtx) * cross(vert_bitang, vert_tang))));
      
          ts_light_pos = tbn * point_pos;
          ts_view_pos = tbn * camera_pos;
          ts_frag_pos = tbn * vec3(model_mtx * vec4(vert_pos, 1.0));
          ts_diffuse_dir = tbn * diffuse_dir;

          gl_Position = proj_mtx * view_mtx * model_mtx * vec4(vert_pos, 1.0);
      } 
    `;

    const fsSource = `
      precision highp float;

      uniform sampler2D tex_norm;
      uniform sampler2D tex_diffuse;
      uniform int show_texture;
      uniform vec3 ambient_color;
      uniform vec3 diffuse_color;
      uniform vec3 point_color;
      
      varying vec2 frag_uv;
      varying vec3 ts_light_pos;
      varying vec3 ts_view_pos;
      varying vec3 ts_frag_pos;
      varying vec3 ts_diffuse_dir;
      
      void main(void)
      {
        vec3 view_dir = normalize(ts_view_pos - ts_frag_pos);
      
        vec3 albedo = texture2D(tex_diffuse, frag_uv).rgb;

        if (show_texture == 0) {
          albedo = vec3(1.0, 1.0, 1.0);
        }
      
        float point_intensity;
        float diffuse_intensity;

        vec3 norm = normalize(texture2D(tex_norm, frag_uv).rgb * 2.0 - 1.0);
        vec3 light_dir = ts_light_pos - ts_frag_pos;
        point_intensity = 15.0 * max(dot(norm, normalize(light_dir)), 0.0) / (length(light_dir) * length(light_dir));
        point_intensity = clamp(point_intensity, 0.0, 1.0);
        diffuse_intensity = max(dot(ts_diffuse_dir, norm), 0.0);

        vec3 lighting = ambient_color + (diffuse_color * diffuse_intensity) + (point_color * point_intensity); 
        gl_FragColor = vec4(albedo * lighting, 1.0);
      }
    `;

    return initShaderProgram(gl, vsSource, fsSource);
  }

  _initBuffers(gl) {
    const positions = [];
    const tangents = [];
    const bitangents = [];
    const textureCoordinates = [];
    const colors = [];
    const indices = [];
    const tangent = vec3.create();
    const bitangent = vec3.create();
    let offset = 0;

    const addSquare = (c0, c1, c2, c3) => {
      positions.push(...c0, ...c1, ...c2, ...c3);
      vec3.subtract(tangent, c3, c0);
      vec3.normalize(tangent, tangent);
      tangents.push(...tangent, ...tangent, ...tangent, ...tangent);
      vec3.subtract(bitangent, c0, c2);
      vec3.normalize(bitangent, bitangent);
      bitangents.push(...bitangent, ...bitangent, ...bitangent, ...bitangent);
      textureCoordinates.push(0, 0, 1, 1, 0, 1, 1, 0);
      indices.push(offset + 0, offset + 1, offset + 2, offset + 0, offset + 3, offset + 1);
      offset += 4;
    }

    const f0 = vec3.fromValues(-1, -1, 1);
    const f1 = vec3.fromValues(1, 1, 1);
    const f2 = vec3.fromValues(-1, 1, 1);
    const f3 = vec3.fromValues(1, -1, 1);
    const b0 = vec3.fromValues(-1, -1, -1);
    const b1 = vec3.fromValues(1, 1, -1);
    const b2 = vec3.fromValues(-1, 1, -1);
    const b3 = vec3.fromValues(1, -1, -1);
    addSquare(f0, f1, f2, f3);  // front
    addSquare(b3, b2, b1, b0);  // back
    addSquare(b0, f2, b2, f0);  // left
    addSquare(f3, b1, f1, b3);  // right
    addSquare(b0, f3, f0, b3);  // bottom
    addSquare(b1, f2, f1, b2);  // top

    const positionBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions), gl.STATIC_DRAW);

    const tangentBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, tangentBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(tangents), gl.STATIC_DRAW);

    const bitangentBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, bitangentBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(bitangents), gl.STATIC_DRAW);

    const textureCoordBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, textureCoordBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(textureCoordinates), gl.STATIC_DRAW);

    const indexBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(indices), gl.STATIC_DRAW);

    return { position: positionBuffer, tangent: tangentBuffer, bitangent: bitangentBuffer, textureCoord: textureCoordBuffer, indices: indexBuffer, vertexCount: indices.length };
  }
}

export default BrickWallModel;
