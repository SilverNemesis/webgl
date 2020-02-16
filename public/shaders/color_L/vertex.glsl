precision mediump float;
precision lowp int;

attribute vec3 aVertexPosition;
attribute vec3 aVertexColor;
attribute vec3 aVertexNormal;

uniform mat4 uProjectionMatrix;
uniform mat4 uViewMatrix;
uniform mat4 uModelMatrix;
uniform mat4 uNormalMatrix;

uniform vec3 uAmbientLight;
uniform struct {
  vec3 direction;
  vec3 color;
} uDirectionalLight;
uniform struct {
  vec3 position;
  vec3 color;
  float brightness;
} uPointLight;

uniform int uLightingModel;

varying vec3 vVertexPosition;
varying vec3 vVertexNormal;
varying vec3 vColor;
varying vec3 vLighting;

void main(void) {
  gl_Position = uProjectionMatrix * uViewMatrix * uModelMatrix * vec4(aVertexPosition, 1.0);
  vColor = aVertexColor;
  vVertexNormal = normalize(vec3(uNormalMatrix * vec4(aVertexNormal, 1.0)));
  vVertexPosition = vec3(uModelMatrix * vec4(aVertexPosition, 1.0));

  if (uLightingModel == 1) {
    float directional = max(dot(vVertexNormal, uDirectionalLight.direction), 0.0);
    vec3 surfaceToLight = uPointLight.position - vVertexPosition;
    float bright = uPointLight.brightness * max(dot(vVertexNormal, normalize(surfaceToLight)), 0.0) / (length(surfaceToLight) * length(surfaceToLight));
    bright = clamp(bright, 0.0, 1.0);
    vLighting = uAmbientLight + (uDirectionalLight.color * directional) + (uPointLight.color * bright);
  }
}
