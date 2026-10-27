'use client';

import * as THREE from 'three';
import React, { useEffect, useMemo, useRef } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import {
  BODIES,
  BodyDef,
  CAMERA,
  EARTH_LAYERS,
  PhotoTexture,
  Quality,
  QUALITY,
  RingType,
  SKY_TEXTURE,
  TextureTier,
  toSceneDistance,
  toSceneRadius,
} from './config';
import { Baker, RING_TYPE_INDEX } from './bake';
import {
  atmosphereFragment,
  atmosphereVertex,
  planetFragment,
  planetVertex,
  ringFragment,
  ringVertex,
  skyFragment,
  skyVertex,
  starsFragment,
  starsVertex,
  sunFragment,
  sunVertex,
} from './shaders';

const DEG = Math.PI / 180;
const UP = new THREE.Vector3(0, 1, 0);
const SUN_POSITION = new THREE.Vector3(0, 0, 0);
const SKY_RADIUS = 1800;
const STAR_RADIUS = 1500;
// the sky panorama is in galactic coordinates: its equator (the Milky Way) maps to the y=0 plane
const GALACTIC_POLE = new THREE.Vector3(0, 1, 0);

// radii (in Saturn radii) spanned by the ring texture, from the C ring out to the A ring
const SATURN_RING_RANGE: [number, number] = [1.11, 2.33];
const SATURN_RING_URL = '/textures/saturn_ring.png';
const TIERS: TextureTier[] = ['1k', '2k', '4k'];
// a body's photo texture is upgraded once it covers this much of the view (radius / distance)
const UPGRADE_ANGULAR_SIZE = 0.012;
// relief height, as a fraction of the body's radius, for a texture's full brightness range
const BUMP_SCALE = 0.004;

const RINGS: Record<RingType, { inner: number; outer: number; color: string; brightness: number }> = {
  jupiter: { inner: 1.35, outer: 3.2, color: '#b59a7c', brightness: 0.5 },
  saturn: { inner: SATURN_RING_RANGE[0], outer: SATURN_RING_RANGE[1], color: '#f2dfbd', brightness: 1.15 },
  uranus: { inner: 1.6, outer: 2.06, color: '#8a8580', brightness: 1.6 },
  neptune: { inner: 1.6, outer: 2.6, color: '#8f8f96', brightness: 1.4 },
};

interface PlacedBody {
  def: BodyDef;
  radius: number;
  holder: THREE.Group;
  mesh: THREE.Mesh;
  extent: number; // radius of the body plus its rings and moons
}

function isMobileDevice() {
  return window.matchMedia('(pointer: coarse), (max-width: 768px)').matches;
}

function glowTexture() {
  const size = 256;
  const canvas = document.createElement('canvas');
  canvas.width = canvas.height = size;
  const ctx = canvas.getContext('2d');
  const g = ctx.createRadialGradient(size / 2, size / 2, 0, size / 2, size / 2, size / 2);
  g.addColorStop(0, 'rgba(255,240,210,1)');
  g.addColorStop(0.12, 'rgba(255,214,150,0.65)');
  g.addColorStop(0.35, 'rgba(255,160,70,0.18)');
  g.addColorStop(1, 'rgba(255,120,40,0)');
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, size, size);
  return new THREE.CanvasTexture(canvas);
}

