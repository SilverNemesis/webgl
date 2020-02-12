import * as mat4 from 'gl-matrix/mat4';
import { initShaderProgram, clearScreen } from '../lib/utility'

class ColoredSquareScene {
  constructor() {
    this.initScene = this.initScene.bind(this);
    this.drawScene = this.drawScene.bind(this);
  }

  initScene(gl) {
    const vsSource = `
    attribute vec4 aVertexPosition;
    attribute vec4 aVertexColor;

    uniform mat4 uModelViewMatrix;
    uniform mat4 uProjectionMatrix;

    varying lowp vec4 vColor;

    void main(void) {
      gl_Position = uProjectionMatrix * uModelViewMatrix * aVertexPosition;
      vColor = aVertexColor;
    }
  `;

    const fsSource = `
    varying lowp vec4 vColor;

    void main(void) {
      gl_FragColor = vColor;
    }
  `;

    const shaderProgram = initShaderProgram(gl, vsSource, fsSource);

    const programInfo = {
      program: shaderProgram,
      attribLocations: {
        vertexPosition: gl.getAttribLocation(shaderProgram, 'aVertexPosition'),
        vertexColor: gl.getAttribLocation(shaderProgram, 'aVertexColor')
      },
      uniformLocations: {
        projectionMatrix: gl.getUniformLocation(shaderProgram, 'uProjectionMatrix'),
        modelViewMatrix: gl.getUniformLocation(shaderProgram, 'uModelViewMatrix')
      }
    };

    const buffers = this._initBuffers(gl);

    this.scene = { programInfo, buffers, squareRotation: 0.0 };
  }

  drawScene(gl, deltaTime) {
    const scene = this.scene;
    const { programInfo, buffers } = scene;

    clearScreen(gl);

    {
      const numComponents = 4;
      const type = gl.FLOAT;
      const normalize = false;
      const stride = 0;
      const offset = 0;
      gl.bindBuffer(gl.ARRAY_BUFFER, buffers.color);
      gl.vertexAttribPointer(
        programInfo.attribLocations.vertexColor,
        numComponents,
        type,
        normalize,
        stride,
        offset);
      gl.enableVertexAttribArray(
        programInfo.attribLocations.vertexColor);
    }

    {
      const numComponents = 2;
      const type = gl.FLOAT;
      const normalize = false;
      const stride = 0;
      const offset = 0;
      gl.bindBuffer(gl.ARRAY_BUFFER, buffers.position);
      gl.vertexAttribPointer(
        programInfo.attribLocations.vertexPosition,
        numComponents,
        type,
        normalize,
        stride,
        offset);
      gl.enableVertexAttribArray(
        programInfo.attribLocations.vertexPosition);
    }

    {
      const fieldOfView = 45 * Math.PI / 180;
      const aspect = gl.canvas.clientWidth / gl.canvas.clientHeight;
      const zNear = 0.1;
      const zFar = 100.0;
      const projectionMatrix = mat4.create();
      mat4.perspective(projectionMatrix, fieldOfView, aspect, zNear, zFar);
      const modelViewMatrix = mat4.create();
      mat4.translate(modelViewMatrix, modelViewMatrix, [-0.0, 0.0, -6.0]);
      mat4.rotate(modelViewMatrix, modelViewMatrix, scene.squareRotation, [0, 0, 1]);
      gl.useProgram(programInfo.program);
      gl.uniformMatrix4fv(
        programInfo.uniformLocations.projectionMatrix,
        false,
        projectionMatrix);
      gl.uniformMatrix4fv(
        programInfo.uniformLocations.modelViewMatrix,
        false,
        modelViewMatrix);
    }

    {
      const offset = 0;
      const vertexCount = 4;
      gl.drawArrays(gl.TRIANGLE_STRIP, offset, vertexCount);
    }

    scene.squareRotation += deltaTime;
  }

  _initBuffers(gl) {
    const positions = [
      1.0, 1.0,
      -1.0, 1.0,
      1.0, -1.0,
      -1.0, -1.0,
    ];
    const position = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, position);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions), gl.STATIC_DRAW);

    const colors = [
      1.0, 1.0, 1.0, 1.0,
      1.0, 0.0, 0.0, 1.0,
      0.0, 1.0, 0.0, 1.0,
      0.0, 0.0, 1.0, 1.0
    ];
    const color = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, color);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(colors), gl.STATIC_DRAW);

    return { position, color };
  }
}

export default ColoredSquareScene;
