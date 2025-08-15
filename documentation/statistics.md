### Genel İstatistikler API

`/admin/istatistikler` sayfası için metrik uçları.

- Base URL: `/api/analytics`
- Auth: `Authorization: Bearer <token>`

#### Özet
- GET `/summary`
  - Response:
    ```json
    {
      "totalProperties": 0,
      "totalViews": 0,
      "totalClicks": 0,
      "avgPrice": 0,
      "byCategory": [{ "category": "Daire", "count": 0 }]
    }
    ```

#### Zaman Serileri
- GET `/timeseries`
  - Query: `metric=views|clicks|avgPrice|newCustomers`, `range=30d`, `groupBy=day|week|month`
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

#### Dağılım Grafikleri
- GET `/breakdowns`
  - Query: `dimension=category|type|city|district`
  - Response:
    ```json
    {
      "labels": ["Daire"],
      "datasets": [
        { "label": "count", "data": [10], "backgroundColor": ["#eee"] }
      ]
    }
    ```

#### Hata Formatı
```json
{ "error": { "code": "string", "message": "string" } }
```


