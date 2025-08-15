### WhatsApp Bot API

`/admin/whatsapp-bot` sayfası için bot, kişi ve mesaj uçları.

- Base URL: `/api/messaging/whatsapp`
- Auth: `Authorization: Bearer <token>`

#### Bot Yapılandırması
- GET `/config`
- PUT `/config` Body: `{ "instanceId":"","instanceName":"","phoneNumber":"","isActive":true, "webhookUrl":"" }`
  - Response:
    ```json
    {
      "instanceId": "",
      "instanceName": "",
      "phoneNumber": "",
      "isActive": true,
      "webhookUrl": "",
      "lastActivity": "2024-01-01T10:00:00Z"
    }
    ```

#### Kişiler
- GET `/contacts` Query: `search?`, `page?`, `pageSize?`
  - Response:
    ```json
    {
      "items": [ { "id": "uuid", "phoneNumber": "", "name": "", "unreadCount": 0, "isOnline": false } ],
      "pagination": { "page": 1, "pageSize": 20, "total": 0 }
    }
    ```
- GET `/contacts/:id`
- POST `/contacts` Body: `{ "phoneNumber":"","name":"" }`

#### Mesajlar
- GET `/contacts/:id/messages` Query: `before?`, `after?`, `limit?=50`
- POST `/contacts/:id/messages` Body: `{ "messageType":"text|image|document", "content":"","mediaUrl":"","fileName":"" }`
  - Response (GET):
    ```json
    {
      "items": [
        { "id": "uuid", "sender": "contact", "messageType": "text", "content": "Merhaba", "timestamp": "2024-01-01T10:00:00Z", "fromMe": false, "status": "delivered" }
      ]
    }
    ```

#### Webhook
- POST `/webhook` Body (N8N):
  ```json
  { "event":"", "instance":"", "data": { "key": {"remoteJid":"","fromMe":false,"id":""}, "message": {"conversation":"..."}, "messageType":"text", "messageTimestamp": 0 }, "destination":"", "date_time":"", "sender":"" }
  ```

#### İstatistikler
- GET `/stats` → toplam mesaj, aktif sohbet, yanıt oranı vb.
  - Response: `{ "totalMessages": 0, "totalContacts": 0, "todayMessages": 0, "responseRate": 0, "avgResponseTime": "2m", "activeChats": 0 }`

#### Hata Formatı
```json
{ "error": { "code": "string", "message": "string" } }
```


