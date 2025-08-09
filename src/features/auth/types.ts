export interface User {
    id: number;
    username: string;
    email: string;
    firstName: string;
    lastName: string;
    role: 'admin' | 'staff' | 'user';
    isActive: boolean;
    lastLogin?: string;
    createdAt: string;
    updatedAt: string;
}

export interface LoginCredentials {
    username: string;
    password: string;
    rememberMe?: boolean;
}

export interface AuthState {
    user: User | null;
    isAuthenticated: boolean;
    isLoading: boolean;
    error: string | null;
    token: string | null;
}

export interface AuthResponse {
    user: User;
    token: string;
    refreshToken: string;
}

export interface PasswordReset {
    email: string;
    token: string;
    newPassword: string;
}

