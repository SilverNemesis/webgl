precision mediump float;

attribute vec3 aVertexPosition;
attribute vec3 aVertexNormal;
  
uniform mat4 uProjectionMatrix;
uniform mat4 uViewMatrix;
uniform mat4 uModelMatrix;
uniform mat4 uNormalMatrix;

varying vec3 FragPos;
varying vec3 Normal;

void main(void) {
  gl_Position = uProjectionMatrix * uViewMatrix * uModelMatrix * vec4(aVertexPosition, 1.0);

  FragPos = vec3(uModelMatrix * vec4(aVertexPosition, 1.0));
  Normal = vec3(uNormalMatrix * vec4(aVertexNormal, 1.0));
}
