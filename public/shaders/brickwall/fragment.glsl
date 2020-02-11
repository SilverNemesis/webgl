precision highp float;

uniform sampler2D uSamplerNormal;
uniform sampler2D uSamplerDiffuse;
uniform int uShowTexture;

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
varying vec3 ts_light_pos;
varying vec3 ts_view_pos;
varying vec3 ts_frag_pos;
varying vec3 ts_diffuse_dir;

void main(void)
{
  vec3 view_dir = normalize(ts_view_pos - ts_frag_pos);

  vec3 albedo = texture2D(uSamplerDiffuse, frag_uv).rgb;

  if (uShowTexture == 0) {
    albedo = vec3(1.0, 1.0, 1.0);
  }

  float point_intensity;
  float diffuse_intensity;

  vec3 norm = normalize(texture2D(uSamplerNormal, frag_uv).rgb * 2.0 - 1.0);
  vec3 light_dir = ts_light_pos - ts_frag_pos;
  point_intensity = 15.0 * max(dot(norm, normalize(light_dir)), 0.0) / (length(light_dir) * length(light_dir));
  point_intensity = clamp(point_intensity, 0.0, 1.0);
  diffuse_intensity = max(dot(ts_diffuse_dir, norm), 0.0);

  vec3 lighting = uAmbientLight + (uDirectionalLight.color * diffuse_intensity) + (uPointLight.color * point_intensity); 
  gl_FragColor = vec4(albedo * lighting, 1.0);
}
