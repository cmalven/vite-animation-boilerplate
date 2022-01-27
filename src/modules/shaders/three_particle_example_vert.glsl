attribute float size;
attribute float index;
uniform float time;
uniform float minSize;
uniform float maxSize;
uniform vec2 currentMouse;
varying float vAlpha;
varying vec3 vPosition;
varying vec3 vColor;

// From THREE…
// uniform mat4 projectionMatrix;
// uniform mat4 modelViewMatrix;
// uniform vec3 cameraPosition;
// attribute vec3 position;
// attribute vec2 uv;

float lerp(float start, float end, float pct) {
  return (start + (end - start) * pct);
}

float map_to_range(float value, float inMin, float inMax, float outMin, float outMax) {
  return (value - inMin) * (outMax - outMin) / (inMax - inMin) + outMin;
}

void main() {
  vec3 adjustedPosition = vec3(
    position.x,
    position.y + sin(time * 2.0 + index) * pow(1.1, size * 10.0),
    position.z
  );

  vec4 mvPosition = modelViewMatrix * vec4(adjustedPosition, 1.0);

  float maxPointDistance = 30.0;
  float pointDistanceScale = lerp(30.0, 0.0, distance(adjustedPosition.xy, currentMouse) / maxPointDistance);
  float maxPointSize = maxSize;
  gl_PointSize = maxPointSize*size - distance(adjustedPosition, cameraPosition)*0.2 + pointDistanceScale + minSize;

  vAlpha = map_to_range(size, 0.0, 1.0, 0.2, 1.0);
  vPosition = adjustedPosition;
  vColor = color;

  gl_Position = projectionMatrix * mvPosition;
}