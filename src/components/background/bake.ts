import * as THREE from 'three';
import { BodyDef, Quality, RingType } from './config';
import {
  bakeVertex,
  earthBakeFragment,
  gasBakeFragment,
  rockyBakeFragment,
  skyGlowFragment,
  sunBakeFragment,
} from './shaders';

export const RING_TYPE_INDEX: Record<RingType, number> = { jupiter: 0, saturn: 1, uranus: 2, neptune: 3 };

const color = (hex: string) => new THREE.Color(hex);
const DEG = Math.PI / 180;

const BAKE_CAMERA = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);

const FRAGMENTS: Record<string, string> = {
  sun: sunBakeFragment,
  earth: earthBakeFragment,
  gas: gasBakeFragment,
  rocky: rockyBakeFragment,
  glow: skyGlowFragment,
};

function surfaceUniforms(body: BodyDef): Record<string, unknown> {
  const { surface } = body;
  if (surface.type === 'gas') {
    return {
      uC0: color(surface.colors[0]),
      uC1: color(surface.colors[1]),
      uC2: color(surface.colors[2]),
      uC3: color(surface.colors[3]),
      uBands: surface.bands,
      uTurb: surface.turbulence,
      uContrast: surface.contrast,
      uSpotAmount: surface.spot ? 1 : 0,
      uSpot: surface.spot
        ? new THREE.Vector4(surface.spot.lat * DEG, surface.spot.lon * DEG, surface.spot.size[0] * DEG, surface.spot.size[1] * DEG)
        : new THREE.Vector4(0, 0, 1, 1),
      uSpotColor: color(surface.spot?.color ?? '#000000'),
    };
  }
  if (surface.type === 'rocky') {
    return {
      uBase: color(surface.base),
      uDark: color(surface.dark),
      uLight: color(surface.light),
      uCapColor: color(surface.capColor ?? '#ffffff'),
      uScale: surface.scale ?? 2,
      uCraters: surface.craters ?? 0,
      uMaria: surface.maria ?? 0,
      uRidges: surface.ridges ?? 0,
      uCap: surface.cap ?? 0,
      uTwoTone: surface.twoTone ?? 0,
      uSpots: surface.spots ?? 0,
    };
  }
  return {};
}

/**
 * Renders procedural surface colour into textures (lit later, at runtime). Materials are cached per shader variant,
 * so each heavy noise program is compiled once rather than once per body.
 */
export class Baker {
  private scene = new THREE.Scene();
  private quad = new THREE.Mesh(new THREE.PlaneGeometry(2, 2));
  private materials = new Map<string, THREE.ShaderMaterial>();

  constructor(private gl: THREE.WebGLRenderer, private quality: Quality) {
    this.quad.frustumCulled = false;
    this.scene.add(this.quad);
  }

  private material(type: string) {
    let material = this.materials.get(type);
    if (!material) {
      material = new THREE.ShaderMaterial({
        vertexShader: bakeVertex,
        fragmentShader: FRAGMENTS[type],
        uniforms: { uSeed: { value: 0 } },
        defines: { OCTAVES: this.quality.octaves },
        depthTest: false,
      });
      this.materials.set(type, material);
    }
    return material;
  }

  private render(material: THREE.ShaderMaterial, values: Record<string, unknown>, width: number) {
    for (const [name, value] of Object.entries(values)) {
      if (material.uniforms[name]) material.uniforms[name].value = value;
      else material.uniforms[name] = { value };
    }

    const target = new THREE.WebGLRenderTarget(width, width / 2, {
      minFilter: THREE.LinearMipmapLinearFilter,
      magFilter: THREE.LinearFilter,
      wrapS: THREE.RepeatWrapping,
      depthBuffer: false,
    });
    target.texture.generateMipmaps = true;
    target.texture.anisotropy = Math.min(4, this.gl.capabilities.getMaxAnisotropy());

    this.quad.material = material;
    const previous = this.gl.getRenderTarget();
    this.gl.setRenderTarget(target);
    this.gl.render(this.scene, BAKE_CAMERA);
    this.gl.setRenderTarget(previous);
    return target;
  }

  /** Bakes a body's surface colour. */
  body(body: BodyDef, seed: number) {
    const width = Math.max(128, Math.round(body.bakeWidth * this.quality.bakeScale));
    return this.render(this.material(body.surface.type), { ...surfaceUniforms(body), uSeed: seed }, width);
  }

  /** Smooth Milky Way glow from the sky panorama (see skyGlowFragment). */
  skyGlow(source: THREE.Texture) {
    const material = this.material('glow');
    const target = this.render(material, { uSource: source }, 1024);
    material.uniforms.uSource.value = null; // don't keep the source alive
    return target;
  }

  dispose() {
    this.quad.geometry.dispose();
    this.materials.forEach((m) => m.dispose());
    this.materials.clear();
  }
}
