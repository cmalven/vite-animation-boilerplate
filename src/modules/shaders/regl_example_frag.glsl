precision highp float;

uniform float time;
uniform vec4 resolution;
uniform vec2 mouse;
uniform vec2 offset;
uniform float scale;

float plot(vec2 st) {
    return smoothstep(0.002, 0.0, abs(st.y - st.x));
}

void main () {
    // The true position and mouse within the viewport
    vec2 pos = gl_FragCoord.xy / resolution.xy;
    vec2 mousePos = mouse / resolution.xy;

    // The position with the viewport scaled to the aspect ratio
    vec2 scaledPos = (gl_FragCoord.xy + offset) / resolution.zz;
    vec2 scaledMousePos = (mouse + offset) / resolution.zz;

    // If you'd like all drawing to be centered on the screen (0,0 = center)
    vec2 scaledPosCentered = (gl_FragCoord.xy - 0.5 * resolution.xy) / resolution.zz;

    // Initial color
    vec3 color = vec3(0.0);

    // Smoothing amount
    float aa = 0.0001;

    // Create a circle
    float center_dist = distance(scaledMousePos, scaledPos);
    float radius = 0.15 * scale;
    float circle = 1.0 - smoothstep(radius-aa, radius+aa, center_dist);

    // Background color
    float r = pos.x;
    float g = pos.y;
    float b = abs(sin(time / 2.0));
    vec3 grad = vec3(r, g, b);

    // Circle color
    vec3 reverseGrad = vec3(g, r, b);

    // Draw circle and background
    color += mix(grad, reverseGrad, circle);

    // Plot a line
    float pct = plot(pos);
    color = (1.0-pct)*color+pct*vec3(0.0,1.0,0.0);

    gl_FragColor = vec4(color, 1.0);
}
