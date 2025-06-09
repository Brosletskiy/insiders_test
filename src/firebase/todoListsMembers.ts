import { doc, setDoc, serverTimestamp } from 'firebase/firestore';
import { db } from './config';
import type { Role } from '../types';

export const addUserToTodoList = async (
    listId: string,
    userId: string,
    role: Role
): Promise<void> => {
    const memberRef = doc(db, 'todoLists', listId, 'members', userId);

    await setDoc(memberRef, {
        role,
        addedAt: serverTimestamp(),
    });
};
