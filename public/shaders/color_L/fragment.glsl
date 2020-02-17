precision mediump float;
precision lowp int;

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
uniform vec3 uCameraPos;

varying vec3 vVertexPosition;
varying vec3 vVertexNormal;
varying vec3 vColor;
varying vec3 vLighting;

void main(void) {
  if (uLightingModel == 0) {
    gl_FragColor = vec4(vColor, 1.0);
  }
  else if (uLightingModel == 1) {
    gl_FragColor = vec4(vColor * vLighting, 1.0);
  }
  else if (uLightingModel == 2) {
    float directional = max(dot(vVertexNormal, uDirectionalLight.direction), 0.0);

    vec3 surfaceToLight = uPointLight.position - vVertexPosition;
    float bright = uPointLight.brightness * max(dot(vVertexNormal, normalize(surfaceToLight)), 0.0) / (length(surfaceToLight) * length(surfaceToLight));
    bright = clamp(bright, 0.0, 1.0);

    vec3 viewDir = normalize(uCameraPos - vVertexPosition);
    vec3 reflectDir = reflect(-normalize(surfaceToLight), vVertexNormal);
    float spec = pow(max(dot(viewDir, reflectDir), 0.0), 5.0);

    vec3 lighting = uAmbientLight + (uDirectionalLight.color * directional) + (uPointLight.color * bright) + spec;

    gl_FragColor = vec4(vColor * lighting, 1.0);
  }
}
