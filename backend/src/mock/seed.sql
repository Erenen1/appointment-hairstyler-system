// seed.mock.sql

-- ============================================
-- KUAFÖR SALONU TEST VERİLERİ
-- ============================================

-- Önce mevcut verileri temizle (test ortamı için)
TRUNCATE TABLE appointment_history, appointments, service_images, services, service_categories,
                contact_messages, gallery_images, gallery_categories, 
                special_days, business_hours, staff, customers, admins, 
                appointment_statuses, email_templates, sms_templates
RESTART IDENTITY CASCADE;

-- ============================================
-- YÖNETİCİ TEST VERİLERİ
-- ============================================
INSERT INTO admins (id, full_name, email, password, phone, is_active) VALUES
('550e8400-e29b-41d4-a716-446655440001', 'Ahmet Yılmaz', 'admin@kuaforsalonu.com', '$2b$10$rOvHPQkn8fZ8nQoYvJKjOuX8mX5vK7qL2hQ9cR3nS1mT6pU4wV8xK', '+90 532 123 4567', true),
('550e8400-e29b-41d4-a716-446655440002', 'Mehmet Demir', 'mehmet@kuaforsalonu.com', '$2b$10$rOvHPQkn8fZ8nQoYvJKjOuX8mX5vK7qL2hQ9cR3nS1mT6pU4wV8xK', '+90 533 234 5678', true),
('550e8400-e29b-41d4-a716-446655440003', 'Ayşe Kaya', 'ayse@kuaforsalonu.com', '$2b$10$rOvHPQkn8fZ8nQoYvJKjOuX8mX5vK7qL2hQ9cR3nS1mT6pU4wV8xK', '+90 534 345 6789', true);

-- ============================================
-- PERSONEL TEST VERİLERİ
-- ============================================
INSERT INTO staff (id, email, full_name, phone, avatar, specialties, is_active) VALUES
('660e8400-e29b-41d4-a716-446655440001', 'zeynep@kuaforsalonu.com', 'Zeynep Özkan', '+90 535 111 2233', '/uploads/staff/zeynep.jpg', 'Saç kesimi, Boyama, Fön', true),
('660e8400-e29b-41d4-a716-446655440002', 'fatma@kuaforsalonu.com', 'Fatma Çelik', '+90 536 222 3344', '/uploads/staff/fatma.jpg', 'Makyaj, Kaş şekillendirme, Cilt bakımı', true),
('660e8400-e29b-41d4-a716-446655440003', 'elif@kuaforsalonu.com', 'Elif Şahin', '+90 537 333 4455', '/uploads/staff/elif.jpg', 'Saç kesimi, Perma, Saç bakımı', true),
('660e8400-e29b-41d4-a716-446655440004', 'selin@kuaforsalonu.com', 'Selin Arslan', '+90 538 444 5566', '/uploads/staff/selin.jpg', 'Manikür, Pedikür, Nail art', true);

-- ============================================
-- MÜŞTERİ TEST VERİLERİ
-- ============================================
INSERT INTO customers (id, email, full_name, phone, notes, is_active) VALUES
('770e8400-e29b-41d4-a716-446655440001', 'merve@gmail.com', 'Merve Yıldız', '+90 541 111 1111', 'Alerjik cilt, doğal ürünler tercih ediyor', true),
('770e8400-e29b-41d4-a716-446655440002', 'deniz@gmail.com', 'Deniz Acar', '+90 542 222 2222', 'Düzenli müşteri, her ay geliyor', true),
('770e8400-e29b-41d4-a716-446655440003', 'cansu@gmail.com', 'Cansu Polat', '+90 543 333 3333', 'Kısa saç seviyor, modern kesimler', true),
('770e8400-e29b-41d4-a716-446655440004', 'burcu@gmail.com', 'Burcu Koç', '+90 544 444 4444', 'Özel günler için geliyor', true),
('770e8400-e29b-41d4-a716-446655440005', 'seda@gmail.com', 'Seda Güven', '+90 545 555 5555', 'Saç boyası konusunda hassas', true),
('770e8400-e29b-41d4-a716-446655440006', 'pelin@gmail.com', 'Pelin Özdemir', '+90 546 666 6666', 'Makyaj hizmetlerini tercih ediyor', true);