function buildStars(count: number) {
  const positions = new Float32Array(count * 3);
  const colors = new Float32Array(count * 3);
  const sizes = new Float32Array(count);
  const palette = ['#9bb4ff', '#c9d7ff', '#ffffff', '#fff4e3', '#ffe2b8', '#ffc58f'].map((c) => new THREE.Color(c));
  const weights = [0.08, 0.17, 0.3, 0.22, 0.15, 0.08];
  const v = new THREE.Vector3();
  const tangent = new THREE.Vector3(1, 0, 0).cross(GALACTIC_POLE).normalize();
  const bitangent = GALACTIC_POLE.clone().cross(tangent);

  for (let i = 0; i < count; i++) {
    if (Math.random() < 0.5) {
      // concentrated toward the Milky Way's plane
      const a = Math.random() * Math.PI * 2;
      const b = (Math.random() + Math.random() + Math.random() - 1.5) * 0.18;
      v.copy(tangent).multiplyScalar(Math.cos(a)).addScaledVector(bitangent, Math.sin(a)).addScaledVector(GALACTIC_POLE, b);
    } else {
      v.set(Math.random() * 2 - 1, Math.random() * 2 - 1, Math.random() * 2 - 1);
    }
    v.normalize().multiplyScalar(STAR_RADIUS);
    v.toArray(positions, i * 3);

    let r = Math.random();
    let k = 0;
    while (k < weights.length - 1 && r > weights[k]) r -= weights[k++];
    // like real magnitudes: a few bright stars, many faint ones; faint stars stay tiny and
    // just get dimmer, so they read as crisp points rather than blobs
    const bright = Math.pow(Math.random(), 12);
    sizes[i] = 2 + bright * 7;
    palette[k]
      .clone()
      .multiplyScalar(0.35 + 0.65 * Math.pow(Math.random(), 3) + bright * 1.2)
      .toArray(colors, i * 3);
  }

  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  geometry.setAttribute('aColor', new THREE.BufferAttribute(colors, 3));
  geometry.setAttribute('aSize', new THREE.BufferAttribute(sizes, 1));
  const material = new THREE.ShaderMaterial({
    vertexShader: starsVertex,
    fragmentShader: starsFragment,
    uniforms: { uPixelRatio: { value: 1 } },
    blending: THREE.AdditiveBlending,
    depthWrite: false,
    transparent: true,
  });
  const points = new THREE.Points(geometry, material);
  points.frustumCulled = false;
  return points;
}

interface TextureLayer {
  name: string;
  max: number; // highest tier index that exists for this file
}

interface StreamedTexture {
  layers: TextureLayer[];
  max: number; // highest tier index worth loading for this item
  tier: number; // tier index currently shown, -1 before the first load
  pending: boolean;
  base: THREE.Texture[] | null; // lowest tier, kept for the whole session
  upgraded: THREE.Texture[] | null; // higher tier, released again when the body is far away
  center?: THREE.Vector3;
  radius?: number;
  url?: (layer: TextureLayer, tier: number) => string;
  apply: (textures: THREE.Texture[]) => void;
  fallback?: () => void; // if even the lowest tier fails to load
}

function tierIndex(texture: PhotoTexture, quality: Quality) {
  return Math.min(TIERS.indexOf(texture.max), TIERS.indexOf(quality.textureTier));
}

