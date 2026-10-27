// GLSL for the Solar System background. Surfaces are baked once into textures
// (see bake.ts), so the expensive noise below never runs per frame.

const NOISE = /* glsl */ `
vec3 mod289(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
vec4 mod289(vec4 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
vec4 permute(vec4 x) { return mod289(((x * 34.0) + 1.0) * x); }
vec4 taylorInvSqrt(vec4 r) { return 1.79284291400159 - 0.85373472095314 * r; }

// Ashima Arts 3D simplex noise, range about [-1, 1]
float snoise(vec3 v) {
  const vec2 C = vec2(1.0 / 6.0, 1.0 / 3.0);
  const vec4 D = vec4(0.0, 0.5, 1.0, 2.0);
  vec3 i = floor(v + dot(v, C.yyy));
  vec3 x0 = v - i + dot(i, C.xxx);
  vec3 g = step(x0.yzx, x0.xyz);
  vec3 l = 1.0 - g;
  vec3 i1 = min(g.xyz, l.zxy);
  vec3 i2 = max(g.xyz, l.zxy);
  vec3 x1 = x0 - i1 + C.xxx;
  vec3 x2 = x0 - i2 + C.yyy;
  vec3 x3 = x0 - D.yyy;
  i = mod289(i);
  vec4 p = permute(permute(permute(
            i.z + vec4(0.0, i1.z, i2.z, 1.0))
          + i.y + vec4(0.0, i1.y, i2.y, 1.0))
          + i.x + vec4(0.0, i1.x, i2.x, 1.0));
  float n_ = 0.142857142857;
  vec3 ns = n_ * D.wyz - D.xzx;
  vec4 j = p - 49.0 * floor(p * ns.z * ns.z);
  vec4 x_ = floor(j * ns.z);
  vec4 y_ = floor(j - 7.0 * x_);
  vec4 x = x_ * ns.x + ns.yyyy;
  vec4 y = y_ * ns.x + ns.yyyy;
  vec4 h = 1.0 - abs(x) - abs(y);
  vec4 b0 = vec4(x.xy, y.xy);
  vec4 b1 = vec4(x.zw, y.zw);
  vec4 s0 = floor(b0) * 2.0 + 1.0;
  vec4 s1 = floor(b1) * 2.0 + 1.0;
  vec4 sh = -step(h, vec4(0.0));
  vec4 a0 = b0.xzyw + s0.xzyw * sh.xxyy;
  vec4 a1 = b1.xzyw + s1.xzyw * sh.zzww;
  vec3 p0 = vec3(a0.xy, h.x);
  vec3 p1 = vec3(a0.zw, h.y);
  vec3 p2 = vec3(a1.xy, h.z);
  vec3 p3 = vec3(a1.zw, h.w);
  vec4 norm = taylorInvSqrt(vec4(dot(p0, p0), dot(p1, p1), dot(p2, p2), dot(p3, p3)));
  p0 *= norm.x; p1 *= norm.y; p2 *= norm.z; p3 *= norm.w;
  vec4 m = max(0.6 - vec4(dot(x0, x0), dot(x1, x1), dot(x2, x2), dot(x3, x3)), 0.0);
  m = m * m;
  return 42.0 * dot(m * m, vec4(dot(p0, x0), dot(p1, x1), dot(p2, x2), dot(p3, x3)));
}

float fbm(vec3 p) {
  float sum = 0.0, amp = 0.5;
  for (int i = 0; i < OCTAVES; i++) {
    sum += amp * snoise(p);
    p = p * 2.03 + vec3(1.7, 9.2, 3.1);
    amp *= 0.5;
  }
  return sum;
}

float ridged(vec3 p) {
  float sum = 0.0, amp = 0.5;
  for (int i = 0; i < OCTAVES; i++) {
    float n = 1.0 - abs(snoise(p));
    sum += amp * n * n;
    p = p * 2.1 + vec3(4.3, 1.1, 7.7);
    amp *= 0.5;
  }
  return sum;
}

vec3 hash3(vec3 p) {
  p = vec3(dot(p, vec3(127.1, 311.7, 74.7)), dot(p, vec3(269.5, 183.3, 246.1)), dot(p, vec3(113.5, 271.9, 124.6)));
  return fract(sin(p) * 43758.5453123);
}

// x: distance to nearest feature point, y: that cell's random id, z: second-nearest distance
vec3 worley(vec3 p) {
  vec3 cell = floor(p);
  vec3 f = fract(p);
  float d1 = 8.0, d2 = 8.0, id = 0.0;
  for (int x = -1; x <= 1; x++)
  for (int y = -1; y <= 1; y++)
  for (int z = -1; z <= 1; z++) {
    vec3 o = vec3(float(x), float(y), float(z));
    vec3 h = hash3(cell + o);
    float d = length(o + h - f);
    if (d < d1) { d2 = d1; d1 = d; id = h.x; } else if (d < d2) { d2 = d; }
  }
  return vec3(d1, id, d2);
}
`;

