'use client';

import * as THREE from 'three';
import React, { useEffect, useMemo, useRef } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import {
  BODIES,
  BodyDef,
  CAMERA,
  CAMERA_STOPS,
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
const GALACTIC_POLE = new THREE.Vector3(0.35, 0.8, 0.48).normalize();

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
    if (Math.random() < 0.4) {
      // concentrated toward the Milky Way's plane
      const a = Math.random() * Math.PI * 2;
      const b = (Math.random() + Math.random() + Math.random() - 1.5) * 0.25;
      v.copy(tangent).multiplyScalar(Math.cos(a)).addScaledVector(bitangent, Math.sin(a)).addScaledVector(GALACTIC_POLE, b);
    } else {
      v.set(Math.random() * 2 - 1, Math.random() * 2 - 1, Math.random() * 2 - 1);
    }
    v.normalize().multiplyScalar(STAR_RADIUS);
    v.toArray(positions, i * 3);

    let r = Math.random();
    let k = 0;
    while (k < weights.length - 1 && r > weights[k]) r -= weights[k++];
    const bright = Math.pow(Math.random(), 6);
    sizes[i] = 1.6 + bright * 9;
    palette[k]
      .clone()
      .multiplyScalar(0.35 + 0.65 * Math.pow(Math.random(), 2) + bright)
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

interface StreamedTexture {
  names: string[];
  max: number; // highest tier index worth loading
  tier: number; // tier index currently shown, -1 before the first load
  pending: boolean;
  center?: THREE.Vector3;
  radius?: number;
  apply: (textures: THREE.Texture[]) => void;
}

function tierIndex(texture: PhotoTexture, quality: Quality) {
  return Math.min(TIERS.indexOf(texture.max), TIERS.indexOf(quality.textureTier));
}

function createTextureStreamer(gl: THREE.WebGLRenderer) {
  const loader = new THREE.TextureLoader();
  const loaded = new Set<THREE.Texture>();
  const items: StreamedTexture[] = [];
  let disposed = false;
  let onChange = () => {};

  // upgrades wait here until the camera is still, so uploading a big texture never stalls a moving frame
  const ready: { item: StreamedTexture; tier: number; textures: THREE.Texture[] }[] = [];

  const loadOne = (url: string) =>
    new Promise<THREE.Texture>((resolve, reject) =>
      loader.load(
        url,
        (texture) => {
          texture.wrapS = THREE.RepeatWrapping;
          texture.anisotropy = Math.min(8, gl.capabilities.getMaxAnisotropy());
          // decode off the main thread now, instead of synchronously at upload time
          const image = texture.image as HTMLImageElement;
          (image.decode ? image.decode() : Promise.resolve()).then(() => resolve(texture), () => resolve(texture));
        },
        undefined,
        reject
      )
    );

  const show = (item: StreamedTexture, tier: number, textures: THREE.Texture[]) => {
    if (disposed || tier <= item.tier) {
      textures.forEach((t) => t.dispose());
      return;
    }
    textures.forEach((t) => {
      gl.initTexture(t);
      loaded.add(t);
    });
    item.apply(textures);
    item.tier = tier;
    onChange();
  };

  const load = async (item: StreamedTexture, tier: number, immediate: boolean) => {
    item.pending = true;
    try {
      const textures = await Promise.all(item.names.map((name) => loadOne(`/textures/${TIERS[tier]}/${name}.webp`)));
      if (immediate) show(item, tier, textures);
      else {
        ready.push({ item, tier, textures });
        onChange(); // wake the render loop so a still camera picks it up
      }
    } catch {
      // keep whatever is showing; the body stays on its lower tier
    } finally {
      if (immediate) item.pending = false;
    }
  };

  return {
    items,
    add(item: Omit<StreamedTexture, 'tier' | 'pending'>) {
      items.push({ ...item, tier: -1, pending: false });
    },
    /** Loads the lowest tier of every texture (the sky goes straight to its best tier). */
    loadInitial(sky: StreamedTexture) {
      return Promise.all(items.map((item) => load(item, item === sky ? item.max : 0, true)));
    },
    /** Upgrades bodies the camera is close to. Cheap enough to run every frame. */
    update(camera: THREE.Camera, moving: boolean) {
      if (!moving && ready.length) {
        const { item, tier, textures } = ready.shift();
        show(item, tier, textures);
        item.pending = false;
      }
      for (const item of items) {
        if (item.pending || item.tier < 0 || item.tier >= item.max || !item.center) continue;
        if (item.radius / camera.position.distanceTo(item.center) > UPGRADE_ANGULAR_SIZE) load(item, item.max, false);
      }
    },
    setOnChange(callback: () => void) {
      onChange = callback;
    },
    dispose() {
      disposed = true;
      loaded.forEach((t) => t.dispose());
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
  const ringTexture = track(new THREE.TextureLoader().load(SATURN_RING_URL));

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
              uRingTex: { value: ringTexture },
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

    if (def.kind === 'star') {
      const material = track(
        new THREE.ShaderMaterial({ vertexShader: sunVertex, fragmentShader: sunFragment, uniforms: { uMap: { value: placeholder } } })
      );
      body.mesh.material = material;
      streamer.add({
        names: [def.texture.name],
        max: tierIndex(def.texture, quality),
        center: body.holder.position,
        radius: body.radius,
        apply: ([map]) => (material.uniforms.uMap.value = map),
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
            uRingTex: { value: ringTexture },
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
        names: earth ? [def.texture.name, ...EARTH_LAYERS] : [def.texture.name],
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
      });
      return;
    }

    // no photo texture: bake a procedural surface with the Sun's direction in the body's own space
    bakeJobs.push(() => {
      const sunDir = body.mesh.worldToLocal(SUN_POSITION.clone()).normalize();
      const target = track(baker.body(def, sunDir, i * 1.618));
      body.mesh.material = track(new THREE.MeshBasicMaterial({ map: target.texture }));
    });
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
  const skyMaterial = track(
    new THREE.MeshBasicMaterial({ color: new THREE.Color(1.5, 1.5, 1.6), side: THREE.BackSide, depthWrite: false })
  );
  const skySphere = new THREE.Mesh(track(new THREE.SphereGeometry(SKY_RADIUS, 64, 32)), skyMaterial);
  skySphere.renderOrder = -2;
  skySphere.visible = false;
  streamer.add({
    names: [SKY_TEXTURE.name],
    max: tierIndex(SKY_TEXTURE, quality),
    apply: ([map]) => {
      skyMaterial.map = map;
      skyMaterial.needsUpdate = true;
      skySphere.visible = true;
    },
  });
  const skyItem = streamer.items[streamer.items.length - 1];
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
    loadTextures: () => streamer.loadInitial(skyItem),
    dispose: () => {
      streamer.dispose();
      disposables.forEach((d) => d.dispose());
    },
  };
}

type System = ReturnType<typeof buildSystem>;

function buildCameraPath(system: System, aspect: number) {
  const halfHeight = Math.tan((CAMERA.fov / 2) * DEG);
  // push bodies toward the same side of the screen so the page text stays readable,
  // without swinging the view left and right between stops
  const sideShift = aspect > 1 ? 0.4 : 0.1;
  const cams: THREE.Vector3[] = [new THREE.Vector3(-14, 8, -42)];
  const looks: THREE.Vector3[] = [new THREE.Vector3(16, -2, 0)];

  CAMERA_STOPS.forEach((name) => {
    const { holder, radius, extent } = system.placed.get(name);
    const pos = holder.position;
    const radial = new THREE.Vector3(pos.x, 0, pos.z).normalize();
    const tangent = new THREE.Vector3().crossVectors(UP, radial);
    const dir = radial.multiplyScalar(-0.45).add(tangent.multiplyScalar(0.85)).addScaledVector(UP, 0.3).normalize();
    const dist = Math.max(radius * 6, extent * 2.1);
    const cam = pos.clone().addScaledVector(dir, dist);
    const look = pos.clone();

    // aim beside the body rather than moving the camera, so it never drifts toward a neighbour
    const forward = look.clone().sub(cam).normalize();
    const right = new THREE.Vector3().crossVectors(forward, UP).normalize();
    const shift = -dist * halfHeight * Math.min(aspect, 1.8) * sideShift;
    cams.push(cam);
    looks.push(look.addScaledVector(right, shift));
  });

  const camCurve = new THREE.CatmullRomCurve3(cams, false, 'centripetal');
  const lookCurve = new THREE.CatmullRomCurve3(looks, false, 'centripetal');
  return { camCurve, lookCurve, segments: cams.length - 1 };
}

type CameraPath = ReturnType<typeof buildCameraPath>;

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

function scrollProgress() {
  const max = document.documentElement.scrollHeight - window.innerHeight;
  return max > 0 ? THREE.MathUtils.clamp(window.scrollY / max, 0, 1) : 0;
}

/** Maps scroll progress to a curve position that eases in and out of each stop. */
function dwell(progress: number, segments: number) {
  const x = progress * segments;
  const i = Math.min(Math.floor(x), segments - 1);
  const f = x - i;
  const eased = f * f * (3 - 2 * f);
  return (i + THREE.MathUtils.lerp(f, eased, CAMERA.dwell)) / segments;
}

const lookTarget = new THREE.Vector3();
const lookCurrent = new THREE.Vector3();

function CameraRig({ path, system }: { path: CameraPath; system: System }) {
  const invalidate = useThree((s) => s.invalidate);
  const reducedMotion = usePrefersReducedMotion();
  const progress = useRef<number | null>(null);
  const target = useRef(0);
  const lookReady = useRef(false);

  useEffect(() => {
    if (reducedMotion) {
      target.current = progress.current = 0;
      invalidate();
      return;
    }
    const onScroll = () => {
      target.current = scrollProgress();
      invalidate();
    };
    onScroll();
    if (progress.current === null) progress.current = target.current;
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
    };
  }, [reducedMotion, invalidate]);

  useEffect(() => invalidate(), [path, invalidate]);

  useFrame(({ camera }, delta) => {
    const dt = Math.min(delta, 1 / 30);
    const current = progress.current ?? target.current;
    const diff = target.current - current;
    let next = target.current;
    if (Math.abs(diff) > 1e-5) {
      next = current + diff * (1 - Math.exp(-CAMERA.damping * dt));
      invalidate();
    }
    progress.current = next;

    const t = dwell(next, path.segments);
    path.camCurve.getPoint(t, camera.position);
    path.lookCurve.getPoint(t, lookTarget);
    if (!lookReady.current) {
      lookCurrent.copy(lookTarget);
      lookReady.current = true;
    }
    const lookGap = lookCurrent.distanceTo(lookTarget);
    const looking = lookGap > 1e-3;
    if (looking) {
      lookCurrent.lerp(lookTarget, 1 - Math.exp(-CAMERA.lookDamping * dt));
      invalidate();
    } else {
      lookCurrent.copy(lookTarget);
    }
    camera.lookAt(lookCurrent);
    system.sky.position.copy(camera.position);
    system.streamer.update(camera, next !== target.current || looking);
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
  const path = useMemo(() => buildCameraPath(system, aspectBucket), [system, aspectBucket]);

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
      <CameraRig path={path} system={system} />
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
