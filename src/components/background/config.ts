// Scene catalogue and tuning knobs for the Solar System background.
// Sizes and distances are compressed (artistic), but keep the real order and relative sizes.

export type TextureTier = '1k' | '2k' | '4k';

export interface Quality {
  maxDpr: number;
  maxPixels: number; // cap on canvas size in device pixels, applied on top of maxDpr
  antialias: boolean;
  bakeScale: number; // multiplier on bake texture resolution
  octaves: number; // fbm octaves used while baking
  sphereSegments: [number, number]; // large bodies; small ones use half
  starCount: number;
  textureTier: TextureTier; // best photo texture tier to stream in as the camera gets close
}

export const QUALITY: Record<'mobile' | 'desktop', Quality> = {
  desktop: {
    maxDpr: 2,
    maxPixels: 4_500_000,
    antialias: true,
    bakeScale: 2,
    octaves: 6,
    sphereSegments: [128, 64],
    starCount: 1400,
    textureTier: '4k',
  },
  mobile: {
    maxDpr: 1.5,
    maxPixels: 2_000_000,
    antialias: false,
    bakeScale: 1,
    octaves: 5,
    sphereSegments: [64, 32],
    starCount: 900,
    textureTier: '2k',
  },
};

export const CAMERA = {
  fov: 50, // vertical
  maxHorizontalFov: 80,
  near: 0.05,
  far: 4000,
  damping: 1.4, // higher = camera catches up with scroll faster
  lookDamping: 1.8, // separate, gentler easing for where the camera points
  dwell: 0.55, // 0..1, how much the camera lingers at each body before moving on
};

// Photo textures in public/textures/<tier>/<name>.webp (Solar System Scope, CC BY 4.0).
// Bodies without one fall back to a procedural surface.
export interface PhotoTexture {
  name: string;
  max: TextureTier;
  bump?: number; // relief derived from the texture's brightness
}

export const SKY_TEXTURE: PhotoTexture = { name: 'sky', max: '4k' };
export const EARTH_LAYERS = ['earth_night', 'earth_clouds', 'earth_specular'];

const RADIUS_SCALE = 0.0045; // units per sqrt(km)
const DISTANCE_BASE = 6;
const DISTANCE_SCALE = 10; // units per AU^DISTANCE_POWER
const DISTANCE_POWER = 0.62;

export const toSceneRadius = (km: number) => RADIUS_SCALE * Math.sqrt(km);
export const toSceneDistance = (au: number) => DISTANCE_BASE + DISTANCE_SCALE * Math.pow(au, DISTANCE_POWER);

export type RingType = 'jupiter' | 'saturn' | 'uranus' | 'neptune';

export interface RockySurface {
  type: 'rocky';
  base: string;
  dark: string;
  light: string;
  scale?: number; // noise frequency
  craters?: number; // 0..1
  maria?: number; // 0..1 large dark patches
  ridges?: number; // 0..1 linear cracks (Europa, Miranda)
  cap?: number; // 0..1 polar cap size
  capColor?: string;
  twoTone?: number; // 0..1 dark leading hemisphere (Iapetus)
  spots?: number; // 0..1 light/dark blotches (Io, Pluto)
  bump?: number;
}

export interface GasSurface {
  type: 'gas';
  colors: [string, string, string, string];
  bands: number; // band frequency
  turbulence: number;
  contrast: number; // 0..1
  spot?: { lat: number; lon: number; size: [number, number]; color: string };
}

export type Surface = RockySurface | GasSurface | { type: 'earth' } | { type: 'sun' };

export interface BodyDef {
  name: string;
  kind: 'star' | 'planet' | 'dwarf' | 'moon';
  radiusKm: number;
  au?: number; // distance from the Sun (planets and dwarfs)
  angle?: number; // degrees around the Sun
  height?: number; // offset above/below the ecliptic, scene units
  parent?: string; // moons
  orbit?: number; // moon distance in parent radii
  orbitAngle?: number; // degrees in the parent's equatorial plane
  tilt?: number; // axial tilt, degrees
  spin?: number; // rotation around the pole, degrees (picks which side faces us)
  shape?: [number, number, number]; // ellipsoid scale (x, y=pole, z)
  ring?: RingType;
  atmosphere?: { color: string; intensity: number };
  surface: Surface;
  texture?: PhotoTexture;
  bakeWidth: number;
}

