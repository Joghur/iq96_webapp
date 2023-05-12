import {Box, Button, Stack, Typography} from '@mui/material';
import React from 'react';
import {logOut} from '../utils/auth';
import {
  copyMapMarkers,
  deleteMapMarkers,
  DocumentUser,
} from '../utils/hooks/useFirestore';
import type {User} from 'firebase/auth';
import DynamicText from '../components/DynamicText';
import packageJson from '../../package.json';

interface Props {
  authUser: User | null;
  documentUser: DocumentUser | null;
  showLogin: (arg0: boolean) => void;
}

const Settings = ({authUser, documentUser, showLogin}: Props) => {
  if (!authUser) {
    return (
      <>
        <p>Mangler login...</p>
        <Button variant="outlined" onClick={() => showLogin(true)}>
          Login
        </Button>
      </>
    );
  }

  return (
    <Box sx={{m: 2}}>
      <Stack spacing={1} justifyContent="flex-start">
        <DynamicText>
          <strong>{documentUser?.name}</strong>
        </DynamicText>
        <DynamicText>{documentUser?.nick}</DynamicText>
        {documentUser?.nick !== documentUser?.title && (
          <DynamicText>{documentUser?.title}</DynamicText>
        )}
        <DynamicText>{authUser?.email}</DynamicText>
        <DynamicText>{`IQ96 web app v${packageJson.version}`}</DynamicText>
        <Button
          onClick={async () => {
            await logOut();
            () => showLogin(false);
          }}>
          Logout
        </Button>
        {documentUser?.title === 'Redacteur' && (
          <>
            <Typography variant="h6">Admin</Typography>
            <Button disabled onClick={() => copyMapMarkers()}>
              Kopier gamle kortdata
            </Button>
            <Button disabled onClick={() => deleteMapMarkers()}>
              Slet gamle kortdata
            </Button>
          </>
        )}
        <Typography variant="h6">Om</Typography>
        <ul>
          <li>
            0.4.4 - Forbedret login oplevelse (mindre flimren) - check for om
            lokation er sat til
          </li>
        </ul>
      </Stack>
    </Box>
  );
};

export default Settings;
