import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
    apiKey: "AIzaSyDyheVnk6EFz_5qiEZAcFubHoA2zOHycdE",
    authDomain: "to-do-list-512af.firebaseapp.com",
    projectId: "to-do-list-512af",
    storageBucket: "to-do-list-512af.firebasestorage.app",
    messagingSenderId: "497446650313",
    appId: "1:497446650313:web:1dac9b3d555e886f122818"
};

const app = initializeApp(firebaseConfig);

export const firebaseAuth = getAuth(app);
export const db = getFirestore(app);