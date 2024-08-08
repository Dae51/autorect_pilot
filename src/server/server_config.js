// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyB9YlI3mdZNpGFLPceBPDaeTLx_ATV8gcI",
  authDomain: "autorectpilot.firebaseapp.com",
  projectId: "autorectpilot",
  storageBucket: "autorectpilot.appspot.com",
  messagingSenderId: "644614777437",
  appId: "1:644614777437:web:91aa12d756b51122e2bbb4",
  measurementId: "G-WD7KP1LX18"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