function createTextureStreamer(gl: THREE.WebGLRenderer) {
  const loader = new THREE.TextureLoader();
  const items: StreamedTexture[] = [];
  let disposed = false;
  let onChange = () => {};

  // Upgrades wait here until the camera is still, then upload one texture per frame, so a
  // big texture never stalls a moving frame and a multi-layer body never uploads all at once.
  const uploads: { item: StreamedTexture; tier: number; textures: THREE.Texture[]; done: number }[] = [];

  const urlFor = (item: StreamedTexture, layer: TextureLayer, tier: number) =>
    item.url ? item.url(layer, tier) : `/textures/${TIERS[Math.min(tier, layer.max)]}/${layer.name}.webp`;

  const loadOne = (url: string) =>
    new Promise<THREE.Texture>((resolve, reject) =>
      loader.load(
        url,
        (texture) => {
          texture.wrapS = THREE.RepeatWrapping;
          texture.anisotropy = Math.min(8, gl.capabilities.getMaxAnisotropy());
          // start decoding off the main thread now rather than at upload time
          const image = texture.image as HTMLImageElement;
          (image.decode ? image.decode() : Promise.resolve()).then(() => resolve(texture), () => resolve(texture));
        },
        undefined,
        reject
      )
    );

  const loadTier = (item: StreamedTexture, tier: number) =>
    Promise.all(item.layers.map((layer) => loadOne(urlFor(item, layer, tier))));

  const release = (textures: THREE.Texture[] | null) => textures?.forEach((t) => t.dispose());

  const loadBase = async (item: StreamedTexture, tier: number) => {
    try {
      const textures = await loadTier(item, tier);
      if (disposed) return release(textures);
      textures.forEach((t) => gl.initTexture(t));
      item.base = textures;
      item.tier = tier;
      item.apply(textures);
      onChange();
    } catch {
      if (!disposed) item.fallback?.();
    }
  };

  const upgrade = async (item: StreamedTexture) => {
    item.pending = true;
    try {
      const textures = await loadTier(item, item.max);
      if (disposed) return release(textures);
      uploads.push({ item, tier: item.max, textures, done: 0 });
      onChange(); // wake the render loop so a still camera picks it up
    } catch {
      item.max = item.tier; // that tier isn't available; stop asking for it
      item.pending = false;
    }
  };

  return {
    items,
    add(item: Omit<StreamedTexture, 'tier' | 'pending' | 'base' | 'upgraded'>) {
      const full: StreamedTexture = { ...item, tier: -1, pending: false, base: null, upgraded: null };
      items.push(full);
      return full;
    },
    /** Loads the lowest tier of every texture. Items without a position (the sky) go straight to their best. */
    loadInitial() {
      return Promise.all(items.map((item) => loadBase(item, item.center ? 0 : item.max)));
    },
    /** Streams textures in and out with the camera. Cheap enough to run every frame. */
    update(camera: THREE.Camera, moving: boolean) {
      if (!moving && uploads.length) {
        const upload = uploads[0];
        gl.initTexture(upload.textures[upload.done++]);
        if (upload.done === upload.textures.length) {
          uploads.shift();
          const { item } = upload;
          release(item.upgraded);
          item.upgraded = upload.textures;
          item.tier = upload.tier;
          item.pending = false;
          item.apply(upload.textures);
        }
        onChange();
      }
      for (const item of items) {
        if (item.pending || item.tier < 0 || !item.center) continue;
        const size = item.radius / camera.position.distanceTo(item.center);
        if (item.tier < item.max && size > UPGRADE_ANGULAR_SIZE) {
          upgrade(item);
        } else if (item.upgraded && size < UPGRADE_ANGULAR_SIZE / 4) {
          // far away again: drop back to the small texture to free GPU memory
          item.apply(item.base);
          release(item.upgraded);
          item.upgraded = null;
          item.tier = 0;
        }
      }
    },
    setOnChange(callback: () => void) {
      onChange = callback;
    },
    dispose() {
      disposed = true;
      uploads.forEach((u) => release(u.textures));
      items.forEach((item) => {
        release(item.base);
        release(item.upgraded);
      });
    },
  };
}

