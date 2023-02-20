precision highp float;

uniform vec3 uColor;
varying vec2 vUv;

uniform vec4 uResolution;
uniform vec2 uOffset;
uniform float uTime;

uniform vec3 uYellow;
uniform vec3 uRed;
uniform vec3 uBlue;
uniform vec3 uGreen;

const float aa = 0.0001;

vec3 addWave(vec2 pos, float waveSpeed, float waveTimeOffset, float waveDepth, float waveOffset, vec3 color, vec3 waveColor) {
    float wave = sin(pos.x * 5.0 + (uTime + waveTimeOffset) * waveSpeed) * waveDepth;
    float waveValue = smoothstep(-aa, aa, wave - pos.y + waveOffset);
    return mix(color, waveColor, waveValue);
}

vec2 rotatePos(vec2 pos, float angle) {
    return vec2(
        pos.x * cos(angle) - pos.y * sin(angle),
        pos.x * sin(angle) + pos.y * cos(angle)
    );
}

void main() {
    // The true position and mouse within the viewport
    vec2 pos = gl_FragCoord.xy / uResolution.xy;

    // The position with the viewport scaled to the aspect ratio
    vec2 scaledPos = (gl_FragCoord.xy + uOffset) / uResolution.zz;

    // If you'd like all drawing to be centered on the screen (0,0 = center)
    vec2 scaledPosCentered = (gl_FragCoord.xy - 0.5 * uResolution.xy) / uResolution.zz;

    // Rotate scaledPosCentered by 45 degrees
    vec2 rotatedWavePos = rotatePos(scaledPosCentered, 0.4);

    // Initial color
    vec3 color = uYellow;

    color = addWave(rotatedWavePos, 0.6, 100.0, 0.05, 0.3, color, uRed);
    color = addWave(rotatedWavePos, 1.5, 200.0, 0.05, -0.15, color, uBlue);
    color = addWave(rotatedWavePos, 0.9, 400.0, 0.05, -0.35, color, uGreen);

    gl_FragColor = vec4(color, 1.0);
}
