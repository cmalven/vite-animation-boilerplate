uniform sampler2D pointTexture;
uniform vec2 currentMouse;
varying float vAlpha;
varying vec3 vPosition;
varying vec3 vColor;

// From THREE…
// uniform vec3 cameraPosition;

void main() {
  gl_FragColor = vec4(
    vColor.r,
    vColor.g,
    vColor.b,
    vAlpha * texture2D(pointTexture, gl_PointCoord).a
  );
}