function buildSystem(gl: THREE.WebGLRenderer, quality: Quality) {
  const root = new THREE.Group();
  const disposables: { dispose: () => void }[] = [];
  const track = <T extends { dispose: () => void }>(d: T) => (disposables.push(d), d);

  const [segW, segH] = quality.sphereSegments;
  const sphereHigh = track(new THREE.SphereGeometry(1, segW, segH));
  const sphereLow = track(new THREE.SphereGeometry(1, segW / 2, segH / 2));
  const placed = new Map<string, PlacedBody>();
  const tiltOf = new Map<string, THREE.Quaternion>();
  const streamer = createTextureStreamer(gl);
  // shared by Saturn's ring and its ring shadow; fully transparent until the real texture loads
  const clear = track(new THREE.DataTexture(new Uint8Array([0, 0, 0, 0]), 1, 1));
  clear.needsUpdate = true;
  const ringTexture: THREE.IUniform<THREE.Texture> = { value: clear };
  streamer.add({
    layers: [{ name: 'saturn_ring', max: 0 }],
    max: 0,
    url: () => SATURN_RING_URL,
    apply: ([ring]) => (ringTexture.value = ring),
  });

  for (const def of BODIES) {
    const radius = toSceneRadius(def.radiusKm);
    const holder = new THREE.Group();
    let tilt: THREE.Quaternion;

    if (def.parent) {
      const parent = placed.get(def.parent);
      tilt = tiltOf.get(def.parent);
      const a = (def.orbitAngle ?? 0) * DEG;
      const offset = new THREE.Vector3(Math.cos(a), 0, -Math.sin(a))
        .multiplyScalar((def.orbit ?? 3) * parent.radius)
        .applyQuaternion(tilt);
      holder.position.copy(parent.holder.position).add(offset);
      parent.extent = Math.max(parent.extent, offset.length() + radius);
    } else {
      tilt = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(1, 0, 0), (def.tilt ?? 0) * DEG);
      if (def.au) {
        const d = toSceneDistance(def.au);
        const a = (def.angle ?? 0) * DEG;
        holder.position.set(d * Math.cos(a), def.height ?? 0, -d * Math.sin(a));
      }
    }
    tiltOf.set(def.name, tilt);

    const spin = new THREE.Quaternion().setFromAxisAngle(UP, (def.spin ?? 0) * DEG);
    holder.quaternion.copy(tilt).multiply(spin);
    holder.scale.setScalar(radius);

    const geometry = radius > 0.25 || def.kind === 'star' ? sphereHigh : sphereLow;
    const mesh = new THREE.Mesh(geometry);
    if (def.shape) mesh.scale.set(...def.shape);
    holder.add(mesh);

    let extent = radius * Math.max(...(def.shape ?? [1]));
    if (def.ring) {
      const cfg = RINGS[def.ring];
      const ring = new THREE.Mesh(
        track(new THREE.RingGeometry(cfg.inner, cfg.outer, 256, 1)),
        track(
          new THREE.ShaderMaterial({
            vertexShader: ringVertex,
            fragmentShader: ringFragment,
            uniforms: {
              uColor: { value: new THREE.Color(cfg.color) },
              uSunDirLocal: { value: new THREE.Vector3(0, 0, 1) },
              uBrightness: { value: cfg.brightness },
              uRingTex: ringTexture,
              uRingRange: { value: new THREE.Vector2(...SATURN_RING_RANGE) },
            },
            defines:
              def.ring === 'saturn'
                ? { RING_TYPE: RING_TYPE_INDEX[def.ring], RING_TEXTURE: '' }
                : { RING_TYPE: RING_TYPE_INDEX[def.ring] },
            extensions: { derivatives: true } as THREE.ShaderMaterial['extensions'],
            side: THREE.DoubleSide,
            transparent: true,
            depthWrite: false,
          })
        )
      );
      ring.rotation.x = -Math.PI / 2;
      ring.name = 'ring';
      holder.add(ring);
      extent = Math.max(extent, radius * cfg.outer);
    }

    if (def.atmosphere) {
      const shape = new THREE.Vector3(...(def.shape ?? [1, 1, 1]));
      for (const back of [true, false]) {
        const shell = back ? 1.1 : 1.015;
        const atmosphere = new THREE.Mesh(
          sphereHigh,
          track(
            new THREE.ShaderMaterial({
              vertexShader: atmosphereVertex,
              fragmentShader: atmosphereFragment,
              uniforms: {
                uColor: { value: new THREE.Color(def.atmosphere.color) },
                uSunPos: { value: SUN_POSITION },
                uIntensity: { value: def.atmosphere.intensity },
                uShell: { value: shell },
              },
              defines: back ? { BACK: '' } : {},
              side: back ? THREE.BackSide : THREE.FrontSide,
              blending: THREE.AdditiveBlending,
              transparent: true,
              depthWrite: false,
            })
          )
        );
        atmosphere.scale.copy(shape).multiplyScalar(shell);
        holder.add(atmosphere);
      }
    }

    root.add(holder);
    placed.set(def.name, { def, radius, holder, mesh, extent });
  }

  root.updateMatrixWorld(true);

  const placeholder = track(new THREE.DataTexture(new Uint8Array([8, 8, 8, 255]), 1, 1));
  placeholder.needsUpdate = true;
  const baker = track(new Baker(gl, quality));
  const bakeJobs: (() => void)[] = [];

  BODIES.forEach((def, i) => {
    const body = placed.get(def.name);
    const ring = body.holder.getObjectByName('ring') as THREE.Mesh<THREE.BufferGeometry, THREE.ShaderMaterial>;
    if (ring) ring.material.uniforms.uSunDirLocal.value = ring.worldToLocal(SUN_POSITION.clone()).normalize();

    // procedural surface baked with the Sun's direction in the body's own space
    const bake = () => track(baker.body(def, body.mesh.worldToLocal(SUN_POSITION.clone()).normalize(), i * 1.618)).texture;
    const layer = (name: string, max = TIERS.indexOf(def.texture?.max ?? '1k')) => ({ name, max });

    if (def.kind === 'star') {
      const material = track(
        new THREE.ShaderMaterial({ vertexShader: sunVertex, fragmentShader: sunFragment, uniforms: { uMap: { value: placeholder } } })
      );
      body.mesh.material = material;
      streamer.add({
        layers: [layer(def.texture.name)],
        max: tierIndex(def.texture, quality),
        center: body.holder.position,
        radius: body.radius,
        apply: ([map]) => (material.uniforms.uMap.value = map),
        fallback: () => (material.uniforms.uMap.value = bake()),
      });
      return;
    }

    if (def.texture) {
      // real photo texture, lit at runtime
      const earth = def.surface.type === 'earth';
      const defines: Record<string, string> = {};
      if (def.surface.type === 'gas') defines.GAS = '';
      if (earth) defines.EARTH = '';
      if (def.ring === 'saturn') defines.RING_SHADOW = '';
      const material = track(
        new THREE.ShaderMaterial({
          vertexShader: planetVertex,
          fragmentShader: planetFragment,
          uniforms: {
            uMap: { value: placeholder },
            uTexel: { value: new THREE.Vector2(1, 1) },
            uBump: { value: (def.texture.bump ?? 0) * body.radius * BUMP_SCALE },
            uAmbient: { value: 0.02 },
            uSunPos: { value: SUN_POSITION },
            uNight: { value: placeholder },
            uClouds: { value: placeholder },
            uSpecular: { value: placeholder },
            uRingTex: ringTexture,
            uRingRange: { value: new THREE.Vector2(...SATURN_RING_RANGE) },
            uRingCenter: { value: body.holder.position },
            uRingNormal: { value: new THREE.Vector3(0, 1, 0).applyQuaternion(body.holder.quaternion) },
            uRingRadius: { value: body.radius },
          },
          defines,
          extensions: { derivatives: true } as THREE.ShaderMaterial['extensions'],
        })
      );
      body.mesh.material = material;
      streamer.add({
        layers: earth
          ? [layer(def.texture.name), ...EARTH_LAYERS.map(({ name, max }) => layer(name, TIERS.indexOf(max)))]
          : [layer(def.texture.name)],
        max: tierIndex(def.texture, quality),
        center: body.holder.position,
        radius: body.radius,
        apply: ([map, night, clouds, specular]) => {
          material.uniforms.uMap.value = map;
          material.uniforms.uTexel.value.set(1 / map.image.width, 1 / map.image.height);
          if (earth) {
            material.uniforms.uNight.value = night;
            material.uniforms.uClouds.value = clouds;
            material.uniforms.uSpecular.value = specular;
          }
        },
        // the photo texture couldn't load (e.g. no WebP support): use the procedural surface
        fallback: () => (body.mesh.material = track(new THREE.MeshBasicMaterial({ map: bake() }))),
      });
      return;
    }

    bakeJobs.push(() => (body.mesh.material = track(new THREE.MeshBasicMaterial({ map: bake() }))));
  });

  // Sun glow
  const sun = placed.get('Sun');
  const glow = track(glowTexture());
  for (const [scale, opacity] of [
    [7, 0.85],
    [16, 0.18],
  ]) {
    const sprite = new THREE.Sprite(
      track(new THREE.SpriteMaterial({ map: glow, blending: THREE.AdditiveBlending, depthWrite: false, opacity }))
    );
    sprite.scale.setScalar(sun.radius * scale);
    root.add(sprite);
  }

  // sky: real Milky Way panorama plus glowing point stars; follows the camera
  const sky = new THREE.Group();
  // The panorama only supplies the soft Milky Way glow (it can't be sharp enough for a
  // full-screen sky); the crisp stars are the points below.
  const skyMaterial = track(
    new THREE.ShaderMaterial({
      vertexShader: skyVertex,
      fragmentShader: skyFragment,
      uniforms: { uMap: { value: clear }, uBrightness: { value: 1.7 } },
      side: THREE.BackSide,
      depthWrite: false,
    })
  );
  const skySphere = new THREE.Mesh(track(new THREE.SphereGeometry(SKY_RADIUS, 64, 32)), skyMaterial);
  skySphere.renderOrder = -2;
  skySphere.visible = false;
  streamer.add({
    layers: [{ name: SKY_TEXTURE.name, max: TIERS.indexOf(SKY_TEXTURE.max) }],
    max: tierIndex(SKY_TEXTURE, quality),
    apply: ([map]) => {
      skyMaterial.uniforms.uMap.value = track(baker.skyGlow(map)).texture;
      skySphere.visible = true;
    },
  });
  const stars = buildStars(quality.starCount);
  track(stars.geometry);
  track(stars.material as THREE.Material);
  stars.renderOrder = -1;
  sky.add(skySphere, stars);
  root.add(sky);

  return {
    root,
    sky,
    stars,
    placed,
    bakeJobs,
    streamer,
    loadTextures: () => streamer.loadInitial(),
    dispose: () => {
      streamer.dispose();
      disposables.forEach((d) => d.dispose());
    },
  };
}

