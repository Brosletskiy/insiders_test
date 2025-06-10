import { collection, getDocs } from 'firebase/firestore';
import { db } from './config';

export const getAllUsers = async () => {
    const snapshot = await getDocs(collection(db, 'users'));
    return snapshot.docs.map(doc => ({ uid: doc.id, ...doc.data() })) as any[];
};