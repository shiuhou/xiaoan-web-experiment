export const SIGNAL_FIELD_VERTEX_SHADER = /* glsl */ `
  uniform float uProgress;
  uniform float uPointSize;

  attribute vec3 aAligned;
  attribute vec3 aCompressed;
  attribute float aKind;

  varying float vKind;
  varying float vProgress;

  float easeInOut(float value) {
    return value * value * (3.0 - 2.0 * value);
  }

  void main() {
    float alignment = easeInOut(smoothstep(0.08, 0.58, uProgress));
    float compression = easeInOut(smoothstep(0.48, 0.94, uProgress));
    vec3 staged = mix(position, aAligned, alignment);
    staged = mix(staged, aCompressed, compression);

    vec4 viewPosition = modelViewMatrix * vec4(staged, 1.0);
    gl_Position = projectionMatrix * viewPosition;
    gl_PointSize = uPointSize * (1.0 + aKind * 0.22) * (4.4 / -viewPosition.z);

    vKind = aKind;
    vProgress = uProgress;
  }
`;

export const SIGNAL_FIELD_FRAGMENT_SHADER = /* glsl */ `
  varying float vKind;
  varying float vProgress;

  void main() {
    vec2 point = gl_PointCoord - 0.5;
    float radius = length(point);
    float core = 1.0 - smoothstep(0.16, 0.48, radius);
    float filament = 1.0 - smoothstep(0.08, 0.5, abs(point.y));
    float shape = mix(core, core * filament, step(0.52, fract(vKind * 1.91)));

    vec3 cold = vec3(0.51, 0.91, 0.93);
    vec3 warm = vec3(0.95, 0.90, 0.78);
    vec3 color = mix(cold, warm, smoothstep(0.56, 1.0, vKind));
    float assembled = smoothstep(0.5, 0.92, vProgress);
    float alpha = shape * mix(0.46, 0.72, assembled);

    if (alpha < 0.02) discard;
    gl_FragColor = vec4(color, alpha);
  }
`;