-- ============================================
-- HİZMET KATEGORİLERİ TEST VERİLERİ
-- ============================================
INSERT INTO service_categories (name, description, image_path, order_index, is_active) VALUES
('Saç Hizmetleri', 'Saç kesimi, boyama, şekillendirme ve bakım hizmetleri', '/uploads/categories/sac-hizmetleri.jpg', 1, true),
('Cilt Bakımı', 'Yüz bakımı, temizlik ve cilt sağlığı hizmetleri', '/uploads/categories/cilt-bakimi.jpg', 2, true),
('Makyaj', 'Günlük ve özel gün makyaj hizmetleri', '/uploads/categories/makyaj.jpg', 3, true),
('Tırnak Bakımı', 'Manikür, pedikür ve nail art hizmetleri', '/uploads/categories/tirnak-bakimi.jpg', 4, true),
('Kaş ve Kirpik', 'Kaş şekillendirme ve kirpik hizmetleri', '/uploads/categories/kas-kirpik.jpg', 5, true);

-- ============================================
-- HİZMETLER TEST VERİLERİ
-- ============================================
INSERT INTO services (category_id, slug, title, description, duration, price, is_active, order_index, benefits, includes, recommended_for, before_after_images) VALUES
-- Saç Hizmetleri
(1, 'sac-kesimi', 'Saç Kesimi', 'Profesyonel saç kesimi ve şekillendirme', '45 dakika', '150-250 TL', true, 1, 
 '["Yüz şekline uygun kesim", "Profesyonel danışmanlık", "Şekillendirme"]',
 '["Saç yıkama", "Kesim", "Fön"]',
 '["Kısa saç sevenler", "Yeni stil arayanlar", "Bakım kolaylığı isteyenler"]',
 '["/uploads/services/sac-kesimi-before.jpg", "/uploads/services/sac-kesimi-after.jpg"]'),

(1, 'sac-boyama', 'Saç Boyama', 'Kaliteli boyalarla saç rengi değişimi', '120 dakika', '300-500 TL', true, 2,
 '["Doğal görünüm", "Uzun süre kalıcılık", "Saça zarar vermez"]',
 '["Saç analizi", "Boyama", "Bakım maskesi", "Fön"]',
 '["Renk değişimi isteyenler", "Beyazları kapatmak isteyenler", "Trend renkler isteyenler"]',
 '["/uploads/services/sac-boyama-before.jpg", "/uploads/services/sac-boyama-after.jpg"]'),

(1, 'fon-sekillendirme', 'Fön ve Şekillendirme', 'Profesyonel fön ve saç şekillendirme', '30 dakika', '80-120 TL', true, 3,
 '["Doğal hacim", "Uzun süre kalıcılık", "Şık görünüm"]',
 '["Saç yıkama", "Fön", "Şekillendirme"]',
 '["Özel günler", "İş toplantıları", "Günlük şıklık"]',
 '[]'),

-- Cilt Bakımı
(2, 'yuz-bakimi', 'Yüz Bakımı', 'Derin temizlik ve cilt bakımı', '60 dakika', '200-300 TL', true, 1,
 '["Derin temizlik", "Cilt yenilenmesi", "Pürüzsüz cilt"]',
 '["Cilt analizi", "Temizlik", "Maske", "Nemlendirme"]',
 '["Karma cilt", "Yağlı cilt", "Kuru cilt", "Hassas cilt"]',
 '["/uploads/services/yuz-bakimi-before.jpg", "/uploads/services/yuz-bakimi-after.jpg"]'),

