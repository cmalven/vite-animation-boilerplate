precision highp float;
varying vec2 vUv;
varying vec3 vNormal;
uniform sampler2D textureMap;

void main() {
    vec3 normal = normalize(vNormal);
    vec3 tex = texture2D(textureMap, vUv).rgb;

    vec3 light = normalize(vec3(0.5, 1.0, -0.3));
    float shading = dot(normal, light) * 0.15;

    gl_FragColor.rgb = tex + shading;
    gl_FragColor.a = 1.0;
}