// Ring density as a function of radius in planet radii. Shared by the ring mesh and
// by Saturn's bake (for the ring shadow on the planet).
const RING_DENSITY = /* glsl */ `
float band(float r, float a, float b, float soft) {
  return smoothstep(a - soft, a + soft, r) * (1.0 - smoothstep(b - soft, b + soft, r));
}
float ringHash(float x) { return fract(sin(x * 91.17) * 43758.5453); }
float ringNoise(float x) {
  float i = floor(x); float f = fract(x);
  return mix(ringHash(i), ringHash(i + 1.0), f * f * (3.0 - 2.0 * f));
}
float ringDensity(float r) {
#if RING_TYPE == 1 // Saturn
  float fine = 0.75 + 0.25 * ringNoise(r * 180.0) + 0.1 * ringNoise(r * 900.0);
  float d = band(r, 1.24, 1.53, 0.01) * 0.18
          + band(r, 1.53, 1.95, 0.01) * (0.85 + 0.15 * sin(r * 40.0))
          + band(r, 1.95, 2.03, 0.005) * 0.05
          + band(r, 2.03, 2.27, 0.006) * 0.6 * (1.0 - band(r, 2.208, 2.218, 0.002))
          + band(r, 2.315, 2.325, 0.003) * 0.4;
  return d * fine;
#elif RING_TYPE == 2 // Uranus: narrow dark rings, epsilon is the widest
  float d = 0.0;
  d += band(r, 1.637, 1.645, 0.002);
  d += band(r, 1.664, 1.671, 0.002);
  d += band(r, 1.756, 1.763, 0.002);
  d += band(r, 1.866, 1.873, 0.002);
  d += band(r, 1.957, 1.965, 0.002);
  d += band(r, 2.0, 2.04, 0.003) * 1.4;
  return d * 0.6;
#elif RING_TYPE == 3 // Neptune: faint dusty Galle, narrow Le Verrier and Adams
  return band(r, 1.65, 1.73, 0.02) * 0.12
       + band(r, 2.14, 2.16, 0.004) * 0.5
       + band(r, 2.52, 2.55, 0.004) * (0.45 + 0.4 * ringNoise(r * 300.0));
#else // Jupiter: faint halo and main ring, very faint gossamer rings
  return band(r, 1.4, 1.72, 0.05) * 0.06
       + band(r, 1.72, 1.81, 0.01) * 0.3
       + band(r, 1.81, 3.1, 0.1) * 0.025;
#endif
}
`;

// Streamed photo textures are uploaded without flipY (they're ImageBitmaps), so flip v when sampling.
const STREAMED_UV = 'vec2(uv.x, 1.0 - uv.y)';

export const bakeVertex = /* glsl */ `
varying vec2 vUv;
void main() {
  vUv = uv;
  gl_Position = vec4(position.xy, 0.0, 1.0);
}
`;

