precision highp float;

attribute vec3 aVertexPosition;
attribute vec3 aVertexTangent;
attribute vec3 aVertexBitangent;
attribute vec2 aTextureCoord;

uniform mat4 uNormalMatrix;
uniform mat4 uModelMatrix;
uniform mat4 uViewMatrix;
uniform mat4 uProjectionMatrix;

uniform vec3 uCameraPos;
uniform struct {
  vec3 direction;
  vec3 color;
} uDirectionalLight;
uniform struct {
  vec3 position;
  vec3 color;
} uPointLight;

varying vec2 frag_uv;
varying vec3 ts_light_pos;
varying vec3 ts_view_pos;
varying vec3 ts_frag_pos;
varying vec3 ts_diffuse_dir;

mat3 transpose(in mat3 inMatrix) {
  vec3 i0 = inMatrix[0];
  vec3 i1 = inMatrix[1];
  vec3 i2 = inMatrix[2];
  mat3 outMatrix = mat3(vec3(i0.x, i1.x, i2.x), vec3(i0.y, i1.y, i2.y), vec3(i0.z, i1.z, i2.z));
  return outMatrix;
}

void main(void) {
  frag_uv = aTextureCoord;

  vec3 t = normalize(mat3(uNormalMatrix) * aVertexTangent);
  vec3 b = normalize(mat3(uNormalMatrix) * aVertexBitangent);
  mat3 tbn = transpose(mat3(t, b, normalize(mat3(uNormalMatrix) * cross(aVertexBitangent, aVertexTangent))));

  ts_light_pos = tbn * uPointLight.position;
  ts_view_pos = tbn * uCameraPos;
  ts_frag_pos = tbn * vec3(uModelMatrix * vec4(aVertexPosition, 1.0));
  ts_diffuse_dir = tbn * uDirectionalLight.direction;

  gl_Position = uProjectionMatrix * uViewMatrix * uModelMatrix * vec4(aVertexPosition, 1.0);
}
