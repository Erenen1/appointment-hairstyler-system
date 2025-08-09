# Staff Availability Service Kullanım Örneği

Bu doküman, StaffAvailability servisinin nasıl kullanılacağını ve randevu sistemi için müsait saatlerin nasıl hesaplanacağını gösterir.

## 1. Otomatik Müsaitlik Oluşturma

Yeni bir personel eklendiğinde veya gelecek ay için müsaitlik oluşturmak istediğinizde:

```javascript
// Örnek: Ali personeli için gelecek 4 hafta boyunca Pazartesi-Cumartesi müsaitlik oluştur
await staffAvailabilityService.createAutoAvailability({
  staffId: 'staff-uuid-123',
  startDate: '2025-07-01',
  endDate: '2025-07-31',
  weekDays: [1, 2, 3, 4, 5, 6] // Pazartesi-Cumartesi
});
```

## 2. Belirli Bir Tarihte Müsait Saatleri Getirme

Müşteri randevu sayfasında, 19.07.2025 tarihinde Ali personelinin müsait saatlerini göstermek için:

```javascript
const availableSlots = await staffAvailabilityService.getAvailableTimeSlots({
  staffId: 'staff-uuid-123',
  date: '2025-07-19',
  serviceId: 'service-uuid-456' // Saç kesimi servisi (45 dakika)
});

// Sonuç:
// [
//   { startTime: '09:00', endTime: '09:45' },
//   { startTime: '09:15', endTime: '10:00' },
//   { startTime: '09:30', endTime: '10:15' },
//   { startTime: '10:45', endTime: '11:30' }, // 10:00-10:45 randevu var
//   { startTime: '14:00', endTime: '14:45' },  // 12:00-13:00 öğle molası
//   { startTime: '14:15', endTime: '15:00' },
//   ...
// ]
```

## 3. Belirli Bir Tarihte Müsait Personelleri Getirme

Müşterinin hizmet seçtikten sonra, 19.07.2025 tarihinde hangi personellerin müsait olduğunu görmek için:

```javascript
const availableStaff = await staffAvailabilityService.getAvailableStaffByDate({
  date: '2025-07-19',
  serviceId: 'service-uuid-456'
});

// Sonuç:
// [
//   {
//     staff: { id: 'staff-1', firstName: 'Ali', lastName: 'Yılmaz' },
//     availability: { date: '2025-07-19', startTime: '09:00', endTime: '18:00' },
//     availableSlots: [
//       { startTime: '09:00', endTime: '09:45' },
//       { startTime: '10:45', endTime: '11:30' },
//       ...
//     ]
//   },
//   {
//     staff: { id: 'staff-2', firstName: 'Ayşe', lastName: 'Demir' },
//     availability: { date: '2025-07-19', startTime: '10:00', endTime: '17:00' },
//     availableSlots: [
//       { startTime: '10:00', endTime: '10:45' },
//       { startTime: '15:00', endTime: '15:45' },
//       ...
//     ]
//   }
// ]
```

## 4. Personel İzin/Özel Durum Güncellemesi

Ali personeli 20.07.2025 tarihinde izinli olmak istediğinde:

```javascript
await staffAvailabilityService.updateStaffAvailability(
  'staff-uuid-123',
  '2025-07-20',
  {
    isAvailable: false,
    type: 'off',
    notes: 'Kişisel izin'
  }
);
```

Veya çalışma saatlerini değiştirmek istediğinde:

```javascript
await staffAvailabilityService.updateStaffAvailability(
  'staff-uuid-123',
  '2025-07-21',
  {
    startTime: '10:00:00',
    endTime: '16:00:00',
    type: 'custom',
    notes: 'Yarım gün çalışma'
  }
);
```

## 5. API Endpoint Kullanımı

### Frontend'den müsait saatleri çekme:
```javascript
// GET /api/availability/staff/{staffId}/date/{date}?serviceId={serviceId}
const response = await fetch('/api/availability/staff/staff-uuid-123/date/2025-07-19?serviceId=service-uuid-456');
const data = await response.json();
```

### Belirli tarihteki müsait personelleri çekme:
```javascript
// GET /api/availability/staff-available/{date}?serviceId={serviceId}
const response = await fetch('/api/availability/staff-available/2025-07-19?serviceId=service-uuid-456');
const data = await response.json();
```

## 6. Algoritma Detayları

### Müsait Saat Hesaplama Algoritması:

1. **Personelin çalışma saatleri**: 09:00 - 18:00
2. **Öğle molası**: 12:00 - 13:00
3. **Hizmet süresi**: 45 dakika (saç kesimi)
4. **Slot aralığı**: 15 dakika

**Hesaplama adımları:**
- 09:00'dan 18:00'a kadar her 15 dakikada bir slot oluştur
- Her slot için 45 dakikalık hizmetin sığıp sığmadığını kontrol et
- Öğle molası (12:00-13:00) ile çakışan slotları çıkar
- Mevcut randevular ile çakışan slotları çıkar
- Geriye kalan slotları müsait saatler olarak döndür

### Örnek Hesaplama:
```
Çalışma saati: 09:00-18:00 (540 dakika)
Öğle molası: 12:00-13:00 (60 dakika)
Net çalışma: 480 dakika
Hizmet süresi: 45 dakika
Teorik slot sayısı: 480/15 = 32 slot
Gerçek müsait slot: Randevular ve öğle molası çıkarılır
```

## 7. Frontend Entegrasyonu

### React Komponenti Örneği:
```jsx
const AppointmentBooking = () => {
  const [selectedStaff, setSelectedStaff] = useState('');
  const [selectedDate, setSelectedDate] = useState('');
  const [availableSlots, setAvailableSlots] = useState([]);

  const fetchAvailableSlots = async () => {
    if (selectedStaff && selectedDate && selectedService) {
      const response = await fetch(
        `/api/availability/staff/${selectedStaff}/date/${selectedDate}?serviceId=${selectedService}`
      );
      const data = await response.json();
      setAvailableSlots(data.data || []);
    }
  };

  return (
    <div>
      {/* Personel seçimi, tarih seçimi */}
      <div className="time-slots">
        {availableSlots.map(slot => (
          <button key={slot.startTime} onClick={() => bookAppointment(slot)}>
            {slot.startTime} - {slot.endTime}
          </button>
        ))}
      </div>
    </div>
  );
};
```

Bu sistem sayesinde müşteriler sadece gerçekten müsait olan saatleri görebilir ve randevu alabilirler. 