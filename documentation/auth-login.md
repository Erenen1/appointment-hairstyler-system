### Auth/Login API

Login ekranı için kimlik doğrulama uçları.

- Base URL: `/api/auth`
- Auth: `Authorization: Bearer <token>` (login hariç)

#### Giriş
- POST `/login`
  - Body:
    ```json
    { "username": "string", "password": "string", "rememberMe": true }
    ```
  - Response:
    ```json
    {
      "user": {
        "id": "uuid",
        "username": "",
        "email": "",
        "firstName": "",
        "lastName": "",
        "role": "admin",
        "isActive": true,
        "lastLogin": "2024-01-01T10:00:00Z",
        "createdAt": "2024-01-01T09:00:00Z",
        "updatedAt": "2024-01-01T09:00:00Z"
      },
      "token": "jwt",
      "refreshToken": "jwt"
    }
    ```

#### Token Yenileme
- POST `/refresh`
  - Body: `{ "refreshToken": "string" }`
  - Response: `{ "token": "jwt" }`

#### Çıkış
- POST `/logout`
  - Response: `204 No Content`

#### Şifre Sıfırlama
- POST `/password-reset/request` Body: `{ "email": "" }`
- POST `/password-reset/confirm` Body: `{ "email":"","token":"","newPassword":"" }`

#### Hata Formatı
```json
{ "error": { "code": "string", "message": "string" } }
```


