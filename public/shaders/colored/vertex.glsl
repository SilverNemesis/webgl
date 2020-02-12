precision mediump float;

attribute vec3 aVertexPosition;
attribute vec3 aVertexColor;

uniform mat4 uProjectionMatrix;
uniform mat4 uViewMatrix;
uniform mat4 uModelMatrix;

varying vec4 vColor;

void main(void) {
  gl_Position = uProjectionMatrix * uViewMatrix * uModelMatrix * vec4(aVertexPosition, 1.0);
  vColor = vec4(aVertexColor, 1.0);
}
