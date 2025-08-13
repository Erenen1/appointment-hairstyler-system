export type UserRole = 'admin' | 'staff' | 'user';

export interface User {
    id: string;
    username: string;
    email: string;
    firstName?: string | null;
    lastName?: string | null;
    role: UserRole;
    isActive: boolean;
    lastLogin?: string | null;
    createdAt?: string;
    updatedAt?: string;
}

export interface AuthState {
    user: User | null;
    isAuthenticated: boolean;
    isLoading: boolean;
    error: string | null;
}

export interface LoginCredentials {
    username: string;
    password: string;
    rememberMe?: boolean;
}

export interface RegisterData {
    username: string;
    email: string;
    password: string;
    role?: UserRole;
}

export interface AuthResponse {
    success: boolean;
    message: string;
    data: {
        user: User;
        token: string;
        refreshToken: string;
    };
    timestamp: string;
}

export interface LoginResponse {
    user: User;
    token: string;
    refreshToken: string;
}

export interface RefreshTokenResponse {
    success: boolean;
    message: string;
    data: {
        token: string;
    };
    timestamp: string;
}

export interface ApiError {
    success: false;
    type: string;
    message: string;
    errors?: Array<{
        field: string;
        message: string;
        code: string;
    }>;
    timestamp: string;
    path: string;
}
