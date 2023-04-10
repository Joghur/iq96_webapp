import {Button} from '@mui/material';
import React from 'react';

export const RefreshButton = () => {
  return (
    <Button
      variant="contained"
      sx={{width: '10%'}}
      onClick={() => window.location.reload()}>
      Genopfrisk
    </Button>
  );
};
