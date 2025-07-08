# Kuaför Sistemi Mock Data

Bu klasörde, kuaför randevu sistemi için frontend geliştirmede kullanabileceğiniz detaylı mock data bulunmaktadır.

## Dosya Listesi

| Dosya | Model | Açıklama |
|-------|-------|----------|
| `admins.json` | Admin | Sistem yöneticileri |
| `staff.json` | Staff | Kuaför personelleri |
| `customers.json` | Customer | Müşteriler |
| `service-categories.json` | ServiceCategory | Hizmet kategorileri |
| `services.json` | Service | Kuaför hizmetleri |
| `appointments.json` | Appointment | Randevular |
| `appointment-statuses.json` | AppointmentStatus | Randevu durumları |
| `appointment-history.json` | AppointmentHistory | Randevu geçmişi |
| `business-hours.json` | BusinessHours | İş saatleri |
| `special-days.json` | SpecialDays | Özel günler ve tatiller |
| `gallery-categories.json` | GalleryCategory | Galeri kategorileri |
| `gallery-images.json` | GalleryImage | Galeri resimleri |
| `contact-messages.json` | ContactMessage | İletişim mesajları |
| `email-templates.json` | EmailTemplate | E-posta şablonları |
| `sms-templates.json` | SmsTemplate | SMS şablonları |
| `service-images.json` | ServiceImage | Hizmet resimleri |
| `staff-services.json` | StaffService | Personel-hizmet eşleştirmeleri |

## Model İlişkileri

### Temel İlişkiler
- **Staff** → **Services** (çoka-çok ilişki via StaffService)
- **Customer** → **Appointments** (bire-çok)
- **Staff** → **Appointments** (bire-çok)
- **Service** → **Appointments** (bire-çok)
- **AppointmentStatus** → **Appointments** (bire-çok)
- **ServiceCategory** → **Services** (bire-çok)

### Galeri İlişkileri
- **GalleryCategory** → **GalleryImage** (bire-çok)
- **Service** → **ServiceImage** (bire-çok)

### Geçmiş/Log İlişkileri
- **Appointment** → **AppointmentHistory** (bire-çok)

## Kullanım Örnekleri

### React/Vue.js için

```javascript
// Hizmetleri yüklemek için
import services from './data/services.json';
import serviceCategories from './data/service-categories.json';

// Kategoriye göre hizmetleri gruplamak
const servicesByCategory = services.reduce((acc, service) => {
  const category = serviceCategories.find(cat => cat.id === service.categoryId);
  if (!acc[category.name]) acc[category.name] = [];
  acc[category.name].push(service);
  return acc;
}, {});
```

### Personel ve Hizmet Eşleştirmesi

```javascript
import staff from './data/staff.json';
import services from './data/services.json';
import staffServices from './data/staff-services.json';

// Bir personelin yapabildiği hizmetleri bulmak
function getStaffServices(staffId) {
  const staffServiceIds = staffServices
    .filter(ss => ss.staffId === staffId)
    .map(ss => ss.serviceId);
  
  return services.filter(service => 
    staffServiceIds.includes(service.id)
  );
}
```

### Randevu Durumu Renklendirmesi

```javascript
import appointmentStatuses from './data/appointment-statuses.json';

// Durum rengini almak için
function getStatusColor(statusId) {
  const status = appointmentStatuses.find(s => s.id === statusId);
  return status ? status.color : '#000000';
}
```

## Özel Alanlar

### Service Model
- `benefits`: Hizmetin faydaları (array)
- `includes`: Hizmete dahil olanlar (array)
- `recommendedFor`: Kimler için önerilir (array)
- `beforeAfterImages`: Önce/sonra fotoğrafları (array)

### Staff Model
- `workingDays`: Çalışma günleri "1,2,3,4,5" formatında (1=Pazartesi)
- `specialties`: Uzmanlık alanları (text)

### BusinessHours Model
- `dayOfWeek`: 1=Pazartesi, 7=Pazar
- `isClosed`: Kapalı gün kontrolü

### Template Değişkenleri
Email ve SMS şablonlarında `{{değişkenAdı}}` formatında değişkenler kullanılır:
- `{{customerName}}`: Müşteri adı
- `{{appointmentDate}}`: Randevu tarihi
- `{{startTime}}`: Başlangıç saati
- vb.

## Test Senaryoları

1. **Aktif Randevular**: `appointments.json`'da statusId 1-3 olan kayıtlar
2. **Tamamlanan Randevular**: statusId 4 olan kayıtlar
3. **İptal Edilen Randevular**: statusId 5-6 olan kayıtlar
4. **Çalışma Saatleri**: Pazartesi-Cuma 09:00-18:00, Cumartesi 10:00-17:00, Pazar kapalı
5. **Özel Günler**: Resmi tatiller ve özel açılış saatleri

## Notlar

- Tüm tarihler ISO 8601 formatındadır
- Fiyatlar Türk Lirası (TL) cinsindendir
- Telefon numaraları Türkiye formatındadır (+90 5xx xxx xxxx)
- Resim yolları örnek olup, gerçek resimlerle değiştirilmelidir
- Şifreler hash edilmiş olarak saklanır (örneklerde placeholder hash'ler kullanılmıştır)

Bu mock data'lar frontend geliştirme, test ve demo amaçlı kullanım için hazırlanmıştır. 