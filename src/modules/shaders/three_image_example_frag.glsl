uniform sampler2D imageTexture;
uniform float time;
uniform vec2 currentMouse;
varying vec2 vUv;
varying vec3 vPosition;

// From THREE…
// uniform vec3 cameraPosition;

void main() {
  float u = vUv.x;
  float v = vUv.y;
  vec2 newUv = vec2(u, v);

    // Add highlight based on z position
  float zHighlight = vPosition.z * 0.02;

  float r = texture2D(imageTexture, newUv).r + zHighlight;
  float g = texture2D(imageTexture, newUv).g + zHighlight;
  float b = texture2D(imageTexture, newUv).b + zHighlight;

  vec3 texture = vec3(r, g, b);

  gl_FragColor = vec4(texture, 1.0);
}