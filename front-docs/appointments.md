## Appointments (Randevular) API
### Standart Yanıt Yapısı
```json
{ "success": true, "message": "", "data": [], "pagination": { "currentPage":1, "totalPages":1, "totalItems":1, "itemsPerPage":20 }, "timestamp": "2024-01-01T10:00:00Z" }
```

- Base URL: `/api/schedule/appointments`
- Header'lar: `Authorization`, `x-tenant-id`, `Content-Type: application/json`

### Listeleme
- GET `/`
- Query: `startDate`, `endDate`, `customerId`, `serviceId`, `staffId`, `statusId`, `timeSlot`, `page`, `pageSize`, `sort=appointmentDate|-appointmentDate`

### Detay
- GET `/:id`
```json
{ "success": true, "data": { "id":"uuid","appointmentDate":"2024-01-01","startTime":"09:00","endTime":"09:30","customer":{"id":"uuid","fullName":""},"service":{"id":"uuid","title":"Gösterim","price":0,"duration":30},"staff":{"id":"uuid","fullName":""},"status":{"id":"uuid","displayName":"Planlandı","color":"#22c55e"},"history":[{"from":"Planlandı","to":"Tamamlandı","changedAt":"2024-01-01T10:00:00Z"}],"notes":"","price":0 } }
```

### Oluşturma
- POST `/`
```json
{ "customerId":"uuid","staffId":"uuid","serviceId":"uuid","statusId":"uuid","appointmentDate":"2024-01-01","startTime":"09:00","endTime":"09:30","notes":"","price":0 }
```

### Güncelleme
- PUT `/:id`

### Silme
- DELETE `/:id`

### Durum Geçmişi
- GET `/:id/history`
- POST `/:id/history`
```json
{ "toStatusId":"uuid", "note":"" }
```
Yanıt: `{ "success": true, "data": { "items": [ {"from_status_id":"uuid","to_status_id":"uuid","changed_at":"2024-01-01T10:00:00Z"} ] } }`

### Yardımcılar
- GET `/helpers/services`
- GET `/helpers/staff`
- GET `/helpers/statuses`