// Matches THREE.SphereGeometry's uv layout, so the baked texture wraps the sphere exactly.
const SPHERE_DIR = /* glsl */ `
vec3 sphereDir(vec2 uv) {
  float phi = uv.x * 6.28318530718;
  float theta = (1.0 - uv.y) * 3.14159265359;
  return vec3(-cos(phi) * sin(theta), cos(theta), sin(phi) * sin(theta));
}
vec3 tangentX(vec3 n) { return normalize(cross(abs(n.y) > 0.99 ? vec3(1.0, 0.0, 0.0) : vec3(0.0, 1.0, 0.0), n)); }
float lambert(vec3 n, vec3 geo, vec3 L) {
  float shadow = smoothstep(-0.08, 0.12, dot(geo, L));
  return max(dot(n, L), 0.0) * shadow;
}
`;

const BAKE_HEADER = /* glsl */ `
uniform vec3 uSunDir;   // object space
uniform float uSeed;
uniform float uAmbient;
varying vec2 vUv;
${NOISE}
${SPHERE_DIR}
`;

export const rockyBakeFragment = /* glsl */ `
${BAKE_HEADER}
uniform vec3 uBase, uDark, uLight, uCapColor;
uniform float uScale, uCraters, uMaria, uRidges, uCap, uTwoTone, uSpots, uBump;

float crater(vec3 p, float density) {
  vec3 w = worley(p);
  if (w.y > density) return 0.0;
  float size = mix(0.25, 0.5, fract(w.y * 17.0));
  float d = w.x / size;
  float bowl = (smoothstep(0.0, 0.85, d) - 1.0) * 0.9;
  float rim = smoothstep(0.7, 0.95, d) * (1.0 - smoothstep(0.95, 1.35, d)) * 0.5;
  return bowl + rim;
}

float mariaMask(vec3 p) {
  return smoothstep(0.0, 0.25, fbm(p * 0.7 + 5.0)) * uMaria;
}

float height(vec3 p) {
  float h = fbm(p) * 0.25;
  h -= mariaMask(p) * 0.25;
  if (uCraters > 0.0) {
    float c = crater(p * 2.0, uCraters * 0.55) * 0.6 + crater(p * 5.0 + 11.0, uCraters * 0.7) * 0.3
            + crater(p * 12.0 + 3.0, uCraters * 0.8) * 0.12;
    h += c * (1.0 - mariaMask(p) * 0.7) * uCraters;
  }
  return h;
}

void main() {
  vec3 dir = sphereDir(vUv);
  vec3 p = dir * uScale + uSeed * vec3(13.1, 7.7, 3.3);

  float h = height(p);
  float detail = fbm(p * 3.0 + 2.0) * 0.5 + 0.5;
  vec3 col = mix(uBase, uLight, smoothstep(0.35, 0.9, detail));
  col = mix(col, uDark, (1.0 - smoothstep(0.15, 0.55, detail)) * 0.5);

  float maria = mariaMask(p);
  col = mix(col, uDark, maria * 0.85);
  // fresh craters are brighter than the old surface around them
  col = mix(col, uLight, smoothstep(0.05, 0.3, -h) * uCraters * 0.25);

  if (uRidges > 0.0) {
    float lines = max(smoothstep(0.93, 0.995, 1.0 - abs(snoise(p * 1.3 + 7.0))),
                      smoothstep(0.95, 0.997, 1.0 - abs(snoise(p * 2.6 - 3.0))));
    col = mix(col, uDark, lines * uRidges * 0.8);
    h += lines * uRidges * 0.05;
  }
  if (uSpots > 0.0) {
    float s = fbm(p * 1.8 + 21.0);
    col = mix(col, uLight, smoothstep(0.15, 0.4, s) * uSpots);
    col = mix(col, uDark, smoothstep(0.3, 0.55, -s) * uSpots * 0.8);
  }
  if (uTwoTone > 0.0) {
    float lead = smoothstep(-0.25, 0.35, dir.x + fbm(p * 2.0) * 0.25);
    col = mix(col, uDark, lead * uTwoTone);
  }
  if (uCap > 0.0) {
    float cap = smoothstep(1.0 - uCap, 1.0 - uCap * 0.6, abs(dir.y) + fbm(p * 2.0) * 0.06);
    col = mix(col, uCapColor, cap);
  }

  // bump lighting from finite differences of the height field
  float e = 0.004 * uScale;
  vec3 t1 = tangentX(dir);
  vec3 t2 = cross(dir, t1);
  float hx = height(p + t1 * e) - h;
  float hy = height(p + t2 * e) - h;
  vec3 n = normalize(dir - (t1 * hx + t2 * hy) / e * 0.012 * uBump);

  float light = lambert(n, dir, uSunDir);
  gl_FragColor = vec4(col * (light + uAmbient), 1.0);
}
`;