(2, 'cilt-temizligi', 'Cilt Temizliği', 'Profesyonel cilt temizliği ve bakımı', '45 dakika', '150-200 TL', true, 2,
 '["Gözenek temizliği", "Siyah nokta giderme", "Cilt tazelenmesi"]',
 '["Buhar", "Temizlik", "Tonik", "Nemlendirici"]',
 '["Problemli cilt", "Siyah nokta sorunu", "Düzenli bakım isteyenler"]',
 '[]'),

-- Makyaj
(3, 'gunluk-makyaj', 'Günlük Makyaj', 'Doğal ve şık günlük makyaj', '30 dakika', '120-180 TL', true, 1,
 '["Doğal görünüm", "Uzun süre kalıcılık", "Cilt dostu ürünler"]',
 '["Cilt hazırlığı", "Makyaj uygulaması", "Sabitleyici"]',
 '["İş hayatı", "Günlük kullanım", "Doğal görünüm sevenler"]',
 '[]'),

(3, 'ozel-gun-makyaji', 'Özel Gün Makyajı', 'Düğün, nişan ve özel günler için makyaj', '60 dakika', '250-400 TL', true, 2,
 '["Profesyonel görünüm", "Fotoğraf uyumlu", "Uzun süre kalıcılık"]',
 '["Cilt hazırlığı", "Detaylı makyaj", "Sabitleyici", "Rötuş"]',
 '["Düğün", "Nişan", "Mezuniyet", "Özel davetler"]',
 '["/uploads/services/ozel-gun-makyaji-before.jpg", "/uploads/services/ozel-gun-makyaji-after.jpg"]'),

-- Tırnak Bakımı
(4, 'manikur', 'Manikür', 'El ve tırnak bakımı', '45 dakika', '80-150 TL', true, 1,
 '["Temiz görünüm", "Sağlıklı tırnaklar", "Uzun süre kalıcılık"]',
 '["Tırnak kesimi", "Şekillendirme", "Oje", "El bakımı"]',
 '["Düzenli bakım isteyenler", "Temiz görünüm sevenler", "Özel günler"]',
 '[]'),

(4, 'pedikur', 'Pedikür', 'Ayak ve tırnak bakımı', '60 dakika', '100-180 TL', true, 2,
 '["Temiz görünüm", "Rahatlatıcı", "Sağlıklı ayaklar"]',
 '["Ayak banyosu", "Tırnak kesimi", "Nasır temizliği", "Oje"]',
 '["Yaz ayları", "Açık ayakkabı kullananlar", "Ayak bakımı isteyenler"]',
 '[]'),

-- Kaş ve Kirpik
(5, 'kas-sekillendirme', 'Kaş Şekillendirme', 'Profesyonel kaş şekillendirme', '20 dakika', '60-100 TL', true, 1,
 '["Yüz şekline uygun", "Doğal görünüm", "Uzun süre kalıcılık"]',
 '["Kaş analizi", "Şekillendirme", "Boyama"]',
 '["Düzenli bakım isteyenler", "Doğal görünüm sevenler", "Yüz şeklini belirginleştirmek isteyenler"]',
 '["/uploads/services/kas-sekillendirme-before.jpg", "/uploads/services/kas-sekillendirme-after.jpg"]'),

(5, 'kirpik-lifting', 'Kirpik Lifting', 'Doğal kirpik kaldırma ve boyama', '45 dakika', '150-250 TL', true, 2,
 '["Doğal kıvrım", "Uzun görünüm", "4-6 hafta kalıcılık"]',
 '["Kirpik analizi", "Lifting işlemi", "Boyama", "Bakım serumu"]',
 '["Doğal görünüm sevenler", "Maskara kullanmak istemeyenler", "Pratik çözüm arayanlar"]',
 '["/uploads/services/kirpik-lifting-before.jpg", "/uploads/services/kirpik-lifting-after.jpg"]');

