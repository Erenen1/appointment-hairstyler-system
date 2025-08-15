### İlan Analitikleri API

`/admin/ilan-analitikleri` sayfası için analitik veri uçları.

- Base URL: `/api/analytics/properties`
- Ek olarak liste verileri için: `/api/listings/properties`
- Auth: `Authorization: Bearer <token>`

#### Filtreli Liste (Tablo)
- GET `/list`
  - Query: `type[]?`, `category[]?`, `priceMin?`, `priceMax?`, `areaMin?`, `areaMax?`, `district[]?`, `rooms[]?`, `features[]?`, `status[]?`, `page?`, `pageSize?`, `sort?=views|-views|clicks|-clicks|price|-price`
  - Response:
    ```json
    {
      "items": [
        {
          "id": "uuid",
          "title": "",
          "price": 0,
          "type": "Satılık",
          "category": "Daire",
          "area": 0,
          "rooms": "3+1",
          "district": "Kadıköy",
          "views": 0,
          "clicks": 0,
          "isFeatured": false,
          "status": "active",
          "createdAt": "2024-01-01T10:00:00Z"
        }
      ],
      "pagination": { "page": 1, "pageSize": 20, "total": 0 }
    }
    ```

#### Özet İstatistikler
- GET `/stats`
  - Query: `range=7d|30d|90d`, `groupBy?=day|week|month`
  - Response:
    ```json
    {
      "totalProperties": 0,
      "activeProperties": 0,
      "soldProperties": 0,
      "rentedProperties": 0,
      "totals": { "views": 0, "clicks": 0 },
      "avgPrice": 0,
      "distributions": {
        "type": { "Satılık": 0, "Kiralık": 0 },
        "category": { "Daire": 0 }
      }
    }
    ```

#### Zaman Serileri
- GET `/timeseries`
  - Query: `metric=views|clicks|favorites`, `range=30d`, `groupBy=day|week|month`
  - Response:
    ```json
    {
      "labels": ["2024-01-01"],
      "datasets": [
        { "label": "views", "data": [0] },
        { "label": "clicks", "data": [0] }
      ]
    }
    ```

#### İlan Etkinlikleri
- GET `/properties/:id/events` Query: `type?=view|click|favorite|share|inquiry`, `range?`
- POST `/properties/:id/events` Body: `{ "eventType":"view", "metadata": {} }`
  - Response:
    ```json
    { "id":"uuid", "eventType":"view", "occurredAt":"2024-01-01T10:00:00Z" }
    ```

#### Hata Formatı
```json
{ "error": { "code": "string", "message": "string" } }
```


