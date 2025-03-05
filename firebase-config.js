import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { getAnalytics } from "firebase/analytics";


const firebaseConfig = {
    apiKey: "AIzaSyCgTDQ3s53lq__EWaN7n3IuU8NiXjwwft0",
    authDomain: "falldetection-9c400.firebaseapp.com",
    projectId: "falldetection-9c400",
    storageBucket: "falldetection-9c400.firebasestorage.app",
    messagingSenderId: "451649221542",
    appId: "1:451649221542:web:051f7908a81202208e1567",
    measurementId: "G-JK4JYGNE9G"
};


const app = initializeApp(firebaseConfig);  
const analytics = getAnalytics(app);
const db = getFirestore(app);
const auth = getAuth(app);

export { app, db, auth, analytics };