precision highp float;

uniform float time;
uniform vec2 resolution;
uniform vec2 mouse;

void main () {
    float maxRes = max(resolution.x, resolution.y);
    float minRes = min(resolution.x, resolution.y);
    float off = (maxRes - minRes) / 2.0;
    float xOffset = resolution.x < resolution.y ? off : 0.0;
    float yOffset = resolution.x > resolution.y ? off : 0.0;
    vec2 offset = vec2(xOffset, yOffset);
    vec2 scaledRes = vec2(maxRes, maxRes);

    // The true position within the viewport
    vec2 pos = gl_FragCoord.xy / resolution;

    // The position with the viewport scaled to the aspect ratio
    vec2 scaledPos = (gl_FragCoord.xy + offset) / scaledRes;

    // Set background color
    float r = pos.x;
    float g = pos.y;
    float b = abs(sin(time / 2.0));
    vec3 color = vec3(r, g, b);

    // Draw a circle in the center
    float center_dist = distance(vec2(0.5, 0.5), scaledPos);
    color += 1.0 - step(0.15, center_dist);

    gl_FragColor = vec4(color, 1.0);
}
