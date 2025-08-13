export interface User {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    role: 'admin' | 'user';
    createdAt: Date;
    updatedAt: Date;
}

export interface AuthState {
    user: User | null;
    isAuthenticated: boolean;
    isLoading: boolean;
    error: string | null;
}

export interface LoginCredentials {
    email: string;
    password: string;
}

export interface RegisterData {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    password: string;
}

export interface AuthResponse {
    user: User;
    token: string;
    message: string;
}
