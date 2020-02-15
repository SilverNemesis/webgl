precision mediump float;

uniform sampler2D uSamplerNormal;
uniform sampler2D uSamplerDiffuse;
uniform sampler2D uSamplerHeight;
uniform sampler2D uSamplerOcclusion;

uniform int uShowDiffuseMap;
uniform int uShowNormalMap;
uniform int uShowAmbientOcclusionMap;
uniform int uShowParallaxMap;
uniform float uParallaxHeightScale;
uniform int uParallaxSteps;
uniform int uParallaxOcclusionMapping;

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

float GetDepth(vec2 texCoords) {
  return 1.0 - texture2D(uSamplerHeight, texCoords).r;
}

vec2 ParallaxMapping(vec2 texCoords, vec3 viewDir, float heightScale) {
  float height = GetDepth(texCoords);
  vec2 p = viewDir.xy / viewDir.z * (height * heightScale);
  return texCoords - p;
}

vec2 ParallaxMappingSteps(vec2 texCoords, vec3 viewDir, float heightScale) { 
  float numLayers = float(uParallaxSteps);

  if (numLayers >= 8.0) {
    float minLayers = max(numLayers / 4.0, 2.0);
    float maxLayers = numLayers;
    numLayers = mix(maxLayers, minLayers, abs(dot(vec3(0.0, 0.0, 1.0), viewDir)));
  }

  float layerDepth = 1.0 / numLayers;
  vec2 P = viewDir.xy / viewDir.z * heightScale; 
  vec2 deltaTexCoords = P / numLayers;
  vec2 currentTexCoords = texCoords;
  float currentDepthMapValue = GetDepth(currentTexCoords);
  float currentLayerDepth = 0.0;

  for (int i = 0; i < 32; i++) {
    if (currentLayerDepth >= currentDepthMapValue) {
      break;
    }
    currentTexCoords -= deltaTexCoords;
    currentDepthMapValue = GetDepth(currentTexCoords);
    currentLayerDepth += layerDepth;
  }

  if (uParallaxOcclusionMapping > 0) {
    vec2 prevTexCoords = currentTexCoords + deltaTexCoords;
    float afterDepth  = currentDepthMapValue - currentLayerDepth;
    float beforeDepth = GetDepth(prevTexCoords) - currentLayerDepth + layerDepth;
    float weight = afterDepth / (afterDepth - beforeDepth);
    currentTexCoords = prevTexCoords * weight + currentTexCoords * (1.0 - weight);
  }
  
  return currentTexCoords;
}

void main(void) {
  vec3 view_dir = normalize(ts_view_pos - ts_frag_pos);

  vec2 texCoords;

  if (uShowParallaxMap != 0) {
    if (uParallaxSteps > 0) {
      texCoords = ParallaxMappingSteps(frag_uv, view_dir, uParallaxHeightScale);
    }
    else {
      texCoords = ParallaxMapping(frag_uv, view_dir, uParallaxHeightScale);
    }
  }
  else {
    texCoords = frag_uv;
  }

  vec3 albedo = texture2D(uSamplerDiffuse, texCoords).rgb;

  if (uShowDiffuseMap == 0) {
    albedo = vec3(0.5, 0.5, 0.5);
  }

  float point_intensity;
  float diffuse_intensity;

  if (uShowNormalMap == 0) {
    vec3 normal = frag_normal;
    vec3 light_dir = uPointLight.position - frag_position;
    point_intensity = clamp(15.0 * max(dot(normalize(light_dir), normal), 0.0) / (length(light_dir) * length(light_dir)), 0.0, 1.0);
    diffuse_intensity = max(dot(uDirectionalLight.direction, normal), 0.0);
  }
  else {
    vec3 normal = normalize(texture2D(uSamplerNormal, texCoords).rgb * 2.0 - 1.0);
    vec3 light_dir = ts_light_pos - ts_frag_pos;
    point_intensity = clamp(15.0 * max(dot(normalize(light_dir), normal), 0.0) / (length(light_dir) * length(light_dir)), 0.0, 1.0);
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
