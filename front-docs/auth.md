## Auth API (Kullanıcı Girişi ve Hesap Yönetimi)
### Standart Yanıt Yapısı
- Başarılı
```json
{ "success": true, "message": "", "data": {}, "pagination": null, "timestamp": "2024-01-01T10:00:00.000Z" }
```
- Hata
```json
{ "success": false, "type": "AUTHENTICATION_ERROR", "message": "", "errors": [ { "field": "", "message": "", "code": "" } ], "timestamp": "2024-01-01T10:00:00.000Z", "path": "/api/auth/login" }
```

### Tipler (öneri)
```ts
export type UserRole = 'admin' | 'staff' | 'user';
export interface AuthUserResponse {
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
export interface LoginResponse { user: AuthUserResponse; token: string; refreshToken: string }
```

- Base URL: `/api/auth`
- Gerekli Header'lar:
  - `Content-Type: application/json`
  - `Authorization: Bearer <token>` (login/register hariç diğerlerinde gerekebilir)

### Giriş (Login)
- POST `/login`
- Body
```json
{ "tenantId": "uuid", "username": "string", "password": "string", "rememberMe": true }
```
- Response
```json
{
  "success": true,
  "message": "Giriş başarılı",
  "data": {
    "user": {
      "id": "uuid",
      "username": "string",
      "email": "string",
      "firstName": null,
      "lastName": null,
      "role": "admin",
      "isActive": true,
      "lastLogin": null,
      "createdAt": "2024-01-01T10:00:00Z",
      "updatedAt": "2024-01-01T10:00:00Z"
    },
    "token": "jwt",
    "refreshToken": "jwt"
  },
  "timestamp": "2024-01-01T10:00:00.000Z"
}
```
- Örnek fetch
```ts
async function login(tenantId: string, username: string, password: string) {
  const res = await fetch('/api/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ tenantId, username, password, rememberMe: true })
  });
  if (!res.ok) throw await res.json();
  return res.json();
}
```

### Kayıt (Register)
- POST `/register`
- Body
```json
{ "tenantId": "uuid", "username":"string", "email":"string", "password":"string", "role":"user" }
```
- Response (login ile benzer)
```json
{
  "success": true,
  "message": "Kayıt başarıyla oluşturuldu",
  "data": {
    "user": { "id": "uuid", "username": "string", "email": "string", "role": "user", "isActive": true },
    "token": "jwt",
    "refreshToken": "jwt"
  }
}
```

### Token Yenileme
- POST `/refresh`
- Body
```json
{ "refreshToken":"string" }
```
- Response
```json
{ "success": true, "message": "Token yenilendi", "data": { "token":"jwt" }, "timestamp": "2024-01-01T10:00:00.000Z" }
```

### Çıkış
- POST `/logout`
- Response: HTTP 204

### Parola Sıfırlama
- POST `/password-reset/request`
```json
{ "email": "string" }
```
- POST `/password-reset/confirm`
```json
{ "token":"string", "newPassword":"string" }
```

### Örnek axios instance
```ts
import axios from 'axios';
export const api = axios.create({ baseURL: '/api', headers: { 'Content-Type': 'application/json' } });
export function withAuth(token?: string) {
  return api.create({ baseURL: '/api', headers: { 'Content-Type': 'application/json', ...(token ? { Authorization: `Bearer ${token}` } : {}) } });
}
```

### Notlar
- Başarılı yanıtlarda sarmal yapı: `{ success, message, data }`
- Hatalı yanıtlarda: `{ success:false, type, message, errors? }`

