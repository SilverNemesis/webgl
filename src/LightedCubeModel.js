import * as mat4 from 'gl-matrix/mat4';
import * as vec3 from 'gl-matrix/vec3';
import { loadTexture, initShaderProgram } from './utility'

class LightedCubeModel {
  constructor(gl) {
    this.gl = gl;
    this.draw = this.draw.bind(this);
    const shaderProgram = this._initShaders(gl);
    const shaderProgramPerPixel = this._initShadersPerPixel(gl);
    this.model = {
      shader: {
        program: shaderProgram,
        attribLocations: {
          vertexPosition: gl.getAttribLocation(shaderProgram, 'aVertexPosition'),
          vertexNormal: gl.getAttribLocation(shaderProgram, 'aVertexNormal'),
          textureCoord: gl.getAttribLocation(shaderProgram, 'aTextureCoord')
        },
        uniformLocations: {
          projectionMatrix: gl.getUniformLocation(shaderProgram, 'uProjectionMatrix'),
          modelViewMatrix: gl.getUniformLocation(shaderProgram, 'uModelViewMatrix'),
          normalMatrix: gl.getUniformLocation(shaderProgram, 'uNormalMatrix'),
          uSampler: gl.getUniformLocation(shaderProgram, 'uSampler'),
          ambientLight: gl.getUniformLocation(shaderProgram, 'uAmbientLight'),
          directionalLight: {
            direction: gl.getUniformLocation(shaderProgram, 'uDirectionalLight.direction'),
            color: gl.getUniformLocation(shaderProgram, 'uDirectionalLight.color')
          },
          pointLight: {
            position: gl.getUniformLocation(shaderProgram, 'uPointLight.position'),
            color: gl.getUniformLocation(shaderProgram, 'uPointLight.color')
          }
        }
      },
      shaderPerPixel: {
        program: shaderProgramPerPixel,
        attribLocations: {
          vertexPosition: gl.getAttribLocation(shaderProgramPerPixel, 'aVertexPosition'),
          vertexNormal: gl.getAttribLocation(shaderProgramPerPixel, 'aVertexNormal'),
          textureCoord: gl.getAttribLocation(shaderProgramPerPixel, 'aTextureCoord')
        },
        uniformLocations: {
          projectionMatrix: gl.getUniformLocation(shaderProgramPerPixel, 'uProjectionMatrix'),
          modelViewMatrix: gl.getUniformLocation(shaderProgramPerPixel, 'uModelViewMatrix'),
          normalMatrix: gl.getUniformLocation(shaderProgramPerPixel, 'uNormalMatrix'),
          uSampler: gl.getUniformLocation(shaderProgramPerPixel, 'uSampler'),
          ambientLight: gl.getUniformLocation(shaderProgramPerPixel, 'uAmbientLight'),
          directionalLight: {
            direction: gl.getUniformLocation(shaderProgramPerPixel, 'uDirectionalLight.direction'),
            color: gl.getUniformLocation(shaderProgramPerPixel, 'uDirectionalLight.color')
          },
          pointLight: {
            position: gl.getUniformLocation(shaderProgramPerPixel, 'uPointLight.position'),
            color: gl.getUniformLocation(shaderProgramPerPixel, 'uPointLight.color')
          }
        }
      },
      buffers: this._initBuffers(gl),
      texture: loadTexture(gl, 'images/cubetexture.png')
    }
  }

