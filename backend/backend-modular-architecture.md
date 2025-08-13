## Backend Modüler Mimari Kılavuzu

Bu doküman, backend API'lerinin modüler, sınıf tabanlı ve yeniden kullanılabilir bir yapıda nasıl organize edileceğini anlatır. Her modül kendi repository, service, controller ve route katmanlarına sahip olur. Modüle özel tipler `types/` klasöründe tutulur. Ortak yardımcı fonksiyonlar `src/utils/` altındadır.

### Hedefler
- Modüller arası bağımlılıkları minimumda tutmak
- Okunabilir, test edilebilir ve genişletilebilir bir yapı sağlamak
- Tek sorumluluk ilkesi ve katmanlar arası ayrımı korumak

Sequelize ORM kullan. ORM'in yetmediği yerlerde sql sorgusu kullanabilirsin.

Response yapısı olarak utils/ApiResponse.ts kullanmanı istiyorum. Sabit bir response yapısı kullan.

throw error olarak utils/ApiError.ts kullanmanı istiyorum. 

next(error) ile error handler'a yönlendirebilirsin. 

### Klasör Yapısı
```bash
src/
  modules/
    user/
      types/
        user.types.ts
      user.repository.ts
      user.service.ts
      user.controller.ts
      user.route.ts
    business-auth/
      business-auth.repository.ts
      business-auth.service.ts
      business-auth.controller.ts
      business-auth.route.ts
      business-auth.interface.ts
    index.ts            # Tüm modül router'larını birleştirir
  utils/
    ApiError.ts
    ApiResponse.ts
    hashUtils.ts
    jwtUtils.ts
    logUtils.ts
```

### Katman Sorumlulukları
- Repository: Veri erişimi (Sequelize modelleriyle CRUD, sorgular, transaction kullanımı)
- Service: İş kuralları, validasyon/koşullar, transaction yönetimi (gerekirse repository ile birlikte)
- Controller: HTTP katmanı, request/response dönüştürme, `ApiResponse` ve hata yayılımı
- Route: Express router tanımları, controller metotlarını uç noktalara bağlama
- Types: Modüle özel interface/type tanımları (DTO, payload, filtreler, response tipleri)

### Örnek Modül İskeleti (User)
```bash
modules/user/
  types/user.types.ts      # IUser, CreateUserDTO, UpdateUserDTO, UserFilters
  user.repository.ts       # UserRepository
  user.service.ts          # UserService
  user.controller.ts       # UserController
  user.route.ts            # /api/v1/users
```

#### user.types.ts
```ts
export interface CreateUserDTO { tenantId: string; username: string; email: string; password?: string }
export interface UpdateUserDTO { firstName?: string; lastName?: string; phone?: string; isActive?: boolean }
export interface UserFilters { tenantId: string; search?: string; isActive?: boolean }
```

#### user.repository.ts
```ts
export class UserRepository {
  async findById(id: string) { /* Sequelize ile auth.users */ }
  async findAll(filters: UserFilters) { /* listeleme + sayfalama */ }
  async create(data: CreateUserDTO) { /* insert */ }
  async update(id: string, data: UpdateUserDTO) { /* update */ }
  async remove(id: string) { /* soft/hard delete stratejisi */ }
}
```

#### user.service.ts
```ts
import { ApiError } from '../../utils/ApiError';
export class UserService {
  constructor(private readonly repo: UserRepository) {}
  async get(id: string) { return this.repo.findById(id) }
  async list(filters: UserFilters) { return this.repo.findAll(filters) }
  async create(dto: CreateUserDTO) { return this.repo.create(dto) }
  async update(id: string, dto: UpdateUserDTO) { return this.repo.update(id, dto) }
  async remove(id: string) { return this.repo.remove(id) }
}
```

#### user.controller.ts
```ts
import { ApiResponse } from '../../utils/ApiResponse';
export class UserController {
  constructor(private readonly service: UserService) {}
  list = async (req, res, next) => { const data = await this.service.list(req.query); return res.json(ApiResponse.success(data)) }
  get = async (req, res, next) => { const data = await this.service.get(req.params.id); return res.json(ApiResponse.success(data)) }
  create = async (req, res, next) => { const data = await this.service.create(req.body); return res.status(201).json(ApiResponse.created(data)) }
  update = async (req, res, next) => { const data = await this.service.update(req.params.id, req.body); return res.json(ApiResponse.success(data)) }
  remove = async (req, res, next) => { await this.service.remove(req.params.id); return res.json(ApiResponse.success(true)) }
}
```

#### user.route.ts
```ts
import { Router } from 'express';
const router = Router();
// const controller = new UserController(new UserService(new UserRepository()));
router.get('/', /* controller.list */);
router.get('/:id', /* controller.get */);
router.post('/', /* controller.create */);
router.put('/:id', /* controller.update */);
router.delete('/:id', /* controller.remove */);
export default router;
```

### Modül Router’larının Birleştirilmesi
`src/modules/index.ts` tüm modül router’larını tek bir router altında toplar ve `app.ts` içinde mount edilir.
```ts
import { Router } from 'express';
import userRouter from './user/user.route';
import businessAuthRouter from './business-auth/business-auth.route';
const router = Router();
router.use('/api/v1/users', userRouter);
router.use('/api/v1/auth', businessAuthRouter);
export default router;
```

### Utils Kullanımı
- `ApiError.ts`: Hata oluşturma/taşıma (HTTP status, message, details)
- `ApiResponse.ts`: Tutarlı başarı/olay yanıtları
- `hashUtils.ts`: Parola ve benzeri özetleme işlemleri
- `jwtUtils.ts`: Token üretme/doğrulama
- `logUtils.ts`: Log yönetimi ve temizlik işleri

### İsimlendirme Kuralları
- Dosyalar: `kebab-case` (ör. `user.repository.ts`)
- Sınıflar: `PascalCase` (ör. `UserService`)
- Tipler/Interface’ler: `PascalCase` (ör. `CreateUserDTO`)
- Router yolları: `/api/v1/<resource>` (çoğul isimler)

### Transaction ve Hata Yönetimi
- Kritik işlemleri tek transaction altında toplayın (ör. birden fazla tablo güncellemesi)
- Controller katmanında try/catch ile `next(ApiError.from(err))` şeklinde hata yayılımı yapın
- Service katmanında domain kurallarını ihlalde `ApiError.badRequest(...)` vb. üretin

### Notlar
- NOT NULL dışında ek validation’lar service katmanına bırakılabilir
- Ortak tipler modüller arasında paylaşılacaksa modül dışı `src/types/` altında toplanabilir


