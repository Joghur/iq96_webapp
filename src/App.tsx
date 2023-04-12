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
import {Stack} from '@mui/material';
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
  const [value, setValue] = React.useState(1);
  const [showLogin, setShowLogin] = useState(!authUser);

  //   console.log('user', user?.displayName, user?.email);

  useEffect(() => {
    setInterval(checkVersion, 600);
  }, []);

  //   console.log('showLogin', showLogin);
  //   console.log('user', user);

  if (!authUser && showLogin) {
    return <Login open={showLogin} onClose={() => setShowLogin(false)} />;
  }

  if (loading && !documentUser) {
    return (
      <>
        <b>Genopfrisk siden</b>
        <RefreshButton />
      </>
    );
  }

  if (!documentUser) {
    return (
      <Stack spacing={2}>
        <b>Genopfrisk siden</b>
        <RefreshButton />
      </Stack>
    );
  }

  return (
    <>
      <CssBaseline />
      <Header banner={handleHeaderTitle(value)} nick={documentUser?.nick} />
      {value === 0 && (
        <Home
          authUser={authUser}
          documentUser={documentUser}
          showLogin={setShowLogin}
        />
      )}
      {value === 1 && <Map authUser={authUser} showLogin={setShowLogin} />}
      {value === 2 && (
        <Chat
          authUser={authUser}
          documentUser={documentUser}
          showLogin={setShowLogin}
        />
      )}
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