-- ============================================
-- HİZMET RESİMLERİ TEST VERİLERİ
-- ============================================
INSERT INTO service_images (service_id, image_path, is_main, order_index) VALUES
(1, '/uploads/services/sac-kesimi-1.jpg', true, 1),
(1, '/uploads/services/sac-kesimi-2.jpg', false, 2),
(2, '/uploads/services/sac-boyama-1.jpg', true, 1),
(2, '/uploads/services/sac-boyama-2.jpg', false, 2),
(3, '/uploads/services/fon-1.jpg', true, 1),
(4, '/uploads/services/yuz-bakimi-1.jpg', true, 1),
(5, '/uploads/services/cilt-temizligi-1.jpg', true, 1),
(6, '/uploads/services/gunluk-makyaj-1.jpg', true, 1),
(7, '/uploads/services/ozel-gun-makyaji-1.jpg', true, 1),
(8, '/uploads/services/manikur-1.jpg', true, 1),
(9, '/uploads/services/pedikur-1.jpg', true, 1),
(10, '/uploads/services/kas-sekillendirme-1.jpg', true, 1),
(11, '/uploads/services/kirpik-lifting-1.jpg', true, 1);


-- ============================================
-- RANDEVULAR TEST VERİLERİ
-- ============================================
INSERT INTO appointments (customer_id, staff_id, service_id,  appointment_date, start_time, end_time, notes, price, created_by_admin) VALUES
-- Tamamlanan randevular (geçmiş)
('770e8400-e29b-41d4-a716-446655440001', '660e8400-e29b-41d4-a716-446655440001', 1, '2024-01-15', '10:00', '10:45', 'Saç kesimi tamamlandı, çok memnun kaldı', 200.00, '550e8400-e29b-41d4-a716-446655440001'),
('770e8400-e29b-41d4-a716-446655440002', '660e8400-e29b-41d4-a716-446655440002', 4, '2024-01-16', '14:00', '15:00', 'Yüz bakımı tamamlandı', 250.00, '550e8400-e29b-41d4-a716-446655440001'),
('770e8400-e29b-41d4-a716-446655440003', '660e8400-e29b-41d4-a716-446655440001', 2, '2024-01-18', '11:00', '13:00', 'Saç boyama işlemi başarılı', 400.00, '550e8400-e29b-41d4-a716-446655440002'),

-- Onaylanmış randevular (gelecek)
('770e8400-e29b-41d4-a716-446655440004', '660e8400-e29b-41d4-a716-446655440003', 7,  CURRENT_DATE + INTERVAL '2 days', '15:00', '16:00', 'Özel gün makyajı - düğün', 350.00, '550e8400-e29b-41d4-a716-446655440001'),
('770e8400-e29b-41d4-a716-446655440005', '660e8400-e29b-41d4-a716-446655440001', 1,  CURRENT_DATE + INTERVAL '3 days', '10:30', '11:15', 'Saç kesimi randevusu', 200.00, '550e8400-e29b-41d4-a716-446655440002'),
('770e8400-e29b-41d4-a716-446655440006', '660e8400-e29b-41d4-a716-446655440004', 8,  CURRENT_DATE + INTERVAL '5 days', '13:00', '13:45', 'Manikür randevusu', 120.00, '550e8400-e29b-41d4-a716-446655440001'),

-- Bekleyen randevular
('770e8400-e29b-41d4-a716-446655440001', '660e8400-e29b-41d4-a716-446655440002', 5, CURRENT_DATE + INTERVAL '7 days', '11:00', '11:45', 'Cilt temizliği talebi', 175.00, NULL),
('770e8400-e29b-41d4-a716-446655440002', '660e8400-e29b-41d4-a716-446655440003', 10, CURRENT_DATE + INTERVAL '8 days', '16:00', '16:20', 'Kaş şekillendirme', 80.00, NULL);

