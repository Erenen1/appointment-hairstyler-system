### Admin Dashboard API

Bu doküman `/admin` gösterge panelinde kullanılan verileri sağlayan endpointleri tanımlar.

 - Base URL: `/api/dashboard`
 - Auth: `Authorization: Bearer <token>`

#### Özet Kartları
- GET `/summary`
  - Query: `range=7d|30d|90d|ytd` (default: 30d)
  - Response:
    ```json
    {
      "totals": {
        "totalProperties": 0,
        "activeProperties": 0,
        "totalCustomers": 0
      },
      "appointments": {
        "today": 0,
        "thisWeek": 0,
        "thisMonth": 0
      },
      "finance": {
        "income": 0,
        "expense": 0,
        "net": 0
      },
      "engagement": {
        "whatsappActiveChats": 0,
        "topProperty": {
          "id": "uuid",
          "title": "string",
          "views": 0,
          "clicks": 0
        }
      },
      "range": "30d",
      "generatedAt": "2024-01-01T10:00:00Z"
    }
    ```

#### En Popüler İlanlar
- GET `/top-properties`
  - Query: `limit=5`, `range=30d`, `sort=views|clicks|favorites`
  - Response:
    ```json
    {
      "items": [
        {
          "id": "uuid",
          "title": "string",
          "price": 0,
          "type": "Satılık",
          "category": "Daire",
          "area": 120,
          "views": 1200,
          "clicks": 240,
          "isFeatured": true,
          "status": "active",
          "createdAt": "2024-01-01T10:00:00Z"
        }
      ],
      "total": 1
    }
    ```

#### Yaklaşan Randevular
- GET `/upcoming-appointments`
  - Query: `limit=5`, `from=today`, `staffId?`
  - Response:
    ```json
    {
      "items": [
        {
          "id": "uuid",
          "appointmentDate": "2024-01-02",
          "startTime": "09:00",
          "endTime": "09:30",
          "customer": { "id": "uuid", "fullName": "string", "phone": "" },
          "staff": { "id": "uuid", "fullName": "string" },
          "service": { "id": "uuid", "title": "Gösterim", "duration": 30 },
          "status": { "id": "uuid", "displayName": "Planlandı", "color": "#22c55e" }
        }
      ],
      "total": 1
    }
    ```

#### Finansal Özet
- GET `/financial-overview`
  - Query: `range=30d`
  - Response:
    ```json
    {
      "incomeTotal": 0,
      "expenseTotal": 0,
      "net": 0,
      "byCategory": [
        { "category": "Kira", "total": 0 },
        { "category": "Komisyon", "total": 0 }
      ],
      "byMonth": [
        { "month": "2024-01", "income": 0, "expense": 0, "net": 0 }
      ]
    }
    ```

#### Hata Formatı
```json
{ "error": { "code": "string", "message": "string", "details": {} } }
```


