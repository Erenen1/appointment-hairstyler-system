# Cookie Utilities

Bu dosya, Next.js uygulamasında cookie yönetimi için kapsamlı utility fonksiyonları sağlar.

## 🚀 Kurulum

`js-cookie` paketi zaten yüklü. Import etmek için:

```typescript
import { 
  setCookie, 
  getCookie, 
  removeCookie,
  authCookieUtils,
  themeCookieUtils,
  languageCookieUtils 
} from '@/lib/cookieUtils';
```

## 📝 Temel Kullanım

### 1. **Genel Cookie İşlemleri**

```typescript
// Cookie kaydet
setCookie('user_preference', { theme: 'dark', language: 'tr' });

// Cookie al
const preference = getCookie('user_preference');
// Returns: { theme: 'dark', language: 'tr' }

// Cookie sil
removeCookie('user_preference');

// Cookie var mı kontrol et
const exists = hasCookie('user_preference');
```

### 2. **Auth Cookie'leri**

```typescript
// Token kaydet
authCookieUtils.setAuthToken('jwt_token_here');
authCookieUtils.setRefreshToken('refresh_token_here');

// Token al
const token = authCookieUtils.getAuthToken();
const refreshToken = authCookieUtils.getRefreshToken();

// User data kaydet/al
authCookieUtils.setUserData({ id: 1, name: 'John' });
const user = authCookieUtils.getUserData();

// Tüm auth cookie'leri temizle
authCookieUtils.clear();
```

### 3. **Theme Cookie'leri**

```typescript
// Theme kaydet
themeCookieUtils.setTheme('dark');

// Theme al
const theme = themeCookieUtils.getTheme(); // 'light' | 'dark'
```

### 4. **Language Cookie'leri**

```typescript
// Dil kaydet
languageCookieUtils.setLanguage('en');

// Dil al
const language = languageCookieUtils.getLanguage(); // Default: 'tr'
```

## ⚙️ Gelişmiş Özellikler

### **Cookie Seçenekleri**

```typescript
// Özel süre ile cookie kaydet
setCookieWithExpiry('temp_data', 'value', 30); // 30 gün

// Session cookie (browser kapanınca silinir)
setSessionCookie('session_data', 'value');

// Secure cookie (HTTPS gerekli)
setSecureCookie('secure_data', 'value');

// HttpOnly cookie (JavaScript'ten erişilemez)
setHttpOnlyCookie('http_only_data', 'value');
```

### **Toplu İşlemler**

```typescript
// Tüm cookie'leri temizle
clearAllCookies();

// Sadece auth cookie'leri temizle
clearAuthCookies();
```

### **Debug İşlemleri**

```typescript
// Tüm cookie'leri listele
const allCookies = debugCookieUtils.listAllCookies();

// Cookie boyutunu kontrol et
const size = debugCookieUtils.getCookieSize('user_data');
```

## 🔒 Güvenlik Özellikleri

### **Otomatik Güvenlik**

- **Development**: `secure: false`, `httpOnly: false`
- **Production**: `secure: true`, `httpOnly: true`
- **SameSite**: `strict` (CSRF koruması)

### **Cookie Ayarları**

```typescript
const COOKIE_OPTIONS = {
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'strict',
  expires: 7, // 7 gün
};
```

## 📱 Kullanım Örnekleri

### **Login İşlemi**

```typescript
const handleLogin = async (credentials: LoginCredentials) => {
  try {
    const response = await AuthService.login(credentials);
    
    if (response.success) {
      // Token'ları cookie'ye kaydet
      authCookieUtils.setAuthToken(response.data.token);
      authCookieUtils.setRefreshToken(response.data.refreshToken);
      authCookieUtils.setUserData(response.data.user);
      
      // Kullanıcıyı yönlendir
      router.push('/dashboard');
    }
  } catch (error) {
    console.error('Login failed:', error);
  }
};
```

### **Logout İşlemi**

```typescript
const handleLogout = async () => {
  try {
    await AuthService.logout();
    
    // Cookie'leri temizle
    authCookieUtils.clear();
    
    // Kullanıcıyı yönlendir
    router.push('/login');
  } catch (error) {
    console.error('Logout failed:', error);
  }
};
```

### **Theme Değiştirme**

```typescript
const toggleTheme = () => {
  const currentTheme = themeCookieUtils.getTheme();
  const newTheme = currentTheme === 'light' ? 'dark' : 'light';
  
  themeCookieUtils.setTheme(newTheme);
  setTheme(newTheme); // React state güncelle
};
```

### **Dil Değiştirme**

```typescript
const changeLanguage = (language: string) => {
  languageCookieUtils.setLanguage(language);
  setLanguage(language); // React state güncelle
  
  // Sayfayı yenile veya i18n güncelle
  router.push(router.asPath, router.asPath, { locale: language });
};
```

## 🎯 Best Practices

### **1. Cookie İsimleri**
- Tek yerden yönetim için `COOKIE_NAMES` kullanın
- Anlamlı isimler verin
- Prefix kullanmayın (Next.js otomatik ekler)

### **2. Veri Tipleri**
- String veriler direkt kaydedin
- Object/Array veriler JSON.stringify ile kaydedin
- getCookie otomatik JSON parse eder

### **3. Hata Yönetimi**
- Try-catch blokları kullanın
- Console.error ile loglama yapın
- Fallback değerler sağlayın

### **4. Performans**
- Gereksiz cookie okuma/yazma işlemlerinden kaçının
- Cookie boyutunu minimum tutun
- Expire sürelerini makul ayarlayın

## 🚨 Dikkat Edilecekler

1. **Browser Desteği**: Modern browser'lar gerekli
2. **HTTPS**: Production'da secure cookie'ler için gerekli
3. **Boyut Limiti**: Cookie başına max 4KB
4. **Domain**: Subdomain'lerde dikkatli olun
5. **Privacy**: GDPR/CCPA uyumluluğu için gerekli

## 📚 Referanslar

- [js-cookie Documentation](https://github.com/js-cookie/js-cookie)
- [Next.js Cookies](https://nextjs.org/docs/api-routes/edge-runtime)
- [MDN Cookies](https://developer.mozilla.org/en-US/docs/Web/HTTP/Cookies)
