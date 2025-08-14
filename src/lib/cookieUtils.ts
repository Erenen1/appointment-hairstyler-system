import Cookies from 'js-cookie';
import { showSuccessToast, showErrorToast } from './utils/toast';

// Cookie ayarları
const COOKIE_OPTIONS = {
    // Development için httpOnly: false, production'da true olabilir
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict' as const,
    expires: 7, // 7 gün
};

// Toast mesajları
const TOAST_MESSAGES = {
    COOKIE_SET: 'Cookie başarıyla kaydedildi',
    COOKIE_GET: 'Cookie başarıyla alındı',
    COOKIE_REMOVED: 'Cookie başarıyla silindi',
    COOKIE_CLEARED: 'Tüm cookie\'ler temizlendi',
    AUTH_COOKIES_CLEARED: 'Giriş bilgileri temizlendi',
    COOKIE_ERROR: 'Cookie işlemi başarısız',
    COOKIE_NOT_FOUND: 'Cookie bulunamadı',
} as const;

// Cookie isimleri - tek yerden yönetim için
export const COOKIE_NAMES = {
    AUTH_TOKEN: 'auth_token',
    REFRESH_TOKEN: 'refresh_token',
    USER_DATA: 'user_data',
    THEME: 'theme',
    LANGUAGE: 'language',
    SESSION_ID: 'session_id',
} as const;

// Cookie değerlerinin tipi
export type CookieName = typeof COOKIE_NAMES[keyof typeof COOKIE_NAMES];

/**
 * Cookie'ye değer kaydet
 * @param name Cookie adı
 * @param value Cookie değeri
 * @param options Ek cookie seçenekleri
 */
export const setCookie = <T>(
    name: CookieName,
    value: T,
    options?: Cookies.CookieAttributes
): void => {
    try {
        const cookieValue = typeof value === 'string' ? value : JSON.stringify(value);
        Cookies.set(name, cookieValue, { ...COOKIE_OPTIONS, ...options });

        // Başarılı toast ve log
        showSuccessToast(`${TOAST_MESSAGES.COOKIE_SET}: ${name}`);
        console.log(`🍪 Cookie başarıyla kaydedildi: ${name}`, { value, options });
    } catch (error) {
        // Hata toast ve log
        showErrorToast(`${TOAST_MESSAGES.COOKIE_ERROR}: ${name}`);
        console.error(`❌ Cookie kaydetme hatası (${name}):`, error);
    }
};

/**
 * Cookie'den değer al
 * @param name Cookie adı
 * @param defaultValue Varsayılan değer
 * @returns Cookie değeri veya undefined
 */
export const getCookie = <T>(
    name: CookieName,
    defaultValue?: T
): T | undefined => {
    try {
        const cookieValue = Cookies.get(name);
        if (cookieValue === undefined) {
            // Cookie bulunamadı - sadece log, toast yok
            console.log(`🔍 Cookie bulunamadı: ${name}, varsayılan değer kullanılıyor:`, defaultValue);
            return defaultValue;
        }

        // JSON parse etmeye çalış, başarısız olursa string olarak döndür
        try {
            const parsedValue = JSON.parse(cookieValue) as T;
            console.log(`🍪 Cookie başarıyla alındı: ${name}`, { value: parsedValue });
            return parsedValue;
        } catch {
            console.log(`🍪 Cookie başarıyla alındı (string): ${name}`, { value: cookieValue });
            return cookieValue as T;
        }
    } catch (error) {
        showErrorToast(`${TOAST_MESSAGES.COOKIE_ERROR}: ${name}`);
        console.error(`❌ Cookie alma hatası (${name}):`, error);
        return defaultValue;
    }
};

/**
 * Cookie'yi sil
 * @param name Cookie adı
 * @param options Ek cookie seçenekleri
 */
export const removeCookie = (
    name: CookieName,
    options?: Cookies.CookieAttributes
): void => {
    try {
        Cookies.remove(name, { ...COOKIE_OPTIONS, ...options });

        // Başarılı toast ve log
        showSuccessToast(`${TOAST_MESSAGES.COOKIE_REMOVED}: ${name}`);
        console.log(`🗑️ Cookie başarıyla silindi: ${name}`);
    } catch (error) {
        // Hata toast ve log
        showErrorToast(`${TOAST_MESSAGES.COOKIE_ERROR}: ${name}`);
        console.error(`❌ Cookie silme hatası (${name}):`, error);
    }
};

/**
 * Cookie'nin var olup olmadığını kontrol et
 * @param name Cookie adı
 * @returns Cookie var mı?
 */
export const hasCookie = (name: CookieName): boolean => {
    try {
        const exists = Cookies.get(name) !== undefined;
        console.log(`🔍 Cookie kontrol edildi: ${name} - ${exists ? 'Mevcut ✅' : 'Mevcut değil ❌'}`);
        return exists;
    } catch (error) {
        console.error(`❌ Cookie kontrol hatası (${name}):`, error);
        return false;
    }
};

/**
 * Tüm cookie'leri temizle
 */
export const clearAllCookies = (): void => {
    try {
        Object.values(COOKIE_NAMES).forEach(cookieName => {
            Cookies.remove(cookieName);
        });

        // Başarılı toast ve log
        showSuccessToast(TOAST_MESSAGES.COOKIE_CLEARED);
        console.log(`🧹 Tüm cookie\'ler temizlendi`);
    } catch (error) {
        // Hata toast ve log
        showErrorToast('Cookie\'ler temizlenirken hata oluştu');
        console.error('❌ Tüm cookie temizleme hatası:', error);
    }
};

/**
 * Auth ile ilgili cookie'leri temizle
 */
