varying mediump vec2 vTextureCoord;

uniform sampler2D uSamplerDiffuse;

void main(void) {
  gl_FragColor = texture2D(uSamplerDiffuse, vTextureCoord);
}
