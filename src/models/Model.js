import * as mat4 from 'gl-matrix/mat4';
import * as vec3 from 'gl-matrix/vec3';
import { loadTexture, initShaderProgram, getShaderParameters } from '../lib/utility'

class Model {
  _initModel(options) {
    const { gl, geometry } = options;
    const textures = [];
    if (options.texture) {
      const texture = {};
      if (options.texture.diffuse) {
        texture.diffuse = loadTexture(gl, options.texture.diffuse);
      }
      if (options.texture.normal) {
        texture.normal = loadTexture(gl, options.texture.normal);
      }
      if (options.texture.height) {
        texture.height = loadTexture(gl, options.texture.height);
      }
      if (options.texture.occlusion) {
        texture.occlusion = loadTexture(gl, options.texture.occlusion);
      }
      textures.push(texture);
    } else if (options.textures) {
      for (let i = 0; i < options.textures.length; i++) {
        const texture = {};
        if (options.textures[i].diffuse) {
          texture.diffuse = loadTexture(gl, options.textures[i].diffuse);
        }
        if (options.textures[i].normal) {
          texture.normal = loadTexture(gl, options.textures[i].normal);
        }
        if (options.textures[i].height) {
          texture.height = loadTexture(gl, options.textures[i].height);
        }
        if (options.textures[i].occlusion) {
          texture.occlusion = loadTexture(gl, options.textures[i].occlusion);
        }
        textures.push(texture);
      }
    }

    if (options.shader) {
      let vertexShader;
      let fragmentShader;
      Promise.all([
        fetch(options.shader.vertex).then((response) => response.text()).then((text) => vertexShader = text),
        fetch(options.shader.fragment).then((response) => response.text()).then((text) => fragmentShader = text)
      ]).then(() => {
        const shader = this._setupShader(gl, vertexShader, fragmentShader);
        const buffers = this._initBuffers(gl, [shader], geometry, textures.length || 1);
        this.model = {
          shaders: [shader],
          buffers,
          textures
        };
      });
    }
    else {
      const vertexShaders = new Array(options.shaders.length).fill(null);
      const fragmentShaders = new Array(options.shaders.length).fill(null);
      const pendingLoads = [];
      for (let i = 0; i < options.shaders.length; i++) {
        pendingLoads.push(fetch(options.shaders[i].vertex).then((response) => response.text()).then((text) => vertexShaders[i] = text));
        pendingLoads.push(fetch(options.shaders[i].fragment).then((response) => response.text()).then((text) => fragmentShaders[i] = text));
      }

      Promise.all(pendingLoads)
        .then(() => {
          const shaders = [];
          for (let i = 0; i < options.shaders.length; i++) {
            shaders.push(this._setupShader(gl, vertexShaders[i], fragmentShaders[i]));
          }
          const buffers = this._initBuffers(gl, shaders, geometry, textures.length || 1);
          this.model = {
            shaders,
            buffers,
            textures
          };
        });
    }
  }

  _updateModel(geometry) {
    this._deleteBuffers();
    this.model.buffers = this._initBuffers(this.gl, this.model.shaders, geometry, this.model.textures.length || 1);
  }

  _setupShader(gl, vertexShader, fragmentShader) {
    const shaderProgram = initShaderProgram(gl, vertexShader, fragmentShader);
    const shaderParameters = getShaderParameters(gl, shaderProgram);
    const shader = {
      program: shaderProgram,
      attribLocations: {},
      uniformLocations: {}
    };
    shaderParameters.attributes.forEach((attribute) => {
      const location = gl.getAttribLocation(shaderProgram, attribute.name)
      this._addShaderNameToJavascript(shader.attribLocations, attribute.name, location);
    });
    shaderParameters.uniforms.forEach((uniform) => {
      const location = gl.getUniformLocation(shaderProgram, uniform.name)
      this._addShaderNameToJavascript(shader.uniformLocations, uniform.name, location);
    });
    return shader;
  }

