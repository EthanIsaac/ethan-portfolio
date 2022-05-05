import * as THREE from 'three';
import React, { useRef, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { BackgroundContainer } from './styled';
import { Points, PointMaterial } from '@react-three/drei';
import theme from '../../utils/theme';

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
          color={theme.colors.primaryLight}
          size={0.005}
          sizeAttenuation={true}
          depthWrite={false}
        />
      </Points>
    </group>
  );
};

const Background = () => {
  return (
    <BackgroundContainer>
      <Canvas camera={{ position: [0, 0, 1] }}>
        <ambientLight />
        <pointLight position={[10, 10, 10]} />
        <Stars />
      </Canvas>
    </BackgroundContainer>
  );
};

export default Background;
