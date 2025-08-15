### Randevular API

`/admin/randevular` sayfası için uçlar.

- Base URL: `/api/schedule/appointments`
- İlgili: `/api/schedule/services`, `/api/schedule/staff`, `/api/schedule/statuses`
- Auth: `Authorization: Bearer <token>`

#### Listeleme
- GET `/`
  - Query: `startDate?`, `endDate?`, `customerId?`, `serviceId?`, `staffId?`, `statusId?`, `timeSlot?`, `page?`, `pageSize?`, `sort?=appointmentDate|-appointmentDate`
  - Response:
    ```json
    {
      "items": [
        {
          "id": "uuid",
          "appointmentDate": "2024-01-01",
          "startTime": "09:00",
          "endTime": "09:30",
          "customer": { "id": "uuid", "fullName": "" },
          "service": { "id": "uuid", "title": "Gösterim", "price": 0, "duration": 30 },
          "staff": { "id": "uuid", "fullName": "" },
          "status": { "id": "uuid", "displayName": "Planlandı", "color": "#22c55e" },
          "notes": "",
          "price": 0
        }
      ],
      "pagination": { "page": 1, "pageSize": 20, "total": 0 }
    }
    ```

#### Detay
- GET `/:id`
  - Response:
    ```json
    {
      "id": "uuid",
      "appointmentDate": "2024-01-01",
      "startTime": "09:00",
      "endTime": "09:30",
      "customer": { "id": "uuid", "fullName": "" },
      "service": { "id": "uuid", "title": "Gösterim", "price": 0, "duration": 30 },
      "staff": { "id": "uuid", "fullName": "" },
      "status": { "id": "uuid", "displayName": "Planlandı", "color": "#22c55e" },
      "history": [ { "from": "Planlandı", "to": "Tamamlandı", "changedAt": "2024-01-01T10:00:00Z" } ],
      "notes": "",
      "price": 0
    }
    ```

#### Oluşturma
- POST `/`
  - Body:
    ```json
    {
      "customerId":"uuid",
      "staffId":"uuid",
      "serviceId":"uuid",
      "statusId":"uuid",
      "appointmentDate":"2024-01-01",
      "startTime":"09:00",
      "endTime":"09:30",
      "notes":"",
      "price": 0
    }
    ```

#### Güncelleme
- PUT `/:id` (kısmi kabul edilebilir)

#### Silme
- DELETE `/:id`

#### Durum Geçmişi
- GET `/:id/history`
- POST `/:id/history` Body: `{ "toStatusId":"uuid", "note":"" }`

#### Yardımcı Kaynaklar
- GET `/services` → hizmet listesi
  - Response: `{ "items": [ { "id":"uuid","title":"Gösterim","price":0,"duration":30 } ] }`
- GET `/staff` → personel listesi
  - Response: `{ "items": [ { "id":"uuid","fullName":"" } ] }`
- GET `/statuses` → durum listesi
  - Response: `{ "items": [ { "id":"uuid","displayName":"Planlandı","color":"#22c55e" } ] }`

#### İstatistikler
- GET `/stats?startDate&endDate` → toplamlar ve kırılımlar

#### Hata Formatı
```json
{ "error": { "code": "string", "message": "string" } }
```


