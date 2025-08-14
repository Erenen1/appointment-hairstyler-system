## CRM Customers API

- Base URL: `http://148.230.104.189:8000/crm/customers`
- Header'lar: `Authorization: Bearer <token>`, `x-tenant-id: <uuid>`, `Content-Type: application/json`

### Standart Yanıt Yapısı

```json
{
  "success": true,
  "message": "",
  "data": [{ "id": "uuid" }],
  "pagination": {
    "currentPage": 1,
    "totalPages": 1,
    "totalItems": 1,
    "itemsPerPage": 20
  },
  "timestamp": "2024-01-01T10:00:00Z"
}
```

### Listeleme

- GET `/`
- Query (hepsi opsiyonel): `search, isActive, assignedAgentId, preferredType, preferredCategory, page=1, pageSize=20, sort=created_at:DESC`
- Response

```json
{
  "success": true,
  "message": "Kayıtlar başarıyla getirildi",
  "data": [
    {
      "id": "uuid",
      "full_name": "string",
      "email": null,
      "phone": null,
      "address": null,
      "budget": null,
      "preferred_type": null,
      "preferred_category": null,
      "min_rooms_label": null,
      "is_active": true,
      "registration_date": "2024-01-01T10:00:00Z"
    }
  ],
  "pagination": {
    "currentPage": 1,
    "totalPages": 1,
    "totalItems": 1,
    "itemsPerPage": 20
  }
}
```

### Detay

- GET `/:id`

```json
{
  "success": true,
  "message": "Kayıt başarıyla getirildi",
  "data": {
    "id": "uuid",
    "full_name": "string",
    "email": "string",
    "phone": "string",
    "address": "string",
    "date_of_birth": "1990-01-01",
    "profession": "string",
    "budget": 0,
    "preferred_type": "Satılık",
    "preferred_category": "Daire",
    "min_area": 0,
    "max_area": 120,
    "min_rooms_label": "3+1",
    "is_serious_buyer": false,
    "customer_notes": "",
    "assigned_agent_id": "uuid",
    "preferredDistricts": ["Kadıköy"],
    "requirements": [{ "id": "uuid", "name": "otopark" }],
    "viewedProperties": ["uuid"],
    "registration_date": "2024-01-01T10:00:00Z",
    "last_contact": null,
    "is_active": true
  }
}
```

### Oluşturma

- POST `/`

```json
{
  "fullName": "string",
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
  "assignedAgentId": "uuid",
  "preferredDistricts": ["Kadıköy", "Beşiktaş"],
  "requirements": ["otopark", "asansör"]
}
```

### Güncelleme

- PUT `/:id` (POST ile aynı alanlardan kısmi)

### Silme

- DELETE `/:id`

### Tercihler

- GET `/:id/preferences`
- PUT `/:id/preferences`

```json
{ "preferredDistricts": ["Kadıköy"], "requirementIds": ["uuid"] }
```

Yanıt:

```json
{
  "success": true,
  "message": "Kayıt başarıyla güncellendi",
  "data": {
    "preferredDistricts": ["Kadıköy"],
    "requirements": [{ "id": "uuid", "name": "asansör" }]
  }
}
```

### Görüntülenen İlanlar

- GET `/:id/viewed-properties`

```json
{
  "success": true,
  "message": "Kayıt başarıyla getirildi",
  "data": {
    "items": [
      {
        "propertyId": "uuid",
        "firstViewedAt": "2024-01-01T10:00:00Z",
        "lastViewedAt": "2024-01-02T10:00:00Z",
        "viewsCount": 3
      }
    ]
  }
}
```

- POST `/:id/viewed-properties`

```json
{ "propertyId": "uuid" }
```

Yanıt: `{ "success": true, "data": { "ok": true } }`

- DELETE `/:id/viewed-properties/:propertyId`
  Yanıt: `{ "success": true, "data": { "ok": true } }`

### İstatistikler

- GET `/stats/summary`

```json
{
  "success": true,
  "data": {
    "totalCustomers": 0,
    "activeCustomers": 0,
    "newCustomersThisMonth": 0,
    "totalBudget": 0,
    "averageBudget": 0,
    "topBudgetCustomer": { "id": "uuid", "fullName": "" }
  }
}
```

### Fetch örneği

```ts
async function listCustomers(token: string, tenantId: string, p = 1) {
  const res = await fetch(
    `http://148.230.104.189:8000/crm/customers?page=${p}`,
    { headers: { Authorization: `Bearer ${token}`, "x-tenant-id": tenantId } }
  );
  if (!res.ok) throw await res.json();
  return res.json();
}
```
