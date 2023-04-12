// import {deleteData, keys} from './async';

import {FirebaseError} from 'firebase/app';
import {
  getAuth,
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
  signOut,
} from 'firebase/auth';

const auth = getAuth();

const handleError = (error: FirebaseError | unknown) => {
  if (typeof error === 'object' && error !== null && 'code' in error) {
    switch (error?.code) {
      case 'auth/user-not-found':
        return 'Ugyldig email';

      case 'auth/wrong-password':
        return 'Ugyldigt kodeord.';

      case 'auth/too-many-requests':
        return 'For mange login forsøg. Forsøg igen senere.';

      case 'auth/network-request-failed':
        return 'Netwærk fejl. Forsøg igen senere.';

      default:
        return 'Ukendt fejl under indlogning.';
    }
  }
};

export const logIn = async (
  email: string | undefined,
  password: string | undefined,
) => {
  if (email && password) {
    let userObj;
    try {
      userObj = await signInWithEmailAndPassword(auth, email, password);
    } catch (error) {
      console.log('Login error: ', error);
      alert(handleError(error));
    }
    return userObj;
  }
  return null;
};

export const logOut = async () => {
  console.log('logOut');
  try {
    await signOut(auth);
    // await deleteData(keys);
  } catch (error) {
    console.log('Logout error: ', error);
    alert('Der er skete en fejl under log ud');
  }
};

export const resetPassword = async (email: string) => {
  try {
    await sendPasswordResetEmail(auth, email);
  } catch (error) {
    console.log('Logout error: ', error);
    alert('Der er skete en fejl under reset kodeord!');
  }
};
