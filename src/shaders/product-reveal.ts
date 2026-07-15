export const PRODUCT_REVEAL_VERTEX_SHADER = /* glsl */ `
  varying vec2 vUv;

  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

export const PRODUCT_REVEAL_FRAGMENT_SHADER = /* glsl */ `
  uniform sampler2D uTexture;
  uniform float uRevealProgress;
  uniform vec2 uPointer;
  varying vec2 vUv;

  float hash(vec2 point) {
    return fract(sin(dot(point, vec2(127.1, 311.7))) * 43758.5453123);
  }

  float noise(vec2 point) {
    vec2 cell = floor(point);
    vec2 local = fract(point);
    vec2 curve = local * local * (3.0 - 2.0 * local);
    return mix(
      mix(hash(cell), hash(cell + vec2(1.0, 0.0)), curve.x),
      mix(hash(cell + vec2(0.0, 1.0)), hash(cell + vec2(1.0)), curve.x),
      curve.y
    );
  }

  float fbm(vec2 point) {
    float value = 0.0;
    float amplitude = 0.5;
    for (int octave = 0; octave < 4; octave++) {
      value += amplitude * noise(point);
      point = point * 2.03 + 11.7;
      amplitude *= 0.5;
    }
    return value;
  }

  void main() {
    float field = mix(vUv.x, 1.0 - vUv.y, 0.24);
    float boundary = uRevealProgress * 1.34 - 0.17 + fbm(vUv * 4.2) * 0.11;
    float reveal = smoothstep(field - 0.035, field + 0.035, boundary);
    float edge = 1.0 - smoothstep(0.0, 0.048, abs(field - boundary));

    vec2 pointerDelta = vUv - uPointer;
    float pointerFocus = exp(-dot(pointerDelta, pointerDelta) * 20.0);
    vec2 refraction = normalize(pointerDelta + vec2(0.0001))
      * pointerFocus
      * edge
      * 0.012;
    vec4 product = texture2D(uTexture, clamp(vUv + refraction, 0.0, 1.0));
    product.rgb += vec3(0.24, 0.82, 0.9) * edge * 0.34;

    gl_FragColor = vec4(product.rgb, product.a * reveal);
  }
`;