  _addShaderNameToJavascript(shaderLocations, inputName, location) {
    if (inputName[0] !== 'a' && inputName[0] !== 'u') {
      alert('shader name of ' + inputName + ' is not valid');
      return;
    }
    let outputName = inputName[1].toLowerCase() + inputName.slice(2);
    const names = outputName.split('.');
    let out = shaderLocations;
    for (let i = 0; i < names.length; i++) {
      let name = names[i];
      const subBeg = name.indexOf('[');
      if (subBeg !== -1) {
        const subEnd = name.indexOf(']');
        if (subEnd < subBeg + 2) {
          alert('shader name of ' + inputName + ' is not valid');
          return;
        }
        const index = Number(name.slice(subBeg + 1, subEnd));
        name = name.slice(0, subBeg);
        if (i < names.length - 1) {
          if (!out[name]) {
            out[name] = [];
          }
          if (out[name].length <= index) {
            out[name].length = index + 1;
          }
          if (!out[name][index]) {
            out[name][index] = {};
          }
          out = out[name][index];
        } else {
          if (!out[name]) {
            out[name] = [];
          }
          if (out[name].length <= index) {
            out[name].length = index + 1;
          }
          out[name][index] = location;
        }
      } else {
        if (i < names.length - 1) {
          if (!out[name]) {
            out[name] = {};
          }
          out = out[name];
        } else {
          out[name] = location;
        }
      }
    }
  }

  _initBuffers(gl, shaders, geometry, bufferCount) {
    const requirements = {};

    for (let i = 0; i < shaders.length; i++) {
      const shader = shaders[i];

      if (shader.attribLocations.vertexNormal) {
        requirements.vertexNormal = true;
      }

      if (shader.attribLocations.vertexTangent) {
        requirements.vertexTangent = true;
      }

      if (shader.attribLocations.vertexBitangent) {
        requirements.vertexBitangent = true;
      }

      if (shader.attribLocations.textureCoord) {
        requirements.textureCoord = true;
      }

      if (shader.attribLocations.vertexColor) {
        requirements.vertexColor = true;
      }
    }

    const normal = vec3.create();
    const tangent = vec3.create();
    const bitangent = vec3.create();

    const inputBuffers = [];

    for (let i = 0; i < bufferCount; i++) {
      inputBuffers.push({
        positions: [],
        normals: [],
        tangents: [],
        bitangents: [],
        textureCoordinates: [],
        colors: [],
        indices: [],
        offset: 0
      });
    }

    const addSquare = (c0, c1, c2, c3, options) => {
      let inputBuffer;
      if (options && options.bufferIndex) {
        inputBuffer = inputBuffers[options.bufferIndex];
      } else {
        inputBuffer = inputBuffers[0];
      }

      const { positions, normals, tangents, bitangents, textureCoordinates, colors, indices, offset } = inputBuffer;

      positions.push(...c0, ...c1, ...c2, ...c3);
      indices.push(offset + 0, offset + 1, offset + 2, offset + 2, offset + 3, offset + 0);
      inputBuffer.offset += 4;

      if (requirements.vertexNormal || requirements.vertexTangent || requirements.vertexBitangent) {
        vec3.subtract(tangent, c1, c0);
        vec3.subtract(bitangent, c3, c0);

        if (requirements.vertexNormal) {
          vec3.cross(normal, tangent, bitangent);
          vec3.normalize(normal, normal);
          normals.push(...normal, ...normal, ...normal, ...normal);
        }

        if (requirements.vertexTangent) {
          vec3.normalize(tangent, tangent);
          tangents.push(...tangent, ...tangent, ...tangent, ...tangent);
        }

        if (requirements.vertexBitangent) {
          vec3.normalize(bitangent, bitangent);
          bitangents.push(...bitangent, ...bitangent, ...bitangent, ...bitangent);
        }
      }

      if (requirements.textureCoord) {
        textureCoordinates.push(0, 0, 1, 0, 1, 1, 0, 1);
      }

      if (requirements.vertexColor) {
        colors.push(...options.color, ...options.color, ...options.color, ...options.color);
      }
    }

    const addTriangle = (c0, c1, c2, options) => {
      let inputBuffer;
      if (options.bufferIndex) {
        inputBuffer = inputBuffers[options.bufferIndex];
      } else {
        inputBuffer = inputBuffers[0];
      }

      const { positions, normals, tangents, bitangents, colors, indices, offset } = inputBuffer;

      positions.push(...c0, ...c1, ...c2);
      indices.push(offset + 0, offset + 1, offset + 2);
      inputBuffer.offset += 3;

      if (requirements.vertexNormal || requirements.vertexTangent || requirements.vertexBitangent) {
        vec3.subtract(tangent, c1, c0);
        vec3.subtract(bitangent, c2, c0);

        if (requirements.vertexNormal) {
          vec3.cross(normal, tangent, bitangent);
          vec3.normalize(normal, normal);
          normals.push(...normal, ...normal, ...normal);
        }

        if (requirements.vertexTangent) {
          vec3.normalize(tangent, tangent);
          tangents.push(...tangent, ...tangent, ...tangent);
        }

        if (requirements.vertexBitangent) {
          vec3.normalize(bitangent, bitangent);
          bitangents.push(...bitangent, ...bitangent, ...bitangent);
        }
      }

      if (requirements.vertexColor) {
        colors.push(...options.color, ...options.color, ...options.color);
      }
    }

    const addPentagon = (c0, c1, c2, c3, c4, options) => {
      let inputBuffer;
      if (options.bufferIndex) {
        inputBuffer = inputBuffers[options.bufferIndex];
      } else {
        inputBuffer = inputBuffers[0];
      }

      const { positions, normals, tangents, bitangents, colors, indices, offset } = inputBuffer;

      positions.push(...c0, ...c1, ...c2, ...c3, ...c4);
      indices.push(offset + 0, offset + 3, offset + 4, offset + 0, offset + 1, offset + 3, offset + 1, offset + 2, offset + 3);
      inputBuffer.offset += 5;

      if (requirements.vertexNormal || requirements.vertexTangent || requirements.vertexBitangent) {
        vec3.subtract(tangent, c1, c0);
        vec3.subtract(bitangent, c4, c0);

        if (requirements.vertexNormal) {
          vec3.cross(normal, tangent, bitangent);
          vec3.normalize(normal, normal);
          normals.push(...normal, ...normal, ...normal, ...normal, ...normal);
        }

        if (requirements.vertexTangent) {
          vec3.normalize(tangent, tangent);
          tangents.push(...tangent, ...tangent, ...tangent, ...tangent, ...tangent);
        }

        if (requirements.vertexBitangent) {
          vec3.normalize(bitangent, bitangent);
          bitangents.push(...bitangent, ...bitangent, ...bitangent, ...bitangent, ...bitangent);
        }
      }

      if (requirements.vertexColor) {
        colors.push(...options.color, ...options.color, ...options.color, ...options.color, ...options.color);
      }
    }

    const addFace = (vertices, face, options) => {
      switch (face.length) {
        case 3:
          addTriangle(vertices[face[0]], vertices[face[1]], vertices[face[2]], options);
          break;
        case 4:
          addSquare(vertices[face[0]], vertices[face[1]], vertices[face[2]], vertices[face[3]], options);
          break;
        case 5:
          addPentagon(vertices[face[0]], vertices[face[1]], vertices[face[2]], vertices[face[3]], vertices[face[4]], options);
          break;
        default:
          alert('faces with ' + face.length + ' vertices are not supported');
      }
    }

    const addFaces = (vertices, faces, options) => {
      for (let i = 0; i < faces.length; i++) {
        let option = {}
        if (options) {
          if (options.colors) {
            option.color = options.colors[i % options.colors.length];
          }
        }
        addFace(vertices, faces[i], option);
      }
    }

    geometry({ addSquare, addFaces });

    const outputBuffers = [];

    for (let i = 0; i < bufferCount; i++) {
      const inputBuffer = inputBuffers[i];
      const { positions, normals, tangents, bitangents, textureCoordinates, colors, indices } = inputBuffer;

      const positionBuffer = gl.createBuffer();
      gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
      gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions), gl.STATIC_DRAW);