export const gasBakeFragment = /* glsl */ `
${BAKE_HEADER}
uniform vec3 uC0, uC1, uC2, uC3, uSpotColor;
uniform float uBands, uTurb, uContrast, uSpotAmount;
uniform vec4 uSpot; // lat, lon, half-size lat, half-size lon (radians)
${RING_DENSITY}

void main() {
  vec3 dir = sphereDir(vUv);
  vec3 p = dir + uSeed * vec3(5.1, 2.3, 8.9);

  float lat = asin(dir.y);
  float lon = atan(dir.z, -dir.x);

  // longitude-sheared turbulence, stronger at the band edges
  vec3 q = vec3(p.x * 3.0, p.y * 14.0, p.z * 3.0);
  float swirl = fbm(q + vec3(fbm(q * 0.5), 0.0, fbm(q * 0.5 + 4.0)));
  float b = lat * uBands + swirl * uTurb * 0.6;

  float s1 = 0.5 + 0.5 * sin(b);
  float s2 = 0.5 + 0.5 * sin(b * 2.37 + 1.3);
  vec3 col = mix(mix(uC0, uC1, s1), mix(uC2, uC3, s2), smoothstep(0.3, 0.7, fbm(p * vec3(1.0, 9.0, 1.0)) * 0.5 + 0.5));
  col *= 0.92 + 0.16 * fbm(p * vec3(6.0, 30.0, 6.0));
  vec3 mean = (uC0 + uC1 + uC2 + uC3) * 0.25;
  col = mix(mean, col, uContrast);

  if (uSpotAmount > 0.0) {
    float dLon = atan(sin(lon - uSpot.y), cos(lon - uSpot.y));
    vec2 d = vec2(dLon / uSpot.w, (lat - uSpot.x) / uSpot.z);
    float r = length(d);
    float ring = (1.0 - smoothstep(0.6, 1.0, r));
    float inner = (1.0 - smoothstep(0.0, 0.75, r + swirl * 0.15));
    col = mix(col, mix(col, uSpotColor, 0.6), ring);
    col = mix(col, uSpotColor, inner);
  }

  // darker, hazier toward the poles
  col *= mix(1.0, 0.72, smoothstep(0.55, 1.0, abs(dir.y)));

  float light = lambert(dir, dir, uSunDir);
  light = pow(light, 0.85);

#ifdef RING_SHADOW
  if (uSunDir.y != 0.0) {
    float t = -dir.y / uSunDir.y;
    if (t > 0.0) {
      vec3 hit = dir + uSunDir * t;
      light *= 1.0 - clamp(ringDensity(length(hit.xz)), 0.0, 1.0) * 0.8;
    }
  }
#endif

  gl_FragColor = vec4(col * (light + uAmbient), 1.0);
}
`;