type System = ReturnType<typeof buildSystem>;

interface Pose {
  position: THREE.Vector3;
  quaternion: THREE.Quaternion;
}

/** Where the camera sits to frame each body: sunward and to one side, aimed so the body sits off-centre. */
function buildPoses(system: System, aspect: number) {
  // half the view's width at unit distance, using the same horizontal field-of-view cap as the camera
  const halfWidth = Math.min(Math.tan((CAMERA.fov / 2) * DEG) * aspect, Math.tan((CAMERA.maxHorizontalFov / 2) * DEG));
  // keep the body to one side of the screen so the page text stays readable
  const sideShift = aspect > 1 ? 0.4 : 0.1;
  const aim = new THREE.PerspectiveCamera();
  const poses = new Map<string, Pose>();

  system.placed.forEach(({ holder, radius, extent, def }, name) => {
    const pos = holder.position;
    const radial = pos.lengthSq() > 0 ? new THREE.Vector3(pos.x, 0, pos.z).normalize() : new THREE.Vector3(1, 0, 0);
    const tangent = new THREE.Vector3().crossVectors(UP, radial);
    const dir = radial.multiplyScalar(-0.45).add(tangent.multiplyScalar(0.85)).addScaledVector(UP, 0.3).normalize();
    const dist = def.kind === 'star' ? radius * 7 : Math.max(radius * 6, extent * 2.1);
    const camera = pos.clone().addScaledVector(dir, dist);

    const forward = pos.clone().sub(camera).normalize();
    const right = new THREE.Vector3().crossVectors(forward, UP).normalize();
    const look = pos.clone().addScaledVector(right, -dist * halfWidth * sideShift);

    aim.position.copy(camera);
    aim.lookAt(look);
    poses.set(name, { position: camera, quaternion: aim.quaternion.clone() });
  });
  return poses;
}

