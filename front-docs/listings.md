## Listings (İlanlar) API

- Base URL: `/api/listings/properties`
- Header'lar: `Authorization`, `Content-Type: application/json`

### Standart Yanıt Yapısı
```json
{ "success": true, "message": "", "data": [], "pagination": { "currentPage":1, "totalPages":1, "totalItems":1, "itemsPerPage":20 }, "timestamp": "2024-01-01T10:00:00Z" }
```

### Listeleme
- GET `/`
- Query: `type[]`, `category[]`, `priceMin`, `priceMax`, `areaMin`, `areaMax`, `status[]`, `page`, `pageSize`, `sort=views|-views|clicks|-clicks|price|-price|createdAt|-createdAt`

### Detay
- GET `/:id`
```json
{
  "success": true,
  "data": {
    "id":"uuid","title":"","price":0,"type":"Satılık","category":"Daire",
    "area":120,"rooms_label":"3+1","district_name":"Kadıköy","status":"active",
    "images":[{"id":"uuid","url":"/uploads/a.jpg","alt":"","sortOrder":0}]
  }
}
```

### Oluşturma
- POST `/`
```json
{ "title":"","price":0,"type":"Satılık","category":"Daire","area":120,"roomsLabel":"3+1","districtName":"Kadıköy" }
```

### Güncelleme
- PUT `/:id`

### Silme
- DELETE `/:id`

### Görseller
- POST `/:id/images`
```json
{ "images": [ { "url":"/uploads/a.jpg", "alt":"", "sortOrder":0 } ] }
```

### Etiketler
- PUT `/:id/tags`
```json
{ "tags": ["teras","deniz manzarası"] }
```
Yanıt: `{ "success": true, "data": { "ok": true } }`

### Özellikler (amenities)
- PUT `/:id/amenities`
```json
{ "names": ["otopark","asansör"] }
```
Yanıt: `{ "success": true, "data": { "ok": true } }`

### Etkinlikler
- GET `/:id/events?type=view|click|favorite|share|inquiry`
- POST `/:id/events`
```json
{ "eventType":"view", "metadata": {"source":"listing-page"} }
```
Yanıt:
```json
{ "success": true, "message": "Kayıt başarıyla oluşturuldu", "data": { "id":"uuid", "eventType":"view", "occurredAt":"2024-01-01T10:00:00Z" } }
```

