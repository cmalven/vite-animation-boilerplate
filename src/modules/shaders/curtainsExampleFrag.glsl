#ifdef GL_ES
precision mediump float;
#endif

varying vec3 vVertexPosition;
varying vec2 vTextureCoord;
uniform float uTime;
uniform float uDistortPeriod;
uniform float uDistortStrength;
uniform vec2 uMouse;
uniform sampler2D uSampler0;

void main() {
  float u = vTextureCoord.x;
  float v = vTextureCoord.y;
  vec2 newUv = vec2(u, v);

  // Get difference/distance between uv and mouse
  vec2 diff = uMouse - vVertexPosition.xy;
  float dist = smoothstep(1.7, -1.0, distance(uMouse, vVertexPosition.xy));

  // Distort texture
  newUv.x += sin(newUv.y * uDistortStrength) * cos(newUv.x * uDistortStrength) * (cos(uTime / uDistortPeriod)) / uDistortStrength;
  newUv += diff * dist * 0.6;

  // Add highlight based on z position
  float zHighlight = vVertexPosition.z * 1.0;

  float r = texture2D(uSampler0, newUv).r + zHighlight;
  float g = texture2D(uSampler0, newUv).g + zHighlight;
  float b = texture2D(uSampler0, newUv).b + zHighlight;

  vec3 texture = vec3(r, g, b);

  gl_FragColor = vec4(texture, 1.0);
}