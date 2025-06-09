import {
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    signOut,
    onAuthStateChanged,
} from 'firebase/auth';
import type { User } from 'firebase/auth';
import { db, firebaseAuth } from './config';
import { updateAccessToken } from './tokenManager';
import { doc, serverTimestamp, setDoc } from 'firebase/firestore';

//Register
export const registerUser = async (email: string, password: string, username: string) => {
    const userCredential = await createUserWithEmailAndPassword(firebaseAuth, email, password);
    const user = userCredential.user;

    await setDoc(doc(db, 'users', user.uid), {
        email: user.email,
        username,
        createdAt: serverTimestamp(),
    });

    await updateAccessToken();
    return user;
};

// Login
export const loginUser = async (
    email: string,
    password: string
): Promise<User> => {
    const userCredential = await signInWithEmailAndPassword(firebaseAuth, email, password);
    await updateAccessToken();
    return userCredential.user;
};

// Logout
export const logoutUser = async (): Promise<void> => {
    await signOut(firebaseAuth);
};

export const observeAuthState = (callback: (user: User | null) => void): (() => void) => {
    const unsubscribe = onAuthStateChanged(firebaseAuth, (user) => {
        callback(user);
    });
    return unsubscribe;
};
