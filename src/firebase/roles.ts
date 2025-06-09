import { doc, setDoc, getDoc, collection, getDocs } from 'firebase/firestore';
import { db } from './config';
import type { Role } from '../types';

interface MemberRole {
    userId: string;
    role: Role;
}

export const assignUserRole = async (
    listId: string,
    userId: string,
    role: Role
): Promise<void> => {
    const ref = doc(db, 'todoLists', listId, 'members', userId);
    await setDoc(ref, { userId, role });
};

export const getUserRole = async (
    listId: string,
    userId: string
): Promise<Role | null> => {
    const ref = doc(db, 'todoLists', listId, 'members', userId);
    const snapshot = await getDoc(ref);
    if (snapshot.exists()) {
        const data = snapshot.data() as MemberRole;
        return data.role;
    }
    return null;
};

export const getListMembers = async (
    listId: string
): Promise<MemberRole[]> => {
    const ref = collection(db, 'todoLists', listId, 'members');
    const snapshot = await getDocs(ref);
    return snapshot.docs.map(doc => doc.data() as MemberRole);
};
