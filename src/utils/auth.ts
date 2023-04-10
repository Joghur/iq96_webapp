// import {deleteData, keys} from './async';

import {
  getAuth,
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
  signOut,
} from 'firebase/auth';

const auth = getAuth();

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
      alert('Der er skete en fejl under indlogning.');
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
    alert('Der er skete en fejl under log ud!');
  }
};
