import {
    collection,
    doc,
    addDoc,
    getDocs,
    deleteDoc,
    updateDoc,
    serverTimestamp,
} from 'firebase/firestore';
import { db } from './config';
import type { Task } from '../types';

// Add task to list
export const addTaskToList = async (
    listId: string,
    task: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>
): Promise<void> => {
    const ref = collection(db, 'todoLists', listId, 'tasks');
    await addDoc(ref, {
        ...task,
        completed: false,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
    });
};

// Delete task
export const deleteTask = async (
    listId: string,
    taskId: string
): Promise<void> => {
    const ref = doc(db, 'todoLists', listId, 'tasks', taskId);
    await deleteDoc(ref);
};

// Update task (title, description, completed)
export const updateTask = async (
    listId: string,
    taskId: string,
    updates: Partial<Pick<Task, 'title' | 'description' | 'completed'>>
): Promise<void> => {
    const ref = doc(db, 'todoLists', listId, 'tasks', taskId);
    await updateDoc(ref, {
        ...updates,
        updatedAt: serverTimestamp(),
    });
};

// Get all tasks
export const getTasksForList = async (listId: string): Promise<Task[]> => {
    const ref = collection(db, 'todoLists', listId, 'tasks');
    const snapshot = await getDocs(ref);
    return snapshot.docs.map(doc => {
        const data = doc.data();
        return {
            id: doc.id,
            title: data.title,
            description: data.description,
            completed: data.completed,
            createdAt: data.createdAt,
            updatedAt: data.updatedAt,
        } as Task;
    });
};
