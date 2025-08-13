import { useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from '../../../lib/utils/toast';
import { AuthState, LoginCredentials, RegisterData, AuthResponse } from '../../../types/auth';

export const useAuth = () => {
    const [authState, setAuthState] = useState<AuthState>({
        user: null,
        isAuthenticated: false,
        isLoading: false,
        error: null,
    });

    const router = useRouter();

    const login = useCallback(async (credentials: LoginCredentials) => {
        setAuthState(prev => ({ ...prev, isLoading: true, error: null }));

        try {
            // Burada API çağrısı yapılacak
            console.log('Giriş verileri:', credentials);

            // Simüle edilmiş başarılı giriş
            const mockResponse: AuthResponse = {
                user: {
                    id: '1',
                    firstName: 'Admin',
                    lastName: 'User',
                    email: credentials.email,
                    phone: '+905551234567',
                    role: 'admin',
                    createdAt: new Date('2024-01-01'),
                    updatedAt: new Date('2024-01-01'),
                },
                token: 'mock-jwt-token',
                message: 'Giriş başarılı',
            };

            setAuthState({
                user: mockResponse.user,
                isAuthenticated: true,
                isLoading: false,
                error: null,
            });

            toast.success('Giriş başarılı! 🎉');

            // Yönlendirme
            router.push('/admin/randevu-takvimi');

        } catch (error) {
            const errorMessage = 'E-posta veya şifre hatalı. Lütfen tekrar deneyiniz.';
            setAuthState(prev => ({ ...prev, error: errorMessage, isLoading: false }));

            toast.error('Giriş başarısız! 😔');
        }
    }, [router]);

    const register = useCallback(async (data: RegisterData) => {
        setAuthState(prev => ({ ...prev, isLoading: true, error: null }));

        try {
            // Burada API çağrısı yapılacak
            console.log('Kayıt verileri:', data);

            toast.success('Kayıt başarılı! 🎊');

            // Giriş sayfasına yönlendir
            router.push('/admin/giris-yap');

        } catch (error) {
            const errorMessage = 'Kayıt sırasında bir hata oluştu. Lütfen tekrar deneyiniz.';
            setAuthState(prev => ({ ...prev, error: errorMessage, isLoading: false }));

            toast.error('Kayıt başarısız! 😕');
        } finally {
            setAuthState(prev => ({ ...prev, isLoading: false }));
        }
    }, [router]);

    const logout = useCallback(() => {
        setAuthState({
            user: null,
            isAuthenticated: false,
            isLoading: false,
            error: null,
        });

        toast.info('Çıkış yapıldı 👋');

        router.push('/admin/giris-yap');
    }, [router]);

    const clearError = useCallback(() => {
        setAuthState(prev => ({ ...prev, error: null }));
    }, []);

    return {
        ...authState,
        login,
        register,
        logout,
        clearError,
    };
};
