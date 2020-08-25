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

  // If we use Document Object method, we can perform CRUD(create, retrieve, update, delete) methods in the Database
  const userRef = firestore.doc(`users/${userAuth.uid}`); // {id:"..."//firebase userID, path:'...'}

  //documentSnapshot Object allow us to check if document exist at this quary using the .exists property witch returns a boolean
  const snapShot = await userRef.get(); // DocumentSnapshot{ exists: true/false, id=".."//firebase UserID or url... }

  if (!snapShot.exists) {
    const { displayName, email } = userAuth; // get data from firebase auth. p{...}
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

export const addCollectionAndDocuments = async (
  collectionKey,
  objectsToAdd
) => {
  const collectionRef = firestore.collection(collectionKey);

  const batch = firestore.batch();
  objectsToAdd.forEach((obj) => {
    const newDocRef = collectionRef.doc();
    batch.set(newDocRef, obj);
  });

  return await batch.commit();
};

export const convertCollectionsSnapshotToMap = (collections) => {
  const transformedCollection = collections.docs.map((doc) => {
    const { title, items } = doc.data();

    return {
      routeName: encodeURI(title.toLowerCase()),
      id: doc.id,
      title,
      items,
    };
  });

  return transformedCollection.reduce((accumulator, collection) => {
    accumulator[collection.title.toLowerCase()] = collection;
    return accumulator;
  }, {});
};

export const getCurrentUser = () => {
  return new Promise((resolve, reject) => {
    const unsubscribe = auth.onAuthStateChanged((userAuth) => {
      unsubscribe();
      resolve(userAuth);
    }, reject);
  });
};

export const auth = firebase.auth();
export const firestore = firebase.firestore();

export const googleProvider = new firebase.auth.GoogleAuthProvider();
googleProvider.setCustomParameters({ prompt: "select_account" });
export const signInWithGoogle = () => auth.signInWithPopup(googleProvider);

export default firebase;
