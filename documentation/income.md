### Gelirler API

`/admin/gelir` sayfası için uçlar.

- Base URL: `/api/finance/incomes`
- Auth: `Authorization: Bearer <token>`

#### Listeleme
- GET `/`
  - Query: `startDate?`, `endDate?`, `categoryId?`, `source?`, `minAmount?`, `maxAmount?`, `page?`, `pageSize?`, `sort?=date|-date|amount|-amount`
  - Response:
    ```json
    {
      "items": [
        {
          "id": "uuid",
          "category": { "id": "uuid", "name": "Komisyon", "color": "#22c55e" },
          "amount": 0,
          "date": "2024-01-01",
          "description": "",
          "paymentMethod": "",
          "source": "Satış"
        }
      ],
      "pagination": { "page": 1, "pageSize": 20, "total": 0 }
    }
    ```

#### Oluşturma
- POST `/` Body: `{ "categoryId":"uuid","amount":0,"date":"2024-01-01","description":"","paymentMethod":"","source":"" }`

#### Güncelleme
- PUT `/:id`

#### Silme
- DELETE `/:id`

#### Kategoriler
- GET `/categories`
  - Response: `{ "items": [ { "id":"uuid","name":"Komisyon","description":"","color":"#22c55e" } ] }`
- POST `/categories` Body: `{ "name":"","description":"","color":"#xxxxxx" }`
- PUT `/categories/:id`
- DELETE `/categories/:id`

#### İstatistikler
- GET `/stats?startDate&endDate` → toplam, aylık, yıllık ve kırılımlar

#### Hata Formatı
```json
{ "error": { "code": "string", "message": "string" } }
```