export const earthBakeFragment = /* glsl */ `
${BAKE_HEADER}

void main() {
  vec3 dir = sphereDir(vUv);
  vec3 p = dir * 1.6 + uSeed * vec3(3.7, 1.9, 6.2);
  float lat = abs(dir.y);

  float continent = fbm(p) + 0.35 * fbm(p * 3.0 + 9.0) * 0.5;
  float land = smoothstep(0.1, 0.13, continent);
  float coast = smoothstep(-0.02, 0.11, continent);

  vec3 deep = vec3(0.02, 0.09, 0.24);
  vec3 shallow = vec3(0.07, 0.27, 0.45);
  vec3 ocean = mix(deep, shallow, coast * (1.0 - land));

  float dry = smoothstep(0.45, 0.7, fbm(p * 2.0 + 30.0) * 0.5 + 0.5 + (0.12 - abs(lat - 0.3)) * 0.8);
  vec3 green = vec3(0.13, 0.27, 0.09);
  vec3 desert = vec3(0.62, 0.5, 0.32);
  vec3 tundra = vec3(0.4, 0.38, 0.33);
  vec3 ground = mix(green, desert, dry);
  ground = mix(ground, tundra, smoothstep(0.55, 0.7, lat));
  ground *= 0.85 + 0.3 * fbm(p * 8.0);
  float mountains = ridged(p * 3.0) * smoothstep(0.08, 0.25, continent);
  ground = mix(ground, vec3(0.45, 0.42, 0.38), smoothstep(0.55, 0.8, mountains) * 0.5);

  vec3 col = mix(ocean, ground, land);
  float ice = smoothstep(0.8, 0.86, lat + fbm(p * 4.0) * 0.05);
  col = mix(col, vec3(0.92, 0.95, 0.98), ice);

  vec3 cq = dir * 2.2 + vec3(11.0);
  float cloud = fbm(cq + vec3(fbm(cq * 1.5) * 0.8, fbm(cq * 1.5 + 3.0) * 0.4, 0.0));
  cloud = smoothstep(0.02, 0.45, cloud) * 0.9;
  cloud *= 0.6 + 0.4 * smoothstep(0.0, 0.3, abs(abs(dir.y) - 0.15)); // thinner near the subtropics
  col = mix(col, vec3(0.95), cloud);

  float light = lambert(dir, dir, uSunDir);
  vec3 lit = col * (light + uAmbient);

  // city lights on the night side
  float night = (1.0 - smoothstep(-0.15, 0.05, dot(dir, uSunDir)));
  float cities = smoothstep(0.62, 0.8, fbm(dir * 14.0 + 4.0) * 0.5 + 0.5) * land * (1.0 - ice) * (1.0 - cloud);
  lit += vec3(1.0, 0.7, 0.35) * cities * night * 0.7;

  gl_FragColor = vec4(lit, 1.0);
}
`;

export const sunBakeFragment = /* glsl */ `
${BAKE_HEADER}

void main() {
  vec3 dir = sphereDir(vUv);
  vec3 w = worley(dir * 38.0 + uSeed);
  float gran = smoothstep(0.0, 0.5, w.z - w.x); // bright cell centres, dark lanes
  float n = fbm(dir * 4.0) * 0.5 + 0.5;
  float heat = 0.78 + 0.1 * gran + 0.22 * (n - 0.5);
  float spot = smoothstep(0.74, 0.78, fbm(dir * 5.0 + 40.0) * 0.5 + 0.5) * (1.0 - smoothstep(0.2, 0.55, abs(dir.y)));
  float penumbra = smoothstep(0.7, 0.74, fbm(dir * 5.0 + 40.0) * 0.5 + 0.5) * (1.0 - smoothstep(0.2, 0.55, abs(dir.y)));
  heat -= penumbra * 0.18 + spot * 0.35;
  vec3 col = mix(vec3(0.95, 0.42, 0.06), vec3(1.0, 0.8, 0.42), smoothstep(0.35, 0.8, heat));
  col = mix(col, vec3(1.0, 0.96, 0.84), smoothstep(0.8, 0.95, heat));
  gl_FragColor = vec4(col, 1.0);
}
`;

// Turns the sky panorama into a smooth Milky Way glow: a wide Gaussian over a coarse mip level
// averages away its baked-in stars and compression blocks. Runs once.
export const skyGlowFragment = /* glsl */ `
uniform sampler2D uSource;
varying vec2 vUv;
void main() {
  float lat = (vUv.y - 0.5) * 3.14159265;
  float stretch = 1.0 / max(cos(lat), 0.2); // equirect pixels get narrower toward the poles
  vec3 sum = vec3(0.0);
  float total = 0.0;
  for (int i = -3; i <= 3; i++)
  for (int j = -3; j <= 3; j++) {
    vec2 o = vec2(float(i), float(j));
    float w = exp(-dot(o, o) / 6.0);
    // no fract() on x: the source repeats horizontally, and wrapping by hand would make the
    // mip selection jump at the seam
    vec2 uv = vUv + o * vec2(0.0035 * stretch, 0.007);
    uv.y = clamp(uv.y, 0.0, 1.0);
    sum += texture2D(uSource, vec2(uv.x, 1.0 - uv.y), 2.0).rgb * w; // source is a streamed (unflipped) photo
    total += w;
  }
  gl_FragColor = vec4(sum / total, 1.0);
}
`;

