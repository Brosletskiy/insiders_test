import {
    collection,
    doc,
    addDoc,
    updateDoc,
    deleteDoc,
    getDocs,
    getDoc,
    serverTimestamp,
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
    const snapshot = await getDocs(collection(db, 'todoLists'));

    const allLists = await Promise.all(
        snapshot.docs.map(async (docSnap) => {
            const data = docSnap.data();
            const members = await getListMembers(docSnap.id);
            const memberRoles: Record<string, Role> = {};
            members.forEach((m) => (memberRoles[m.userId] = m.role));

            const isUserInList = memberRoles[userId];
            if (!isUserInList) return null;

            return {
                id: docSnap.id,
                title: data.title,
                ownerId: data.ownerId,
                createdAt: data.createdAt,
                updatedAt: data.updatedAt,
                memberRoles,
            } as TodoList;
        })
    );

    return allLists.filter((list): list is TodoList => list !== null);
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