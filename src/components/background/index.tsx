'use client';

import React from 'react';
import { Box, useTheme } from '@mui/material';

const Background = () => {
  const theme = useTheme();
  return (
    <Box
      aria-hidden
      sx={{
        position: 'fixed',
        inset: 0,
        zIndex: -1,
        background: theme.palette.primary.dark,
        pointerEvents: 'none',
      }}
    />
  );
};

export default Background;