-- ============================================
-- RANDEVU GEÇMİŞİ TEST VERİLERİ
-- ============================================
INSERT INTO appointment_history (appointment_id,  notes, created_by_admin) VALUES
-- İlk randevu geçmişi
(1, 'Randevu oluşturuldu', '550e8400-e29b-41d4-a716-446655440001'),
(1, 'Randevu onaylandı', '550e8400-e29b-41d4-a716-446655440001'),
(1, 'Randevu tamamlandı', '550e8400-e29b-41d4-a716-446655440001'),

-- İkinci randevu geçmişi
(2, 'Randevu oluşturuldu', '550e8400-e29b-41d4-a716-446655440001'),
(2, 'Randevu onaylandı', '550e8400-e29b-41d4-a716-446655440001'),
(2, 'Randevu tamamlandı', '550e8400-e29b-41d4-a716-446655440001'),

-- Üçüncü randevu geçmişi
(3, 'Randevu oluşturuldu', '550e8400-e29b-41d4-a716-446655440002'),
(3, 'Randevu onaylandı', '550e8400-e29b-41d4-a716-446655440002'),
(3, 'Randevu tamamlandı', '550e8400-e29b-41d4-a716-446655440002');

-- ============================================
-- İŞ SAATLERİ TEST VERİLERİ
-- ============================================
INSERT INTO business_hours (day_of_week, open_time, close_time, is_closed) VALUES
(1, '09:00', '18:00', false), -- Pazartesi
(2, '09:00', '18:00', false), -- Salı
(3, '09:00', '18:00', false), -- Çarşamba
(4, '09:00', '18:00', false), -- Perşembe
(5, '09:00', '18:00', false), -- Cuma
(6, '09:00', '17:00', false), -- Cumartesi
(7, NULL, NULL, true);        -- Pazar (kapalı)

-- ============================================
-- ÖZEL GÜNLER TEST VERİLERİ
-- ============================================
INSERT INTO special_days (date, description, is_closed, open_time, close_time) VALUES
('2024-01-01', 'Yılbaşı', true, NULL, NULL),
('2024-04-23', '23 Nisan Ulusal Egemenlik ve Çocuk Bayramı', true, NULL, NULL),
('2024-05-01', 'İşçi Bayramı', true, NULL, NULL),
('2024-05-19', '19 Mayıs Atatürk''ü Anma, Gençlik ve Spor Bayramı', true, NULL, NULL),
('2024-08-30', '30 Ağustos Zafer Bayramı', true, NULL, NULL),
('2024-10-29', '29 Ekim Cumhuriyet Bayramı', true, NULL, NULL),
('2024-12-31', 'Yılbaşı Arifesi', false, '09:00', '15:00');

-- ============================================
-- İLETİŞİM MESAJLARI TEST VERİLERİ
-- ============================================
INSERT INTO contact_messages (fullName, email, subject, message, isRead) VALUES
('Aylin Kara', 'aylin@gmail.com', 'Randevu Talebi', 'Merhaba, saç boyama için randevu almak istiyorum. Müsait günlerinizi öğrenebilir miyim?', true, '550e8400-e29b-41d4-a716-446655440001'),
('Cem Özkan', 'cem@gmail.com', 'Fiyat Bilgisi', 'Erkek saç kesimi fiyatlarınızı öğrenebilir miyim?', false, NULL),
('Gizem Yılmaz', 'gizem@gmail.com', 'Özel Gün Makyajı', 'Düğünüm için makyaj hizmeti alabilir miyim? Tarih: 15 Haziran', true, '550e8400-e29b-41d4-a716-446655440002'),
('Okan Demir', 'okan@gmail.com', 'Şikayet', 'Geçen hafta aldığım hizmetle ilgili bir sorun yaşadım. Görüşmek istiyorum.', false, NULL),
('Esra Çelik', 'esra@gmail.com', 'Teşekkür', 'Harika bir hizmet aldım, çok teşekkür ederim!', true, '550e8400-e29b-41d4-a716-446655440001');

