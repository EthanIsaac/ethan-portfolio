'use client';

import React, { useCallback, useState } from 'react';
import dynamic from 'next/dynamic';
import { Box } from '@mui/material';

// three.js and the scene load in their own chunk after the page has painted
const SolarSystem = dynamic(() => import('./SolarSystem'), { ssr: false });

// The planet textures are CC BY 4.0, so the page must credit them. Rendered with the page
// content (not inside the aria-hidden, click-through background) so it can be read and clicked.
export const TextureCredit = () => (
  <Box
    component='a'
    href='https://www.solarsystemscope.com/textures/'
    target='_blank'
    rel='noopener noreferrer'
    sx={{
      display: 'block',
      py: 2,
      textAlign: 'center',
      fontSize: 11,
      color: 'rgba(255,255,255,0.45)',
      textDecoration: 'none',
      '&:hover': { color: 'rgba(255,255,255,0.8)' },
    }}
  >
    Planet textures: Solar System Scope, CC BY 4.0
  </Box>
);

const Background = () => {
  const [ready, setReady] = useState(false);
  const handleReady = useCallback(() => setReady(true), []);

  return (
    <Box
      aria-hidden
      sx={{
        position: 'fixed',
        inset: 0,
        zIndex: -1,
        background: '#000',
        pointerEvents: 'none',
      }}
    >
      <Box sx={{ width: '100%', height: '100%', opacity: ready ? 1 : 0, transition: 'opacity 1.2s ease' }}>
        <SolarSystem onReady={handleReady} />
      </Box>
    </Box>
  );
};

export default Background;
