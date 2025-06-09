import type { JSX } from 'react';
import HomePage from '../pages/HomePage';
import LoginPage from '../pages/auth/LoginPage';
import RegisterPage from '../pages/auth/RegisterPage';
import Dashboard from '../pages/system/dashboard';
import TodoListPage from '../pages/system/todoList';
import { Navigate } from 'react-router-dom';

interface RouteConfig {
    path: string;
    element: JSX.Element;
    protected?: boolean;
}

export const routes: RouteConfig[] = [
    {
        path: '/',
        element: <HomePage />,
    },
    {
        path: '/login',
        element: <LoginPage />,
    },
    {
        path: '/register',
        element: <RegisterPage />,
    },
    {
        path: '*',
        element: <Navigate to="/" />,
    },
    {
        path: '/dashboard',
        element: <Dashboard />,
    },
    {
        path: '/list/:id',
        element: <TodoListPage/>,
    }
];
