# Swagger Modüler Yapısı

Bu proje swagger dokümantasyonunu modüler bir yapıda organize eder. Her API endpoint grubu için ayrı schema ve path dosyaları bulunur.

## Authentication

API **JWT Bearer Token** authentication kullanır. Session-based authentication'dan JWT'ye geçiş yapılmıştır.

### JWT Token Kullanımı

1. **Login**: `/auth/admin/login` endpoint'ine POST request gönderin
2. **Token Alma**: Response'da `data.token` field'ında JWT token alırsınız
3. **Token Kullanımı**: Korumalı endpoint'lere erişim için Authorization header'ı ekleyin:
   ```
   Authorization: Bearer <your-jwt-token>
   ```
4. **Token Süresi**: Token'lar 24 saat geçerlidir
5. **Logout**: Client-side'da token'ı silin (server-side session yok)

### Swagger UI'da Authentication

Swagger UI'da "Authorize" butonuna tıklayın ve token'ınızı şu formatta girin:
```
Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

## Dizin Yapısı

```
swagger/
├── schemas/           # Schema tanımları
│   ├── common.ts      # Ortak schema'lar (ErrorResponse, Pagination vb.)
│   ├── auth.ts        # Authentication schema'ları (JWT token yapısı)
│   ├── admin.ts       # Admin schema'ları
│   ├── appointment.ts # Randevu schema'ları
│   ├── customer.ts    # Müşteri schema'ları
│   ├── staff.ts       # Personel schema'ları
│   ├── service.ts     # Hizmet schema'ları
│   ├── content.ts     # İçerik schema'ları
│   ├── contact.ts     # İletişim schema'ları
│   ├── health.ts      # Sağlık kontrol schema'ları
│   └── dashboard.ts   # Dashboard schema'ları
├── paths/             # API path tanımları
│   ├── auth.ts        # Authentication endpoint'leri (JWT login/logout)
│   ├── admin.ts       # Admin endpoint'leri
│   ├── appointment.ts # Randevu endpoint'leri
│   ├── customer.ts    # Müşteri endpoint'leri
│   ├── staff.ts       # Personel endpoint'leri
│   ├── service.ts     # Hizmet endpoint'leri
│   ├── content.ts     # İçerik endpoint'leri
│   ├── contact.ts     # İletişim endpoint'leri
│   ├── health.ts      # Sağlık kontrol endpoint'leri
│   └── dashboard.ts   # Dashboard endpoint'leri
├── index.ts           # Ana konfigürasyon dosyası
└── README.md          # Bu dosya
```

## Security Schemes

### Bearer Authentication
```typescript
bearerAuth: {
  type: 'http',
  scheme: 'bearer',
  bearerFormat: 'JWT',
  description: 'JWT Bearer token authentication. Format: Bearer <token>'
}
```

### API Key Authentication (Super Admin)
```typescript
apiKeyAuth: {
  type: 'apiKey',
  in: 'header',
  name: 'X-API-KEY',
  description: 'API Key for super admin operations'
}
```

## Yeni API Endpoint'i Ekleme

### 1. Schema Dosyası Oluşturma

`schemas/` dizininde yeni bir TypeScript dosyası oluşturun:

```typescript
// schemas/example.ts
export const exampleSchemas = {
  ExampleModel: {
    type: 'object',
    properties: {
      id: { type: 'string', example: '1' }, // UUID string format
      name: { type: 'string', example: 'Örnek' },
      createdAt: { type: 'string', format: 'date-time' }
    }
  },
  CreateExampleRequest: {
    type: 'object',
    required: ['name'],
    properties: {
      name: { type: 'string', minLength: 2, maxLength: 100 }
    }
  }
};
```

### 2. Path Dosyası Oluşturma

`paths/` dizininde yeni bir TypeScript dosyası oluşturun:

```typescript
// paths/example.ts
export const examplePaths = {
  '/examples': {
    get: {
      tags: ['Examples'],
      summary: 'Örnekleri listele',
      security: [{ bearerAuth: [] }], // JWT authentication gerekli
      responses: {
        200: {
          description: 'Başarılı',
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  success: { type: 'boolean', example: true },
                  data: {
                    type: 'array',
                    items: { $ref: '#/components/schemas/ExampleModel' }
                  }
                }
              }
            }
          }
        },
        401: { $ref: '#/components/responses/UnauthorizedError' }
      }
    },
    post: {
      tags: ['Examples'],
      summary: 'Yeni örnek oluştur',
      security: [{ bearerAuth: [] }], // JWT authentication gerekli
      requestBody: {
        required: true,
        content: {
          'application/json': {
            schema: { $ref: '#/components/schemas/CreateExampleRequest' }
          }
        }
      },
      responses: {
        201: {
          description: 'Başarıyla oluşturuldu',
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  success: { type: 'boolean', example: true },
                  data: { $ref: '#/components/schemas/ExampleModel' }
                }
              }
            }
          }
        },
        401: { $ref: '#/components/responses/UnauthorizedError' }
      }
    }
  }
};
```

### 3. Ana Index Dosyasını Güncelleme

`index.ts` dosyasında yeni schema ve path'leri import edin:

```typescript
// Yeni import'ları ekleyin
import { exampleSchemas } from './schemas/example';
import { examplePaths } from './paths/example';

