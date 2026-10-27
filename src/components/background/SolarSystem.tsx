'use client';

import * as THREE from 'three';
import React, { useEffect, useMemo, useRef } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import {
  BODIES,
  BodyDef,
  CAMERA,
  CAMERA_STOPS,
  Quality,
  QUALITY,
  RingType,
  toSceneDistance,
  toSceneRadius,
} from './config';
import { bakeBody, bakeSky, RING_TYPE_INDEX } from './bake';
import {
  atmosphereFragment,
  atmosphereVertex,
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

const RINGS: Record<RingType, { inner: number; outer: number; color: string; brightness: number }> = {
  jupiter: { inner: 1.35, outer: 3.2, color: '#b59a7c', brightness: 1.2 },
  saturn: { inner: 1.2, outer: 2.36, color: '#d8c49c', brightness: 1 },
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

function buildSystem(gl: THREE.WebGLRenderer, quality: Quality) {
  const root = new THREE.Group();
  const disposables: { dispose: () => void }[] = [];
  const track = <T extends { dispose: () => void }>(d: T) => (disposables.push(d), d);

  const [segW, segH] = quality.sphereSegments;
  const sphereHigh = track(new THREE.SphereGeometry(1, segW, segH));
  const sphereLow = track(new THREE.SphereGeometry(1, segW / 2, segH / 2));
  const placed = new Map<string, PlacedBody>();
  const tiltOf = new Map<string, THREE.Quaternion>();

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
            },
            defines: { RING_TYPE: RING_TYPE_INDEX[def.ring] },
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

  // bake every surface with the Sun's direction in that body's own space
  BODIES.forEach((def, i) => {
    const body = placed.get(def.name);
    const sunDir = body.mesh.worldToLocal(SUN_POSITION.clone()).normalize();
    const target = track(bakeBody(gl, def, sunDir, quality, i * 1.618));
    if (def.kind === 'star') {
      body.mesh.material = track(
        new THREE.ShaderMaterial({ vertexShader: sunVertex, fragmentShader: sunFragment, uniforms: { uMap: { value: target.texture } } })
      );
    } else {
      body.mesh.material = track(new THREE.MeshBasicMaterial({ map: target.texture }));
    }
    const ring = body.holder.getObjectByName('ring') as THREE.Mesh<THREE.BufferGeometry, THREE.ShaderMaterial>;
    if (ring) ring.material.uniforms.uSunDirLocal.value = ring.worldToLocal(SUN_POSITION.clone()).normalize();
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

  // sky: baked Milky Way + faint stars, plus brighter glowing point stars; follows the camera
  const sky = new THREE.Group();
  const skyTarget = track(bakeSky(gl, quality));
  const skySphere = new THREE.Mesh(
    track(new THREE.SphereGeometry(SKY_RADIUS, 64, 32)),
    track(new THREE.MeshBasicMaterial({ map: skyTarget.texture, side: THREE.BackSide, depthWrite: false }))
  );
  skySphere.renderOrder = -2;
  const stars = buildStars(quality.starCount);
  track(stars.geometry);
  track(stars.material as THREE.Material);
  (stars.material as THREE.ShaderMaterial).uniforms.uPixelRatio.value = gl.getPixelRatio();
  stars.renderOrder = -1;
  sky.add(skySphere, stars);
  root.add(sky);

  return {
    root,
    sky,
    placed,
    dispose: () => disposables.forEach((d) => d.dispose()),
  };
}

type System = ReturnType<typeof buildSystem>;

function buildCameraPath(system: System, aspect: number) {
  const halfHeight = Math.tan((CAMERA.fov / 2) * DEG);
  // push each body toward one side of the screen so the page text stays readable
  const sideShift = aspect > 1 ? 0.42 : 0.12;
  const cams: THREE.Vector3[] = [new THREE.Vector3(-14, 8, -42)];
  const looks: THREE.Vector3[] = [new THREE.Vector3(16, -2, 0)];

  CAMERA_STOPS.forEach((name, i) => {
    const { holder, radius, extent } = system.placed.get(name);
    const pos = holder.position;
    const radial = new THREE.Vector3(pos.x, 0, pos.z).normalize();
    const tangent = new THREE.Vector3().crossVectors(UP, radial);
    const dir = radial.multiplyScalar(-0.45).add(tangent.multiplyScalar(0.85)).addScaledVector(UP, 0.3).normalize();
    const dist = Math.max(radius * 6, extent * 2.1);
    const cam = pos.clone().addScaledVector(dir, dist);
    const look = pos.clone();

    const forward = look.clone().sub(cam).normalize();
    const right = new THREE.Vector3().crossVectors(forward, UP).normalize();
    const shift = dist * halfHeight * aspect * sideShift * (i % 2 ? 1 : -1);
    cams.push(cam.addScaledVector(right, shift));
    looks.push(look.addScaledVector(right, shift));
  });

  const camCurve = new THREE.CatmullRomCurve3(cams, false, 'centripetal');
  const lookCurve = new THREE.CatmullRomCurve3(looks, false, 'centripetal');
  return { camCurve, lookCurve };
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

const lookTarget = new THREE.Vector3();

function CameraRig({ path, sky }: { path: CameraPath; sky: THREE.Object3D }) {
  const invalidate = useThree((s) => s.invalidate);
  const reducedMotion = usePrefersReducedMotion();
  const progress = useRef<number | null>(null);
  const target = useRef(0);

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
    const current = progress.current ?? target.current;
    const diff = target.current - current;
    let next = target.current;
    if (Math.abs(diff) > 1e-5) {
      next = current + diff * (1 - Math.exp(-CAMERA.damping * Math.min(delta, 1 / 30)));
      invalidate();
    }
    progress.current = next;

    path.camCurve.getPoint(next, camera.position);
    camera.lookAt(path.lookCurve.getPoint(next, lookTarget));
    sky.position.copy(camera.position);
  });

  return null;
}

function Scene({ quality, onReady }: { quality: Quality; onReady?: () => void }) {
  const gl = useThree((s) => s.gl);
  const camera = useThree((s) => s.camera);
  const aspect = useThree((s) => s.size.width / Math.max(1, s.size.height));
  const system = useMemo(() => buildSystem(gl, quality), [gl, quality]);
  const landscape = aspect > 1;
  const path = useMemo(() => buildCameraPath(system, aspect), [system, landscape]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    // compile every shader now, so bodies coming into view later don't stall a frame
    gl.compile(system.root, camera);
    onReady?.();
    return () => system.dispose();
  }, [system]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <>
      <primitive object={system.root} />
      <CameraRig path={path} sky={system.sky} />
    </>
  );
}

const SolarSystem = ({ onReady }: { onReady?: () => void }) => {
  const quality = useMemo(() => QUALITY[isMobileDevice() ? 'mobile' : 'desktop'], []);
  const dpr = useMemo(() => {
    const cssPixels = window.innerWidth * window.innerHeight;
    return Math.max(1, Math.min(quality.maxDpr, window.devicePixelRatio, Math.sqrt(quality.maxPixels / cssPixels)));
  }, [quality]);

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
