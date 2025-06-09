import { firebaseAuth } from './config';

// Save to LocalStorage
const ACCESS_TOKEN_KEY = 'accessToken';
const REFRESH_TIMESTAMP_KEY = 'lastRefresh';

export const getAccessToken = () => localStorage.getItem(ACCESS_TOKEN_KEY);
export const setAccessToken = (token: string) => localStorage.setItem(ACCESS_TOKEN_KEY, token);

export const clearTokens = () => {
    localStorage.removeItem(ACCESS_TOKEN_KEY);
    localStorage.removeItem(REFRESH_TIMESTAMP_KEY);
};

// Get accessToken
export const updateAccessToken = async (forceRefresh = false): Promise<string | null> => {
    const user = firebaseAuth.currentUser;
    if (!user) return null;

    try {
        const token = await user.getIdToken(forceRefresh);
        setAccessToken(token);
        localStorage.setItem(REFRESH_TIMESTAMP_KEY, Date.now().toString());
        return token;
    } catch (err) {
        return null;
    }
};
