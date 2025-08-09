# Features Directory Structure

Bu dizin, uygulamanın ana özelliklerini (features) organize etmek için kullanılır. Her özellik kendi klasöründe bulunur ve kendi bileşenlerini, tiplerini ve mantığını içerir.

## Mevcut Özellikler

### 1. Income (Gelir) - `/income`

- **Açıklama**: Gelir yönetimi ve takibi
- **Ana Bileşenler**: `IncomePage`, `IncomeForm`, `IncomeList`, `IncomeStats`
- **Tipler**: `Income`, `IncomeCategory`, `IncomeFilter`, `IncomeStats`

### 2. Expense (Gider) - `/expense`

- **Açıklama**: Gider yönetimi ve takibi
- **Ana Bileşenler**: `ExpensePage`, `ExpenseForm`, `ExpenseList`, `ExpenseStats`
- **Tipler**: `Expense`, `ExpenseCategory`, `ExpenseFilter`, `ExpenseStats`

### 3. Auth (Kimlik Doğrulama) - `/auth`

- **Açıklama**: Kullanıcı girişi ve kimlik doğrulama
- **Ana Bileşenler**: `LoginPage`, `LoginForm`, `AuthGuard`, `useAuth`
- **Tipler**: `User`, `LoginCredentials`, `AuthState`, `AuthResponse`

### 4. Customers (Müşteriler) - `/customers`

- **Açıklama**: Müşteri yönetimi ve bilgileri
- **Ana Bileşenler**: `CustomersPage`, `CustomerForm`, `CustomerList`, `CustomerDetails`
- **Tipler**: `Customer`, `CustomerFilter`, `CustomerStats`

### 5. Appointments (Randevular) - `/appointments`

- **Açıklama**: Randevu yönetimi ve takvimi
- **Ana Bileşenler**: `AppointmentsPage`, `AppointmentForm`, `AppointmentList`, `AppointmentCalendar`
- **Tipler**: `Appointment`, `AppointmentStatus`, `AppointmentFilter`, `AppointmentStats`

### 6. Services (Hizmetler) - `/services`

- **Açıklama**: Hizmet yönetimi ve kategorileri
- **Ana Bileşenler**: `ServicesPage`, `ServiceForm`, `ServiceList`, `ServiceCategories`
- **Tipler**: `Service`, `ServiceCategory`, `ServiceFilter`, `ServiceStats`

### 7. Current Accounts (Cari Hesaplar) - `/current-accounts`

- **Açıklama**: Cari hesap yönetimi ve takibi
- **Ana Bileşenler**: `CurrentAccountsPage`, `CurrentAccountForm`, `CurrentAccountList`, `CurrentAccountDetails`
- **Tipler**: `CurrentAccount`, `CurrentAccountTransaction`, `CurrentAccountFilter`, `CurrentAccountStats`

### 8. Bills (Faturalar) - `/bills`

- **Açıklama**: Fatura yönetimi ve oluşturma
- **Ana Bileşenler**: `BillsPage`, `BillForm`, `BillList`, `BillDetails`
- **Tipler**: `Bill`, `BillItem`, `BillFilter`, `BillStats`

### 9. Admin (Yönetim) - `/admin`

- **Açıklama**: Yönetici paneli bileşenleri ve yönetim araçları
- **Ana Bileşenler**: `Sidebar` ve diğer yönetim bileşenleri
- **Yapı**: `components/` klasörü altında yönetim bileşenleri

### 10. Calendar (Takvim) - `/calendar`

- **Açıklama**: Takvim görünümü ve etkinlik yönetimi
- **Ana Bileşenler**: `page.tsx` (ana takvim sayfası)
- **Yapı**: `components/`, `hooks/`, `services/`, `types/`, `utils/` klasörleri

### 11. Team (Ekip) - `/team`

- **Açıklama**: Ekip üyeleri yönetimi ve personel bilgileri
- **Ana Bileşenler**: `page.tsx` (ana ekip sayfası)
- **Yapı**: `components/`, `hooks/`, `services/`, `types/`, `utils/` klasörleri

### 12. Contact (İletişim) - `/contact`

- **Açıklama**: İletişim formu ve mesaj yönetimi
- **Ana Bileşenler**: `page.tsx` (ana iletişim sayfası)
- **Yapı**: `components/`, `hooks/`, `services/`, `types/`, `utils/` klasörleri

## Dizin Yapısı

Her özellik klasörü aşağıdaki yapıyı takip eder:

```
/feature-name
├── index.ts          # Ana export dosyası
├── types.ts          # TypeScript tip tanımları
├── FeaturePage.tsx   # Ana sayfa bileşeni
├── FeatureForm.tsx   # Form bileşeni
├── FeatureList.tsx   # Liste bileşeni
├── FeatureDetails.tsx # Detay bileşeni
├── components/       # Alt bileşenler
├── hooks/           # Custom hook'lar
├── services/        # API servisleri
└── utils/           # Yardımcı fonksiyonlar
```

## Kullanım

Özellikleri kullanmak için ana `index.ts` dosyasından import edin:

```typescript
import { IncomePage, ExpensePage, CustomersPage } from "@/features";
```

## Geliştirme Notları

- Her özellik kendi state yönetimini yapar
- Ortak tipler `types.ts` dosyalarında tanımlanır
- Bileşenler PrimeReact UI kütüphanesi kullanır
- Responsive tasarım için Tailwind CSS kullanılır
- TypeScript ile tip güvenliği sağlanır
- Bazı özellikler henüz geliştirme aşamasında (calendar, team, contact)

## Gelecek Geliştirmeler

- Calendar, Team ve Contact özelliklerinin tamamlanması
- Her özellik için custom hook'lar eklenebilir
- API servisleri entegrasyonu yapılabilir
- Test dosyaları eklenebilir
- Daha detaylı bileşenler geliştirilebilir
- Admin paneli için daha fazla yönetim bileşeni eklenebilir
