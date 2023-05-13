import {Box, Tab, Tabs} from '@mui/material';
import React, {useState} from 'react';
import {DocumentUser} from '../utils/hooks/useFirestore';
import type {User} from 'firebase/auth';
import UserTab from './AboutPages/UserTab';
import AdminTab from './AboutPages/AdminTab';
import AboutTab from './AboutPages/AboutTab';

interface Props {
  authUser: User | null;
  documentUser: DocumentUser | null;
  setShowLogin: (arg0: boolean) => void;
}

const About = ({authUser, documentUser, setShowLogin}: Props) => {
  const [value, setValue] = useState(0);

  const handleChange = (_: unknown, newValue: React.SetStateAction<number>) => {
    setValue(newValue);
  };

  const isSuperAdmin = documentUser?.isSuperAdmin;

  return (
    <Box>
      <Tabs value={value} onChange={handleChange} centered>
        <Tab label="Med-lem" />
        <Tab label="Om" />
        {isSuperAdmin && <Tab label="Admin" />}
      </Tabs>

      <Box sx={{m: 2, mt: 4}}>
        {value === 0 && (
          <UserTab
            authUser={authUser}
            documentUser={documentUser}
            setShowLogin={setShowLogin}
          />
        )}
        {value === 1 && <AboutTab />}
        {value === 2 && <AdminTab />}
      </Box>
    </Box>
  );
};

export default About;
