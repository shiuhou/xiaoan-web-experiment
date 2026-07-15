export const EDGE_TUNNEL_VERTEX_SHADER = /* glsl */ `
  uniform float uProgress;
  uniform float uVelocity;
  uniform float uPointSize;

  attribute vec3 aOrdered;
  attribute float aLane;

  varying float vLane;
  varying float vProgress;

  float easeInOut(float value) {
    return value * value * (3.0 - 2.0 * value);
  }

  void main() {
    float order = easeInOut(smoothstep(0.08, 0.9, uProgress));
    vec3 staged = mix(position, aOrdered, order);
    staged.x *= 1.0 + abs(uVelocity) * 0.08;
    staged.x += uVelocity * 0.07 * (0.35 + aLane);

    vec4 viewPosition = modelViewMatrix * vec4(staged, 1.0);
    gl_Position = projectionMatrix * viewPosition;
    gl_PointSize = uPointSize * (1.0 + 0.2 * aLane) * (5.0 / -viewPosition.z);

    vLane = aLane;
    vProgress = uProgress;
  }
`;

export const EDGE_TUNNEL_FRAGMENT_SHADER = /* glsl */ `
  varying float vLane;
  varying float vProgress;

  void main() {
    vec2 point = gl_PointCoord - 0.5;
    float horizontal = 1.0 - smoothstep(0.07, 0.5, abs(point.y));
    float cap = 1.0 - smoothstep(0.34, 0.5, abs(point.x));
    float alpha = horizontal * cap;

    vec3 ice = vec3(0.43, 0.86, 0.87);
    vec3 white = vec3(0.88, 0.93, 0.89);
    vec3 copper = vec3(0.78, 0.48, 0.25);
    vec3 color = vLane < 0.66
      ? mix(ice, white, vLane)
      : mix(white, copper, smoothstep(0.66, 1.0, vLane));
    alpha *= mix(0.38, 0.78, smoothstep(0.42, 0.92, vProgress));

    if (alpha < 0.025) discard;
    gl_FragColor = vec4(color, alpha);
  }
`;
