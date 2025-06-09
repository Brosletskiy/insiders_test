import { configureStore } from '@reduxjs/toolkit';
import todoListReducer from '../features/todoLists/todoListSlice';
import authSlice from '../features/auth/authSlice';
import tasksSlice from '../features/tasks/taskSlice';

export const store = configureStore({
    reducer: {
        todoLists: todoListReducer,
        auth: authSlice,
        task: tasksSlice,
    },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;