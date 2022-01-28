precision highp float;

uniform float time;
varying vec2 v_position;

void main () {
    // Convert to coordinate system with 0,0 in bottom left and 1,1 in top right
    float x = smoothstep(-1.0, 1.0, v_position.x);
    float y = smoothstep(-1.0, 1.0, v_position.y);
    vec2 pos = vec2(x, y);

    // Set background color
    float r = pos.x;
    float g = pos.y;
    float b = abs(sin(time / 2.0));
    vec3 color = vec3(r, g, b);

    // Draw a circle in the center
    float center_dist = distance(vec2(0.5, 0.5), pos);
    color += 1.0 - step(0.3, center_dist);

    gl_FragColor = vec4(color, 1.0);
}
