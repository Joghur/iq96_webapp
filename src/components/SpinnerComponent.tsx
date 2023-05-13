import {CircularProgress, Stack, Typography} from '@mui/material';
import React, {useEffect, useState} from 'react';
import {RefreshButton} from './RefreshButton';

const SpinnerComponent = () => {
  const [timerId, setTimerId] = useState<number | undefined>(undefined);
  const [showRefresh, setShowRefresh] = useState(false);

  useEffect(() => {
    const id = window.setTimeout(() => {
      setShowRefresh(true);
    }, 4000);
    setTimerId(id);

    return () => {
      if (timerId) {
        clearTimeout(timerId);
      }
    };
  }, [timerId]);

  return (
    <Stack alignItems="center" spacing={3}>
      <CircularProgress />
      {showRefresh && (
        <>
          <Stack spacing={3}>
            <Stack alignItems="center">
              <Typography variant="subtitle1">Data har kløjst i det</Typography>
              <Typography variant="subtitle2">
                Kan det være der ikke er internetforbindelse
              </Typography>
            </Stack>
            <Stack alignItems="center">
              <Typography>Genopfrisk siden</Typography>
              <RefreshButton />
            </Stack>
          </Stack>
        </>
      )}
    </Stack>
  );
};

export default SpinnerComponent;
