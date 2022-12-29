import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
    apiKey: process.env.REACT_APP_DS_API_KEY,
    authDomain: process.env.REACT_APP_DS_AUTH_DOMAIN,
    projectId: process.env.REACT_APP_DS_PROJECT_ID,
    storageBucket: process.env.REACT_APP_DS_STORAGE_BUCKET,
    messagingSenderId: process.env.REACT_APP_DS_MESSAGING_SENDER_ID,
    appId: process.env.REACT_APP_DS_APP_ID,
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
