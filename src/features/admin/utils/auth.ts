export const saveTokenToLocalStorage = (token: string) => {
    if (typeof window !== 'undefined') {
        localStorage.setItem('token', token);
    }
};

export const getTokenToLocalStorage = (): string | null => {
    if (typeof window !== 'undefined') {
        return localStorage.getItem('token');
    }
    return null;
};

export const removeTokenFromLocalStorage = () => {
    if (typeof window !== 'undefined') {
        localStorage.removeItem('token');
    }
};