// --- runtime shaders (cheap) ---

export const sunVertex = /* glsl */ `
varying vec2 vUv;
varying vec3 vNormal;
varying vec3 vView;
void main() {
  vUv = ${STREAMED_UV};
  vec4 world = modelMatrix * vec4(position, 1.0);
  vNormal = normalize(mat3(modelMatrix) * normal);
  vView = cameraPosition - world.xyz;
  gl_Position = projectionMatrix * viewMatrix * world;
}
`;

export const sunFragment = /* glsl */ `
uniform sampler2D uMap;
varying vec2 vUv;
varying vec3 vNormal;
varying vec3 vView;
void main() {
  float mu = max(dot(normalize(vNormal), normalize(vView)), 0.0);
  vec3 col = texture2D(uMap, vUv).rgb;
  col = mix(col, vec3(1.0, 0.93, 0.78), 0.25) * 1.35;
  col *= 0.55 + 0.6 * pow(mu, 0.5); // limb darkening
  gl_FragColor = vec4(col, 1.0);
}
`;

export const atmosphereVertex = /* glsl */ `
uniform vec3 uSunPos;
varying vec3 vNormal;
varying vec3 vView;
varying vec3 vLight;
void main() {
  vec4 mv = modelViewMatrix * vec4(position, 1.0);
  vNormal = normalize(normalMatrix * normal); // correct under the oblate (non-uniform) scale
  vView = -mv.xyz;
  vLight = (viewMatrix * vec4(uSunPos, 1.0)).xyz - mv.xyz;
  gl_Position = projectionMatrix * mv;
}
`;

// Back faces of a slightly larger shell give the halo outside the limb;
// front faces add a thin haze over the lit edge of the disc.
export const atmosphereFragment = /* glsl */ `
uniform vec3 uColor;
uniform vec3 uSunPos;
uniform float uIntensity;
uniform float uShell; // shell radius / planet radius
varying vec3 vNormal;
varying vec3 vView;
varying vec3 vLight;
void main() {
  vec3 N = normalize(vNormal);
  vec3 V = normalize(vView);
  vec3 L = normalize(vLight);
  float lit = smoothstep(-0.3, 0.5, dot(N, L));
  float nv = dot(N, V);
#ifdef BACK
  float limb = sqrt(1.0 - 1.0 / (uShell * uShell));
  float k = clamp(-nv / limb, 0.0, 1.0);
  float a = pow(k, 3.0) * 0.9;
#else
  float a = pow(1.0 - max(nv, 0.0), 3.5) * 0.8;
#endif
  gl_FragColor = vec4(uColor * a * lit * uIntensity, 1.0);
}
`;

export const ringVertex = /* glsl */ `
varying vec3 vLocal;
varying vec3 vWorld;
void main() {
  vLocal = position;
  vec4 world = modelMatrix * vec4(position, 1.0);
  vWorld = world.xyz;
  gl_Position = projectionMatrix * viewMatrix * world;
}
`;

