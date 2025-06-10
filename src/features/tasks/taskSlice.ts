import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import type { Task } from '../../types';
import {
    addTaskToList,
    deleteTask,
    updateTask,
    getTasksForList,
} from '../../firebase/taskService';

interface TasksState {
    tasks: Task[];
    loading: boolean;
    error: string | null;
}

const initialState: TasksState = {
    tasks: [],
    loading: false,
    error: null,
};

// Fetch tasks
export const fetchTasks = createAsyncThunk(
    'tasks/fetchTasks',
    async (listId: string, thunkAPI) => {
        try {
            const allTasks = await getTasksForList(listId);
            return allTasks.map(task => ({ ...task, todoListId: listId }));
        } catch (error: any) {
            return thunkAPI.rejectWithValue(error.message);
        }
    }
);

export const addTask = createAsyncThunk(
    'tasks/addTask',
    async (
        { listId, task }: { listId: string; task: Omit<Task, 'id' | 'createdAt' | 'updatedAt'> },
        thunkAPI
    ) => {
        try {
            await addTaskToList(listId, task);
            const refreshedTasks = await getTasksForList(listId);
            return refreshedTasks.map(t => ({ ...t, todoListId: listId }));
        } catch (error: any) {
            return thunkAPI.rejectWithValue(error.message);
        }
    }
);

export const removeTask = createAsyncThunk(
    'tasks/deleteTask',
    async (
        { listId, taskId }: { listId: string; taskId: string },
        thunkAPI
    ) => {
        try {
            await deleteTask(listId, taskId);
            return thunkAPI.dispatch(fetchTasks(listId));
        } catch (error: any) {
            return thunkAPI.rejectWithValue(error.message);
        }
    }
);

export const editTask = createAsyncThunk(
    'tasks/editTask',
    async (
        {
            listId,
            taskId,
            updates,
        }: {
            listId: string;
            taskId: string;
            updates: Partial<Pick<Task, 'title' | 'description' | 'completed'>>;
        },
        thunkAPI
    ) => {
        try {
            await updateTask(listId, taskId, updates);
            return thunkAPI.dispatch(fetchTasks(listId));
        } catch (error: any) {
            return thunkAPI.rejectWithValue(error.message);
        }
    }
);

const tasksSlice = createSlice({
    name: 'tasks',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchTasks.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchTasks.fulfilled, (state, action: PayloadAction<Task[]>) => {
                const fetchedListId = action.payload[0]?.todoListId;
                if (fetchedListId) {
                    state.tasks = [
                        ...state.tasks.filter(t => t.todoListId !== fetchedListId),
                        ...action.payload
                    ];
                }
                state.loading = false;
            })
            .addCase(fetchTasks.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            });
    },
});

export default tasksSlice.reducer;