// allSchemas objesine ekleyin
export const allSchemas = {
  // ... mevcut schema'lar
  ...exampleSchemas
};

// allPaths objesine ekleyin  
export const allPaths = {
  // ... mevcut path'ler
  ...examplePaths
};

// Tag'lere ekleyin
const tags = [
  // ... mevcut tag'ler
  { name: 'Examples', description: 'Örnek yönetimi' }
];
```

## JWT Token Structure

JWT token'ın payload yapısı:

```typescript
{
  id: string,          // User ID
  email: string,       // User email
  userType: 'admin',   // User type (currently only admin)
  fullName: string,    // User full name
  iat: number,         // Issued at timestamp
  exp: number          // Expiration timestamp (24h)
}
```

## Swagger Dokümantasyonunu Görüntüleme

API çalıştırıldıktan sonra aşağıdaki URL'den swagger dokümantasyonunu görüntüleyebilirsiniz:

```
http://localhost:3000/api-docs
```

## Schema Referansları

Schema'lar arasında referans vermek için `$ref` kullanın:

```typescript
{
  customer: { $ref: '#/components/schemas/Customer' }
}
```

## Ortak Responses

Sık kullanılan response'lar `common.ts` dosyasında tanımlanmıştır:

- `UnauthorizedError` - 401 hatası (JWT token geçersiz/yok)
- `ForbiddenError` - 403 hatası  
- `ValidationError` - 400 doğrulama hatası
- `InternalError` - 500 sunucu hatası

Bu response'ları şu şekilde kullanabilirsiniz:

```typescript
responses: {
  401: { $ref: '#/components/responses/UnauthorizedError' },
  500: { $ref: '#/components/responses/InternalError' }
}
```

## Best Practices

1. **JWT Authentication**: Tüm korumalı endpoint'lerde `security: [{ bearerAuth: [] }]` ekleyin
2. **Tutarlı Naming**: Schema ve path isimlendirmelerinde tutarlı olun
3. **Açıklayıcı Descriptions**: Her endpoint ve schema için açıklayıcı açıklamalar yazın
4. **Example Values**: Tüm property'ler için örnek değerler sağlayın
5. **Validation Rules**: Gerekli validation kurallarını (minLength, maxLength vb.) belirtin
6. **Error Handling**: Tüm olası hata durumları için response tanımları yapın
7. **Token Expiry**: 401 response'ları için "Token süresi dolmuş" durumunu belirtin

## API Versiyonlama

API versiyonları URL'de belirtilir:
- v1: `/api/v1/*`
- v2: `/api/v2/*` (gelecekte)

Yeni version eklerken schemas ve paths'i ayrı dizinlerde organize edin. 