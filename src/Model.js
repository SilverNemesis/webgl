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
        uniformLocations: {}
      };
      shaderParameters.attributes.forEach((attribute) => {
        const location = gl.getAttribLocation(shaderProgram, attribute.name)
        switch (attribute.name) {
          case 'aVertexPosition':
            shader.attribLocations.vertexPosition = location;
            break;
          case 'aVertexNormal':
            shader.attribLocations.vertexNormal = location;
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
          case 'uPerPixel':
            shader.uniformLocations.perPixel = location;
            break;
          case 'uCameraPos':
            shader.uniformLocations.cameraPosition = location;
            break;
          case 'uAmbientLight':
            shader.uniformLocations.ambientLight = location;
            break;
          case 'uDirectionalLight.color':
            if (!shader.uniformLocations.directionalLight) {
              shader.uniformLocations.directionalLight = {};
            }
            shader.uniformLocations.directionalLight.color = location;
            break;
          case 'uDirectionalLight.direction':
            if (!shader.uniformLocations.directionalLight) {
              shader.uniformLocations.directionalLight = {};
            }
            shader.uniformLocations.directionalLight.direction = location;
            break;
          case 'uPointLight.color':
            if (!shader.uniformLocations.pointLight) {
              shader.uniformLocations.pointLight = {};
            }
            shader.uniformLocations.pointLight.color = location;
            break;
          case 'uPointLight.position':
            if (!shader.uniformLocations.pointLight) {
              shader.uniformLocations.pointLight = {};
            }
            shader.uniformLocations.pointLight.position = location;
            break;
          case 'uLight[0].position':
            if (!shader.uniformLocations.lights) {
              shader.uniformLocations.lights = [];
            }
            while (shader.uniformLocations.lights.length < 1) {
              shader.uniformLocations.lights.push({});
            }
            shader.uniformLocations.lights[0].position = location;
            break;
          case 'uLight[0].ambient':
            if (!shader.uniformLocations.lights) {
              shader.uniformLocations.lights = [];
            }
            while (shader.uniformLocations.lights.length < 1) {
              shader.uniformLocations.lights.push({});
            }
            shader.uniformLocations.lights[0].ambient = location;
            break;
          case 'uLight[0].diffuse':
            if (!shader.uniformLocations.lights) {
              shader.uniformLocations.lights = [];
            }
            while (shader.uniformLocations.lights.length < 1) {
              shader.uniformLocations.lights.push({});
            }
            shader.uniformLocations.lights[0].diffuse = location;
            break;
          case 'uLight[0].specular':
            if (!shader.uniformLocations.lights) {
              shader.uniformLocations.lights = [];
            }
            while (shader.uniformLocations.lights.length < 1) {
              shader.uniformLocations.lights.push({});
            }
            shader.uniformLocations.lights[0].specular = location;
            break;
          case 'uLight[1].position':
            if (!shader.uniformLocations.lights) {
              shader.uniformLocations.lights = [];
            }
            while (shader.uniformLocations.lights.length < 2) {
              shader.uniformLocations.lights.push({});
            }
            shader.uniformLocations.lights[1].position = location;
            break;
          case 'uLight[1].ambient':
            if (!shader.uniformLocations.lights) {
              shader.uniformLocations.lights = [];
            }
            while (shader.uniformLocations.lights.length < 2) {
              shader.uniformLocations.lights.push({});
            }
            shader.uniformLocations.lights[1].ambient = location;
            break;
          case 'uLight[1].diffuse':
            if (!shader.uniformLocations.lights) {
              shader.uniformLocations.lights = [];
            }
            while (shader.uniformLocations.lights.length < 2) {
              shader.uniformLocations.lights.push({});
            }
            shader.uniformLocations.lights[1].diffuse = location;
            break;
          case 'uLight[1].specular':
            if (!shader.uniformLocations.lights) {
              shader.uniformLocations.lights = [];
            }
            while (shader.uniformLocations.lights.length < 2) {
              shader.uniformLocations.lights.push({});
            }
            shader.uniformLocations.lights[1].specular = location;
            break;
          case 'uMaterial.ambient':
            if (!shader.uniformLocations.material) {
              shader.uniformLocations.material = {};
            }
            shader.uniformLocations.material.ambient = location;
            break;
          case 'uMaterial.diffuse':
            if (!shader.uniformLocations.material) {
              shader.uniformLocations.material = {};
            }
            shader.uniformLocations.material.diffuse = location;
            break;
          case 'uMaterial.specular':
            if (!shader.uniformLocations.material) {
              shader.uniformLocations.material = {};
            }
            shader.uniformLocations.material.specular = location;
            break;
          case 'uMaterial.shininess':
            if (!shader.uniformLocations.material) {
              shader.uniformLocations.material = {};
            }
            shader.uniformLocations.material.shininess = location;
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
      };
    });
  }

  _initBuffers(gl, shader, geometry) {
    const positions = [];
    const normals = [];
    const tangents = [];
    const bitangents = [];
    const textureCoordinates = [];
    const indices = [];
    const normal = vec3.create();
    const tangent = vec3.create();
    const bitangent = vec3.create();
    let offset = 0;

    const addSquare = (c0, c1, c2, c3) => {
      positions.push(...c0, ...c1, ...c2, ...c3);
      indices.push(offset + 0, offset + 1, offset + 2, offset + 0, offset + 3, offset + 1);
      offset += 4;

      if (shader.attribLocations.vertexNormal || shader.attribLocations.vertexTangent || shader.attribLocations.vertexBitangent) {
        vec3.subtract(tangent, c3, c0);
        vec3.subtract(bitangent, c0, c2);

        if (shader.attribLocations.vertexNormal) {
          vec3.cross(normal, tangent, bitangent);
          vec3.normalize(normal, normal);
          normals.push(...normal, ...normal, ...normal, ...normal);
        }

        if (shader.attribLocations.vertexTangent) {
          vec3.normalize(tangent, tangent);
          tangents.push(...tangent, ...tangent, ...tangent, ...tangent);
        }

        if (shader.attribLocations.vertexBitangent) {
          vec3.normalize(bitangent, bitangent);
          bitangents.push(...bitangent, ...bitangent, ...bitangent, ...bitangent);
        }
      }

      if (shader.attribLocations.vertexTextureCoord) {
        textureCoordinates.push(0, 0, 1, 1, 0, 1, 1, 0);
      }
    }

    const addTriangle = (c0, c1, c2) => {
      positions.push(...c0, ...c1, ...c2);
      indices.push(offset + 0, offset + 1, offset + 2);
      offset += 3;
      vec3.subtract(tangent, c1, c0);
      vec3.subtract(bitangent, c2, c0);
      vec3.cross(normal, tangent, bitangent);
      vec3.normalize(normal, normal);
      normals.push(...normal, ...normal, ...normal);
    }

    const addSquare2 = (c0, c1, c2, c3) => {
      positions.push(...c0, ...c1, ...c2, ...c3);
      indices.push(offset + 0, offset + 1, offset + 2, offset + 2, offset + 3, offset + 0);
      offset += 4;
      vec3.subtract(tangent, c1, c0);
      vec3.subtract(bitangent, c2, c0);
      vec3.cross(normal, tangent, bitangent);
      vec3.normalize(normal, normal);
      normals.push(...normal, ...normal, ...normal, ...normal);
    }

    const addPentagon = (c0, c1, c2, c3, c4) => {
      positions.push(...c0, ...c1, ...c2, ...c3, ...c4);
      indices.push(offset + 0, offset + 3, offset + 4, offset + 0, offset + 1, offset + 3, offset + 1, offset + 2, offset + 3);
      offset += 5;
      vec3.subtract(tangent, c1, c0);
      vec3.subtract(bitangent, c4, c0);
      vec3.cross(normal, tangent, bitangent);
      vec3.normalize(normal, normal);
      normals.push(...normal, ...normal, ...normal, ...normal, ...normal);
    }

    const addFace = (vertices, face) => {
      switch (face.length) {
        case 3:
          addTriangle(vertices[face[0]], vertices[face[1]], vertices[face[2]]);
          break;
        case 4:
          addSquare2(vertices[face[0]], vertices[face[1]], vertices[face[2]], vertices[face[3]]);
          break;
        case 5:
          addPentagon(vertices[face[0]], vertices[face[1]], vertices[face[2]], vertices[face[3]], vertices[face[4]]);
          break;
        default:
          alert('faces with ' + face.length + ' vertices are not supported');
      }
    }

    const addFaces = (vertices, faces) => {
      for (let i = 0; i < faces.length; i++) {
        addFace(vertices, faces[i]);
      }
    }

    geometry({ addSquare, addFaces });

    const positionBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions), gl.STATIC_DRAW);

    const indexBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(indices), gl.STATIC_DRAW);

    const buffers = { position: positionBuffer, indices: indexBuffer, vertexCount: indices.length }

    if (shader.attribLocations.vertexNormal) {
      const normalBuffer = gl.createBuffer();
      gl.bindBuffer(gl.ARRAY_BUFFER, normalBuffer);
      gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(normals), gl.STATIC_DRAW);
      buffers.normal = normalBuffer;
    }

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

    const { gl, model, projectionMatrix, viewMatrix, modelMatrix } = options;
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

    if (shader.attribLocations.vertexNormal) {
      const numComponents = 3;
      const type = gl.FLOAT;
      const normalize = false;
      const stride = 0;
      const offset = 0;
      gl.bindBuffer(gl.ARRAY_BUFFER, buffers.normal);
      gl.vertexAttribPointer(shader.attribLocations.vertexNormal, numComponents, type, normalize, stride, offset);
      gl.enableVertexAttribArray(shader.attribLocations.vertexNormal);
    }

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
      gl.uniform1i(shader.uniformLocations.textureShow, options.textureShow);
    }

    if (shader.uniformLocations.perPixel) {
      gl.uniform1i(shader.uniformLocations.perPixel, options.perPixel);
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

    if (options.lights) {
      const lights = options.lights;
      for (let i = 0; i < lights.length; i++) {
        const light = lights[i];
        gl.uniform3fv(shader.uniformLocations.lights[i].position, light.position);
        gl.uniform3fv(shader.uniformLocations.lights[i].ambient, light.ambient);
        gl.uniform3fv(shader.uniformLocations.lights[i].diffuse, light.diffuse);
        gl.uniform3fv(shader.uniformLocations.lights[i].specular, light.specular);
      }
    }

    if (options.material) {
      const material = options.material;
      gl.uniform3fv(shader.uniformLocations.material.ambient, material.ambient);
      gl.uniform3fv(shader.uniformLocations.material.diffuse, material.diffuse);
      gl.uniform3fv(shader.uniformLocations.material.specular, material.specular);
      gl.uniform1f(shader.uniformLocations.material.shininess, material.shininess);
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
