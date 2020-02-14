precision mediump float;

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

uniform Light uLights[2];
uniform Material uMaterial;

varying vec3 FragPos;
varying vec3 Normal;

void main(void) {
  vec3 viewPos = vec3(0.0, 0.0, 0.0);

  vec3 ambient;
  vec3 diffuse;
  vec3 specular;

  for (int i = 0; i < 2; i++) {
    ambient += uLights[i].ambient * uMaterial.ambient;
    vec3 norm = normalize(Normal);
    vec3 lightDir = normalize(uLights[i].position - FragPos);
    float diff = max(dot(norm, lightDir), 0.0);
    diffuse += uLights[i].diffuse * (diff * uMaterial.diffuse);
    vec3 viewDir = normalize(viewPos - FragPos);
    vec3 reflectDir = reflect(-lightDir, norm);
    float spec = pow(max(dot(viewDir, reflectDir), 0.0), uMaterial.shininess);
    specular += uLights[i].specular * (spec * uMaterial.specular);
  }
      
  vec3 result = ambient + diffuse + specular;
  gl_FragColor = vec4(result, 1.0);
}