-- ============================================
-- GALERİ KATEGORİLERİ TEST VERİLERİ
-- ============================================
INSERT INTO gallery_categories (name, description, order_index) VALUES
('Saç Modelleri', 'Çeşitli saç kesimi ve şekillendirme örnekleri', 1),
('Saç Renkleri', 'Farklı saç boyama ve renk geçiş örnekleri', 2),
('Makyaj Çalışmaları', 'Günlük ve özel gün makyaj örnekleri', 3),
('Cilt Bakımı', 'Cilt bakımı öncesi ve sonrası görselleri', 4),
('Tırnak Sanatı', 'Nail art ve tırnak tasarım örnekleri', 5),
('Özel Günler', 'Düğün, nişan ve özel gün hazırlıkları', 6);

-- ============================================
-- GALERİ RESİMLERİ TEST VERİLERİ
-- ============================================
INSERT INTO gallery_images (category_id, title, description, image_path, order_index, is_visible) VALUES
-- Saç Modelleri
(1, 'Bob Kesim', 'Modern bob saç kesimi', '/uploads/gallery/sac-modelleri/bob-kesim-1.jpg', 1, true),
(1, 'Pixie Cut', 'Cesur pixie saç kesimi', '/uploads/gallery/sac-modelleri/pixie-cut-1.jpg', 2, true),
(1, 'Uzun Katmanlı', 'Uzun katmanlı saç kesimi', '/uploads/gallery/sac-modelleri/uzun-katmanli-1.jpg', 3, true),

-- Saç Renkleri
(2, 'Balayaj', 'Doğal balayaj tekniği', '/uploads/gallery/sac-renkleri/balayaj-1.jpg', 1, true),
(2, 'Ombre', 'Renk geçişli ombre', '/uploads/gallery/sac-renkleri/ombre-1.jpg', 2, true),
(2, 'Platin Sarı', 'Platin sarı renk', '/uploads/gallery/sac-renkleri/platin-sari-1.jpg', 3, true),

-- Makyaj Çalışmaları
(3, 'Doğal Makyaj', 'Günlük doğal makyaj', '/uploads/gallery/makyaj/dogal-makyaj-1.jpg', 1, true),
(3, 'Smokey Eyes', 'Klasik smokey eyes', '/uploads/gallery/makyaj/smokey-eyes-1.jpg', 2, true),
(3, 'Gelin Makyajı', 'Düğün günü makyajı', '/uploads/gallery/makyaj/gelin-makyaji-1.jpg', 3, true),

-- Cilt Bakımı
(4, 'Yüz Bakımı Öncesi', 'Bakım öncesi cilt durumu', '/uploads/gallery/cilt-bakimi/yuz-bakimi-oncesi-1.jpg', 1, true),
(4, 'Yüz Bakımı Sonrası', 'Bakım sonrası cilt durumu', '/uploads/gallery/cilt-bakimi/yuz-bakimi-sonrasi-1.jpg', 2, true),

-- Tırnak Sanatı
(5, 'French Manikür', 'Klasik french manikür', '/uploads/gallery/tirnak-sanati/french-manikur-1.jpg', 1, true),
(5, 'Nail Art', 'Özel tasarım nail art', '/uploads/gallery/tirnak-sanati/nail-art-1.jpg', 2, true),

-- Özel Günler
(6, 'Gelin Hazırlığı', 'Düğün günü hazırlık süreci', '/uploads/gallery/ozel-gunler/gelin-hazirlik-1.jpg', 1, true),
(6, 'Mezuniyet Makyajı', 'Mezuniyet töreni makyajı', '/uploads/gallery/ozel-gunler/mezuniyet-makyaji-1.jpg', 2, true);

