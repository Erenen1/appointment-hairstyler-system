## WhatsApp Bot API

- Base: `/api/messaging/whatsapp`
- Header'lar: `Authorization`, `x-tenant-id`, `Content-Type: application/json`

### Bot Config
- GET `/config`
- PUT `/config`
```json
{ "instanceId":"","instanceName":"","phoneNumber":"","isActive":true, "webhookUrl":"" }
```
Yanıt: `{ "success": true, "data": { "instance_id":"","instance_name":"","phone_number":"","is_active":true,"webhook_url":"","last_activity":"2024-01-01T10:00:00Z" } }`

### Contacts
- GET `/contacts?search=&page=1&pageSize=20`
- GET `/contacts/:id`
- POST `/contacts`
```json
{ "phoneNumber":"","name":"" }
```
Yanıt: `{ "success": true, "message": "Kayıt başarıyla oluşturuldu", "data": { "id":"uuid","phoneNumber":"","name":"" } }`

### Messages
- GET `/contacts/:id/messages?before=&after=&limit=50`
- POST `/contacts/:id/messages`
```json
{ "messageType":"text|image|document", "content":"", "mediaUrl":"", "fileName":"" }
```
Yanıt: `{ "success": true, "message": "Kayıt başarıyla oluşturuldu", "data": { "id":"uuid","sender":"me","message_type":"text","content":"...","status":"sent","message_timestamp":"2024-01-01T10:00:00Z" } }`

### Stats
- GET `/stats`

