import {Button, Stack} from '@mui/material';
import React from 'react';
import DynamicText from '../../components/DynamicText';
import {User} from 'firebase/auth';
import {logOut} from '../../utils/auth';
import {DocumentUser} from '../../utils/hooks/useFirestore';

interface Props {
  authUser: User | null;
  documentUser: DocumentUser | null;
  showLogin: (arg0: boolean) => void;
}

const UserTab = ({authUser, documentUser, showLogin}: Props) => {
  return (
    <Stack alignItems="center" spacing={2}>
      <DynamicText>
        <strong>{documentUser?.name}</strong>
      </DynamicText>
      <DynamicText>{documentUser?.nick}</DynamicText>
      {documentUser?.nick !== documentUser?.title && (
        <DynamicText>{documentUser?.title}</DynamicText>
      )}
      <DynamicText>{authUser?.email}</DynamicText>
      <Button
        onClick={async () => {
          await logOut();
          () => showLogin(false);
        }}>
        Logout
      </Button>
    </Stack>
  );
};

export default UserTab;
