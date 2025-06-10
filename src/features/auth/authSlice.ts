import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import {
    registerUser as fbRegister,
    loginUser as fbLogin,
    logoutUser as fbLogout,
} from '../../firebase/auth';

interface SimplifiedUser {
    uid: string;
    email: string | null;
    displayName: string;
}

interface AuthState {
    user: SimplifiedUser | null;
    loading: boolean;
    error: string | null;
    isAuthenticated: boolean;
}

const initialState: AuthState = {
    user: null,
    loading: false,
    error: null,
    isAuthenticated: false,
};

export const registerUser = createAsyncThunk(
    'auth/register',
    async (
        { email, password, username }: { email: string; password: string; username: string },
        thunkAPI
    ) => {
        try {
            const user = await fbRegister(email, password, username);
            return user;
        } catch (error: any) {
            return thunkAPI.rejectWithValue(error.message);
        }
    }
);

export const loginUser = createAsyncThunk(
    'auth/login',
    async ({ email, password }: { email: string; password: string }, thunkAPI) => {
        try {
            const user = await fbLogin(email, password);
            return user;
        } catch (error: any) {
            return thunkAPI.rejectWithValue(error.message);
        }
    }
);

export const logoutUser = createAsyncThunk('auth/logout', async (_, thunkAPI) => {
    try {
        await fbLogout();
        localStorage.removeItem('accessToken');
        localStorage.removeItem('lastRefresh');

        return null;
    } catch (error: any) {
        return thunkAPI.rejectWithValue(error.message);
    }
});

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        setUser(state, action: PayloadAction<SimplifiedUser | null>) {
            state.user = action.payload;
            state.isAuthenticated = !!action.payload;
        },
        clearUser(state) {
            state.user = null;
            state.isAuthenticated = false;
            state.loading = false;
            state.error = null;
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(registerUser.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(registerUser.fulfilled, (state, action) => {
                const firebaseUser = action.payload;
                state.user = {
                    uid: firebaseUser.uid,
                    email: firebaseUser.email,
                    displayName: firebaseUser.displayName || '',
                };
                state.isAuthenticated = true;
                state.loading = false;
            })
            .addCase(registerUser.rejected, (state, action) => {
                state.error = action.payload as string;
                state.loading = false;
            })
            .addCase(loginUser.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(loginUser.fulfilled, (state, action) => {
                const firebaseUser = action.payload;
                state.user = {
                    uid: firebaseUser.uid,
                    email: firebaseUser.email,
                    displayName: firebaseUser.displayName || '',
                };
                state.isAuthenticated = true;
                state.loading = false;
            })
            .addCase(loginUser.rejected, (state, action) => {
                state.error = action.payload as string;
                state.loading = false;
            })
            .addCase(logoutUser.fulfilled, (state) => {
                state.user = null;
                state.isAuthenticated = false;
                state.loading = false;
                state.error = null;
            });
    },
});

export const { setUser, clearUser } = authSlice.actions;
export default authSlice.reducer;