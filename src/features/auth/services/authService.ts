import { LoginCredentials, RegisterData, AuthResponse, RefreshTokenResponse, ApiError } from '../../../types/auth';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || '/api.erencelik.info';

// Tenant ID'yi localStorage'dan al veya environment variable'dan
const getTenantId = (): string => {
    if (typeof window !== 'undefined') {
        return localStorage.getItem('tenantId') || process.env.NEXT_PUBLIC_TENANT_ID || '';
    }
    return process.env.NEXT_PUBLIC_TENANT_ID || '';
};

// Token'ı localStorage'dan al
const getAuthToken = (): string | null => {
    if (typeof window !== 'undefined') {
        return localStorage.getItem('authToken');
    }
    return null;
};

// API yanıtını kontrol et
const handleApiResponse = async <T>(response: Response): Promise<T> => {
    if (!response.ok) {
        let errorMessage = 'API isteği başarısız';

        try {
            // Önce JSON olarak parse etmeye çalış
            const errorData: ApiError = await response.json();
            errorMessage = errorData.message || errorMessage;
        } catch {
            // JSON parse edilemezse text olarak oku
            try {
                const textResponse = await response.text();
                // HTML yanıtı gelip gelmediğini kontrol et
                if (textResponse.includes('<!DOCTYPE') || textResponse.includes('<html')) {
                    errorMessage = 'API endpoint bulunamadı veya sunucu hatası';
                } else {
                    errorMessage = textResponse || errorMessage;
                }
            } catch {
                // Text de okunamazsa status text'i kullan
                errorMessage = response.statusText || errorMessage;
            }
        }

        throw new Error(errorMessage);
    }

    try {
        return await response.json();
    } catch {
        throw new Error('API yanıtı JSON formatında değil');
    }
};

