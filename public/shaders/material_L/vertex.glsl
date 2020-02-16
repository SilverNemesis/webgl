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

attribute vec3 aVertexPosition;
attribute vec3 aVertexNormal;
  
uniform mat4 uProjectionMatrix;
uniform mat4 uViewMatrix;
uniform mat4 uModelMatrix;
uniform mat4 uNormalMatrix;

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
  gl_Position = uProjectionMatrix * uViewMatrix * uModelMatrix * vec4(aVertexPosition, 1.0);

  FragPos = vec3(uModelMatrix * vec4(aVertexPosition, 1.0));
  Normal = vec3(uNormalMatrix * vec4(aVertexNormal, 1.0));

  if (uLightingModel == 1) {
    for (int i = 0; i < 2; i++) {
      vAmbient += uLights[i].ambient;
      vec3 norm = normalize(Normal);
      vec3 lightDir = normalize(uLights[i].position - FragPos);
      float diff = max(dot(norm, lightDir), 0.0);
      vDiffuse += uLights[i].diffuse * diff;
      vec3 viewDir = normalize(uCameraPos - FragPos);
      vec3 reflectDir = reflect(-lightDir, norm);
      float spec = pow(max(dot(viewDir, reflectDir), 0.0), uMaterial.shininess);
      vSpecular += uLights[i].specular * spec;
    }
  }
}
