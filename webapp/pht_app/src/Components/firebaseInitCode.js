// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
export const firebaseConfig = {
  apiKey: "AIzaSyCIZX_86XACr_pFqFDM4BcmAGM7F-zAncI",
  authDomain: "plant-health-tracker.firebaseapp.com",
  projectId: "plant-health-tracker",
  storageBucket: "plant-health-tracker.appspot.com",
  messagingSenderId: "791972996799",
  appId: "1:791972996799:web:c1b9b1673aeedfed12480a",
  measurementId: "G-E6KS4L9KLN"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);