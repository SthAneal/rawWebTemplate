// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

import  { getAuth } from "firebase/auth";
// SDK for google realtime database
import  { getDatabase } from "firebase/database";

// SDK for google cloud platform storage
import { getStorage, ref, uploadBytes, getDownloadURL, deleteObject } from "firebase/storage";

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "----Use your own firebase apiKey----",
  authDomain: "----Use your own firebase authDomain----",
  databaseURL: "----Use your own firebase databaseURL----",
  projectId: "----Use your own firebase projectId----",
  storageBucket: "----Use your own firebase storageBucket----",
  messagingSenderId: "----Use your own firebase messagingSenderId----",
  appId: "----Use your own firebase appId----",
  measurementId: "----Use your own firebase measurementId----"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Authentication and get reference to the service
export const auth = getAuth(app);

// Initialize Realtime Database and get a reference to the service
export const db = getDatabase(app);

// Initialize Cloud Storage and get a reference to the service
export const storage = getStorage(app); 

// provide ref and uploadBytes
export {ref as storageRef, uploadBytes, getDownloadURL, deleteObject};

const analytics = getAnalytics(app);