-- ============================================
-- E-POSTA ŞABLONLARI TEST VERİLERİ
-- ============================================
INSERT INTO email_templates (name, subject, body, variables, is_active) VALUES
('randevu_onay', 'Randevunuz Onaylandı', 
'Merhaba {{customerName}},

{{appointmentDate}} tarihinde saat {{appointmentTime}}''da {{serviceName}} hizmeti için randevunuz onaylanmıştır.

Personel: {{staffName}}
Süre: {{serviceDuration}}
Fiyat: {{servicePrice}}

Randevunuza 15 dakika önce gelmenizi rica ederiz.

İyi günler dileriz,
{{salonName}} Ekibi', 
'["customerName", "appointmentDate", "appointmentTime", "serviceName", "staffName", "serviceDuration", "servicePrice", "salonName"]', 
true),

('randevu_hatirlatma', 'Randevu Hatırlatması', 
'Merhaba {{customerName}},

Yarın saat {{appointmentTime}}''da {{serviceName}} hizmeti için randevunuz bulunmaktadır.

Randevunuzu iptal etmeniz gerekiyorsa lütfen en az 2 saat önceden bizi arayınız.

Teşekkürler,
{{salonName}} Ekibi', 
'["customerName", "appointmentTime", "serviceName", "salonName"]', 
true),

('randevu_iptal', 'Randevunuz İptal Edildi', 
'Merhaba {{customerName}},

{{appointmentDate}} tarihindeki randevunuz iptal edilmiştir.

İptal Nedeni: {{cancelReason}}

Yeni randevu almak için bizimle iletişime geçebilirsiniz.

Saygılarımızla,
{{salonName}} Ekibi', 
'["customerName", "appointmentDate", "cancelReason", "salonName"]', 
true);

-- ============================================
-- SMS ŞABLONLARI TEST VERİLERİ
-- ============================================
INSERT INTO sms_templates (name, message, variables, is_active) VALUES
('randevu_onay_sms', 
'{{customerName}}, {{appointmentDate}} {{appointmentTime}} randevunuz onaylandı. {{salonName}} - {{salonPhone}}', 
'["customerName", "appointmentDate", "appointmentTime", "salonName", "salonPhone"]', 
true),

('randevu_hatirlatma_sms', 
'{{customerName}}, yarın saat {{appointmentTime}} randevunuz var. İptal için {{salonPhone}}. {{salonName}}', 
'["customerName", "appointmentTime", "salonPhone", "salonName"]', 
true),

('randevu_iptal_sms', 
'{{customerName}}, {{appointmentDate}} randevunuz iptal edildi. Yeni randevu: {{salonPhone}}. {{salonName}}', 
'["customerName", "appointmentDate", "salonPhone", "salonName"]', 
true);

-- ============================================
-- VERİ TUTARLILIK KONTROLLERI
-- ============================================

-- Sequence'ları güncelle
SELECT setval('service_categories_id_seq', (SELECT MAX(id) FROM service_categories));
SELECT setval('services_id_seq', (SELECT MAX(id) FROM services));
SELECT setval('service_images_id_seq', (SELECT MAX(id) FROM service_images));
SELECT setval('appointment_statuses_id_seq', (SELECT MAX(id) FROM appointment_statuses));
SELECT setval('appointments_id_seq', (SELECT MAX(id) FROM appointments));
SELECT setval('appointment_history_id_seq', (SELECT MAX(id) FROM appointment_history));
SELECT setval('business_hours_id_seq', (SELECT MAX(id) FROM business_hours));
SELECT setval('special_days_id_seq', (SELECT MAX(id) FROM special_days));
SELECT setval('contact_messages_id_seq', (SELECT MAX(id) FROM contact_messages));
SELECT setval('gallery_categories_id_seq', (SELECT MAX(id) FROM gallery_categories));
SELECT setval('gallery_images_id_seq', (SELECT MAX(id) FROM gallery_images));
SELECT setval('email_templates_id_seq', (SELECT MAX(id) FROM email_templates));
SELECT setval('sms_templates_id_seq', (SELECT MAX(id) FROM sms_templates));
