import firebase from "firebase/app";
import "firebase/firestore";
import "firebase/auth";

const config = {
  apiKey: "AIzaSyDEoT3B3Sqqc5oqG8bb9Ku46ar86tblPNw",
  authDomain: "crown-clothing-db-bbbef.firebaseapp.com",
  databaseURL: "https://crown-clothing-db-bbbef.firebaseio.com",
  projectId: "crown-clothing-db-bbbef",
  storageBucket: "crown-clothing-db-bbbef.appspot.com",
  messagingSenderId: "38420622689",
  appId: "1:38420622689:web:1579d1c5e7a766d4626920",
  measurementId: "G-CPTNNYNDLG",
};

firebase.initializeApp(config);

export const createUserProfileDocument = async (userAuth, additionalData) => {
  if (!userAuth) return;

  const userRef = firestore.doc(`users/${userAuth.uid}`);

  const snapShot = await userRef.get();

  if (!snapShot.exists) {
    const { displayName, email } = userAuth;
    const createdAt = new Date();

    try {
      await userRef.set({
        displayName,
        email,
        createdAt,
        ...additionalData,
      });
    } catch (error) {
      console.log("error creating user", error.message);
    }
  }

  return userRef;
};

export const auth = firebase.auth();
export const firestore = firebase.firestore();

const provider = new firebase.auth.GoogleAuthProvider();
provider.setCustomParameters({ prompt: "select_account" });
export const signInWithGoogle = () => auth.signInWithPopup(provider);

export default firebase;
