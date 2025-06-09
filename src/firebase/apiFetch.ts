import { getAccessToken, updateAccessToken, clearTokens } from './tokenManager';
import { firebaseAuth } from './config';

export const apiFetch = async (input: RequestInfo, init: RequestInit = {}, retry = true): Promise<Response> => {
    const user = firebaseAuth.currentUser;
    if (!user) {
        throw new Error('User not authenticated');
    }

    const token = getAccessToken();
    const headers = {
        ...(init.headers || {}),
        Authorization: token ? `Bearer ${token}` : '',
    };

    const response = await fetch(input, {
        ...init,
        headers,
    });

    if (response.status === 401 && retry) {
        const newToken = await updateAccessToken(true);
        if (newToken) {
            return apiFetch(input, init, false);
        } else {
            clearTokens();
            window.location.href = '/login';
        }
    }

    return response;
};