export const ringFragment = /* glsl */ `
uniform vec3 uColor;
uniform vec3 uSunDirLocal; // ring space, normalized
uniform float uBrightness;
#ifdef RING_TEXTURE
uniform sampler2D uRingTex;
uniform vec2 uRingRange; // inner, outer radius covered by the texture
#endif
varying vec3 vLocal;
varying vec3 vWorld;
${RING_DENSITY}
void main() {
  float r = length(vLocal.xy);
#ifdef RING_TEXTURE
  float u = (r - uRingRange.x) / (uRingRange.y - uRingRange.x);
  vec4 tex = texture2D(uRingTex, vec2(clamp(u, 0.0, 1.0), 0.5));
  float d = tex.a * step(0.0, u) * step(u, 1.0);
#else
  float fw = fwidth(r);
  // average density across the pixel footprint so thin rings don't shimmer
  float d = (ringDensity(r - fw * 0.5) + ringDensity(r) + ringDensity(r + fw * 0.5)) / 3.0;
#endif

  // planet shadow (planet is a unit sphere in ring space)
  vec3 q = vec3(vLocal.xy, 0.0);
  float bq = dot(q, uSunDirLocal);
  float disc = bq * bq - (dot(q, q) - 1.0);
  float shadow = (disc > 0.0 && -bq - sqrt(disc) > 0.0) ? 0.08 : 1.0;

  float facing = 0.45 + 0.55 * abs(uSunDirLocal.z);
#ifdef RING_TEXTURE
  vec3 col = tex.rgb * uColor * facing * shadow * uBrightness;
#else
  vec3 col = uColor * (0.85 + 0.3 * ringNoise(r * 60.0)) * facing * shadow * uBrightness;
#endif
  gl_FragColor = vec4(col, clamp(d, 0.0, 1.0));
}
`;

export const starsVertex = /* glsl */ `
attribute float aSize;
attribute vec3 aColor;
uniform float uPixelRatio;
varying vec3 vColor;
varying float vGlow;
varying float vPixels;
void main() {
  vColor = aColor;
  vGlow = smoothstep(3.0, 7.0, aSize);
  vec4 mv = modelViewMatrix * vec4(position, 1.0);
  gl_Position = projectionMatrix * mv;
  // at least 3 device pixels, so even faint stars cover a full pixel footprint and don't shimmer
  vPixels = max(aSize * uPixelRatio, 3.0);
  gl_PointSize = vPixels;
}
`;

export const starsFragment = /* glsl */ `
varying vec3 vColor;
varying float vGlow;
varying float vPixels;
void main() {
  vec2 c = gl_PointCoord - 0.5;
  float d = length(c) * 2.0;
  float px = length(c) * vPixels; // distance from the centre in device pixels
  float core = exp(-px * px / 0.8); // ~1 px wide core whatever the sprite size
  float halo = exp(-d * 5.0) * 0.22 * vGlow; // only bright stars get a glow
  float a = (core + halo) * (1.0 - smoothstep(0.8, 1.0, d));
  gl_FragColor = vec4(vColor * a, 1.0);
}
`;

export const skyVertex = /* glsl */ `
varying vec2 vUv;
void main() {
  vUv = uv;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
`;

export const skyFragment = /* glsl */ `
uniform sampler2D uMap;
uniform float uBrightness;
varying vec2 vUv;
void main() {
  vec3 col = texture2D(uMap, vUv).rgb * uBrightness;
  // dither so the dark, brightened gradient doesn't band into steps
  float noise = fract(sin(dot(gl_FragCoord.xy, vec2(12.9898, 78.233))) * 43758.5453);
  gl_FragColor = vec4(col + (noise - 0.5) / 255.0, 1.0);
}
`;

// Photo-textured bodies, lit by the Sun at runtime. Normals and lighting are in view space,
// which stays correct under the oblate scale of Jupiter and Saturn.
export const planetVertex = /* glsl */ `
uniform vec3 uSunPos;
varying vec2 vUv;
varying vec3 vNormal;
varying vec3 vViewPos;
varying vec3 vSunDir;
varying vec3 vWorld;
void main() {
  vUv = ${STREAMED_UV};
  vec4 world = modelMatrix * vec4(position, 1.0);
  vWorld = world.xyz;
  vec4 mv = viewMatrix * world;
  vViewPos = mv.xyz;
  vNormal = normalize(normalMatrix * normal);
  vSunDir = (viewMatrix * vec4(uSunPos, 1.0)).xyz - mv.xyz;
  gl_Position = projectionMatrix * mv;
}
`;

