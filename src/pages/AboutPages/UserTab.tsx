import {Button, Stack} from '@mui/material';
import React from 'react';
import DynamicText from '../../components/DynamicText';
import {User} from 'firebase/auth';
import {logOut} from '../../utils/auth';
import {DocumentUser} from '../../utils/hooks/useFirestore';

interface Props {
  authUser: User | null;
  documentUser: DocumentUser | null;
  setShowLogin: (arg0: boolean) => void;
}

const UserTab = ({authUser, documentUser, setShowLogin}: Props) => {
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
          () => setShowLogin(false);
        }}>
        Logout
      </Button>
    </Stack>
  );
};

export default UserTab;
