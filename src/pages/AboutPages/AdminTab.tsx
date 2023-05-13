import {Button, Stack} from '@mui/material';
import React from 'react';
import {copyMapMarkers, deleteMapMarkers} from '../../utils/hooks/useFirestore';

const AdminTab = () => {
  return (
    <Stack alignItems="center" spacing={2}>
      <>
        <Button disabled onClick={() => copyMapMarkers()}>
          Kopier gamle kortdata
        </Button>
        <Button disabled onClick={() => deleteMapMarkers()}>
          Slet gamle kortdata
        </Button>
      </>
    </Stack>
  );
};

export default AdminTab;