      const indexBuffer = gl.createBuffer();
      gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);
      gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(indices), gl.STATIC_DRAW);

      const outputBuffer = { position: positionBuffer, indices: indexBuffer, vertexCount: indices.length }

      if (requirements.vertexNormal) {
        const normalBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, normalBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(normals), gl.STATIC_DRAW);
        outputBuffer.normal = normalBuffer;
      }

      if (requirements.vertexTangent) {
        const tangentBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, tangentBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(tangents), gl.STATIC_DRAW);
        outputBuffer.tangent = tangentBuffer;
      }

      if (requirements.vertexBitangent) {
        const bitangentBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, bitangentBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(bitangents), gl.STATIC_DRAW);
        outputBuffer.bitangent = bitangentBuffer;
      }

      if (requirements.textureCoord) {
        const textureCoordBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, textureCoordBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(textureCoordinates), gl.STATIC_DRAW);
        outputBuffer.textureCoord = textureCoordBuffer;
      }

      if (requirements.vertexColor) {
        const colorBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(colors), gl.STATIC_DRAW);
        outputBuffer.color = colorBuffer;
      }

      outputBuffers.push(outputBuffer);
    }

    return outputBuffers;
  }

  _deleteBuffers() {
    const buffers = this.model.buffers;
    for (let i = 0; i < buffers.length; i++) {
      const buffer = buffers[i];
      buffer.vertexCount = 0;
      for (const prop in buffer) {
        if (buffer.hasOwnProperty(prop) && typeof buffer[prop] === 'object') {
          this.gl.deleteBuffer(buffer[prop]);
        }
      }
    }
  }

  _drawModel(options) {
    if (!options.model) {
      return;
    }

    const { gl, model, projectionMatrix, viewMatrix, modelMatrix } = options;
    const { shaders, buffers, textures } = model;
    const shader = shaders[options.shaderIndex ? options.shaderIndex : 0];

    for (let i = 0; i < buffers.length; i++) {
      const buffer = buffers[i];
      const texture = textures[i];

      {
        const numComponents = 3;
        const type = gl.FLOAT;
        const normalize = false;
        const stride = 0;
        const offset = 0;
        gl.bindBuffer(gl.ARRAY_BUFFER, buffer.position);
        gl.vertexAttribPointer(shader.attribLocations.vertexPosition, numComponents, type, normalize, stride, offset);
        gl.enableVertexAttribArray(shader.attribLocations.vertexPosition);
      }

      gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, buffer.indices);

      if (shader.attribLocations.vertexNormal && buffer.normal) {
        const numComponents = 3;
        const type = gl.FLOAT;
        const normalize = false;
        const stride = 0;
        const offset = 0;
        gl.bindBuffer(gl.ARRAY_BUFFER, buffer.normal);
        gl.vertexAttribPointer(shader.attribLocations.vertexNormal, numComponents, type, normalize, stride, offset);
        gl.enableVertexAttribArray(shader.attribLocations.vertexNormal);
      }

      if (shader.attribLocations.vertexTangent && buffer.tangent) {
        const numComponents = 3;
        const type = gl.FLOAT;
        const normalize = false;
        const stride = 0;
        const offset = 0;
        gl.bindBuffer(gl.ARRAY_BUFFER, buffer.tangent);
        gl.vertexAttribPointer(shader.attribLocations.vertexTangent, numComponents, type, normalize, stride, offset);
        gl.enableVertexAttribArray(shader.attribLocations.vertexTangent);
      }

      if (shader.attribLocations.vertexBitangent && buffer.bitangent) {
        const numComponents = 3;
        const type = gl.FLOAT;
        const normalize = false;
        const stride = 0;
        const offset = 0;
        gl.bindBuffer(gl.ARRAY_BUFFER, buffer.bitangent);
        gl.vertexAttribPointer(shader.attribLocations.vertexBitangent, numComponents, type, normalize, stride, offset);
        gl.enableVertexAttribArray(shader.attribLocations.vertexBitangent);
      }

      if (shader.attribLocations.textureCoord && buffer.textureCoord) {
        const numComponents = 2;
        const type = gl.FLOAT;
        const normalize = false;
        const stride = 0;
        const offset = 0;
        gl.bindBuffer(gl.ARRAY_BUFFER, buffer.textureCoord);
        gl.vertexAttribPointer(shader.attribLocations.textureCoord, numComponents, type, normalize, stride, offset);
        gl.enableVertexAttribArray(shader.attribLocations.textureCoord);
      }

      if (shader.attribLocations.vertexColor && buffer.color) {
        const numComponents = 3;
        const type = gl.FLOAT;
        const normalize = false;
        const stride = 0;
        const offset = 0;
        gl.bindBuffer(gl.ARRAY_BUFFER, buffer.color);
        gl.vertexAttribPointer(shader.attribLocations.vertexColor, numComponents, type, normalize, stride, offset);
        gl.enableVertexAttribArray(shader.attribLocations.vertexColor);
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

      if (shader.uniformLocations.showDiffuseMap && options.showDiffuseMap !== undefined) {
        gl.uniform1i(shader.uniformLocations.showDiffuseMap, options.showDiffuseMap);
      }

      if (shader.uniformLocations.showNormalMap && options.showNormalMap !== undefined) {
        gl.uniform1i(shader.uniformLocations.showNormalMap, options.showNormalMap);
      }

      if (shader.uniformLocations.showAmbientOcclusionMap && options.showAmbientOcclusionMap !== undefined) {
        gl.uniform1i(shader.uniformLocations.showAmbientOcclusionMap, options.showAmbientOcclusionMap);
      }

      if (shader.uniformLocations.lightingModel && options.lightingModel !== undefined) {
        gl.uniform1i(shader.uniformLocations.lightingModel, options.lightingModel);
      }

      if (shader.uniformLocations.parallaxHeightScale && options.parallaxHeightScale !== undefined) {
        gl.uniform1f(shader.uniformLocations.parallaxHeightScale, options.parallaxHeightScale);
      }

      if (shader.uniformLocations.parallaxSteps && options.parallaxSteps !== undefined) {
        gl.uniform1i(shader.uniformLocations.parallaxSteps, options.parallaxSteps);
      }

      if (shader.uniformLocations.parallaxOcclusionMapping && options.parallaxOcclusionMapping !== undefined) {
        gl.uniform1i(shader.uniformLocations.parallaxOcclusionMapping, options.parallaxOcclusionMapping);
      }

      if (shader.uniformLocations.ambientLight && options.ambientLight) {
        gl.uniform3fv(shader.uniformLocations.ambientLight, options.ambientLight);
      }

      if (shader.uniformLocations.directionalLight && options.directionalLight) {
        const direction = vec3.clone(options.directionalLight.direction);
        vec3.normalize(direction, direction);
        gl.uniform3fv(shader.uniformLocations.directionalLight.color, options.directionalLight.color);
        gl.uniform3fv(shader.uniformLocations.directionalLight.direction, direction);
      }

      if (shader.uniformLocations.pointLight && options.pointLight) {
        gl.uniform3fv(shader.uniformLocations.pointLight.color, options.pointLight.color);
        gl.uniform3fv(shader.uniformLocations.pointLight.position, options.pointLight.position);
      }

      if (shader.uniformLocations.lights && options.lights) {
        const lights = options.lights;
        for (let i = 0; i < lights.length; i++) {
          const light = lights[i];
          gl.uniform3fv(shader.uniformLocations.lights[i].position, light.position);
          gl.uniform3fv(shader.uniformLocations.lights[i].ambient, light.ambient);
          gl.uniform3fv(shader.uniformLocations.lights[i].diffuse, light.diffuse);
          gl.uniform3fv(shader.uniformLocations.lights[i].specular, light.specular);
        }
      }

      if (shader.uniformLocations.material && options.material) {
        const material = options.material;
        gl.uniform3fv(shader.uniformLocations.material.ambient, material.ambient);
        gl.uniform3fv(shader.uniformLocations.material.diffuse, material.diffuse);
        gl.uniform3fv(shader.uniformLocations.material.specular, material.specular);
        gl.uniform1f(shader.uniformLocations.material.shininess, material.shininess);
      }

      if (shader.uniformLocations.cameraPos && options.cameraPos) {
        gl.uniform3fv(shader.uniformLocations.cameraPos, options.cameraPos);
      }

      if (shader.uniformLocations.samplerDiffuse && texture.diffuse) {
        gl.activeTexture(gl.TEXTURE0);
        gl.bindTexture(gl.TEXTURE_2D, texture.diffuse);
        gl.uniform1i(shader.uniformLocations.samplerDiffuse, 0);
      }

      if (shader.uniformLocations.samplerNormal && texture.normal) {
        gl.activeTexture(gl.TEXTURE1);
        gl.bindTexture(gl.TEXTURE_2D, texture.normal);
        gl.uniform1i(shader.uniformLocations.samplerNormal, 1);
      }

      if (shader.uniformLocations.samplerHeight && texture.height) {
        gl.activeTexture(gl.TEXTURE2);
        gl.bindTexture(gl.TEXTURE_2D, texture.height);
        gl.uniform1i(shader.uniformLocations.samplerHeight, 2);
      }

      if (shader.uniformLocations.samplerOcclusion && texture.occlusion) {
        gl.activeTexture(gl.TEXTURE3);
        gl.bindTexture(gl.TEXTURE_2D, texture.occlusion);
        gl.uniform1i(shader.uniformLocations.samplerOcclusion, 3);
      }

      {
        const vertexCount = buffer.vertexCount;
        const type = gl.UNSIGNED_SHORT;
        const offset = 0;
        gl.drawElements(gl.TRIANGLES, vertexCount, type, offset);
      }
    }
  }
}

export default Model;