export class AuthService {
    static async login(credentials: LoginCredentials): Promise<AuthResponse> {
        const tenantId = getTenantId();

        const response = await fetch(`${API_BASE_URL}/auth/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'x-tenant-id': tenantId,
            },
            body: JSON.stringify(credentials),
        });

        const data = await handleApiResponse<AuthResponse>(response);

        // Token'ları localStorage'a kaydet
        if (typeof window !== 'undefined' && data.success) {
            localStorage.setItem('authToken', data.data.token);
            localStorage.setItem('refreshToken', data.data.refreshToken);
        }

        return data;
    }

    static async register(data: RegisterData): Promise<AuthResponse> {
        const tenantId = getTenantId();

        const response = await fetch(`${API_BASE_URL}/auth/register`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'x-tenant-id': tenantId,
            },
            body: JSON.stringify(data),
        });

        const responseData = await handleApiResponse<AuthResponse>(response);

        // Token'ları localStorage'a kaydet
        if (typeof window !== 'undefined' && responseData.success) {
            localStorage.setItem('authToken', responseData.data.token);
            localStorage.setItem('refreshToken', responseData.data.refreshToken);
        }

        return responseData;
    }

    static async logout(): Promise<void> {
        const token = getAuthToken();
        const tenantId = getTenantId();

        if (token) {
            try {
                await fetch(`${API_BASE_URL}/auth/logout`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'x-tenant-id': tenantId,
                        'Authorization': `Bearer ${token}`,
                    },
                });
            } catch (error) {
                console.error('Logout API hatası:', error);
            }
        }

        // Local storage'ı temizle
        if (typeof window !== 'undefined') {
            localStorage.removeItem('authToken');
            localStorage.removeItem('refreshToken');
            localStorage.removeItem('user');
        }
    }

    static async refreshToken(): Promise<RefreshTokenResponse> {
        const refreshToken = typeof window !== 'undefined' ? localStorage.getItem('refreshToken') : null;
        const tenantId = getTenantId();

        if (!refreshToken) {
            throw new Error('Refresh token bulunamadı');
        }

        const response = await fetch(`${API_BASE_URL}/auth/refresh`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'x-tenant-id': tenantId,
            },
            body: JSON.stringify({ refreshToken }),
        });

        const data = await handleApiResponse<RefreshTokenResponse>(response);

        // Yeni token'ı localStorage'a kaydet
        if (typeof window !== 'undefined' && data.success) {
            localStorage.setItem('authToken', data.data.token);
        }

        return data;
    }

    static async getCurrentUser(): Promise<AuthResponse['data']['user']> {
        const token = getAuthToken();
        const tenantId = getTenantId();

        if (!token) {
            throw new Error('Token bulunamadı');
        }

        const response = await fetch(`${API_BASE_URL}/auth/me`, {
            headers: {
                'Content-Type': 'application/json',
                'x-tenant-id': tenantId,
                'Authorization': `Bearer ${token}`,
            },
        });

        const data = await handleApiResponse<AuthResponse>(response);
        return data.data.user;
    }

    static async requestPasswordReset(email: string): Promise<{ success: boolean; message: string }> {
        const tenantId = getTenantId();

        const response = await fetch(`${API_BASE_URL}/auth/password-reset/request`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'x-tenant-id': tenantId,
            },
            body: JSON.stringify({ email }),
        });

        return handleApiResponse<{ success: boolean; message: string }>(response);
    }

    static async confirmPasswordReset(token: string, newPassword: string): Promise<{ success: boolean; message: string }> {
        const tenantId = getTenantId();

        const response = await fetch(`${API_BASE_URL}/auth/password-reset/confirm`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'x-tenant-id': tenantId,
            },
            body: JSON.stringify({ token, newPassword }),
        });

        return handleApiResponse<{ success: boolean; message: string }>(response);
    }

    // Token'ın geçerli olup olmadığını kontrol et
    static isTokenValid(): boolean {
        const token = getAuthToken();
        if (!token) return false;

        try {
            // JWT token'ın expire date'ini kontrol et
            const payload = JSON.parse(atob(token.split('.')[1]));
            const currentTime = Date.now() / 1000;
            return payload.exp > currentTime;
        } catch {
            return false;
        }
    }

    // Kullanıcı bilgilerini localStorage'dan al
    static getUserFromStorage(): AuthResponse['data']['user'] | null {
        if (typeof window !== 'undefined') {
            const userStr = localStorage.getItem('user');
            return userStr ? JSON.parse(userStr) : null;
        }
        return null;
    }

    // Kullanıcı bilgilerini localStorage'a kaydet
    static saveUserToStorage(user: AuthResponse['data']['user']): void {
        if (typeof window !== 'undefined') {
            localStorage.setItem('user', JSON.stringify(user));
        }
    }

    // API endpoint'lerinin mevcut olup olmadığını kontrol et
    static async checkApiHealth(): Promise<{ isHealthy: boolean; message: string }> {
        try {
            const tenantId = getTenantId();
            const response = await fetch(`${API_BASE_URL}/auth/health`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'x-tenant-id': tenantId,
                },
            });

            if (response.ok) {
                return { isHealthy: true, message: 'API sağlıklı' };
            } else {
                return { isHealthy: false, message: `API hatası: ${response.status}` };
            }
        } catch (error) {
            return {
                isHealthy: false,
                message: `API bağlantı hatası: ${error instanceof Error ? error.message : 'Bilinmeyen hata'}`
            };
        }
    }

    // Debug: API endpoint'lerini test et
    static async debugApiEndpoints(): Promise<{ [key: string]: { status: number; message: string } }> {
        const tenantId = getTenantId();
        const endpoints = [
            { name: 'health', path: '/auth/health', method: 'GET' },
            { name: 'login', path: '/auth/login', method: 'POST' },
            { name: 'register', path: '/auth/register', method: 'POST' },
        ];

        const results: { [key: string]: { status: number; message: string } } = {};

        for (const endpoint of endpoints) {
            try {
                const response = await fetch(`${API_BASE_URL}${endpoint.path}`, {
                    method: endpoint.method,
                    headers: {
                        'Content-Type': 'application/json',
                        'x-tenant-id': tenantId,
                    },
                    ...(endpoint.method === 'POST' && { body: JSON.stringify({ test: true }) }),
                });

                results[endpoint.name] = {
                    status: response.status,
                    message: response.statusText
                };
            } catch (error) {
                results[endpoint.name] = {
                    status: 0,
                    message: error instanceof Error ? error.message : 'Bilinmeyen hata'
                };
            }
        }

        return results;
    }
}

