precision mediump float;
precision lowp int;

uniform sampler2D uSamplerDiffuse;
uniform vec3 uAmbientLight;     
uniform struct {
  vec3 direction;
  vec3 color;
} uDirectionalLight;
uniform struct {
  vec3 position;
  vec3 color;
} uPointLight;
uniform int uLightingModel;

varying vec3 vVertexPosition;
varying vec3 vVertexNormal;
varying vec3 vColor;
varying vec3 vLighting;

void main(void) {
  if (uLightingModel == 0) {
    gl_FragColor = vec4(vColor, 1.0);
  }
  else if (uLightingModel == 1) {
    vec4 texelColor = vec4(vColor, 1.0);
    gl_FragColor = vec4(texelColor.rgb * vLighting, texelColor.a);
  }
  else if (uLightingModel == 2) {
    float directional = max(dot(vVertexNormal, uDirectionalLight.direction), 0.0);
    vec3 surfaceToLight = uPointLight.position - vVertexPosition;
    float bright = 50.0 * max(dot(vVertexNormal, normalize(surfaceToLight)), 0.0) / (length(surfaceToLight) * length(surfaceToLight));
    bright = clamp(bright, 0.0, 1.0);
    vec3 lighting = uAmbientLight + (uDirectionalLight.color * directional) + (uPointLight.color * bright);
    vec4 texelColor = vec4(vColor, 1.0);
    gl_FragColor = vec4(texelColor.rgb * lighting, texelColor.a);
  }
}
