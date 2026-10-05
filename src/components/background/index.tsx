'use client';

import * as THREE from 'three';
import React, { useEffect, useRef, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Points, PointMaterial } from '@react-three/drei';
import { Box, useTheme } from '@mui/material';

const DISTANCE_TO_SLOW_DOWN = 1;

function inSphere(buffer: Float32Array, sphere: { radius: number; x0?: number; y0?: number; z0?: number }) {
  const { radius, x0 = 0, y0 = 0, z0 = 0 } = sphere;

  for (var i = 0; i < buffer.length; i += 3) {
    var u = Math.pow(Math.random(), 1 / 3);
    var x = Math.random() * 2 - 1;
    var y = Math.random() * 2 - 1;
    var z = Math.random() * 2 - 1;
    var mag = Math.sqrt(x * x + y * y + z * z);
    x = (u * x) / mag;
    y = (u * y) / mag;
    z = (u * z) / mag;
    buffer[i] = x * radius + x0;
    buffer[i + 1] = y * radius + y0;
    buffer[i + 2] = z * radius + z0;
  }

  return buffer;
}
const Stars = (props) => {
  const ref = useRef<THREE.Points>();
  const theme = useTheme();
  const [sphere] = useState(() => inSphere(new Float32Array(5000), { radius: 1.5 }));

  useFrame((_, delta) => {
    ref.current.rotation.x -= delta / 10;
    ref.current.rotation.y -= delta / 15;
  });

  return (
    <group rotation={[0, 0, Math.PI / 4]}>
      <Points ref={ref} positions={sphere} stride={3} frustumCulled={false} {...props}>
        <PointMaterial
          transparent
          color={theme.palette.primary.contrastText}
          size={0.002}
          sizeAttenuation={true}
          depthWrite={false}
        />
      </Points>
    </group>
  );
};

function CameraMovement({ position }) {
  const [cameraPosition, setCameraPosition] = useState([0, 0, 2]);
  const [steps, setSteps] = useState([0.0, 0.0, 0.0]);

  useEffect(() => {
    const stepX = (position[0] - cameraPosition[0]) / 120;
    const stepY = (position[1] - cameraPosition[1]) / 120;
    const stepZ = (position[2] - cameraPosition[2]) / 120;
    setSteps([stepX, stepY, stepZ]);
  }, [position]);

  useFrame(({ camera }) => {
    const [newX, newY, newZ] = position;
    setCameraPosition([camera.position.x, camera.position.y, camera.position.z]);

    const deltaX = camera.position.x - newX;
    const deltaY = camera.position.y - newY;
    const deltaZ = camera.position.z - newZ;

    const squareDistance = Math.sqrt(Math.pow(deltaX, 2) + Math.pow(deltaY, 2) + Math.pow(deltaZ, 2));

    const divider = 1.5 / squareDistance;

    if (Math.abs(deltaX) > 0.01) {
      camera.position.x += steps[0] / divider;
    }

    if (Math.abs(deltaY) > 0.01) {
      camera.position.y += steps[1] / divider;
    }

    if (Math.abs(deltaZ) > 0.01) {
      camera.position.z += steps[2] / divider;
    }
  });
  return null;
}

interface BackgroundProps {
  position: [number, number, number];
}

const Background = ({ position }: BackgroundProps) => {
  const theme = useTheme();
  return (
    <Box
      sx={{
        position: 'absolute',
        zIndex: -1,
        width: '100%',
        height: '100%',
        background: theme.palette.primary.dark,
      }}
    >
      <Canvas camera={{ position }}>
        <CameraMovement position={position} />
        <ambientLight />
        <pointLight position={[10, 10, 10]} />
        <Stars />
      </Canvas>
    </Box>
  );
};

export default Background;
