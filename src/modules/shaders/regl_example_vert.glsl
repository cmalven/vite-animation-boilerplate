precision highp float;

attribute vec2 position;
uniform float time;
varying vec2 v_position;

void main () {
    gl_Position = vec4(position, 0, 1);
    v_position = gl_Position.xy;
}
