import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

import "firebase/firestore";

// Your web app's Firebase configuration
// const firebaseConfig = {
//   apiKey: "AIzaSyCbrOhhRMm1AlZkedpKNKvGHuJjRwl3GSk",
//   authDomain: "days-ced06.firebaseapp.com",
//   projectId: "days-ced06",
//   storageBucket: "days-ced06.appspot.com",
//   messagingSenderId: "276938954903",
//   appId: "1:276938954903:web:ca542e3d4682dc1c5771d2",
//   measurementId: "G-MPGDE4BJLL",
// };
const firebaseConfig = {
  apiKey: "AIzaSyBckXoGG94leA71NINsqynN28WvWiw9g8k",
  authDomain: "days-dev-fdeae.firebaseapp.com",
  projectId: "days-dev-fdeae",
  storageBucket: "days-dev-fdeae.appspot.com",
  messagingSenderId: "324231068565",
  appId: "1:324231068565:web:dc71d5cde72ca37899949c",
  measurementId: "G-NGVLDLC3W5",
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
// Initialize Cloud Firestore and get a reference to the service
export const db = getFirestore(app);

// https://firebase.google.com/docs/firestore/quickstart#web-version-9
