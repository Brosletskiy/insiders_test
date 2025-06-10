import {
    collection,
    doc,
    addDoc,
    updateDoc,
    deleteDoc,
    getDocs,
    getDoc,
    serverTimestamp,
    setDoc,
} from 'firebase/firestore';
import type { Role, TodoList } from '../types';
import { db } from './config';
import { getListMembers, assignUserRole } from './roles';

const todoListsRef = collection(db, 'todoLists');

export const createTodoList = async (title: string, ownerId: string): Promise<void> => {
    const docRef = await addDoc(todoListsRef, {
        title,
        ownerId,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
    });

    await assignUserRole(docRef.id, ownerId, 'Admin');
};

export const updateTodoList = async (listId: string, title: string): Promise<void> => {
    const listRef = doc(db, 'todoLists', listId);
    await updateDoc(listRef, { title, updatedAt: serverTimestamp() });
};

export const deleteTodoList = async (listId: string): Promise<void> => {
    const listRef = doc(db, 'todoLists', listId);
    await deleteDoc(listRef);
};

export const getUserTodoLists = async (userId: string): Promise<TodoList[]> => {
    const todoListsSnap = await getDocs(collection(db, 'todoLists'));
    const result: TodoList[] = [];

    for (const listDoc of todoListsSnap.docs) {
        const listId = listDoc.id;
        const listData = listDoc.data();

        const memberDocRef = doc(db, 'todoLists', listId, 'members', userId);
        const memberDoc = await getDoc(memberDocRef);
        if (!memberDoc.exists()) continue;

        const members = await getListMembers(listId);
        const memberRoles: Record<string, Role> = {};
        members.forEach((m) => {
            memberRoles[m.userId] = m.role;
        });

        result.push({
            id: listId,
            title: listData.title,
            ownerId: listData.ownerId,
            createdAt: listData.createdAt,
            updatedAt: listData.updatedAt,
            memberRoles,
        });
    }

    return result;
};

export const getTodoListById = async (listId: string): Promise<TodoList | null> => {
    const listRef = doc(db, 'todoLists', listId);
    const snapshot = await getDoc(listRef);
    if (!snapshot.exists()) return null;
    const data = snapshot.data();

    const members = await getListMembers(listId);
    const memberRoles: Record<string, Role> = {};
    members.forEach((m) => (memberRoles[m.userId] = m.role));

    return {
        id: snapshot.id,
        title: data.title,
        ownerId: data.ownerId,
        createdAt: data.createdAt,
        updatedAt: data.updatedAt,
        memberRoles,
    } as TodoList;
};

export const patchTodoList = async (
    listId: string,
    updates: Partial<Pick<TodoList, 'title' | 'updatedAt'>>
): Promise<void> => {
    const listRef = doc(db, 'todoLists', listId);
    await updateDoc(listRef, { ...updates, updatedAt: serverTimestamp() });
};

export const addUserToList = async (
    listId: string,
    userId: string,
    role: Role = 'Viewer'
): Promise<void> => {
    const memberRef = doc(db, 'todoLists', listId, 'members', userId);
    await setDoc(memberRef, {
        userId,
        role,
        addedAt: serverTimestamp(),
    });
};