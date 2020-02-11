import * as mat4 from 'gl-matrix/mat4';
import * as vec3 from 'gl-matrix/vec3';
import { loadTexture, initShaderProgram, getShaderParameters } from './utility'

class Model {
  _initModel(options) {
    const { gl, geometry } = options;
    let texture
    if (options.texture) {
      texture = {};
      texture.diffuse = loadTexture(gl, options.texture.diffuse);
      texture.normal = loadTexture(gl, options.texture.normal);
    }
    let vertexShader;
    let fragmentShader;
    Promise.all([
      fetch(options.shader.vertex).then((response) => response.text()).then((text) => vertexShader = text),
      fetch(options.shader.fragment).then((response) => response.text()).then((text) => fragmentShader = text)
    ]).then(() => {
      const shaderProgram = initShaderProgram(gl, vertexShader, fragmentShader);
      const shaderParameters = getShaderParameters(gl, shaderProgram);
      const shader = {
        program: shaderProgram,
        attribLocations: {},
        uniformLocations: {
          directionalLight: {},
          pointLight: {}
        }
      };
      shaderParameters.attributes.forEach((attribute) => {
        const location = gl.getAttribLocation(shaderProgram, attribute.name)
        switch (attribute.name) {
          case 'aVertexPosition':
            shader.attribLocations.vertexPosition = location;
            break;
          case 'aVertexTangent':
            shader.attribLocations.vertexTangent = location;
            break;
          case 'aVertexBitangent':
            shader.attribLocations.vertexBitangent = location;
            break;
          case 'aTextureCoord':
            shader.attribLocations.vertexTextureCoord = location;
            break;
          default:
            alert('unknown attribute of ' + attribute.name);
        }
      });
      shaderParameters.uniforms.forEach((uniform) => {
        const location = gl.getUniformLocation(shaderProgram, uniform.name)
        switch (uniform.name) {
          case 'uModelMatrix':
            shader.uniformLocations.modelMatrix = location;
            break;
          case 'uViewMatrix':
            shader.uniformLocations.viewMatrix = location;
            break;
          case 'uNormalMatrix':
            shader.uniformLocations.normalMatrix = location;
            break;
          case 'uProjectionMatrix':
            shader.uniformLocations.projectionMatrix = location;
            break;
          case 'uSamplerNormal':
            shader.uniformLocations.textureNormal = location;
            break;
          case 'uSamplerDiffuse':
            shader.uniformLocations.textureDiffuse = location;
            break;
          case 'uShowTexture':
            shader.uniformLocations.textureShow = location;
            break;
          case 'uCameraPos':
            shader.uniformLocations.cameraPosition = location;
            break;
          case 'uAmbientLight':
            shader.uniformLocations.ambientLight = location;
            break;
          case 'uDirectionalLight.color':
            shader.uniformLocations.directionalLight.color = location;
            break;
          case 'uDirectionalLight.direction':
            shader.uniformLocations.directionalLight.direction = location;
            break;
          case 'uPointLight.color':
            shader.uniformLocations.pointLight.color = location;
            break;
          case 'uPointLight.position':
            shader.uniformLocations.pointLight.position = location;
            break;
          default:
            alert('unknown uniform of ' + uniform.name);
        }
      });
      const buffers = this._initBuffers(gl, shader, geometry);
      this.model = {
        shader,
        buffers,
        texture
      }
    });
  }

