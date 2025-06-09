import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import type { TodoList } from '../../types';
import * as todoService from '../../firebase/todoService';

interface TodoListState {
    items: TodoList[];
    loading: boolean;
    error: string | null;
}

const initialState: TodoListState = {
    items: [],
    loading: false,
    error: null,
};

// Fetch Lists
export const fetchTodoLists = createAsyncThunk(
    'todoLists/fetch',
    async (userId: string, thunkAPI) => {
        try {
            return await todoService.getUserTodoLists(userId);
        } catch (error) {
            return thunkAPI.rejectWithValue('Failed to fetch todo lists');
        }
    }
);

// Create List
export const createTodoList = createAsyncThunk(
    'todoLists/create',
    async ({ title, ownerId }: { title: string; ownerId: string }, thunkAPI) => {
        try {
            await todoService.createTodoList(title, ownerId);
            return await todoService.getUserTodoLists(ownerId);
        } catch (error) {
            return thunkAPI.rejectWithValue('Failed to create todo list');
        }
    }
);

// Update List
export const updateTodoListTitle = createAsyncThunk(
    'todoLists/update',
    async ({ id, title, ownerId }: { id: string; title: string; ownerId: string }, thunkAPI) => {
        try {
            await todoService.updateTodoList(id, title);
            return await todoService.getUserTodoLists(ownerId);
        } catch (error) {
            return thunkAPI.rejectWithValue('Failed to update todo list');
        }
    }
);

// Delete List
export const deleteTodoList = createAsyncThunk(
    'todoLists/delete',
    async ({ id, ownerId }: { id: string; ownerId: string }, thunkAPI) => {
        try {
            await todoService.deleteTodoList(id);
            return await todoService.getUserTodoLists(ownerId);
        } catch (error) {
            return thunkAPI.rejectWithValue('Failed to delete todo list');
        }
    }
);

const todoListSlice = createSlice({
    name: 'todoLists',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchTodoLists.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchTodoLists.fulfilled, (state, action: PayloadAction<TodoList[]>) => {
                state.loading = false;
                state.items = action.payload;
            })
            .addCase(fetchTodoLists.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            });


        [createTodoList, updateTodoListTitle, deleteTodoList].forEach((thunk) => {
            builder
                .addCase(thunk.pending, (state) => {
                    state.loading = true;
                    state.error = null;
                })
                .addCase(thunk.fulfilled, (state, action: PayloadAction<TodoList[]>) => {
                    state.loading = false;
                    state.items = action.payload;
                })
                .addCase(thunk.rejected, (state, action) => {
                    state.loading = false;
                    state.error = action.payload as string;
                });
        });
    },
});

export default todoListSlice.reducer;