export interface User {
    uid: string;
    name: string;
    email: string;
}

export interface TodoList {
    id: string;
    title: string;
    ownerId: string;
    createdAt?: any;
    updatedAt?: any;
    memberRoles: Record<string, Role>;
}

export interface Task {
    id: string;
    todoListId: string;
    title: string;
    description?: string;
    completed: boolean;
    createdAt?: any;
    updatedAt?: any;
}

export const Role = {
    Admin: 'Admin',
    Viewer: 'Viewer',
} as const;

export type Role = typeof Role[keyof typeof Role];

export interface Collaborator {
    userId: string;
    email: string;
    role: Role;
}