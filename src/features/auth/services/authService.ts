import { LoginCredentials, RegisterData, AuthResponse } from '../../../types/auth';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api';

export class AuthService {
    static async login(credentials: LoginCredentials): Promise<AuthResponse> {
        const response = await fetch(`${API_BASE_URL}/auth/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(credentials),
        });

        if (!response.ok) {
            throw new Error('Giriş başarısız');
        }

        return response.json();
    }

    static async register(data: RegisterData): Promise<AuthResponse> {
        const response = await fetch(`${API_BASE_URL}/auth/register`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        });

        if (!response.ok) {
            throw new Error('Kayıt başarısız');
        }

        return response.json();
    }

    static async logout(): Promise<void> {
        const token = localStorage.getItem('authToken');

        if (token) {
            await fetch(`${API_BASE_URL}/auth/logout`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            });

            localStorage.removeItem('authToken');
        }
    }

    static async refreshToken(): Promise<{ token: string }> {
        const response = await fetch(`${API_BASE_URL}/auth/refresh`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
        });

        if (!response.ok) {
            throw new Error('Token yenileme başarısız');
        }

        return response.json();
    }

    static async getCurrentUser(): Promise<AuthResponse['user']> {
        const token = localStorage.getItem('authToken');

        if (!token) {
            throw new Error('Token bulunamadı');
        }

        const response = await fetch(`${API_BASE_URL}/auth/me`, {
            headers: {
                'Authorization': `Bearer ${token}`,
            },
        });

        if (!response.ok) {
            throw new Error('Kullanıcı bilgileri alınamadı');
        }

        return response.json();
    }
}
