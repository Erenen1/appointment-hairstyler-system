import { LoginCredentials, RegisterData, AuthResponse, RefreshTokenResponse, ApiError } from '../../../types/auth';
import { authCookieUtils } from '@/lib/cookieUtils';

// External API URL - always use the remote server
const API_BASE_URL = 'http://148.230.104.189:8000/auth';

// Get tenant ID - use a default value for now
const getTenantId = (): string => {
    return 'default-tenant-id'; // Bu değeri gerçek tenant ID ile değiştirin
};

// Auth token'ı cookie'den al
const getAuthToken = (): string | null => {
    return authCookieUtils.getAuthToken() || null;
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
        console.log('🔍 Login isteği gönderiliyor:', `${API_BASE_URL}/login`);
        console.log('🔍 API_BASE_URL:', API_BASE_URL);

        const response = await fetch(`${API_BASE_URL}/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'x-tenant-id': getTenantId(),
            },
            body: JSON.stringify(credentials),
        });

        const data = await handleApiResponse<AuthResponse>(response);

        // Token'ları cookie'ye kaydet
        if (data.success) {
            authCookieUtils.setAuthToken(data.data.token);
            authCookieUtils.setRefreshToken(data.data.refreshToken);
        }

        return data;
    }

    static async register(data: RegisterData): Promise<AuthResponse> {
        const response = await fetch(`${API_BASE_URL}/register`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'x-tenant-id': getTenantId(),
            },
            body: JSON.stringify(data),
        });

        const responseData = await handleApiResponse<AuthResponse>(response);

        // Token'ları cookie'ye kaydet
        if (responseData.success) {
            authCookieUtils.setAuthToken(responseData.data.token);
            authCookieUtils.setRefreshToken(responseData.data.refreshToken);
        }

        return responseData;
    }

    static async logout(): Promise<void> {
        const token = getAuthToken();

        if (token) {
            try {
                await fetch(`${API_BASE_URL}/logout`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'x-tenant-id': getTenantId(),
                        'Authorization': `Bearer ${token}`,
                    },
                });
            } catch (error) {
                console.error('Logout API hatası:', error);
            }
        }

        // Cookie'leri temizle
        authCookieUtils.clear();
    }

    static async refreshToken(): Promise<RefreshTokenResponse> {
        const refreshToken = authCookieUtils.getRefreshToken();

        if (!refreshToken) {
            throw new Error('Refresh token bulunamadı');
        }

        const response = await fetch(`${API_BASE_URL}/refresh`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'x-tenant-id': getTenantId(),
            },
            body: JSON.stringify({ refreshToken }),
        });

        const data = await handleApiResponse<RefreshTokenResponse>(response);

        // Yeni token'ı cookie'ye kaydet
        if (data.success) {
            authCookieUtils.setAuthToken(data.data.token);
        }

        return data;
    }

    static async getCurrentUser(): Promise<AuthResponse['data']['user']> {
        const token = getAuthToken();

        if (!token) {
            throw new Error('Token bulunamadı');
        }

        const response = await fetch(`${API_BASE_URL}/me`, {
            headers: {
                'Content-Type': 'application/json',
                'x-tenant-id': getTenantId(),
                'Authorization': `Bearer ${token}`,
            },
        });

        const data = await handleApiResponse<AuthResponse>(response);
        return data.data.user;
    }

    static async requestPasswordReset(email: string): Promise<{ success: boolean; message: string }> {
        const response = await fetch(`${API_BASE_URL}/password-reset/request`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'x-tenant-id': getTenantId(),
            },
            body: JSON.stringify({ email }),
        });

        return handleApiResponse<{ success: boolean; message: string }>(response);
    }

    static async confirmPasswordReset(token: string, newPassword: string): Promise<{ success: boolean; message: string }> {
        const response = await fetch(`${API_BASE_URL}/password-reset/confirm`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'x-tenant-id': getTenantId(),
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

    // Kullanıcı bilgilerini cookie'den al
    static getUserFromStorage(): AuthResponse['data']['user'] | null {
        const userData = authCookieUtils.getUserData();
        return userData as AuthResponse['data']['user'] | null;
    }

    // Kullanıcı bilgilerini cookie'ye kaydet
    static saveUserToStorage(user: AuthResponse['data']['user']): void {
        authCookieUtils.setUserData(user as unknown as Record<string, unknown>);
    }

    // API endpoint'lerinin mevcut olup olmadığını kontrol et
    static async checkApiHealth(): Promise<{ isHealthy: boolean; message: string }> {
        try {
            const response = await fetch(`${API_BASE_URL}/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'x-tenant-id': getTenantId(),
                },
                body: JSON.stringify({ test: true }),
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
}

