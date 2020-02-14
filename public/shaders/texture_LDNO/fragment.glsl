precision mediump float;

uniform sampler2D uSamplerNormal;
uniform sampler2D uSamplerDiffuse;
uniform sampler2D uSamplerOcclusion;

uniform int uShowDiffuseMap;
uniform int uShowNormalMap;
uniform int uShowAmbientOcclusionMap;

uniform vec3 uAmbientLight;
uniform struct {
  vec3 direction;
  vec3 color;
} uDirectionalLight;
uniform struct {
  vec3 position;
  vec3 color;
} uPointLight;

varying vec2 frag_uv;
varying vec3 frag_position;
varying vec3 frag_normal;
varying vec3 ts_light_pos;
varying vec3 ts_view_pos;
varying vec3 ts_frag_pos;
varying vec3 ts_diffuse_dir;

void main(void) {
  vec3 view_dir = normalize(ts_view_pos - ts_frag_pos);

  vec2 texCoords = frag_uv;

  vec3 albedo = texture2D(uSamplerDiffuse, texCoords).rgb;

  if (uShowDiffuseMap == 0) {
    albedo = vec3(0.5, 0.5, 0.5);
  }

  float point_intensity;
  float diffuse_intensity;

  if (uShowNormalMap == 0) {
    vec3 normal = frag_normal;
    vec3 light_dir = uPointLight.position - frag_position;
    point_intensity = clamp(10.0 * max(dot(normalize(light_dir), normal), 0.0) / (length(light_dir) * length(light_dir)), 0.0, 1.0);
    diffuse_intensity = max(dot(uDirectionalLight.direction, normal), 0.0);
  }
  else {
    vec3 normal = normalize(texture2D(uSamplerNormal, texCoords).rgb * 2.0 - 1.0);
    vec3 light_dir = ts_light_pos - ts_frag_pos;
    point_intensity = clamp(10.0 * max(dot(normalize(light_dir), normal), 0.0) / (length(light_dir) * length(light_dir)), 0.0, 1.0);
    diffuse_intensity = max(dot(ts_diffuse_dir, normal), 0.0);
  }

  vec3 ambient;

  if (uShowAmbientOcclusionMap == 0) {
    ambient = uAmbientLight;
  }
  else {
    ambient = texture2D(uSamplerOcclusion, texCoords).r * uAmbientLight;
  }

  vec3 lighting = ambient + (uDirectionalLight.color * diffuse_intensity) + (uPointLight.color * point_intensity); 
  gl_FragColor = vec4(albedo * lighting, 1.0);
}
