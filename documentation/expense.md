### Giderler API

`/admin/gider` sayfası için uçlar.

- Base URL: `/api/finance/expenses`
- Auth: `Authorization: Bearer <token)`

#### Listeleme
- GET `/`
  - Query: `startDate?`, `endDate?`, `categoryId?`, `minAmount?`, `maxAmount?`, `page?`, `pageSize?`, `sort?=date|-date|amount|-amount`
  - Response:
    ```json
    {
      "items": [
        {
          "id": "uuid",
          "category": { "id": "uuid", "name": "Pazarlama", "budget": 1000, "color": "#ef4444" },
          "amount": 0,
          "date": "2024-01-01",
          "description": "",
          "paymentMethod": "",
          "type": ""
        }
      ],
      "pagination": { "page": 1, "pageSize": 20, "total": 0 }
    }
    ```

#### Oluşturma
- POST `/` Body: `{ "categoryId":"uuid","amount":0,"date":"2024-01-01","description":"","paymentMethod":"","type":"" }`

#### Güncelleme
- PUT `/:id`

#### Silme
- DELETE `/:id`

#### Kategoriler
- GET `/categories`
  - Response: `{ "items": [ { "id":"uuid","name":"Pazarlama","description":"","color":"#ef4444","budget":1000 } ] }`
- POST `/categories` Body: `{ "name":"","description":"","color":"#xxxxxx","budget":0 }`
- PUT `/categories/:id`
- DELETE `/categories/:id`

#### İstatistikler
- GET `/stats?startDate&endDate` → toplam/aylık/yıllık, kategori bütçe durumu
  - Response:
    ```json
    {
      "totalExpenses": 0,
      "monthlyExpenses": 0,
      "yearlyExpenses": 0,
      "categoryBreakdown": [ { "category": "Pazarlama", "total": 0, "percentage": 0 } ],
      "budgetStatus": [ { "category": "Pazarlama", "spent": 0, "budget": 1000, "remaining": 1000, "percentage": 0 } ]
    }
    ```

#### Hata Formatı
```json
{ "error": { "code": "string", "message": "string" } }
```


