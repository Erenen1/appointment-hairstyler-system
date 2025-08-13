import { User } from '../../../types/auth';

export const isTokenValid = (token: string): boolean => {
    if (!token) return false;

    try {
        // JWT token'ı decode et ve expire date'i kontrol et
        const payload = JSON.parse(atob(token.split('.')[1]));
        const currentTime = Date.now() / 1000;

        return payload.exp > currentTime;
    } catch {
        return false;
    }
};

export const getStoredToken = (): string | null => {
    if (typeof window === 'undefined') return null;
    return localStorage.getItem('authToken');
};

export const setStoredToken = (token: string): void => {
    if (typeof window === 'undefined') return;
    localStorage.setItem('authToken', token);
};

export const removeStoredToken = (): void => {
    if (typeof window === 'undefined') return;
    localStorage.removeItem('authToken');
};

export const formatUserName = (user: User): string => {
    return `${user.firstName} ${user.lastName}`;
};

export const getUserInitials = (user: User): string => {
    return `${user.firstName.charAt(0)}${user.lastName.charAt(0)}`.toUpperCase();
};

export const hasPermission = (user: User, permission: string): boolean => {
    // Basit permission sistemi - geliştirilebilir
    if (user.role === 'admin') return true;

    // User role için özel permission'lar burada tanımlanabilir
    const userPermissions: Record<string, string[]> = {
        user: ['read', 'create'],
        admin: ['read', 'create', 'update', 'delete', 'manage_users'],
    };

    return userPermissions[user.role]?.includes(permission) || false;
};

export const validatePassword = (password: string): {
    isValid: boolean;
    errors: string[];
} => {
    const errors: string[] = [];

    if (password.length < 6) {
        errors.push('Şifre en az 6 karakter olmalıdır');
    }

    if (!/(?=.*[a-z])/.test(password)) {
        errors.push('Şifre en az bir küçük harf içermelidir');
    }

    if (!/(?=.*[A-Z])/.test(password)) {
        errors.push('Şifre en az bir büyük harf içermelidir');
    }

    if (!/(?=.*\d)/.test(password)) {
        errors.push('Şifre en az bir rakam içermelidir');
    }

    return {
        isValid: errors.length === 0,
        errors,
    };
};