export const planetFragment = /* glsl */ `
uniform sampler2D uMap;
uniform vec2 uTexel; // 1 / texture size
uniform float uBump; // relief height in world units for a full black-to-white change
uniform float uAmbient;
#ifdef EARTH
uniform sampler2D uNight;
uniform sampler2D uClouds;
uniform sampler2D uSpecular;
#endif
#ifdef RING_SHADOW
uniform sampler2D uRingTex;
uniform vec2 uRingRange;
uniform vec3 uSunPos;
uniform vec3 uRingCenter; // world
uniform vec3 uRingNormal; // world
uniform float uRingRadius; // planet radius, world units
#endif
varying vec2 vUv;
varying vec3 vNormal;
varying vec3 vViewPos;
varying vec3 vSunDir;
varying vec3 vWorld;

float luma(vec3 c) { return dot(c, vec3(0.299, 0.587, 0.114)); }

// Relief from the texture's brightness, as in three's bump map, but with the slope taken
// across texels (central differences) so it stays smooth when the texture is magnified.
vec3 bumpNormal(vec3 n) {
  vec2 tu = vec2(uTexel.x, 0.0);
  vec2 tv = vec2(0.0, uTexel.y);
  float hu = (luma(texture2D(uMap, vUv + tu).rgb) - luma(texture2D(uMap, vUv - tu).rgb)) / (2.0 * uTexel.x);
  float hv = (luma(texture2D(uMap, vUv + tv).rgb) - luma(texture2D(uMap, vUv - tv).rgb)) / (2.0 * uTexel.y);
  vec2 dx = dFdx(vUv);
  vec2 dy = dFdy(vUv);
  vec2 dh = vec2(hu * dx.x + hv * dx.y, hu * dy.x + hv * dy.y) * uBump;
  vec3 sx = dFdx(vViewPos);
  vec3 sy = dFdy(vViewPos);
  vec3 r1 = cross(sy, n);
  vec3 r2 = cross(n, sx);
  float det = dot(sx, r1);
  vec3 grad = sign(det) * (dh.x * r1 + dh.y * r2);
  return normalize(abs(det) * n - grad);
}

void main() {
  vec3 geo = normalize(vNormal);
  vec3 V = normalize(-vViewPos);
  vec3 L = normalize(vSunDir);
  vec3 albedo = texture2D(uMap, vUv).rgb;

  vec3 N = uBump > 0.0 ? bumpNormal(geo) : geo;
  float terminator = smoothstep(-0.06, 0.12, dot(geo, L));
  float diffuse = max(dot(N, L), 0.0) * terminator;

#ifdef GAS
  // gas giants darken toward the limb
  diffuse *= 0.55 + 0.45 * pow(max(dot(geo, V), 0.0), 0.35);
#endif

  vec3 col = albedo * (diffuse * 1.12 + uAmbient);

#ifdef EARTH
  float cloud = texture2D(uClouds, vUv).r;
  float ocean = texture2D(uSpecular, vUv).r;
  vec3 H = normalize(L + V);
  float glint = pow(max(dot(geo, H), 0.0), 70.0) * ocean * (1.0 - cloud) * terminator;
  col += vec3(1.0, 0.92, 0.8) * glint * 0.55;
  col = mix(col, vec3(diffuse * 1.05 + uAmbient), cloud * 0.92);
  float night = 1.0 - smoothstep(-0.18, 0.08, dot(geo, L));
  col += texture2D(uNight, vUv).rgb * vec3(1.0, 0.85, 0.62) * night * (1.0 - cloud * 0.8) * 1.3;
#endif

#ifdef RING_SHADOW
  vec3 Lw = normalize(uSunPos - vWorld);
  float denom = dot(Lw, uRingNormal);
  if (abs(denom) > 1e-4) {
    float t = dot(uRingCenter - vWorld, uRingNormal) / denom;
    if (t > 0.0) {
      float r = length(vWorld + Lw * t - uRingCenter) / uRingRadius;
      float u = (r - uRingRange.x) / (uRingRange.y - uRingRange.x);
      if (u > 0.0 && u < 1.0) col *= 1.0 - texture2D(uRingTex, vec2(u, 0.5)).a * 0.85;
    }
  }
#endif

  gl_FragColor = vec4(col, 1.0);
}
`;
