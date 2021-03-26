uniform float time;
uniform vec2 currentMouse;
varying vec2 vUv;
varying vec3 vPosition;

// From THREE…
// uniform mat4 projectionMatrix;
// uniform mat4 modelViewMatrix;
// uniform vec3 cameraPosition;
// attribute vec3 position;
// attribute vec2 uv;

float easeIn(float t) {
  return t * t;
}

float lerp(float start, float end, float pct) {
  return (start + (end - start) * pct);
}

void main() {
  float maxDist = 40.0;
  float dist = lerp(1.0, 0.0, distance(position.xy, currentMouse) / maxDist);

  vec3 adjustedPosition = vec3(
    position.x,
    position.y,
    position.z + sin(time * 2.0 - uv.x*10.0) * dist * 10.0
  );

  vec4 mvPosition = modelViewMatrix * vec4(adjustedPosition, 1.0);

  vUv = uv;
  vPosition = adjustedPosition;

  gl_Position = projectionMatrix * mvPosition;
}