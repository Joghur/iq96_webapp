# IQ96 web app

This project is for making a webapp for IQ96 on tour

## Setup

Before running project:
Add file `src/settings/firebaseConfig.ts` with this firebase login (get this from your firebase console):

    export const firebaseConfig = {
    apiKey: <apiKey>,
    authDomain: <authDomain>,
    databaseURL: <databaseURL>,
    projectId: <projectId>,
    storageBucket: <storageBucket>,
    messagingSenderId: <messagingSenderId>,
    appId: <appId>,
    };

After that run
### `npm install`

## Available Scripts

In the project directory, you can run:

### `npm run start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

The page will reload when you make changes.\
You may also see any lint errors in the console.

### `npm run build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information
