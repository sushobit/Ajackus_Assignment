import React from 'react';
import { CircularProgress, Box } from '@mui/material';

const Loader = () => (
  <Box
    display="flex"
    justifyContent="center"
    alignItems="center"
    height="100vh"
    position="fixed"
    top={0}
    left={0}
    right={0}
    bottom={0}
    bgcolor="rgba(255, 255, 255, 0.7)"
    zIndex={1300}
  >
    <CircularProgress size={50} />
  </Box>
);

export default Loader;
