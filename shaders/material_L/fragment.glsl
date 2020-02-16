precision mediump float;
precision lowp int;

struct Light {
  vec3 position;
  vec3 ambient;
  vec3 diffuse;
  vec3 specular;
};

struct Material {
  vec3 ambient;
  vec3 diffuse;
  vec3 specular;
  float shininess;
}; 

uniform vec3 uCameraPos;
uniform Light uLights[2];
uniform Material uMaterial;

uniform int uLightingModel;

varying vec3 FragPos;
varying vec3 Normal;
varying vec3 vAmbient;
varying vec3 vDiffuse;
varying vec3 vSpecular;

void main(void) {
  if (uLightingModel == 0) {
    gl_FragColor = vec4(uMaterial.ambient + uMaterial.diffuse, 1.0);
  }
  else if (uLightingModel == 1) {
    vec3 result = vAmbient * uMaterial.ambient + vDiffuse * uMaterial.diffuse + vSpecular * uMaterial.specular;
    gl_FragColor = vec4(result, 1.0);
  }
  else if (uLightingModel == 2) {
    vec3 ambient;
    vec3 diffuse;
    vec3 specular;

    for (int i = 0; i < 2; i++) {
      ambient += uLights[i].ambient;
      vec3 norm = normalize(Normal);
      vec3 lightDir = normalize(uLights[i].position - FragPos);
      float diff = max(dot(norm, lightDir), 0.0);
      diffuse += uLights[i].diffuse * diff;
      vec3 viewDir = normalize(uCameraPos - FragPos);
      vec3 reflectDir = reflect(-lightDir, norm);
      float spec = pow(max(dot(viewDir, reflectDir), 0.0), uMaterial.shininess);
      specular += uLights[i].specular * spec;
    }

    vec3 result = ambient * uMaterial.ambient + diffuse * uMaterial.diffuse + specular * uMaterial.specular;
    gl_FragColor = vec4(result, 1.0);
  }
}
