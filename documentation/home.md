### Ana Sayfa (Home) API

`/` ve `/admin` giriş sayfalarında gösterilen ortak veriler.

- Base URL: `/api/home`
- Auth: `Authorization: Bearer <token>` (opsiyonel)

#### Kahraman Alanı (Hero)
- GET `/hero`
  - Response: `{ "title":"","subtitle":"","ctaText":"","ctaHref":"/admin" }`

#### Öne Çıkan İlanlar
- GET `/featured-properties`
  - Query: `limit=6`
  - Response:
    ```json
    {
      "items": [ { "id":"uuid","title":"","price":0,"type":"Satılık","category":"Daire","area":120,"district":"Kadıköy","isFeatured":true } ]
    }
    ```

#### Hızlı İstatistikler
- GET `/quick-stats` → `{ "totalProperties":0, "activeCustomers":0 }`
  - Response:
    ```json
    { "totalProperties": 0, "activeCustomers": 0, "todayAppointments": 0 }
    ```

#### Hata Formatı
```json
{ "error": { "code": "string", "message": "string" } }
```


