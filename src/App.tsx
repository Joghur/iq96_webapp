/* eslint-disable @typescript-eslint/no-unused-vars */
import React, {useEffect, useState} from 'react';
import CssBaseline from '@mui/material/CssBaseline';
import {useDocumentUser} from './utils/hooks/useFirestore';
import FixedBottomNavigation from './components/BottomMenu';
import Header from './components/Header';
import Map from './pages/Map';
import Home from './pages/Home';
import {checkVersion} from './utils/checkVersion';
import Settings from './pages/Settings';
import Login from './pages/login';
import {RefreshButton} from './components/RefreshButton';
import {Stack, CircularProgress, Typography, Box} from '@mui/material';
import Chat from './pages/Chat';

const handleHeaderTitle = (key: number) => {
  switch (key) {
    case 1:
      return 'Kort';

    case 2:
      return 'Chat';

    case 3:
      return 'Indstillinger';

    default:
      return 'Oversigt';
  }
};

const App = () => {
  const [authUser, documentUser, loading] = useDocumentUser();
  const [value, setValue] = React.useState(0);
  const [showLogin, setShowLogin] = useState(false);

  useEffect(() => {
    setInterval(checkVersion, 600);
  }, []);

  const needLogin = !loading && showLogin;
  const needAuthUser = loading && !authUser;
  const needDocumentUser = loading && authUser && !documentUser;

  if (needLogin) {
    return <Login open={showLogin} onClose={() => setShowLogin(false)} />;
  }

  if (needAuthUser) {
    return (
      <Box sx={{top: 60}}>
        <Stack alignItems="center">
          <CircularProgress />
        </Stack>
      </Box>
    );
  }

  if (needDocumentUser) {
    return (
      <Stack alignItems="center">
        <Typography variant="subtitle1">Data har kløjst i det</Typography>
        <Typography>Genopfrisk siden</Typography>
        <RefreshButton />
      </Stack>
    );
  }

  return (
    <>
      <CssBaseline />
      <Header banner={handleHeaderTitle(value)} nick={documentUser?.nick} />
      {value === 0 && <Home documentUser={documentUser} />}
      {value === 1 && <Map />}
      {value === 2 && <Chat authUser={authUser} documentUser={documentUser} />}
      {value === 3 && (
        <Settings
          authUser={authUser}
          documentUser={documentUser}
          showLogin={setShowLogin}
        />
      )}
      <FixedBottomNavigation value={value} onChange={setValue} />
    </>
  );
};

export default App;
