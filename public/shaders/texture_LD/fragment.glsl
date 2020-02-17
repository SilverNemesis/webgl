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
  float brightness;
} uPointLight;

uniform int uLightingModel;
uniform vec3 uCameraPos;

varying vec3 vVertexPosition;
varying vec3 vVertexNormal;
varying vec2 vTextureCoord;
varying vec3 vLighting;

void main(void) {
  vec4 texelColor = texture2D(uSamplerDiffuse, vTextureCoord);
  if (uLightingModel == 0) {
    gl_FragColor = texelColor;
  }
  else if (uLightingModel == 1) {
    gl_FragColor = vec4(texelColor.rgb * vLighting, texelColor.a);
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

    gl_FragColor = vec4(texelColor.rgb * lighting, texelColor.a);
  }
}
