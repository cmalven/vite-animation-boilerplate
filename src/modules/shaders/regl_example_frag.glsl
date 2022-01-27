precision highp float;

uniform float time;
varying vec2 v_position;

void main () {
    // Convert to coordinate system with 0,0 in top left and 1,1 in bottom right
    float x = smoothstep(-1.0, 1.0, v_position.x);
    float y = smoothstep(1.0, -1.0, v_position.y);

    float r = x;
    float g = y;
    float b = abs(sin(time / 2.0));

    gl_FragColor = vec4(r, g, b, 1.0);
}
