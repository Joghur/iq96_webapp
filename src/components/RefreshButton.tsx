import {Button} from '@mui/material';
import React from 'react';

export const RefreshButton = () => {
  return (
    <Button
      variant="contained"
      sx={{width: '20%'}}
      onClick={() => window.location.reload()}>
      Genopfrisk
    </Button>
  );
};
