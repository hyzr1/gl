export const FULLSCREEN_VERTEX_SHADER = `#version 300 es
precision highp float;

layout(location = 0) in vec2 aPosition;
out vec2 vUv;

void main() {
  vUv = aPosition * 0.5 + 0.5;
  gl_Position = vec4(aPosition, 0.0, 1.0);
}
`;

export const HYPERGL_FRAGMENT_SHADER = `#version 300 es
precision highp float;

in vec2 vUv;
out vec4 fragColor;

uniform vec2 uResolution;
uniform vec2 uPointer;
uniform float uPointerStrength;
uniform float uTime;
uniform float uEffect;
uniform float uSpeed;
uniform float uIntensity;
uniform float uDensity;
uniform float uScale;
uniform float uDistortion;
uniform float uBloom;
uniform float uGrain;
uniform float uCursorRadius;
uniform float uShapeCount;
uniform float uDepth;
uniform float uRotation;
uniform vec3 uColorA;
uniform vec3 uColorB;
uniform vec3 uColorC;

const float PI = 3.14159265359;
const float TAU = 6.28318530718;

mat2 rotate2d(float angle) {
  float s = sin(angle);
  float c = cos(angle);
  return mat2(c, -s, s, c);
}

float hash12(vec2 p) {
  vec3 p3 = fract(vec3(p.xyx) * 0.1031);
  p3 += dot(p3, p3.yzx + 33.33);
  return fract((p3.x + p3.y) * p3.z);
}

vec2 hash22(vec2 p) {
  vec3 p3 = fract(vec3(p.xyx) * vec3(0.1031, 0.1030, 0.0973));
  p3 += dot(p3, p3.yzx + 33.33);
  return fract((p3.xx + p3.yz) * p3.zy);
}

float noise(vec2 p) {
  vec2 i = floor(p);
  vec2 f = fract(p);
  vec2 u = f * f * (3.0 - 2.0 * f);
  float a = hash12(i);
  float b = hash12(i + vec2(1.0, 0.0));
  float c = hash12(i + vec2(0.0, 1.0));
  float d = hash12(i + vec2(1.0, 1.0));
  return mix(mix(a, b, u.x), mix(c, d, u.x), u.y);
}

float fbm(vec2 p) {
  float value = 0.0;
  float amplitude = 0.5;
  mat2 basis = mat2(1.62, 1.18, -1.18, 1.62);
  for (int i = 0; i < 5; i++) {
    value += amplitude * noise(p);
    p = basis * p + 17.0;
    amplitude *= 0.5;
  }
  return value;
}

vec3 palette(float t) {
  t = clamp(t, 0.0, 1.0);
  vec3 first = mix(uColorA, uColorB, smoothstep(0.0, 0.62, t));
  vec3 second = mix(uColorB, uColorC, smoothstep(0.24, 1.0, t));
  return mix(first, second, smoothstep(0.35, 0.95, t));
}

vec2 pointerWarp(vec2 uv, vec2 p, float aspect) {
  vec2 pointer = vec2(uPointer.x * aspect, uPointer.y);
  vec2 delta = pointer - p;
  float distanceToPointer = length(delta);
  float radius = mix(0.08, 0.68, clamp(uCursorRadius, 0.0, 1.0));
  float falloff = smoothstep(radius, 0.0, distanceToPointer) * uPointerStrength;
  vec2 pull = vec2(delta.x / aspect, delta.y) * falloff * 0.18 * uDistortion;
  vec2 tangent = vec2(-delta.y / aspect, delta.x) * falloff * 0.045 * sin(uTime * 0.9 + distanceToPointer * 18.0);
  return uv - pull + tangent;
}

float lineMask(float value, float width) {
  float line = abs(fract(value) - 0.5);
  return 1.0 - smoothstep(width, width + 0.035, line);
}

vec3 auroraEffect(vec2 uv, vec2 p) {
  vec2 q = uv;
  q.x += sin(q.y * 5.0 + uTime * 0.55) * 0.14 * uDistortion;
  q.y += fbm(q * 2.2 + uTime * 0.12) * 0.28 * uDistortion;
  float bands = sin((q.y * mix(3.0, 9.0, uDensity)) + fbm(q * 4.0) * 3.0 + uTime * 0.7);
  float haze = fbm(q * (2.0 + uScale * 5.0) + vec2(uTime * 0.13, -uTime * 0.08));
  float glow = smoothstep(-0.2, 1.0, bands + haze * 1.15);
  float vignette = smoothstep(1.2, 0.05, length(p - vec2(0.0, 0.06)));
  return palette(glow) * glow * vignette;
}

vec3 liquidEffect(vec2 uv, vec2 p) {
  vec2 q = uv * mix(1.4, 5.0, uScale);
  for (int i = 0; i < 3; i++) {
    float n = fbm(q + vec2(float(i) * 8.2, uTime * (0.12 + float(i) * 0.05)));
    q += vec2(sin(n * TAU + uTime * 0.18), cos(n * TAU - uTime * 0.13)) * uDistortion;
  }
  float field = fbm(q + p * uDepth);
  float veins = lineMask(field * mix(4.0, 16.0, uDensity), 0.08);
  vec3 color = palette(field);
  color += palette(1.0 - field) * veins * 0.34;
  return color * (0.55 + field * 0.78);
}

vec3 particleEffect(vec2 uv, vec2 p, float aspect) {
  vec2 gridUv = uv;
  gridUv.x *= aspect;
  gridUv *= mix(8.0, 22.0 + uShapeCount * 2.0, uDensity);
  vec2 cell = floor(gridUv);
  vec2 local = fract(gridUv) - 0.5;
  vec3 color = vec3(0.0);
  for (int y = -1; y <= 1; y++) {
    for (int x = -1; x <= 1; x++) {
      vec2 offset = vec2(float(x), float(y));
      vec2 id = cell + offset;
      vec2 point = hash22(id) - 0.5;
      point += sin(uTime * (0.6 + uSpeed) + hash22(id + 4.0) * TAU) * 0.28 * uDistortion;
      vec2 diff = offset + point - local;
      float dist = length(diff);
      float star = smoothstep(0.18, 0.0, dist);
      star += pow(max(0.0, 0.08 / max(dist, 0.005)), 1.35) * 0.045;
      color += palette(hash12(id)) * star;
    }
  }
  float pointerGlow = smoothstep(0.44, 0.0, length(vec2(uPointer.x * aspect, uPointer.y) - vec2(uv.x * aspect, uv.y)));
  color += palette(0.78) * pointerGlow * uPointerStrength * 0.4;
  return color;
}

vec3 topographicEffect(vec2 uv, vec2 p) {
  vec2 q = uv * mix(2.5, 9.0, uScale);
  q *= rotate2d(uRotation * TAU);
  q += vec2(uTime * 0.08, -uTime * 0.05);
  float height = fbm(q + fbm(q + 11.0));
  float contour = lineMask(height * mix(5.0, 12.0 + uShapeCount * 2.5, uDensity), 0.04);
  float ridge = smoothstep(0.52, 0.92, height);
  vec3 base = mix(vec3(0.02), palette(height) * 0.45, ridge);
  vec3 lines = palette(fract(height + 0.28)) * contour;
  return base + lines;
}

vec3 glassGridEffect(vec2 uv, vec2 p, float aspect) {
  vec2 q = uv - 0.5;
  q.x *= aspect;
  q *= rotate2d(uRotation * TAU + sin(uTime * 0.1) * 0.12);
  q += 0.5;
  float gridScale = mix(7.0, 14.0 + uShapeCount * 2.0, uDensity);
  vec2 grid = abs(fract(q * gridScale) - 0.5);
  float line = 1.0 - smoothstep(0.015, 0.045, min(grid.x, grid.y));
  float pane = fbm(q * 3.0 + uTime * 0.08);
  float sweep = smoothstep(0.02, 0.0, abs(fract((q.x + q.y) * 2.0 - uTime * 0.17) - 0.5));
  vec3 color = palette(pane) * (0.12 + pane * 0.36);
  color += uColorA * line * 0.72;
  color += uColorC * sweep * 0.28 * uDistortion;
  color.r += line * 0.08;
  color.b += sweep * 0.08;
  return color;
}

float sphereMask(vec2 p, float radius) {
  return smoothstep(radius, radius - 0.006, length(p));
}

vec3 rayOrbEffect(vec2 uv, vec2 p, float aspect) {
  vec2 q = uv - 0.5;
  q.x *= aspect;
  q *= rotate2d(uRotation * TAU + uTime * 0.08);
  float radius = mix(0.26, 0.44, uScale);
  float mask = sphereMask(q, radius);
  float z = sqrt(max(0.0, radius * radius - dot(q, q))) / max(radius, 0.001);
  vec3 normal = normalize(vec3(q / max(radius, 0.001), z));
  vec3 light = normalize(vec3(-0.4 + (uPointer.x - 0.5) * 1.2, 0.35 + (uPointer.y - 0.5) * 1.2, 0.75));
  float diffuse = max(dot(normal, light), 0.0);
  float fresnel = pow(1.0 - max(normal.z, 0.0), 2.2);
  float rings = lineMask((length(q) * (4.0 + uShapeCount) + atan(q.y, q.x) * 0.35 + uTime * 0.16) * mix(1.0, 3.0, uDensity), 0.07);
  vec3 orb = palette(diffuse * 0.7 + fresnel * 0.4);
  orb *= diffuse * 0.9 + fresnel * 0.8 + rings * 0.4;
  float halo = smoothstep(radius + 0.24 + uBloom * 0.2, radius, length(q));
  vec3 background = palette(fbm(uv * 3.0 + uTime * 0.05)) * halo * 0.18;
  return background + orb * mask + palette(0.9) * halo * 0.18;
}

void main() {
  float aspect = uResolution.x / max(uResolution.y, 1.0);
  vec2 uv = vUv;
  vec2 p = vec2((uv.x - 0.5) * aspect, uv.y - 0.5);
  uv = pointerWarp(uv, vec2(uv.x * aspect, uv.y), aspect);
  float localTime = uTime;

  vec2 animatedUv = uv;
  animatedUv += vec2(sin(localTime * 0.12), cos(localTime * 0.1)) * 0.04 * uDistortion;

  vec3 color;
  if (uEffect < 0.5) {
    color = auroraEffect(animatedUv, p);
  } else if (uEffect < 1.5) {
    color = liquidEffect(animatedUv, p);
  } else if (uEffect < 2.5) {
    color = particleEffect(animatedUv, p, aspect);
  } else if (uEffect < 3.5) {
    color = topographicEffect(animatedUv, p);
  } else if (uEffect < 4.5) {
    color = glassGridEffect(animatedUv, p, aspect);
  } else {
    color = rayOrbEffect(animatedUv, p, aspect);
  }

  float vignette = smoothstep(0.95, 0.16, length(p));
  float bloom = pow(max(max(color.r, color.g), color.b), 1.6) * uBloom;
  float grain = (hash12(gl_FragCoord.xy + localTime) - 0.5) * uGrain;
  color = color * (0.52 + uIntensity * 1.35);
  color += bloom * palette(0.88) * 0.28;
  color *= 0.62 + vignette * 0.58;
  color += grain;

  fragColor = vec4(clamp(color, 0.0, 1.0), 1.0);
}
`;
