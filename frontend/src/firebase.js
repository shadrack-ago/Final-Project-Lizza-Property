// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";

const firebaseConfig = {
  apiKey: "AIzaSyAEtkqgGb6sZLX6W4tUR2tJ_rYouYiUMDU",
  authDomain: "lizza-peperties.firebaseapp.com",
  projectId: "lizza-peperties",
  storageBucket: "lizza-peperties.appspot.com",
  messagingSenderId: "461183675157",
  appId: "1:461183675157:web:4d3ab06816c6117025571c",
  measurementId: "G-WEMK8CSCWE"
};

export const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);