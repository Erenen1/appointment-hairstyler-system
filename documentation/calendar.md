### Randevu Takvimi API

`/admin/randevu-takvimi` sayfası için takvim veri uçları.

- Base URL: `/api/schedule/calendar`
- Auth: `Authorization: Bearer <token>`

#### Slot Listeleme
- GET `/slots`
  - Query: `startDate`, `endDate`, `staffId?`, `serviceId?`
  - Response:
    ```json
    {
      "slots": [
        { "date": "2024-01-01", "start": "09:00", "end": "09:30", "available": true, "staffId": "uuid" }
      ],
      "businessHours": { "Mon": { "isOpen": true, "openTime": "09:00", "closeTime": "18:00" } }
    }
    ```

#### Gün Bazlı Randevular
- GET `/day`
  - Query: `date`, `staffId?`
  - Response:
    ```json
    {
      "appointments": [
        { "id": "uuid", "start": "09:00", "end": "09:30", "customerName": "" }
      ],
      "businessHours": { "Mon": { "isOpen": true, "openTime": "09:00", "closeTime": "18:00" } }
    }
    ```

#### Hata Formatı
```json
{ "error": { "code": "string", "message": "string" } }
```