type Poses = ReturnType<typeof buildPoses>;

function usePrefersReducedMotion() {
  const [reduced, setReduced] = React.useState(() => window.matchMedia('(prefers-reduced-motion: reduce)').matches);
  useEffect(() => {
    const query = window.matchMedia('(prefers-reduced-motion: reduce)');
    const onChange = () => setReduced(query.matches);
    query.addEventListener?.('change', onChange);
    return () => query.removeEventListener?.('change', onChange);
  }, []);
  return reduced;
}

const smootherstep = (x: number) => {
  const t = THREE.MathUtils.clamp(x, 0, 1);
  return t * t * t * (t * (t * 6 - 15) + 10);
};

/**
 * Page sections opt in with `data-planet="<body name>"`. Returns their bodies in page order and a
 * continuous stop value for the current scroll position: whole numbers while a section is on
 * screen, easing to the next one over CAMERA.transition viewport heights centred on the moment
 * the next section's top crosses the middle of the screen. Same scroll position, same view.
 */
function readSections(placed: Map<string, unknown>) {
  const sections = Array.from(document.querySelectorAll<HTMLElement>('[data-planet]')).filter((el) =>
    placed.has(el.dataset.planet)
  );
  const names = sections.map((el) => el.dataset.planet);
  const half = (window.innerHeight * CAMERA.transition) / 2;
  let value = 0;
  for (let i = 1; i < sections.length; i++) {
    const boundary = sections[i].getBoundingClientRect().top + window.scrollY - window.innerHeight / 2;
    value += smootherstep((window.scrollY - (boundary - half)) / (2 * half));
  }
  return { names: names.length ? names : ['Earth'], value };
}

