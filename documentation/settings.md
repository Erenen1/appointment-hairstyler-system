### Ayarlar API

`/admin/ayarlar` sayfası için işletme ve kullanıcı ayarları.

- Base URL: `/api/settings`
- Auth: `Authorization: Bearer <token>`

#### İşletme Ayarları
- GET `/business`
- PUT `/business`
  - Body:
    ```json
    {
      "businessName":"",
      "businessLogo":"",
      "ownerName":"",
      "email":"",
      "phone":"",
      "address":"",
      "website":"",
      "description":"",
      "workingHours": {"Mon": {"isOpen": true, "openTime":"09:00","closeTime":"18:00"}}
    }
    ```
  - Response:
    ```json
    {
      "id": "uuid",
      "businessName": "",
      "businessLogo": "",
      "ownerName": "",
      "email": "",
      "phone": "",
      "address": "",
      "website": "",
      "description": "",
      "workingHours": { "Mon": { "isOpen": true, "openTime": "09:00", "closeTime": "18:00" } },
      "updatedAt": "2024-01-01T10:00:00Z"
    }
    ```

#### Bildirim Ayarları
- GET `/notifications`
- PUT `/notifications` Body: `{ "emailNotifications":true, "smsNotifications":false, "appointmentReminders":true, "newCustomerAlerts":true, "paymentAlerts":true }`
  - Response: `{ "emailNotifications": true, "smsNotifications": false, "appointmentReminders": true, "newCustomerAlerts": true, "paymentAlerts": true }`

#### Profil
- GET `/profile`
- PUT `/profile` Body: `{ "fullName":"","email":"","phone":"","avatar":"" }`
  - Response: `{ "id":"uuid","fullName":"","email":"","phone":"","avatar":"","role":"admin","lastLogin":"2024-01-01T10:00:00Z" }`

#### Güvenlik
- POST `/security/change-password` Body: `{ "currentPassword":"","newPassword":"" }`
  - Response: `204 No Content`

#### Hata Formatı
```json
{ "error": { "code": "string", "message": "string" } }
```


