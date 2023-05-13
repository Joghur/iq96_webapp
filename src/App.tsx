import React, {useEffect, useState} from 'react';
import CssBaseline from '@mui/material/CssBaseline';
import {useDocumentUser} from './utils/hooks/useFirestore';
import FixedBottomNavigation from './components/BottomMenu';
import Header from './components/Header';
import Map from './pages/Map';
import Home from './pages/Home';
import {checkVersion} from './utils/checkVersion';
import About from './pages/About';
import Login from './pages/login';
import Chat from './pages/Chat';
import SpinnerComponent from './components/SpinnerComponent';
import {Stack, CircularProgress, Button, Typography} from '@mui/material';
import {Box} from '@mui/system';
import {RefreshButton} from './components/Buttons';

const handleHeaderTitle = (key: number) => {
  switch (key) {
    case 1:
      return 'Kort';

    case 2:
      return 'Chat';

    case 3:
      return 'Med-lem og App info';

    default:
      return 'Oversigt';
  }
};

const App = () => {
  const [authUser, documentUser, loading] = useDocumentUser();
  const [value, setValue] = React.useState(0);
  const [showLogin, setShowLogin] = useState(false);
  const [showRefresh, setShowRefresh] = useState(false);

  useEffect(() => {
    setInterval(checkVersion, 600);
    const timer1 = setTimeout(() => setShowRefresh(true), 4000);

    return () => {
      clearTimeout(timer1);
    };
  }, []);

  //   console.log('loading', !!loading);
  //   console.log('showLogin', !!showLogin);
  //   console.log('authUser', !!authUser);
  //   console.log('documentUser', !!documentUser);

  if (showLogin) {
    return <Login open={showLogin} onClose={() => setShowLogin(false)} />;
  }

  if (loading) {
    return (
      <Box sx={{m: 2}}>
        <Stack alignItems="center" spacing={3}>
          <CircularProgress />
        </Stack>
      </Box>
    );
  }

  if (!documentUser || !authUser) {
    return (
      <Box>
        <Stack alignItems="center" spacing={3}>
          {!showRefresh && <SpinnerComponent />}
          {showRefresh && (
            <>
              <Stack spacing={3}>
                <Stack alignItems="center">
                  <Typography variant="h5">Logget ud</Typography>
                  <ul>
                    {!authUser && <li key="login">Mangler med-lems login</li>}
                    {!documentUser && (
                      <li key="details">Mangler med-lems detaljer</li>
                    )}
                  </ul>
                </Stack>
                <Stack alignItems="center">
                  <Typography variant="subtitle1">Prøv at:</Typography>
                  <ul>
                    {[
                      'Logge ind',
                      'Genopfrisk siden',
                      'Check internetforbindelse',
                    ].map((o, index) => (
                      <li key={index}>{o}</li>
                    ))}
                  </ul>
                </Stack>
                <Stack alignItems="center">
                  <Button onClick={() => setShowLogin(true)}>Login</Button>
                  <RefreshButton />
                </Stack>
              </Stack>
            </>
          )}
        </Stack>
      </Box>
    );
  }

  return (
    <>
      <CssBaseline />
      <Header banner={handleHeaderTitle(value)} nick={documentUser?.nick} />
      {value === 0 && <Home documentUser={documentUser} />}
      {value === 1 && <Map documentUser={documentUser} />}
      {value === 2 && <Chat authUser={authUser} documentUser={documentUser} />}
      {value === 3 && (
        <About
          authUser={authUser}
          documentUser={documentUser}
          setShowLogin={setShowLogin}
        />
      )}
      {documentUser?.nick && (
        <FixedBottomNavigation
          value={value}
          nick={documentUser.nick}
          onChange={setValue}
        />
      )}
    </>
  );
};

export default App;
