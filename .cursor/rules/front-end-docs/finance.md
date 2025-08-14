## Finance API (Gelir, Gider, Cari)
### Standart Yanıt Yapısı
```json
{ "success": true, "message": "", "data": [], "pagination": { "currentPage":1, "totalPages":1, "totalItems":1, "itemsPerPage":20 }, "timestamp": "2024-01-01T10:00:00Z" }
```

Genel header'lar: `Authorization`, `x-tenant-id`, `Content-Type: application/json`

### Incomes
- Örnek liste yanıtı
```json
{ "success": true, "data": [ { "id":"uuid","category":{"id":"uuid","name":"Komisyon","color":"#22c55e"},"amount":0,"date":"2024-01-01","description":"","paymentMethod":"","source":"Satış" } ], "pagination": {"currentPage":1,"totalPages":1,"totalItems":1,"itemsPerPage":20} }
```
- Base: `http://148.230.104.189:8000/finance/incomes`
- GET `/` query: `startDate,endDate,categoryId,source,minAmount,maxAmount,page,pageSize,sort=date|-date|amount|-amount`
- GET `/:id`
- POST `/` body: `{ "categoryId":"uuid","amount":0,"date":"2024-01-01","description":"","paymentMethod":"","source":"" }`
- PUT `/:id`
- DELETE `/:id`
- Categories: GET/POST/PUT/DELETE `/categories`

### Expenses
- Örnek liste yanıtı
```json
{ "success": true, "data": [ { "id":"uuid","category":{"id":"uuid","name":"Pazarlama","budget":1000,"color":"#ef4444"},"amount":0,"date":"2024-01-01","description":"","paymentMethod":"","type":"" } ], "pagination": {"currentPage":1,"totalPages":1,"totalItems":1,"itemsPerPage":20} }
```
- Base: `http://148.230.104.189:8000/finance/expenses`
- GET `/` query: `startDate,endDate,categoryId,minAmount,maxAmount,page,pageSize,sort=date|-date|amount|-amount`
- CRUD `/:id`
- Categories: GET/POST/PUT/DELETE `/categories`

### Current Accounts
- Örnek detay yanıtı
```json
{ "success": true, "data": { "id":"uuid","customer":{"id":"uuid","fullName":""},"name":"","phone":"","email":"","balance":0,"status":"active","transactions":[{"id":"uuid","txType":"payment","amount":0,"date":"2024-01-01","description":""}],"createdAt":"2024-01-01T09:00:00Z","updatedAt":"2024-01-01T09:00:00Z" } }
```
- Base: `http://148.230.104.189:8000/finance/current-accounts`
- GET `/` query: `customerId,status,minAmount,maxAmount,page,pageSize,sort`
- GET `/:id`
- POST `/` body: `{ "customerId":"uuid","name":"","phone":"","email":"" }`
- PUT `/:id`
- DELETE `/:id`
- Transactions:
  - GET `/:id/transactions` query: `page,pageSize,sort=date|-date|amount|-amount`
  - POST `/:id/transactions` body: `{ "txType":"payment|charge|adjustment","amount":0,"description":"","date":"2024-01-01","reference":"","notes":"" }`
  - DELETE `/transactions/:txId`

