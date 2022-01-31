precision highp float;

uniform float time;
uniform vec2 resolution;

void main () {
    // Convert to coordinate system with 0,0 in bottom left and 1,1 in top right
    vec2 pos = gl_FragCoord.xy / resolution;
    pos.x *= resolution.x / resolution.y;

    // Set background color
    float r = pos.x;
    float g = pos.y;
    float b = abs(sin(time / 2.0));
    vec3 color = vec3(r, g, b);

    // Draw a circle in the center
    float center_dist = distance(vec2(0.5, 0.5), pos);
    color += 1.0 - step(0.2, center_dist);

    gl_FragColor = vec4(color, 1.0);
}
