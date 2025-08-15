### Cari Hesaplar API

`/admin/cari` sayfası için uçlar.

- Base URL: `/api/finance/current-accounts`
- Auth: `Authorization: Bearer <token>`

#### Listeleme
- GET `/`
  - Query: `customerId?`, `type?=receivable|payable`, `status?=active|paid|overdue|cancelled`, `minAmount?`, `maxAmount?`, `dueDateStart?`, `dueDateEnd?`, `page?`, `pageSize?`, `sort?`
  - Response:
    ```json
    {
      "items": [
        {
          "id": "uuid",
          "customer": { "id": "uuid", "fullName": "" },
          "name": "",
          "phone": "",
          "email": "",
          "balance": 0,
          "status": "active",
          "lastTransactionAt": "2024-01-01T10:00:00Z"
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
      "customer": { "id": "uuid", "fullName": "" },
      "name": "",
      "phone": "",
      "email": "",
      "balance": 0,
      "status": "active",
      "transactions": [
        { "id": "uuid", "txType": "payment", "amount": 0, "date": "2024-01-01", "reference": "", "notes": "" }
      ],
      "createdAt": "2024-01-01T09:00:00Z",
      "updatedAt": "2024-01-01T09:00:00Z"
    }
    ```

#### Oluşturma
- POST `/` Body: `{ "customerId":"uuid","name":"","phone":"","email":"" }`

#### Güncelleme
- PUT `/:id`

#### Silme
- DELETE `/:id`

#### Hareketler
- GET `/:id/transactions`
  - Query: `page?`, `pageSize?`, `sort?=date|-date|amount|-amount`
  - Response:
    ```json
    {
      "items": [ { "id": "uuid", "txType": "payment", "amount": 0, "date": "2024-01-01", "description": "" } ],
      "pagination": { "page": 1, "pageSize": 20, "total": 0 }
    }
    ```
- POST `/:id/transactions` Body: `{ "txType":"payment|charge|adjustment", "amount":0, "description":"", "date":"2024-01-01", "reference":"", "notes":"" }`
- DELETE `/transactions/:txId`

#### İstatistikler
- GET `/stats` → toplam alacak/borç, vade gecikmeleri, müşteri kırılımları

#### Hata Formatı
```json
{ "error": { "code": "string", "message": "string" } }
```


