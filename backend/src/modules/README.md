# Modüler Yapı Mimarisi

Bu klasör, uygulamanın modüler yapıda organize edilmiş bileşenlerini içerir. Her bir modül, belirli bir iş mantığını veya özelliği temsil eder ve kendi içinde bağımsız olarak çalışacak şekilde tasarlanmıştır.

## Modüler Yapının Avantajları

- **Bakım Kolaylığı**: Her modül kendi içinde bağımsız olduğu için, bir modülde yapılan değişiklikler diğer modülleri etkilemez.
- **Ölçeklenebilirlik**: Yeni özellikler eklemek için yeni modüller oluşturabilirsiniz.
- **Test Edilebilirlik**: Her modül bağımsız olarak test edilebilir.
- **Kod Tekrarını Önleme**: Ortak işlevler paylaşılabilir ve tekrar kullanılabilir.
- **Sorumlulukların Ayrılması**: Her modül belirli bir sorumluluğa sahiptir.

## Modül Yapısı

Her modül aşağıdaki bileşenlerden oluşur:

```
modules/
└── [module-name]/
    ├── dto/                  # Data Transfer Objects
    │   ├── create-dto.ts     # Oluşturma işlemleri için DTO
    │   ├── update-dto.ts     # Güncelleme işlemleri için DTO
    │   └── index.ts          # DTO'ları dışa aktaran dosya
    ├── [module-name].controller.ts  # HTTP isteklerini işleyen controller
    ├── [module-name].service.ts     # İş mantığını içeren servis
    ├── [module-name].repository.ts  # Veritabanı işlemlerini yöneten repository
    ├── [module-name].route.ts       # API rotalarını tanımlayan dosya
    ├── [module-name].interface.ts   # Tip tanımlamaları ve arayüzler
    └── tests/                # Birim testleri
        ├── [module-name].controller.test.ts
        ├── [module-name].service.test.ts
        └── [module-name].repository.test.ts
```

## Dependency Injection

Modüller, bağımlılıkların dışarıdan enjekte edilmesi prensibine göre tasarlanmıştır. Bu, test edilebilirliği artırır ve modüllerin birbirine olan bağımlılığını azaltır.

```typescript
// Örnek: Repository, Service ve Controller arasındaki bağımlılık enjeksiyonu
const repository = new Repository();
const service = new Service(repository);
const controller = new Controller(service);
```

## Modül Ekleme Kılavuzu

Yeni bir modül eklemek için:

1. Modül klasörünü oluşturun: `modules/[module-name]/`
2. Gerekli dosyaları oluşturun: controller, service, repository, route, interface ve dto'lar
3. `modules/index.ts` dosyasına modülün route'ını ekleyin

## Best Practices

- **Tek Sorumluluk İlkesi**: Her sınıf veya dosya tek bir sorumluluğa sahip olmalıdır.
- **Arayüz Kullanımı**: Tip güvenliği için arayüzler (interfaces) kullanın.
- **DTO Kullanımı**: İstek ve yanıt nesnelerini DTO'lar ile modelleyin.
- **Birim Testleri**: Her modül için birim testleri yazın.
- **Bağımlılık Enjeksiyonu**: Sınıflar arasındaki bağımlılıkları constructor üzerinden enjekte edin.
- **Hata Yönetimi**: Tutarlı hata yönetimi için ApiError gibi merkezi bir hata sınıfı kullanın.
- **Dökümantasyon**: Kod içinde JSDoc yorumları kullanarak dökümantasyon sağlayın. 