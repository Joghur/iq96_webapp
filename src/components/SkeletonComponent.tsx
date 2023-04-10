import {Skeleton, Stack, useMediaQuery, useTheme} from '@mui/material';
import React from 'react';

const SkeletonComponent = () => {
  const theme = useTheme();
  const mobile = useMediaQuery(theme.breakpoints.down('sm'));

  return (
    <Stack
      alignItems="center"
      spacing={3}
      sx={{py: 5, px: mobile ? 5 : 0, alignItems: 'center'}}>
      <Skeleton
        variant="rectangular"
        animation="wave"
        width={210}
        height={60}
      />
      <Skeleton
        variant="rectangular"
        animation="wave"
        width={210}
        height={60}
      />
      <Skeleton
        variant="rectangular"
        animation="wave"
        width={210}
        height={60}
      />
      <Skeleton
        variant="rectangular"
        animation="wave"
        width={210}
        height={60}
      />
    </Stack>
  );
};

export default SkeletonComponent;