export const BODIES: BodyDef[] = [
  { name: 'Sun', kind: 'star', radiusKm: 696000, surface: { type: 'sun' }, bakeWidth: 1024, texture: { name: 'sun', max: '4k' } },

  // Planets
  {
    name: 'Mercury', kind: 'planet', radiusKm: 2440, au: 0.39, angle: 9, tilt: 0, bakeWidth: 512, texture: { name: 'mercury', max: '4k', bump: 1.6 },
    surface: { type: 'rocky', base: '#8f8a84', dark: '#5f5a55', light: '#b3ada6', scale: 2.2, craters: 1, bump: 1.2 },
  },
  {
    name: 'Venus', kind: 'planet', radiusKm: 6052, au: 0.72, angle: -7, tilt: 177, bakeWidth: 512, texture: { name: 'venus', max: '4k' },
    atmosphere: { color: '#f7dfa8', intensity: 1.1 },
    surface: { type: 'gas', colors: ['#e9cf98', '#d9b06a', '#f3e2b8', '#c99a55'], bands: 5, turbulence: 1.6, contrast: 0.35 },
  },
  {
    name: 'Earth', kind: 'planet', radiusKm: 6371, au: 1, angle: 6, tilt: 23.4, spin: 200, bakeWidth: 1024, texture: { name: 'earth_day', max: '4k' },
    atmosphere: { color: '#6fa8ff', intensity: 1.3 },
    surface: { type: 'earth' },
  },
  {
    name: 'Mars', kind: 'planet', radiusKm: 3390, au: 1.52, angle: -9, tilt: 25.2, bakeWidth: 512, texture: { name: 'mars', max: '4k', bump: 1.2 },
    atmosphere: { color: '#e8a07a', intensity: 0.55 },
    surface: {
      type: 'rocky', base: '#b5532d', dark: '#6e3220', light: '#d68350', scale: 1.6,
      craters: 0.35, maria: 0.6, cap: 0.18, capColor: '#f2ece6', bump: 0.8,
    },
  },
  {
    name: 'Jupiter', kind: 'planet', radiusKm: 69911, au: 5.2, angle: -5, tilt: 3.1, spin: 40, ring: 'jupiter', bakeWidth: 1024, texture: { name: 'jupiter', max: '4k' },
    shape: [1, 0.935, 1],
    atmosphere: { color: '#e8d2b0', intensity: 0.8 },
    surface: {
      type: 'gas', colors: ['#d9c4a6', '#a8774e', '#f0e7d8', '#8a5a3e'], bands: 22, turbulence: 2.4, contrast: 1,
      spot: { lat: -22, lon: 60, size: [6, 12], color: '#c4673f' },
    },
  },
  {
    name: 'Saturn', kind: 'planet', radiusKm: 58232, au: 9.58, angle: 6, tilt: 26.7, ring: 'saturn', bakeWidth: 1024, texture: { name: 'saturn', max: '4k' },
    shape: [1, 0.9, 1],
    atmosphere: { color: '#f3dfa5', intensity: 0.7 },
    surface: { type: 'gas', colors: ['#e6d3a3', '#c9a86a', '#f1e4bd', '#b8955c'], bands: 16, turbulence: 1.2, contrast: 0.55 },
  },
  {
    name: 'Uranus', kind: 'planet', radiusKm: 25362, au: 19.2, angle: -4, tilt: 97.8, ring: 'uranus', bakeWidth: 512, texture: { name: 'uranus', max: '2k' },
    atmosphere: { color: '#b8f0f5', intensity: 1 },
    surface: { type: 'gas', colors: ['#a9dfe5', '#97d1da', '#c3eaee', '#8cc6d0'], bands: 8, turbulence: 0.6, contrast: 0.25 },
  },
  {
    name: 'Neptune', kind: 'planet', radiusKm: 24622, au: 30.1, angle: 4, tilt: 28.3, spin: 120, ring: 'neptune', bakeWidth: 512, texture: { name: 'neptune', max: '2k' },
    atmosphere: { color: '#5d88ff', intensity: 1.1 },
    surface: {
      type: 'gas', colors: ['#4169cf', '#2d4ca8', '#6f92e2', '#3557b8'], bands: 10, turbulence: 1.4, contrast: 0.6,
      spot: { lat: -20, lon: 50, size: [5, 9], color: '#1d2f78' },
    },
  },

  // Dwarf planets
  {
    name: 'Ceres', kind: 'dwarf', radiusKm: 473, au: 2.77, angle: 11, height: 0.6, bakeWidth: 256, texture: { name: 'ceres', max: '2k', bump: 1.2 },
    surface: { type: 'rocky', base: '#7a766f', dark: '#58544e', light: '#a29d95', scale: 2.4, craters: 0.9 },
  },
  {
    name: 'Pluto', kind: 'dwarf', radiusKm: 1188, au: 39.5, angle: -3, height: 3, tilt: 122.5, spin: 300, bakeWidth: 512,
    surface: {
      type: 'rocky', base: '#c4a07e', dark: '#5e3b2c', light: '#ede2d0', scale: 1.4,
      craters: 0.25, maria: 0.7, spots: 0.8,
    },
  },
  {
    name: 'Haumea', kind: 'dwarf', radiusKm: 816, au: 43.1, angle: 3, height: -2, bakeWidth: 256, texture: { name: 'haumea', max: '2k', bump: 0.8 },
    shape: [1.42, 0.63, 1.04],
    surface: { type: 'rocky', base: '#d8d5cf', dark: '#a9a49d', light: '#f0eee9', scale: 2, craters: 0.3, spots: 0.3 },
  },
  {
    name: 'Makemake', kind: 'dwarf', radiusKm: 715, au: 45.8, angle: -2.5, height: 2, bakeWidth: 256, texture: { name: 'makemake', max: '2k', bump: 0.8 },
    surface: { type: 'rocky', base: '#b98b68', dark: '#8a6248', light: '#d8b08e', scale: 1.8, craters: 0.2, spots: 0.5 },
  },
  {
    name: 'Eris', kind: 'dwarf', radiusKm: 1163, au: 67.8, angle: 2, height: -4, bakeWidth: 256, texture: { name: 'eris', max: '2k', bump: 0.8 },
    surface: { type: 'rocky', base: '#e6e4df', dark: '#c4c0b9', light: '#f7f6f3', scale: 1.8, craters: 0.25 },
  },

  // Moons
  {
    name: 'Moon', kind: 'moon', radiusKm: 1737, parent: 'Earth', orbit: 4.2, orbitAngle: 20, bakeWidth: 512, texture: { name: 'moon', max: '4k', bump: 2 },
    surface: { type: 'rocky', base: '#8e8a85', dark: '#4d4a47', light: '#b5b1ab', scale: 1.8, craters: 0.9, maria: 0.9, bump: 1 },
  },
  {
    name: 'Io', kind: 'moon', radiusKm: 1822, parent: 'Jupiter', orbit: 2.25, orbitAngle: 115, bakeWidth: 256,
    surface: { type: 'rocky', base: '#e2c65a', dark: '#8a5a22', light: '#fff1a6', scale: 2.4, spots: 1, bump: 0.4 },
  },
  {
    name: 'Europa', kind: 'moon', radiusKm: 1561, parent: 'Jupiter', orbit: 2.75, orbitAngle: 200, bakeWidth: 256,
    surface: { type: 'rocky', base: '#ddd2bd', dark: '#9c6e4c', light: '#f2ebdf', scale: 1.6, ridges: 1, bump: 0.3 },
  },
  {
    name: 'Ganymede', kind: 'moon', radiusKm: 2634, parent: 'Jupiter', orbit: 3.35, orbitAngle: 75, bakeWidth: 256,
    surface: { type: 'rocky', base: '#8f8577', dark: '#5f574d', light: '#bdb3a3', scale: 1.6, craters: 0.6, maria: 0.6, ridges: 0.4 },
  },
  {
    name: 'Callisto', kind: 'moon', radiusKm: 2410, parent: 'Jupiter', orbit: 4.2, orbitAngle: 160, bakeWidth: 256,
    surface: { type: 'rocky', base: '#5e5348', dark: '#3e362f', light: '#a39687', scale: 2.6, craters: 1 },
  },
  {
    name: 'Mimas', kind: 'moon', radiusKm: 198, parent: 'Saturn', orbit: 2.6, orbitAngle: 100, bakeWidth: 128,
    surface: { type: 'rocky', base: '#bdb8b1', dark: '#8d8882', light: '#d6d2cc', scale: 2, craters: 1 },
  },
  {
    name: 'Enceladus', kind: 'moon', radiusKm: 252, parent: 'Saturn', orbit: 2.9, orbitAngle: 215, bakeWidth: 128,
    surface: { type: 'rocky', base: '#f2f2f0', dark: '#c9d4d8', light: '#ffffff', scale: 1.8, craters: 0.3, ridges: 0.6 },
  },
  {
    name: 'Tethys', kind: 'moon', radiusKm: 531, parent: 'Saturn', orbit: 3.25, orbitAngle: 60, bakeWidth: 128,
    surface: { type: 'rocky', base: '#d6d3cd', dark: '#aaa6a0', light: '#ebe9e5', scale: 2, craters: 0.8 },
  },
  {
    name: 'Dione', kind: 'moon', radiusKm: 561, parent: 'Saturn', orbit: 3.65, orbitAngle: 160, bakeWidth: 128,
    surface: { type: 'rocky', base: '#c4c0ba', dark: '#94908a', light: '#e0ddd8', scale: 2, craters: 0.8, ridges: 0.3 },
  },
  {
    name: 'Rhea', kind: 'moon', radiusKm: 764, parent: 'Saturn', orbit: 4.15, orbitAngle: 25, bakeWidth: 256,
    surface: { type: 'rocky', base: '#b3aea7', dark: '#86817b', light: '#d2cec8', scale: 2.2, craters: 0.9 },
  },
  {
    name: 'Titan', kind: 'moon', radiusKm: 2575, parent: 'Saturn', orbit: 5.1, orbitAngle: 125, bakeWidth: 256,
    surface: { type: 'gas', colors: ['#d59f45', '#c38a35', '#e0b25c', '#b97f30'], bands: 4, turbulence: 0.8, contrast: 0.25 },
  },
  {
    name: 'Iapetus', kind: 'moon', radiusKm: 735, parent: 'Saturn', orbit: 6.3, orbitAngle: 250, bakeWidth: 256,
    surface: { type: 'rocky', base: '#d8d2c8', dark: '#2e2622', light: '#ebe6dd', scale: 2, craters: 0.6, twoTone: 1 },
  },
  {
    name: 'Miranda', kind: 'moon', radiusKm: 236, parent: 'Uranus', orbit: 2.45, orbitAngle: 40, bakeWidth: 128,
    surface: { type: 'rocky', base: '#a7a29b', dark: '#6f6a64', light: '#cbc6bf', scale: 1.6, craters: 0.4, ridges: 1 },
  },
  {
    name: 'Ariel', kind: 'moon', radiusKm: 579, parent: 'Uranus', orbit: 2.95, orbitAngle: 150, bakeWidth: 128,
    surface: { type: 'rocky', base: '#a19c96', dark: '#77726c', light: '#c3beb8', scale: 2, craters: 0.6, ridges: 0.4 },
  },
  {
    name: 'Umbriel', kind: 'moon', radiusKm: 585, parent: 'Uranus', orbit: 3.45, orbitAngle: 260, bakeWidth: 128,
    surface: { type: 'rocky', base: '#5b5753', dark: '#3e3b38', light: '#7d7873', scale: 2.2, craters: 0.9 },
  },
  {
    name: 'Titania', kind: 'moon', radiusKm: 789, parent: 'Uranus', orbit: 4.1, orbitAngle: 330, bakeWidth: 256,
    surface: { type: 'rocky', base: '#a08f84', dark: '#6f6159', light: '#c0b0a5', scale: 2, craters: 0.8, ridges: 0.3 },
  },
  {
    name: 'Oberon', kind: 'moon', radiusKm: 761, parent: 'Uranus', orbit: 4.8, orbitAngle: 95, bakeWidth: 256,
    surface: { type: 'rocky', base: '#8c7d74', dark: '#5c5049', light: '#ad9d93', scale: 2.2, craters: 1 },
  },
  {
    name: 'Triton', kind: 'moon', radiusKm: 1353, parent: 'Neptune', orbit: 3.3, orbitAngle: 210, bakeWidth: 256,
    surface: {
      type: 'rocky', base: '#d6c0b2', dark: '#a38a7e', light: '#f1e6de', scale: 2.4,
      craters: 0.15, spots: 0.7, cap: 0.45, capColor: '#efd9cf',
    },
  },
  {
    name: 'Charon', kind: 'moon', radiusKm: 606, parent: 'Pluto', orbit: 3.4, orbitAngle: 150, bakeWidth: 256,
    surface: {
      type: 'rocky', base: '#8f8a85', dark: '#5f5a56', light: '#b0aba5', scale: 2,
      craters: 0.6, cap: 0.3, capColor: '#7a4c3c',
    },
  },
];

// The camera visits these, in order, as the page scrolls from top to bottom.
export const CAMERA_STOPS = [
  'Mercury', 'Venus', 'Earth', 'Mars', 'Ceres', 'Jupiter', 'Saturn',
  'Uranus', 'Neptune', 'Pluto', 'Haumea', 'Makemake', 'Eris',
];
