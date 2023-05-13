import {CircularProgress, Stack} from '@mui/material';
import React from 'react';

const SpinnerComponent = () => {
  return (
    <Stack alignItems="center" spacing={3}>
      <CircularProgress />
    </Stack>
  );
};

export default SpinnerComponent;