export const clearAuthCookies = (): void => {
    try {
        removeCookie(COOKIE_NAMES.AUTH_TOKEN);
        removeCookie(COOKIE_NAMES.REFRESH_TOKEN);
        removeCookie(COOKIE_NAMES.USER_DATA);
        removeCookie(COOKIE_NAMES.SESSION_ID);

        // Başarılı toast ve log
        showSuccessToast(TOAST_MESSAGES.AUTH_COOKIES_CLEARED);
        console.log(`🔐 Tüm giriş bilgileri temizlendi`);
    } catch (error) {
        // Hata toast ve log
        showErrorToast('Giriş bilgileri temizlenirken hata oluştu');
        console.error('❌ Auth cookie temizleme hatası:', error);
    }
};

/**
 * Cookie'yi belirli bir süre sonra expire et
 * @param name Cookie adı
 * @param value Cookie değeri
 * @param days Gün cinsinden süre
 */
export const setCookieWithExpiry = <T>(
    name: CookieName,
    value: T,
    days: number
): void => {
    setCookie(name, value, { expires: days });
};

/**
 * Session cookie olarak ayarla (browser kapanınca silinir)
 * @param name Cookie adı
 * @param value Cookie değeri
 */
export const setSessionCookie = <T>(
    name: CookieName,
    value: T
): void => {
    setCookie(name, value, { expires: undefined });
};

/**
 * Cookie'yi secure olarak ayarla (HTTPS gerekli)
 * @param name Cookie adı
 * @param value Cookie değeri
 */
export const setSecureCookie = <T>(
    name: CookieName,
    value: T
): void => {
    setCookie(name, value, { secure: true });
};

/**
 * Cookie'yi httpOnly olarak ayarla (JavaScript'ten erişilemez)
 * @param name Cookie adı
 * @param value Cookie değeri
 */
export const setHttpOnlyCookie = <T>(
    name: CookieName,
    value: T
): void => {
    setCookie(name, value, { httpOnly: true });
};

// Auth özel fonksiyonları
export const authCookieUtils = {
    /**
     * Auth token'ı kaydet
     */
    setAuthToken: (token: string) => {
        setCookie(COOKIE_NAMES.AUTH_TOKEN, token, { expires: 1 }); // 1 gün
    },

    /**
     * Auth token'ı al
     */
    getAuthToken: (): string | undefined => {
        return getCookie(COOKIE_NAMES.AUTH_TOKEN);
    },

    /**
     * Refresh token'ı kaydet
     */
    setRefreshToken: (token: string) => {
        setCookie(COOKIE_NAMES.REFRESH_TOKEN, token, { expires: 7 }); // 7 gün
    },

    /**
     * Refresh token'ı al
     */
    getRefreshToken: (): string | undefined => {
        return getCookie(COOKIE_NAMES.REFRESH_TOKEN);
    },

    /**
     * User data'yı kaydet
     */
    setUserData: (userData: Record<string, unknown>) => {
        setCookie(COOKIE_NAMES.USER_DATA, userData, { expires: 7 });
    },

    /**
     * User data'yı al
     */
    getUserData: () => {
        return getCookie(COOKIE_NAMES.USER_DATA);
    },

    /**
     * Tüm auth cookie'lerini temizle
     */
    clear: () => {
        clearAuthCookies();
    },
};

// Theme özel fonksiyonları
export const themeCookieUtils = {
    /**
     * Theme'i kaydet
     */
    setTheme: (theme: 'light' | 'dark') => {
        setCookie(COOKIE_NAMES.THEME, theme, { expires: 365 }); // 1 yıl
    },

    /**
     * Theme'i al
     */
    getTheme: (): 'light' | 'dark' => {
        return getCookie(COOKIE_NAMES.THEME, 'light') || 'light';
    },
};

// Language özel fonksiyonları
export const languageCookieUtils = {
    /**
     * Dil'i kaydet
     */
    setLanguage: (language: string) => {
        setCookie(COOKIE_NAMES.LANGUAGE, language, { expires: 365 });
    },

    /**
     * Dil'i al
     */
    getLanguage: (): string => {
        return getCookie(COOKIE_NAMES.LANGUAGE, 'tr') as string;
    },
};

// Debug fonksiyonları
export const debugCookieUtils = {
    /**
     * Tüm cookie'leri listele
     */
    listAllCookies: () => {
        try {
            const cookies = Object.values(COOKIE_NAMES).reduce((acc, cookieName) => {
                acc[cookieName] = Cookies.get(cookieName);
                return acc;
            }, {} as Record<string, string | undefined>);

            console.log(`📋 Tüm cookie\'ler listelendi:`, cookies);
            return cookies;
        } catch (error) {
            console.error('❌ Cookie listeleme hatası:', error);
            return {};
        }
    },

    /**
     * Cookie boyutunu kontrol et
     */
    getCookieSize: (name: CookieName): number => {
        try {
            const cookie = Cookies.get(name);
            const size = cookie ? new Blob([cookie]).size : 0;

            console.log(`📏 Cookie boyutu kontrol edildi: ${name} - ${size} bytes`);
            return size;
        } catch (error) {
            console.error(`❌ Cookie boyut kontrol hatası (${name}):`, error);
            return 0;
        }
    },
};

export default {
    setCookie,
    getCookie,
    removeCookie,
    hasCookie,
    clearAllCookies,
    clearAuthCookies,
    setCookieWithExpiry,
    setSessionCookie,
    setSecureCookie,
    setHttpOnlyCookie,
    auth: authCookieUtils,
    theme: themeCookieUtils,
    language: languageCookieUtils,
    debug: debugCookieUtils,
};