function CameraRig({ poses, system }: { poses: Poses; system: System }) {
  const invalidate = useThree((s) => s.invalidate);
  const reducedMotion = usePrefersReducedMotion();
  const names = useRef<string[]>(['Earth']);
  const value = useRef<number | null>(null);
  const target = useRef(0);

  useEffect(() => {
    const onScroll = () => {
      const sections = readSections(system.placed);
      names.current = sections.names;
      // with reduced motion, cut between planets instead of flying
      target.current = reducedMotion ? Math.round(sections.value) : sections.value;
      if (value.current === null || reducedMotion) value.current = target.current;
      invalidate();
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
    };
  }, [reducedMotion, invalidate, system]);

  useEffect(() => invalidate(), [poses, invalidate]);

  useFrame(({ camera }, delta) => {
    // ease toward the scroll position so a fast fling still glides
    const current = value.current ?? target.current;
    const diff = target.current - current;
    const moving = Math.abs(diff) > 1e-4;
    const next = moving ? current + diff * (1 - Math.exp(-CAMERA.damping * Math.min(delta, 1 / 30))) : target.current;
    value.current = next;
    if (moving) invalidate();

    const stops = names.current;
    const i = THREE.MathUtils.clamp(Math.floor(next), 0, Math.max(stops.length - 2, 0));
    const t = THREE.MathUtils.clamp(next - i, 0, 1);
    const from = poses.get(stops[i]);
    const to = poses.get(stops[Math.min(i + 1, stops.length - 1)]);

    // one smooth arc between the two framings, rising above the planets' plane so it never clips one
    camera.position.lerpVectors(from.position, to.position, t);
    camera.position.y += Math.sin(Math.PI * t) * from.position.distanceTo(to.position) * CAMERA.arc;
    camera.quaternion.slerpQuaternions(from.quaternion, to.quaternion, t);

    system.sky.position.copy(camera.position);
    system.streamer.update(camera, moving);
  });

  return null;
}

function canvasDpr(quality: Quality) {
  const cssPixels = window.innerWidth * window.innerHeight;
  return Math.max(1, Math.min(quality.maxDpr, window.devicePixelRatio, Math.sqrt(quality.maxPixels / cssPixels)));
}

