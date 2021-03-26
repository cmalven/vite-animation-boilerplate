#ifdef GL_ES
precision mediump float;
#endif

attribute vec3 aVertexPosition;
attribute vec2 aTextureCoord;
uniform mat4 uMVMatrix;
uniform mat4 uPMatrix;
uniform float uTime;
uniform float uDistortPeriod;
uniform float uDistortStrength;
uniform vec2 uMouse;
uniform mat4 uTextureMatrix0;
varying vec3 vVertexPosition;
varying vec2 vTextureCoord;

void main() {
  vec3 adjustedPosition = vec3(
    aVertexPosition.x,
    aVertexPosition.y,
    aVertexPosition.z + sin(uTime * 0.02 - aVertexPosition.x * 3.0) * 0.1
  );

  vec4 mvPosition = uMVMatrix * vec4(adjustedPosition, 1.0);
  vTextureCoord = (uTextureMatrix0 * vec4(aTextureCoord, 0.0, 1.0)).xy;
  vVertexPosition = adjustedPosition;
  gl_Position = uPMatrix * mvPosition;
}