attribute vec3 position;
attribute vec3 normal;
uniform mat4 modelViewMatrix;
uniform mat4 projectionMatrix;
uniform mat3 normalMatrix;
varying vec3 vNormal;
uniform float time;

void main() {
    vec3 adjustedPosition = position;
    adjustedPosition.y += sin(time);
    vNormal = normalize(normalMatrix * normal);
    gl_Position = projectionMatrix * modelViewMatrix * vec4(adjustedPosition, 1.0);
}