function Scene({ quality, onReady }: { quality: Quality; onReady?: () => void }) {
  const gl = useThree((s) => s.gl);
  const camera = useThree((s) => s.camera);
  const invalidate = useThree((s) => s.invalidate);
  const setDpr = useThree((s) => s.setDpr);
  const aspect = useThree((s) => s.size.width / Math.max(1, s.size.height));
  // bumped when the WebGL context is restored, since baked textures don't survive a loss
  const [generation, setGeneration] = React.useState(0);
  const system = useMemo(() => buildSystem(gl, quality), [gl, quality, generation]); // eslint-disable-line react-hooks/exhaustive-deps
  const aspectBucket = Math.round(aspect * 10) / 10;
  const poses = useMemo(() => buildPoses(system, aspectBucket), [system, aspectBucket]);

  useEffect(() => {
    // bake one surface per frame so the page stays responsive while the scene loads
    let cancelled = false;
    let frame = 0;
    const jobs = [...system.bakeJobs];
    system.streamer.setOnChange(invalidate);
    const textures = system.loadTextures();
    const step = () => {
      if (cancelled) return;
      jobs.shift()?.();
      if (jobs.length) {
        frame = requestAnimationFrame(step);
        return;
      }
      textures.then(() => {
        if (cancelled) return;
        // compile the runtime shaders now, so bodies coming into view later don't stall a frame
        gl.compile(system.root, camera);
        invalidate();
        onReady?.();
      });
    };
    frame = requestAnimationFrame(step);
    return () => {
      cancelled = true;
      cancelAnimationFrame(frame);
      system.dispose();
    };
  }, [system]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    const canvas = gl.domElement;
    const onLost = (event: Event) => event.preventDefault(); // allow the browser to restore it
    const onRestored = () => setGeneration((g) => g + 1);
    canvas.addEventListener('webglcontextlost', onLost);
    canvas.addEventListener('webglcontextrestored', onRestored);
    return () => {
      canvas.removeEventListener('webglcontextlost', onLost);
      canvas.removeEventListener('webglcontextrestored', onRestored);
    };
  }, [gl]);

  useEffect(() => {
    let timeout: ReturnType<typeof setTimeout>;
    const onResize = () => {
      clearTimeout(timeout);
      timeout = setTimeout(() => setDpr(canvasDpr(quality)), 200);
    };
    window.addEventListener('resize', onResize);
    return () => {
      clearTimeout(timeout);
      window.removeEventListener('resize', onResize);
    };
  }, [quality, setDpr]);

  // keep the horizontal field of view natural on ultrawide screens (avoids stretched edges)
  useEffect(() => {
    const perspective = camera as THREE.PerspectiveCamera;
    const maxVertical = 2 * Math.atan(Math.tan((CAMERA.maxHorizontalFov / 2) * DEG) / aspect) / DEG;
    perspective.fov = Math.min(CAMERA.fov, maxVertical);
    perspective.updateProjectionMatrix();
    invalidate();
  }, [camera, aspect, invalidate]);

  useFrame(({ viewport }) => {
    (system.stars.material as THREE.ShaderMaterial).uniforms.uPixelRatio.value = viewport.dpr;
  });

  return (
    <>
      <primitive object={system.root} />
      <CameraRig poses={poses} system={system} />
    </>
  );
}

const SolarSystem = ({ onReady }: { onReady?: () => void }) => {
  const quality = useMemo(() => QUALITY[isMobileDevice() ? 'mobile' : 'desktop'], []);
  const dpr = useMemo(() => canvasDpr(quality), [quality]);

  return (
    <Canvas
      linear
      flat
      frameloop='demand'
      dpr={dpr}
      gl={{ antialias: quality.antialias, alpha: false, stencil: false, powerPreference: 'high-performance' }}
      camera={{ fov: CAMERA.fov, near: CAMERA.near, far: CAMERA.far, position: [0, 0, 30] }}
    >
      <color attach='background' args={['#000000']} />
      <Scene quality={quality} onReady={onReady} />
    </Canvas>
  );
};

export default SolarSystem;