  _initBuffers(gl, shader, geometry) {
    const positions = [];
    const tangents = [];
    const bitangents = [];
    const textureCoordinates = [];
    const indices = [];
    const tangent = vec3.create();
    const bitangent = vec3.create();
    let offset = 0;

    const addSquare = (c0, c1, c2, c3) => {
      positions.push(...c0, ...c1, ...c2, ...c3);
      indices.push(offset + 0, offset + 1, offset + 2, offset + 0, offset + 3, offset + 1);
      offset += 4;

      if (shader.attribLocations.vertexTangent) {
        vec3.subtract(tangent, c3, c0);
        vec3.normalize(tangent, tangent);
        tangents.push(...tangent, ...tangent, ...tangent, ...tangent);
      }

      if (shader.attribLocations.vertexBitangent) {
        vec3.subtract(bitangent, c0, c2);
        vec3.normalize(bitangent, bitangent);
        bitangents.push(...bitangent, ...bitangent, ...bitangent, ...bitangent);
      }

      if (shader.attribLocations.vertexTextureCoord) {
        textureCoordinates.push(0, 0, 1, 1, 0, 1, 1, 0);
      }
    }

    geometry({ addSquare });

    const positionBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions), gl.STATIC_DRAW);

    const indexBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(indices), gl.STATIC_DRAW);

    const buffers = { position: positionBuffer, indices: indexBuffer, vertexCount: indices.length }

    if (shader.attribLocations.vertexTangent) {
      const tangentBuffer = gl.createBuffer();
      gl.bindBuffer(gl.ARRAY_BUFFER, tangentBuffer);
      gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(tangents), gl.STATIC_DRAW);
      buffers.tangent = tangentBuffer;
    }

    if (shader.attribLocations.vertexBitangent) {
      const bitangentBuffer = gl.createBuffer();
      gl.bindBuffer(gl.ARRAY_BUFFER, bitangentBuffer);
      gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(bitangents), gl.STATIC_DRAW);
      buffers.bitangent = bitangentBuffer;
    }

    if (shader.attribLocations.vertexTextureCoord) {
      const textureCoordBuffer = gl.createBuffer();
      gl.bindBuffer(gl.ARRAY_BUFFER, textureCoordBuffer);
      gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(textureCoordinates), gl.STATIC_DRAW);
      buffers.textureCoord = textureCoordBuffer;
    }

    return buffers;
  }

  _drawModel(options) {
    if (!options.model) {
      return;
    }

    const { gl, model, projectionMatrix, viewMatrix, modelMatrix, textureShow } = options;
    const { shader, buffers, texture } = model;

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

    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, buffers.indices);

    if (shader.attribLocations.vertexTangent) {
      const numComponents = 3;
      const type = gl.FLOAT;
      const normalize = false;
      const stride = 0;
      const offset = 0;
      gl.bindBuffer(gl.ARRAY_BUFFER, buffers.tangent);
      gl.vertexAttribPointer(shader.attribLocations.vertexTangent, numComponents, type, normalize, stride, offset);
      gl.enableVertexAttribArray(shader.attribLocations.vertexTangent);
    }

    if (shader.attribLocations.vertexBitangent) {
      const numComponents = 3;
      const type = gl.FLOAT;
      const normalize = false;
      const stride = 0;
      const offset = 0;
      gl.bindBuffer(gl.ARRAY_BUFFER, buffers.bitangent);
      gl.vertexAttribPointer(shader.attribLocations.vertexBitangent, numComponents, type, normalize, stride, offset);
      gl.enableVertexAttribArray(shader.attribLocations.vertexBitangent);
    }

    if (shader.attribLocations.vertexTextureCoord) {
      const numComponents = 2;
      const type = gl.FLOAT;
      const normalize = false;
      const stride = 0;
      const offset = 0;
      gl.bindBuffer(gl.ARRAY_BUFFER, buffers.textureCoord);
      gl.vertexAttribPointer(shader.attribLocations.vertexTextureCoord, numComponents, type, normalize, stride, offset);
      gl.enableVertexAttribArray(shader.attribLocations.vertexTextureCoord);
    }

    gl.useProgram(shader.program);
    gl.uniformMatrix4fv(shader.uniformLocations.projectionMatrix, false, projectionMatrix);
    gl.uniformMatrix4fv(shader.uniformLocations.modelMatrix, false, modelMatrix);
    gl.uniformMatrix4fv(shader.uniformLocations.viewMatrix, false, viewMatrix);

    if (shader.uniformLocations.normalMatrix) {
      const normalMatrix = mat4.create();
      mat4.invert(normalMatrix, modelMatrix);
      mat4.transpose(normalMatrix, normalMatrix);
      gl.uniformMatrix4fv(shader.uniformLocations.normalMatrix, false, normalMatrix);
    }

    if (shader.uniformLocations.textureShow) {
      gl.uniform1i(shader.uniformLocations.textureShow, textureShow);
    }

    if (shader.uniformLocations.ambientLight) {
      gl.uniform3fv(shader.uniformLocations.ambientLight, options.ambientLight);
    }

    if (shader.uniformLocations.directionalLight) {
      const direction = vec3.clone(options.directionalLight.direction);
      vec3.normalize(direction, direction);
      gl.uniform3fv(shader.uniformLocations.directionalLight.color, options.directionalLight.color);
      gl.uniform3fv(shader.uniformLocations.directionalLight.direction, direction);
    }

    if (shader.uniformLocations.pointLight) {
      gl.uniform3fv(shader.uniformLocations.pointLight.color, options.pointLight.color);
      gl.uniform3fv(shader.uniformLocations.pointLight.position, options.pointLight.position);
    }

    if (shader.uniformLocations.cameraPosition) {
      gl.uniform3fv(shader.uniformLocations.cameraPosition, options.cameraPosition);
    }

    if (shader.uniformLocations.textureNormal) {
      gl.activeTexture(gl.TEXTURE0);
      gl.bindTexture(gl.TEXTURE_2D, texture.normal);
      gl.uniform1i(shader.uniformLocations.textureNormal, 0);
    }

    if (shader.uniformLocations.textureDiffuse) {
      gl.activeTexture(gl.TEXTURE1);
      gl.bindTexture(gl.TEXTURE_2D, texture.diffuse);
      gl.uniform1i(shader.uniformLocations.textureDiffuse, 1);
    }

    {
      const vertexCount = buffers.vertexCount;
      const type = gl.UNSIGNED_SHORT;
      const offset = 0;
      gl.drawElements(gl.TRIANGLES, vertexCount, type, offset);
    }
  }
}

export default Model;