  draw(projectionMatrix, viewMatrix, modelMatrix, perPixel) {
    const gl = this.gl;
    const { buffers, texture } = this.model;

    let shader;
    if (perPixel) {
      shader = this.model.shaderPerPixel;
    } else {
      shader = this.model.shader;
    }

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
      gl.bindBuffer(gl.ARRAY_BUFFER, buffers.normal);
      gl.vertexAttribPointer(shader.attribLocations.vertexNormal, numComponents, type, normalize, stride, offset);
      gl.enableVertexAttribArray(shader.attribLocations.vertexNormal);
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

    const modelViewMatrix = mat4.create();
    mat4.multiply(modelViewMatrix, viewMatrix, modelMatrix);

    const direction = vec3.fromValues(0.0, 1.0, 0.0);
    vec3.normalize(direction, direction);

    gl.useProgram(shader.program);
    gl.uniformMatrix4fv(shader.uniformLocations.projectionMatrix, false, projectionMatrix);
    gl.uniformMatrix4fv(shader.uniformLocations.modelViewMatrix, false, modelViewMatrix);
    gl.uniformMatrix4fv(shader.uniformLocations.normalMatrix, false, normalMatrix);

    gl.uniform3f(shader.uniformLocations.ambientLight, 0.3, 0.3, 0.3);

    gl.uniform3f(shader.uniformLocations.directionalLight.color, 0.5, 0.5, 0.5);
    gl.uniform3fv(shader.uniformLocations.directionalLight.direction, direction);

    gl.uniform3f(shader.uniformLocations.pointLight.color, 0.7, 0.7, 0.7);
    gl.uniform3f(shader.uniformLocations.pointLight.position, 0.0, 0.0, 0.0);

    {
      gl.activeTexture(gl.TEXTURE0);
      gl.bindTexture(gl.TEXTURE_2D, texture);
      gl.uniform1i(shader.uniformLocations.uSampler, 0);

      const vertexCount = 36;
      const type = gl.UNSIGNED_SHORT;
      const offset = 0;
      gl.drawElements(gl.TRIANGLES, vertexCount, type, offset);
    }
  }

  _initShaders(gl) {
    const vsSource = `
      attribute vec4 aVertexPosition;
      attribute vec3 aVertexNormal;
      attribute vec2 aTextureCoord;

      uniform mat4 uProjectionMatrix;
      uniform mat4 uModelViewMatrix;
      uniform mat4 uNormalMatrix;
      uniform vec3 uAmbientLight;
      uniform struct {
        vec3 direction;
        vec3 color;
      } uDirectionalLight;
      uniform struct {
        vec3 position;
        vec3 color;
      } uPointLight;

      varying highp vec2 vTextureCoord;
      varying highp vec3 vLighting;

      void main(void) {
        gl_Position = uProjectionMatrix * uModelViewMatrix * aVertexPosition;
        vTextureCoord = aTextureCoord;

        highp vec3 transformedNormal = vec3(uNormalMatrix * vec4(aVertexNormal, 1.0));
        highp float directional = max(dot(transformedNormal, uDirectionalLight.direction), 0.0);

        vec3 surfaceToLight = uPointLight.position - aVertexPosition.xyz;
        float bright = 50.0 * max(dot(transformedNormal, normalize(surfaceToLight)), 0.0) / (length(surfaceToLight) * length(surfaceToLight));
        bright = clamp(bright, 0.0, 1.0);

        vLighting = uAmbientLight + (uDirectionalLight.color * directional) + (uPointLight.color * bright);
      }
    `;

    const fsSource = `
      varying highp vec2 vTextureCoord;
      varying highp vec3 vLighting;

      uniform sampler2D uSampler;

      void main(void) {
        highp vec4 texelColor = texture2D(uSampler, vTextureCoord);
        gl_FragColor = vec4(texelColor.rgb * vLighting, texelColor.a);
      }
    `;

    return initShaderProgram(gl, vsSource, fsSource);
  }

  _initShadersPerPixel(gl) {
    const vsSource = `
      attribute vec4 aVertexPosition;
      attribute vec2 aTextureCoord;
      attribute vec3 aVertexNormal;

      uniform mat4 uProjectionMatrix;
      uniform mat4 uModelViewMatrix;
      uniform mat4 uNormalMatrix;

      varying vec3 vVertexPosition;
      varying vec2 vTextureCoord;
      varying vec3 vVertexNormal;

      void main(void) {
        gl_Position = uProjectionMatrix * uModelViewMatrix * aVertexPosition;
        vTextureCoord = aTextureCoord;
        vVertexNormal = normalize(vec3(uNormalMatrix * vec4(aVertexNormal, 1.0)));
        vVertexPosition = vec3(uModelViewMatrix * aVertexPosition);
      }
    `;

    const fsSource = `
      precision highp float;

      uniform sampler2D uSampler;
      uniform vec3 uAmbientLight;     
      uniform struct {
        vec3 direction;
        vec3 color;
      } uDirectionalLight;
      uniform struct {
        vec3 position;
        vec3 color;
      } uPointLight;

      varying vec3 vVertexPosition;
      varying vec2 vTextureCoord;
      varying vec3 vVertexNormal;
      
      void main() {
        highp float directional = max(dot(vVertexNormal, uDirectionalLight.direction), 0.0);

        vec3 surfaceToLight = uPointLight.position - vVertexPosition;
        float bright = 50.0 * max(dot(vVertexNormal, normalize(surfaceToLight)), 0.0) / (length(surfaceToLight) * length(surfaceToLight));
        bright = clamp(bright, 0.0, 1.0);

        highp vec3 lighting = uAmbientLight + (uDirectionalLight.color * directional) + (uPointLight.color * bright);

        highp vec4 texelColor = texture2D(uSampler, vTextureCoord);
        gl_FragColor = vec4(texelColor.rgb * lighting, texelColor.a);
      }
    `;

    return initShaderProgram(gl, vsSource, fsSource);
  }

