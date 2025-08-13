import { useState, useCallback, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from '../../../lib/utils/toast';
import { AuthState, LoginCredentials, RegisterData, AuthResponse } from '../../../types/auth';
import { AuthService } from '../services/authService';

export const useAuth = () => {
    const [authState, setAuthState] = useState<AuthState>({
        user: null,
        isAuthenticated: false,
        isLoading: false,
        error: null,
    });

    const router = useRouter();

    // Sayfa yüklendiğinde kullanıcı durumunu kontrol et
    useEffect(() => {
        const initializeAuth = async () => {
            try {
                // API sağlık kontrolü
                const healthCheck = await AuthService.checkApiHealth();
                console.log('🔍 Auth API Durumu:', healthCheck);

                // Local storage'dan kullanıcı bilgilerini al
                const storedUser = AuthService.getUserFromStorage();
                const isTokenValid = AuthService.isTokenValid();

                if (storedUser && isTokenValid) {
                    setAuthState({
                        user: storedUser,
                        isAuthenticated: true,
                        isLoading: false,
                        error: null,
                    });
                } else if (isTokenValid) {
                    // Token geçerli ama kullanıcı bilgisi yok, API'den al
                    try {
                        const user = await AuthService.getCurrentUser();
                        AuthService.saveUserToStorage(user);
                        setAuthState({
                            user,
                            isAuthenticated: true,
                            isLoading: false,
                            error: null,
                        });
                    } catch (error) {
                        // Token geçersiz, temizle
                        AuthService.logout();
                    }
                }
            } catch (error) {
                console.error('Auth initialization error:', error);
                AuthService.logout();
            }
        };

        initializeAuth();
    }, []);

    const login = useCallback(async (credentials: LoginCredentials) => {
        setAuthState(prev => ({ ...prev, isLoading: true, error: null }));

        try {
            // API sağlık kontrolü
            const healthCheck = await AuthService.checkApiHealth();
            if (!healthCheck.isHealthy) {
                throw new Error(`API erişim hatası: ${healthCheck.message}`);
            }

            const response = await AuthService.login(credentials);

            if (response.success) {
                const user = response.data.user;

                // Kullanıcı bilgilerini localStorage'a kaydet
                AuthService.saveUserToStorage(user);

                setAuthState({
                    user,
                    isAuthenticated: true,
                    isLoading: false,
                    error: null,
                });

                toast.success(response.message || 'Giriş başarılı! 🎉');

                // Yönlendirme
                router.push('/admin/randevu-takvimi');
            } else {
                throw new Error(response.message || 'Giriş başarısız');
            }
        } catch (error: any) {
            const errorMessage = error.message || 'E-posta veya şifre hatalı. Lütfen tekrar deneyiniz.';
            setAuthState(prev => ({ ...prev, error: errorMessage, isLoading: false }));
            toast.error('Giriş başarısız! 😔');
        }
    }, [router]);

    const register = useCallback(async (data: RegisterData) => {
        setAuthState(prev => ({ ...prev, isLoading: true, error: null }));

        try {
            // API sağlık kontrolü
            const healthCheck = await AuthService.checkApiHealth();
            if (!healthCheck.isHealthy) {
                throw new Error(`API erişim hatası: ${healthCheck.message}`);
            }

            const response = await AuthService.register(data);

            if (response.success) {
                const user = response.data.user;

                // Kullanıcı bilgilerini localStorage'a kaydet
                AuthService.saveUserToStorage(user);

                setAuthState({
                    user,
                    isAuthenticated: true,
                    isLoading: false,
                    error: null,
                });

                toast.success(response.message || 'Kayıt başarılı! 🎊');

                // Giriş sayfasına yönlendir
                router.push('/admin/giris-yap');
            } else {
                throw new Error(response.message || 'Kayıt başarısız');
            }
        } catch (error: any) {
            const errorMessage = error.message || 'Kayıt sırasında bir hata oluştu. Lütfen tekrar deneyiniz.';
            setAuthState(prev => ({ ...prev, error: errorMessage, isLoading: false }));
            toast.error('Kayıt başarısız! 😕');
        } finally {
            setAuthState(prev => ({ ...prev, isLoading: false }));
        }
    }, [router]);

    const logout = useCallback(async () => {
        try {
            await AuthService.logout();
        } catch (error) {
            console.error('Logout error:', error);
        }

        setAuthState({
            user: null,
            isAuthenticated: false,
            isLoading: false,
            error: null,
        });

        toast.info('Çıkış yapıldı 👋');
        router.push('/admin/giris-yap');
    }, [router]);

    const refreshToken = useCallback(async () => {
        try {
            const response = await AuthService.refreshToken();
            if (response.success) {
                toast.success('Token yenilendi');
                return true;
            }
        } catch (error) {
            console.error('Token refresh error:', error);
            // Token yenilenemezse logout yap
            await logout();
        }
        return false;
    }, [logout]);

    const clearError = useCallback(() => {
        setAuthState(prev => ({ ...prev, error: null }));
    }, []);

    const checkAuthStatus = useCallback(() => {
        const isTokenValid = AuthService.isTokenValid();
        const storedUser = AuthService.getUserFromStorage();

        if (isTokenValid && storedUser) {
            setAuthState(prev => ({
                ...prev,
                user: storedUser,
                isAuthenticated: true,
            }));
        } else {
            setAuthState(prev => ({
                ...prev,
                user: null,
                isAuthenticated: false,
            }));
        }
    }, []);

    return {
        ...authState,
        login,
        register,
        logout,
        refreshToken,
        clearError,
        checkAuthStatus,
    };
};
