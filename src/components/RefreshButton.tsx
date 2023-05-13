import {Button} from '@mui/material';
import React from 'react';

export const RefreshButton = () => {
  return (
    <div style={{display: 'inline-block'}}>
      <Button
        variant="contained"
        sx={{width: 'auto'}}
        onClick={() => window.location.reload()}>
        Genopfrisk
      </Button>
    </div>
  );
};