  _initBuffers(gl) {
    const positions = [
      // Front face
      -1.0, -1.0, 1.0,
      1.0, -1.0, 1.0,
      1.0, 1.0, 1.0,
      -1.0, 1.0, 1.0,

      // Back face
      -1.0, -1.0, -1.0,
      -1.0, 1.0, -1.0,
      1.0, 1.0, -1.0,
      1.0, -1.0, -1.0,

      // Top face
      -1.0, 1.0, -1.0,
      -1.0, 1.0, 1.0,
      1.0, 1.0, 1.0,
      1.0, 1.0, -1.0,

      // Bottom face
      -1.0, -1.0, -1.0,
      1.0, -1.0, -1.0,
      1.0, -1.0, 1.0,
      -1.0, -1.0, 1.0,

      // Right face
      1.0, -1.0, -1.0,
      1.0, 1.0, -1.0,
      1.0, 1.0, 1.0,
      1.0, -1.0, 1.0,

      // Left face
      -1.0, -1.0, -1.0,
      -1.0, -1.0, 1.0,
      -1.0, 1.0, 1.0,
      -1.0, 1.0, -1.0,
    ];

    const positionBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions), gl.STATIC_DRAW);

    const vertexNormals = [
      // Front
      0.0, 0.0, 1.0,
      0.0, 0.0, 1.0,
      0.0, 0.0, 1.0,
      0.0, 0.0, 1.0,

      // Back
      0.0, 0.0, -1.0,
      0.0, 0.0, -1.0,
      0.0, 0.0, -1.0,
      0.0, 0.0, -1.0,

      // Top
      0.0, 1.0, 0.0,
      0.0, 1.0, 0.0,
      0.0, 1.0, 0.0,
      0.0, 1.0, 0.0,

      // Bottom
      0.0, -1.0, 0.0,
      0.0, -1.0, 0.0,
      0.0, -1.0, 0.0,
      0.0, -1.0, 0.0,

      // Right
      1.0, 0.0, 0.0,
      1.0, 0.0, 0.0,
      1.0, 0.0, 0.0,
      1.0, 0.0, 0.0,

      // Left
      -1.0, 0.0, 0.0,
      -1.0, 0.0, 0.0,
      -1.0, 0.0, 0.0,
      -1.0, 0.0, 0.0
    ];

    const normalBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, normalBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertexNormals), gl.STATIC_DRAW);

    const textureCoordinates = [
      // Front
      0.0, 0.0,
      1.0, 0.0,
      1.0, 1.0,
      0.0, 1.0,

      // Back
      0.0, 0.0,
      1.0, 0.0,
      1.0, 1.0,
      0.0, 1.0,

      // Top
      0.0, 0.0,
      1.0, 0.0,
      1.0, 1.0,
      0.0, 1.0,

      // Bottom
      0.0, 0.0,
      1.0, 0.0,
      1.0, 1.0,
      0.0, 1.0,

      // Right
      0.0, 0.0,
      1.0, 0.0,
      1.0, 1.0,
      0.0, 1.0,

      // Left
      0.0, 0.0,
      1.0, 0.0,
      1.0, 1.0,
      0.0, 1.0,
    ];

    const textureCoordBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, textureCoordBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(textureCoordinates), gl.STATIC_DRAW);

    const indices = [
      // Front
      0, 1, 2, 0, 2, 3,

      // Back
      4, 5, 6, 4, 6, 7,

      // Top
      8, 9, 10, 8, 10, 11,

      // Bottom
      12, 13, 14, 12, 14, 15,

      // Right
      16, 17, 18, 16, 18, 19,

      // Left
      20, 21, 22, 20, 22, 23,
    ];

    const indexBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(indices), gl.STATIC_DRAW);

    return { position: positionBuffer, normal: normalBuffer, textureCoord: textureCoordBuffer, indices: indexBuffer };
  }
}

export default LightedCubeModel;
