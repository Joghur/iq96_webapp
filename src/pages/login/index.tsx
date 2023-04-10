import React, {useState, useEffect} from 'react';

import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import {
  getLocalStorage,
  LOCALSTORAGE_PREFIX,
  setLocalStorage,
} from '../../utils/localStorage';
import {logIn, resetPassword} from '../../utils/auth';
import {BoldText} from '../../components/FormDialog';

export const LOCALSTORAGE_EMAIL = `${LOCALSTORAGE_PREFIX}-email`;

type UserCredentials = {
  email: string;
  password: string;
};

interface Props {
  open: boolean;
  onClose: () => void;
}

const initUserCredentials = {email: '', password: ''};

const Login = ({open, onClose}: Props) => {
  const [userCredentials, setUserCredentials] =
    useState<UserCredentials>(initUserCredentials);
  const [reset, setReset] = useState(false);
  const [validatedEmail, setValidatedEmail] = useState<{
    validated: boolean;
    helperText: string | undefined;
  }>({
    validated: true,
    helperText: undefined,
  });
  const [validatedPassword, setValidatedPassword] = useState<{
    validated: boolean;
    helperText: string | undefined;
  }>({
    validated: true,
    helperText: undefined,
  });

  useEffect(() => {
    handleStart();
  }, []);

  const handleStart = async () => {
    const initUserCredentials = {email: '', password: ''};
    const startEmail: string | null = await getLocalStorage(LOCALSTORAGE_EMAIL);

    if (startEmail) {
      initUserCredentials.email = startEmail;
    }

    setUserCredentials(initUserCredentials);
  };

  const handleChange = (event: any) => {
    const {id, value} = event.target;
    console.log('id, value', id, value);

    setUserCredentials(oldCreds => ({
      ...oldCreds,
      [id]: value,
    }));
  };

  const validateEmail = (mail: string | undefined) => {
    if (mail && /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(mail)) {
      setValidatedEmail({
        validated: true,
        helperText: undefined,
      });
      return true;
    }
    setValidatedEmail({
      validated: false,
      helperText: 'Skriv en gyldig email adresse',
    });
    return false;
  };

  const validatePassword = (password: string | undefined) => {
    if (password && password.length > 5) {
      setValidatedPassword({
        validated: true,
        helperText: undefined,
      });
      return true;
    }
    setValidatedPassword({
      validated: false,
      helperText: 'Kodeord skal være længere end 5 bogstaver',
    });
    return false;
  };

  const handleSubmit = () => {
    if (
      validateEmail(userCredentials?.email) &&
      validatePassword(userCredentials?.password)
    ) {
      setLocalStorage(LOCALSTORAGE_EMAIL, userCredentials?.email);
      logIn(userCredentials?.email, userCredentials?.password);
      onClose();
    }
  };

  const handleReset = () => {
    if (validateEmail(userCredentials.email)) {
      setReset(false);
      resetPassword(userCredentials.email);
    }
  };

  return (
    <Dialog open={open} onClose={() => onClose()}>
      <DialogTitle>Indtast email og kodeord for at logge ind</DialogTitle>
      <DialogContent>
        <Stack spacing={2} sx={{pt: 2}}>
          {open && !reset && (
            <>
              <Stack spacing={2}>
                <DialogContentText>
                  Du skal bruge din email fra iq96.dk. Hvis du ikke kan huske
                  det eller vil bruge et andet, så skriv til webmaster.
                </DialogContentText>
                <DialogContentText>
                  Kodeord er det samme som bliver brugt i app'en hvis denne har
                  været brugt.
                </DialogContentText>
                <DialogContentText>
                  <strong>OBS!</strong> Kan du ikke huske dit kodeord, så brug
                  "Reset Kodeord" knappen.
                </DialogContentText>
              </Stack>
              <Stack>
                <BoldText variant="subtitle1">Email</BoldText>
                <TextField
                  id="email"
                  type="email"
                  value={userCredentials?.email}
                  onChange={handleChange}
                  placeholder={userCredentials?.email || 'Email'}
                  error={!validatedEmail.validated}
                  helperText={validatedEmail.helperText}
                />
              </Stack>
              <Stack>
                <BoldText variant="subtitle1">Kodeord</BoldText>
                <TextField
                  id="password"
                  type="password"
                  value={userCredentials?.password}
                  onChange={handleChange}
                  placeholder={userCredentials?.password || 'Kodeord'}
                  error={!validatedPassword.validated}
                  helperText={validatedPassword.helperText}
                />
              </Stack>
            </>
          )}
          {reset && (
            <Stack spacing={2}>
              <Stack>
                <BoldText variant="subtitle1">Email</BoldText>
                <TextField
                  id="email"
                  value={userCredentials?.email}
                  onChange={handleChange}
                  placeholder={userCredentials?.email || 'Email'}
                  error={!validatedEmail.validated}
                  helperText={validatedEmail.helperText}
                />
              </Stack>
              <Stack>
                <Typography>
                  1. Indtast din email ovenover og tryk Reset
                </Typography>
                <Typography>2. Gå til din email indboks </Typography>
                <Typography>
                  3. Find reset mailen. Den kommer fra
                  noreply@iq96-XXXX.firebaseapp.com
                </Typography>
                <Typography>
                  4. Tryk på link - vælg nyt kodeord - kom tilbage hertil
                </Typography>
              </Stack>
            </Stack>
          )}
        </Stack>
      </DialogContent>
      <DialogActions>
        <Stack direction="row" spacing={1}>
          {!reset && (
            <Button onClick={() => setReset(true)}>Reset Kodeord</Button>
          )}
          <Button
            variant="outlined"
            onClick={() => setReset(false)}
            color={'error'}>
            Fortryd
          </Button>
          <Button
            variant="outlined"
            onClick={reset ? handleReset : handleSubmit}>
            {reset ? 'Reset' : 'Login'}
          </Button>
        </Stack>
      </DialogActions>
    </Dialog>
  );
};

export default Login;
