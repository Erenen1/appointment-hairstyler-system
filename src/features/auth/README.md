# Auth Feature

Bu feature, kullanıcı kimlik doğrulama ve yetkilendirme işlemlerini yönetir.

## Özellikler

- ✅ Kullanıcı girişi (Login)
- ✅ Kullanıcı kaydı (Register)
- ✅ Çıkış yapma (Logout)
- ✅ Token yenileme (Refresh Token)
- ✅ Şifre sıfırlama
- ✅ Kullanıcı durumu yönetimi
- ✅ Local storage entegrasyonu
- ✅ Tenant ID desteği

## API Endpoints

### Base URL

```
/api/auth
```

### Gerekli Headers

- `Content-Type: application/json`
- `x-tenant-id: <uuid>` (tüm istekler için zorunlu)
- `Authorization: Bearer <token>` (login/register hariç diğerlerinde gerekli)

### Endpoints

#### POST `/login`

Kullanıcı girişi

```json
{
  "username": "string",
  "password": "string",
  "rememberMe": true
}
```

#### POST `/register`

Kullanıcı kaydı

```json
{
  "username": "string",
  "email": "string",
  "password": "string",
  "role": "admin"
}
```

#### POST `/logout`

Kullanıcı çıkışı

#### POST `/refresh`

Token yenileme

```json
{
  "refreshToken": "string"
}
```

#### GET `/me`

Mevcut kullanıcı bilgileri

#### POST `/password-reset/request`

Şifre sıfırlama isteği

```json
{
  "email": "string"
}
```

#### POST `/password-reset/confirm`

Şifre sıfırlama onayı

```json
{
  "token": "string",
  "newPassword": "string"
}
```

## Kullanım

### Hook Kullanımı

```tsx
import { useAuth } from "@/features/auth";

function MyComponent() {
  const { login, register, logout, user, isAuthenticated, isLoading } =
    useAuth();

  const handleLogin = async () => {
    await login({
      username: "user@example.com",
      password: "password123",
      rememberMe: true,
    });
  };

  const handleRegister = async () => {
    await register({
      username: "newuser@example.com",
      email: "newuser@example.com",
      password: "password123",
      role: "user",
    });
  };

  const handleLogout = async () => {
    await logout();
  };

  if (isLoading) return <div>Yükleniyor...</div>;

  return (
    <div>
      {isAuthenticated ? (
        <div>
          <p>Hoş geldin, {user?.username}!</p>
          <button onClick={handleLogout}>Çıkış Yap</button>
        </div>
      ) : (
        <div>
          <button onClick={handleLogin}>Giriş Yap</button>
          <button onClick={handleRegister}>Kayıt Ol</button>
        </div>
      )}
    </div>
  );
}
```

### Service Kullanımı

```tsx
import { AuthService } from "@/features/auth";

// Doğrudan service kullanımı
const user = await AuthService.getCurrentUser();
const isTokenValid = AuthService.isTokenValid();
```

### Context Kullanımı

```tsx
import { AuthProvider, useAuthContext } from "@/features/auth";

function App() {
  return (
    <AuthProvider>
      <MyComponent />
    </AuthProvider>
  );
}

function MyComponent() {
  const { user, login } = useAuthContext();
  // ...
}
```

## Environment Variables

```env
# API Configuration
NEXT_PUBLIC_API_URL=/api
NEXT_PUBLIC_TENANT_ID=your-tenant-id-here
```

## Dosya Yapısı

```
src/features/auth/
├── components/
│   └── LogoutButton.tsx
├── context/
│   └── AuthContext.tsx
├── hooks/
│   └── useAuth.ts
├── services/
│   └── authService.ts
├── types/
│   └── index.ts
├── index.ts
└── README.md
```

## Notlar

- Tüm API istekleri tenant ID gerektirir
- Token'lar otomatik olarak localStorage'da saklanır
- Token geçerliliği otomatik olarak kontrol edilir
- Hata durumlarında otomatik logout yapılır
- Local storage temizliği logout sırasında otomatik yapılır

## Debug ve Hata Ayıklama

### API Durumu Kontrolü

```tsx
import { checkAuthApiHealth } from "@/features/auth";

// API sağlık durumunu kontrol et
const healthStatus = await checkAuthApiHealth();
console.log(healthStatus);
```

### API Endpoint Test

```tsx
import { debugAuthApi } from "@/features/auth";

// Tüm auth endpoint'lerini test et
const endpointStatus = await debugAuthApi();
console.log(endpointStatus);
```

### Yaygın Hatalar ve Çözümler

#### "Unexpected token '<', "<!DOCTYPE "... is not valid JSON"

Bu hata, API endpoint'inden HTML yanıtı geldiğinde oluşur. Muhtemelen:

- API endpoint'i mevcut değil
- Sunucu hata veriyor
- Route yanlış yapılandırılmış

**Çözüm:**

1. API endpoint'lerinin doğru çalıştığını kontrol edin
2. Network tab'ında API yanıtlarını inceleyin
3. `debugAuthApi()` fonksiyonunu kullanarak endpoint durumunu test edin

#### "API endpoint bulunamadı veya sunucu hatası"

Bu hata, API'den HTML yanıtı geldiğinde otomatik olarak gösterilir.

**Çözüm:**

1. API sunucusunun çalıştığından emin olun
2. Base URL'in doğru olduğunu kontrol edin
3. Tenant ID'nin geçerli olduğunu kontrol edin

### Environment Variables Kontrolü

```env
# .env.local dosyasında bu değerlerin olduğundan emin olun
NEXT_PUBLIC_API_URL=/api
NEXT_PUBLIC_TENANT_ID=your-tenant-id-here
```
