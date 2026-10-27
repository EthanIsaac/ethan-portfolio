import * as THREE from 'three';
import { BodyDef, Quality, RingType } from './config';
import {
  bakeVertex,
  earthBakeFragment,
  gasBakeFragment,
  rockyBakeFragment,
  skyBakeFragment,
  sunBakeFragment,
} from './shaders';

export const RING_TYPE_INDEX: Record<RingType, number> = { jupiter: 0, saturn: 1, uranus: 2, neptune: 3 };

const color = (hex: string) => new THREE.Color(hex);
const DEG = Math.PI / 180;

function materialFor(body: BodyDef, sunDir: THREE.Vector3, quality: Quality, seed: number) {
  const { surface } = body;
  const uniforms: Record<string, THREE.IUniform> = {
    uSunDir: { value: sunDir },
    uSeed: { value: seed },
    uAmbient: { value: 0.025 },
  };
  const defines: Record<string, string | number> = { OCTAVES: quality.octaves, RING_TYPE: 0 };
  let fragmentShader: string;

  switch (surface.type) {
    case 'sun':
      fragmentShader = sunBakeFragment;
      break;
    case 'earth':
      fragmentShader = earthBakeFragment;
      break;
    case 'gas':
      fragmentShader = gasBakeFragment;
      Object.assign(uniforms, {
        uC0: { value: color(surface.colors[0]) },
        uC1: { value: color(surface.colors[1]) },
        uC2: { value: color(surface.colors[2]) },
        uC3: { value: color(surface.colors[3]) },
        uBands: { value: surface.bands },
        uTurb: { value: surface.turbulence },
        uContrast: { value: surface.contrast },
        uSpotAmount: { value: surface.spot ? 1 : 0 },
        uSpot: {
          value: surface.spot
            ? new THREE.Vector4(surface.spot.lat * DEG, surface.spot.lon * DEG, surface.spot.size[0] * DEG, surface.spot.size[1] * DEG)
            : new THREE.Vector4(0, 0, 1, 1),
        },
        uSpotColor: { value: color(surface.spot?.color ?? '#000000') },
      });
      if (body.ring === 'saturn') {
        defines.RING_SHADOW = '';
        defines.RING_TYPE = RING_TYPE_INDEX.saturn;
      }
      break;
    case 'rocky':
      fragmentShader = rockyBakeFragment;
      Object.assign(uniforms, {
        uBase: { value: color(surface.base) },
        uDark: { value: color(surface.dark) },
        uLight: { value: color(surface.light) },
        uCapColor: { value: color(surface.capColor ?? '#ffffff') },
        uScale: { value: surface.scale ?? 2 },
        uCraters: { value: surface.craters ?? 0 },
        uMaria: { value: surface.maria ?? 0 },
        uRidges: { value: surface.ridges ?? 0 },
        uCap: { value: surface.cap ?? 0 },
        uTwoTone: { value: surface.twoTone ?? 0 },
        uSpots: { value: surface.spots ?? 0 },
        uBump: { value: surface.bump ?? 0.7 },
      });
      break;
  }

  return new THREE.ShaderMaterial({ vertexShader: bakeVertex, fragmentShader, uniforms, defines, depthTest: false });
}

function renderToTexture(gl: THREE.WebGLRenderer, material: THREE.ShaderMaterial, width: number) {
  const target = new THREE.WebGLRenderTarget(width, width / 2, {
    minFilter: THREE.LinearMipmapLinearFilter,
    magFilter: THREE.LinearFilter,
    wrapS: THREE.RepeatWrapping,
    depthBuffer: false,
  });
  target.texture.generateMipmaps = true;
  target.texture.anisotropy = Math.min(4, gl.capabilities.getMaxAnisotropy());

  const scene = new THREE.Scene();
  const quad = new THREE.Mesh(new THREE.PlaneGeometry(2, 2), material);
  quad.frustumCulled = false;
  scene.add(quad);

  const previous = gl.getRenderTarget();
  gl.setRenderTarget(target);
  gl.render(scene, BAKE_CAMERA);
  gl.setRenderTarget(previous);

  quad.geometry.dispose();
  material.dispose();
  return target;
}

const BAKE_CAMERA = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);

/** Bakes a body's lit surface. `sunDir` is the direction to the Sun in the body's own space. */
export function bakeBody(gl: THREE.WebGLRenderer, body: BodyDef, sunDir: THREE.Vector3, quality: Quality, seed: number) {
  const width = Math.max(128, Math.round(body.bakeWidth * quality.bakeScale));
  return renderToTexture(gl, materialFor(body, sunDir, quality, seed), width);
}

export function bakeSky(gl: THREE.WebGLRenderer, quality: Quality) {
  const material = new THREE.ShaderMaterial({
    vertexShader: bakeVertex,
    fragmentShader: skyBakeFragment,
    uniforms: {
      uSunDir: { value: new THREE.Vector3(0, 1, 0) },
      uSeed: { value: 0 },
      uAmbient: { value: 0 },
      uGalacticPole: { value: new THREE.Vector3(0.35, 0.8, 0.48).normalize() },
      uGalacticCenter: { value: new THREE.Vector3(0.9, -0.15, -0.4).normalize() },
    },
    defines: { OCTAVES: quality.octaves, RING_TYPE: 0 },
    depthTest: false,
  });
  return renderToTexture(gl, material, quality.skySize);
}
