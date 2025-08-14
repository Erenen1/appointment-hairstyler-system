## Settings API

- Base: `http://148.230.104.189:8000/settings`
- Header'lar: `Authorization`, `x-tenant-id`, `Content-Type: application/json`

### Business Settings
- GET `/business`
- PUT `/business`
```json
{ "businessName":"","businessLogo":"","ownerName":"","email":"","phone":"","address":"","website":"","description":"","workingHours":{} }
```
Yanıt:
```json
{ "success": true, "message": "Kayıt başarıyla güncellendi", "data": { "id":"uuid","business_name":"","business_logo":"","owner_name":"","email":"","phone":"","address":"","website":"","description":"","working_hours":{}, "updated_at":"2024-01-01T10:00:00Z" } }
```

### Notification Settings
- GET `/notifications`
- PUT `/notifications`
```json
{ "emailNotifications":true, "smsNotifications":false, "appointmentReminders":true, "newCustomerAlerts":true, "paymentAlerts":true }
```
Yanıt:
```json
{ "success": true, "message": "Kayıt başarıyla güncellendi", "data": { "email_notifications": true, "sms_notifications": false, "appointment_reminders": true, "new_customer_alerts": true, "payment_alerts": true } }
```

### Profile
- GET `/profile`
- PUT `/profile`
```json
{ "fullName":"","email":"","phone":"","avatar":"" }
```
Yanıt: `{ "success": true, "message": "Kayıt başarıyla güncellendi", "data": { "id":"uuid","username":"","email":"","first_name":"","last_name":"","phone":"","role":"admin","last_login":null } }`

