### Müşteriler (CRM) API

`/admin/musteriler` sayfası için müşteri yönetimi uçları.

- Base URL: `/api/crm/customers`
- Auth: `Authorization: Bearer <token>`

#### Listeleme
- GET `/`
  - Query: `search?`, `isActive?=true|false`, `assignedAgentId?`, `preferredType?`, `preferredCategory?`, `page?`, `pageSize?`, `sort?`
  - Response:
    ```json
    {
      "items": [
        {
          "id": "uuid",
          "fullName": "",
          "email": "",
          "phone": "",
          "address": "",
          "budget": 0,
          "preferredType": "Satılık",
          "preferredCategory": "Daire",
          "minArea": 0,
          "maxArea": 120,
          "minRoomsLabel": "3+1",
          "isSeriousBuyer": false,
          "customerNotes": "",
          "assignedAgent": { "id": "uuid", "fullName": "" },
          "preferredDistricts": ["Kadıköy"],
          "requirements": ["otopark"],
          "registrationDate": "2024-01-01T10:00:00Z",
          "lastContact": "2024-01-05T12:00:00Z",
          "isActive": true
        }
      ],
      "pagination": { "page": 1, "pageSize": 20, "total": 1 }
    }
    ```

#### Detay
- GET `/:id`
  - Response:
    ```json
    {
      "id": "uuid",
      "fullName": "",
      "email": "",
      "phone": "",
      "address": "",
      "dateOfBirth": "1990-01-01",
      "profession": "",
      "budget": 0,
      "preferredType": "Satılık",
      "preferredCategory": "Daire",
      "minArea": 0,
      "maxArea": 120,
      "minRoomsLabel": "3+1",
      "isSeriousBuyer": false,
      "customerNotes": "",
      "assignedAgent": { "id": "uuid", "fullName": "" },
      "preferredDistricts": ["Kadıköy"],
      "requirements": [ {"id": "uuid", "name": "otopark"} ],
      "viewedProperties": ["uuid"],
      "registrationDate": "2024-01-01T10:00:00Z",
      "lastContact": "2024-01-05T12:00:00Z",
      "isActive": true
    }
    ```

#### Oluşturma
- POST `/`
  - Body (örnek):
    ```json
    {
      "fullName":"",
      "email":"",
      "phone":"",
      "address":"",
      "dateOfBirth":"1990-01-01",
      "profession":"",
      "budget":0,
      "preferredType":"Satılık",
      "preferredCategory":"Daire",
      "minArea":0,
      "maxArea":120,
      "minRoomsLabel":"3+1",
      "isSeriousBuyer":false,
      "customerNotes":"",
      "assignedAgentId":"uuid",
      "preferredDistricts":["Kadıköy","Beşiktaş"],
      "requirements":["otopark","asansör"]
    }
    ```

#### Güncelleme
- PUT `/:id` (body: POST ile aynı alanlar, kısmi kabul edilebilir)

#### Silme
- DELETE `/:id` (soft delete)

#### Tercihler
- GET `/:id/preferences` → `{ "preferredDistricts":[], "requirements":[{"id":"uuid","name":""}] }`
  - Response:
    ```json
    {
      "preferredDistricts": ["Kadıköy","Beşiktaş"],
      "requirements": [ {"id":"uuid","name":"asansör"} ]
    }
    ```
- PUT `/:id/preferences` → Body: `{ "preferredDistricts":[], "requirementIds":[] }`

#### Görüntülenen İlanlar
- GET `/:id/viewed-properties`
  - Response:
    ```json
    {
      "items": [ { "propertyId": "uuid", "firstViewedAt": "2024-01-01T10:00:00Z", "lastViewedAt": "2024-01-02T11:00:00Z", "viewsCount": 3 } ]
    }
    ```
- POST `/:id/viewed-properties` Body: `{ "propertyId":"uuid" }`
- DELETE `/:id/viewed-properties/:propertyId`

#### İstatistikler
- GET `/stats`
  - Response:
    ```json
    {
      "totalCustomers": 0,
      "activeCustomers": 0,
      "newCustomersThisMonth": 0,
      "totalBudget": 0,
      "averageBudget": 0,
      "topBudgetCustomer": { "id": "uuid", "fullName": "" }
    }
    ```

#### Hata Formatı
```json
{ "error": { "code": "string", "message": "string", "fields": {} } }
```


