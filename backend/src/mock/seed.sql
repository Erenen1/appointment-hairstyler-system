-- ============================================
-- KUAFÖR SALONU MOCK VERİLERİ
-- ============================================

-- Tabloları temizle
TRUNCATE TABLE appointments, services, service_categories, 
               staff, customers, business_hours, appointment_statuses, admin,
               service_images, gallery_categories, gallery_images, business_info,
               contact_messages, site_settings, special_days 
               RESTART IDENTITY CASCADE;

-- ============================================
-- 1. ADMİN VERİLERİ
-- ============================================
INSERT INTO admin (username, password, "fullName", email, phone, "lastLogin", "isActive", "createdAt", "updatedAt") VALUES
('admin', '$2a$10$QOlGz4HMOOJJkNXGABkhJeC3.wF3Z8yJV6cJw1AQGcvJU0JOJ3K3m', 'Sistem Yöneticisi', 'admin@kuafor.com', '0532 123 4567', NOW() - INTERVAL '2 hours', true, NOW(), NOW()),
('merve.owner', '$2a$10$QOlGz4HMOOJJkNXGABkhJeC3.wF3Z8yJV6cJw1AQGcvJU0JOJ3K3m', 'Merve Güzel', 'merve@kuafor.com', '0533 234 5678', NOW() - INTERVAL '1 day', true, NOW(), NOW());

-- ============================================
-- 2. RANDEVU DURUMLARI
-- ============================================
INSERT INTO appointment_statuses (name, "displayName", description, color, "createdAt") VALUES
('pending', 'Bekliyor', 'Randevu onay bekliyor', '#fbbf24', NOW()),
('confirmed', 'Onaylandı', 'Randevu onaylandı', '#10b981', NOW()),
('in_progress', 'Devam Ediyor', 'Hizmet veriliyor', '#3b82f6', NOW()),
('completed', 'Tamamlandı', 'Hizmet tamamlandı', '#10b981', NOW()),
('cancelled', 'İptal Edildi', 'Randevu iptal edildi', '#ef4444', NOW()),
('no_show', 'Gelmedi', 'Müşteri gelmedi', '#f97316', NOW());

-- ============================================
-- 3. HİZMET KATEGORİLERİ
-- ============================================
INSERT INTO service_categories (name, description, "imagePath", "orderIndex", "isActive", "createdAt", "updatedAt") VALUES
('Saç Kesimi', 'Kadın, erkek ve çocuk saç kesim hizmetleri', '/uploads/categories/haircut.jpg', 1, true, NOW(), NOW()),
('Saç Boyama', 'Profesyonel saç boyama ve renklendirme hizmetleri', '/uploads/categories/coloring.jpg', 2, true, NOW(), NOW()),
('Saç Bakımı', 'Saç maskesi, keratin ve onarım tedavileri', '/uploads/categories/care.jpg', 3, true, NOW(), NOW()),
('Makyaj', 'Özel gün ve günlük makyaj hizmetleri', '/uploads/categories/makeup.jpg', 4, true, NOW(), NOW()),
('Tırnak', 'Manikür, pedikür ve tırnak süsleme', '/uploads/categories/nails.jpg', 5, true, NOW(), NOW());

-- ============================================
-- 4. HİZMETLER
-- ============================================
INSERT INTO services ("categoryId", name, description, duration, price, "discountPrice", "isActive", "isPopular", "orderIndex", "createdAt", "updatedAt") VALUES
-- Saç Kesimi (categoryId: 1)
(1, 'Kadın Saç Kesimi', 'Profesyonel kadın saç kesimi ve şekillendirme', 60, 350.00, 300.00, true, true, 1, NOW(), NOW()),
(1, 'Erkek Saç Kesimi', 'Modern erkek saç kesimi ve styling', 45, 150.00, NULL, true, true, 2, NOW(), NOW()),
(1, 'Çocuk Saç Kesimi', '12 yaş altı çocuklar için saç kesimi', 30, 100.00, 80.00, true, false, 3, NOW(), NOW()),

-- Saç Boyama (categoryId: 2)
(2, 'Tek Renk Boya', 'Saçın tamamına tek renk boya uygulaması', 120, 800.00, 700.00, true, true, 1, NOW(), NOW()),
(2, 'Balyaj', 'Modern balyaj tekniği ile renklendirme', 180, 1200.00, 1000.00, true, true, 2, NOW(), NOW()),
(2, 'Ombre', 'Degradeli renk geçişi ile ombre boya', 160, 1000.00, 900.00, true, true, 3, NOW(), NOW()),

-- Saç Bakımı (categoryId: 3)
(3, 'Keratin Bakımı', 'Saç ipeksi parlaklık için keratin tedavisi', 120, 1500.00, 1300.00, true, true, 1, NOW(), NOW()),
(3, 'Protein Bakımı', 'Yıpranmış saçlar için protein tedavisi', 90, 800.00, 700.00, true, true, 2, NOW(), NOW()),
(3, 'Nem Bakımı', 'Kuru saçlar için nemlendirme bakımı', 60, 500.00, NULL, true, false, 3, NOW(), NOW()),

-- Makyaj (categoryId: 4)
(4, 'Gelin Makyajı', 'Özel gün için gelin makyajı', 90, 1000.00, NULL, true, true, 1, NOW(), NOW()),
(4, 'Günlük Makyaj', 'Doğal görünümlü günlük makyaj', 45, 300.00, 250.00, true, true, 2, NOW(), NOW()),
(4, 'Gece Makyajı', 'Özel geceler için göz alıcı makyaj', 60, 400.00, 350.00, true, false, 3, NOW(), NOW()),

-- Tırnak (categoryId: 5)
(5, 'Manikür', 'El bakımı ve oje uygulaması', 45, 200.00, 180.00, true, true, 1, NOW(), NOW()),
(5, 'Pedikür', 'Ayak bakımı ve oje uygulaması', 50, 250.00, 220.00, true, true, 2, NOW(), NOW()),
(5, 'Protez Tırnak', 'Jel tırnak uygulaması', 90, 400.00, 350.00, true, false, 3, NOW(), NOW());

-- ============================================
-- 5. HİZMET RESİMLERİ
-- ============================================
INSERT INTO service_images ("serviceId", "imagePath", "isMain", "orderIndex", "createdAt") VALUES
(1, '/uploads/services/kadin-sac-kesimi-1.jpg', true, 1, NOW()),
(1, '/uploads/services/kadin-sac-kesimi-2.jpg', false, 2, NOW()),
(2, '/uploads/services/erkek-sac-kesimi-1.jpg', true, 1, NOW()),
(4, '/uploads/services/tek-renk-boya-1.jpg', true, 1, NOW()),
(5, '/uploads/services/balyaj-1.jpg', true, 1, NOW()),
(7, '/uploads/services/keratin-bakim-1.jpg', true, 1, NOW()),
(10, '/uploads/services/gelin-makyaji-1.jpg', true, 1, NOW()),
(13, '/uploads/services/manikur-1.jpg', true, 1, NOW());

-- ============================================
-- 6. PERSONEL
-- ============================================
INSERT INTO staff ("firstName", "lastName", title, specialties, bio, phone, email, password, "lastLogin", "profileImage", "isActive", "workingDays", "orderIndex", "createdAt", "updatedAt") VALUES
('Ayşe', 'Yılmaz', 'Saç Tasarım Uzmanı', 'Saç kesimi, boyama, topuz', 'Sektörde 10 yıllık deneyime sahip saç tasarım uzmanı', '0532 111 2233', 'ayse@kuafor.com', '$2a$10$QOlGz4HMOOJJkNXGABkhJeC3.wF3Z8yJV6cJw1AQGcvJU0JOJ3K3m', NOW(), '/uploads/staff/ayse.jpg', true, '1,2,3,4,5', 1, NOW(), NOW()),
('Fatma', 'Demir', 'Renk Uzmanı', 'Saç boyama, balyaj, ombre', 'Renklendirme konusunda uzman kuaför', '0533 222 3344', 'fatma@kuafor.com', '$2a$10$QOlGz4HMOOJJkNXGABkhJeC3.wF3Z8yJV6cJw1AQGcvJU0JOJ3K3m', NOW(), '/uploads/staff/fatma.jpg', true, '1,2,3,4,5', 2, NOW(), NOW()),
('Zeynep', 'Kaya', 'Makyaj Sanatçısı', 'Gelin makyajı, özel gün makyajı', 'Profesyonel makyaj sanatçısı', '0534 333 4455', 'zeynep@kuafor.com', '$2a$10$QOlGz4HMOOJJkNXGABkhJeC3.wF3Z8yJV6cJw1AQGcvJU0JOJ3K3m', NOW(), '/uploads/staff/zeynep.jpg', true, '1,2,3,4,5,6', 3, NOW(), NOW()),
('Merve', 'Şahin', 'Tırnak Tasarım Uzmanı', 'Manikür, pedikür, protez tırnak', 'Tırnak bakımı ve süsleme uzmanı', '0535 444 5566', 'merve@kuafor.com', '$2a$10$QOlGz4HMOOJJkNXGABkhJeC3.wF3Z8yJV6cJw1AQGcvJU0JOJ3K3m', NOW(), '/uploads/staff/merve.jpg', true, '1,2,3,4,5', 4, NOW(), NOW());

-- ============================================
-- 7. MÜŞTERİLER
-- ============================================
INSERT INTO customers ("firstName", "lastName", phone, email, "birthDate", address, city, district, "loyaltyPoints", "hairType", "hairColor", notes, "createdAt", "updatedAt") VALUES
('Elif', 'Öztürk', '0532 555 6677', 'elif@email.com', '1990-05-15', 'Atatürk Cad. No:1', 'İstanbul', 'Kadıköy', 100, 'Düz', 'Kumral', 'Düzenli müşteri', NOW(), NOW()),
('Selin', 'Yıldız', '0533 666 7788', 'selin@email.com', '1988-08-20', 'Bağdat Cad. No:2', 'İstanbul', 'Maltepe', 50, 'Dalgalı', 'Siyah', 'Hassas saç derisi', NOW(), NOW()),
('Deniz', 'Aydın', '0534 777 8899', 'deniz@email.com', '1995-03-10', 'İstiklal Cad. No:3', 'İstanbul', 'Beyoğlu', 75, 'Kıvırcık', 'Sarı', 'Alerjik bünye', NOW(), NOW());

-- ============================================
-- 8. ÇALIŞMA SAATLERİ
-- ============================================
INSERT INTO business_hours ("dayOfWeek", "openTime", "closeTime", "isClosed", "createdAt", "updatedAt") VALUES
(1, '09:00', '20:00', false, NOW(), NOW()), -- Pazartesi
(2, '09:00', '20:00', false, NOW(), NOW()), -- Salı
(3, '09:00', '20:00', false, NOW(), NOW()), -- Çarşamba
(4, '09:00', '20:00', false, NOW(), NOW()), -- Perşembe
(5, '09:00', '20:00', false, NOW(), NOW()), -- Cuma
(6, '10:00', '18:00', false, NOW(), NOW()), -- Cumartesi
(7, NULL, NULL, true, NOW(), NOW());        -- Pazar

-- ============================================
-- 9. RANDEVULAR
-- ============================================
INSERT INTO appointments ("customerId", "staffId", "serviceId", "statusId", "appointmentDate", "startTime", "endTime", notes, price, "discountAmount", "createdByAdmin", "createdAt", "updatedAt") VALUES
-- Tamamlanmış randevular
(1, 1, 1, 4, CURRENT_DATE - INTERVAL '2 days', '10:00', '11:00', 'Başarılı kesim yapıldı', 350.00, 50.00, 1, NOW() - INTERVAL '3 days', NOW()),
(2, 2, 5, 4, CURRENT_DATE - INTERVAL '1 day', '14:00', '17:00', 'Balyaj uygulaması yapıldı', 1200.00, 200.00, 1, NOW() - INTERVAL '2 days', NOW()),

-- Bugünkü randevular
(3, 3, 10, 3, CURRENT_DATE, '11:00', '12:30', 'Gelin makyajı yapılıyor', 1000.00, 0.00, 1, NOW() - INTERVAL '1 day', NOW()),
(1, 4, 13, 2, CURRENT_DATE, '15:00', '16:00', 'Manikür randevusu', 200.00, 20.00, 1, NOW() - INTERVAL '1 day', NOW()),

-- Gelecek randevular
(2, 1, 2, 2, CURRENT_DATE + INTERVAL '1 day', '13:00', '14:00', 'Erkek saç kesimi', 150.00, 0.00, 1, NOW(), NOW()),
(3, 2, 7, 1, CURRENT_DATE + INTERVAL '2 days', '11:00', '13:00', 'Keratin bakımı', 1500.00, 200.00, 1, NOW(), NOW());

-- ============================================
-- 10. İŞLETME BİLGİLERİ
-- ============================================
INSERT INTO business_info (name, address, city, district, phone, email, instagram, facebook, website, "logoPath", "aboutText", "createdAt", "updatedAt") VALUES
('Güzellik Merkezi', 'Bağdat Caddesi No:123', 'İstanbul', 'Kadıköy', '0216 123 4567', 'info@guzellikmerkezi.com', 'guzellik_merkezi', 'guzellikmerkezi', 'www.guzellikmerkezi.com', '/uploads/logo.png', 'Profesyonel ekibimizle sizlere en iyi hizmeti sunmak için buradayız.', NOW(), NOW());

-- ============================================
-- 11. GALERİ KATEGORİLERİ VE RESİMLERİ
-- ============================================
INSERT INTO gallery_categories (name, description, "orderIndex", "createdAt", "updatedAt") VALUES
('Saç Modelleri', 'En güzel saç kesim ve boyama örnekleri', 1, NOW(), NOW()),
('Makyaj', 'Profesyonel makyaj çalışmalarımız', 2, NOW(), NOW()),
('Tırnak Tasarımları', 'Özel tırnak tasarımları', 3, NOW(), NOW());

INSERT INTO gallery_images ("categoryId", title, description, "imagePath", "orderIndex", "isVisible", "createdAt", "updatedAt") VALUES
(1, 'Modern Kesim', 'Modern kadın saç kesimi örneği', '/uploads/gallery/sac-1.jpg', 1, true, NOW(), NOW()),
(1, 'Ombre Saç', 'Trend ombre çalışması', '/uploads/gallery/sac-2.jpg', 2, true, NOW(), NOW()),
(2, 'Gelin Makyajı', 'Özel gün makyajı örneği', '/uploads/gallery/makyaj-1.jpg', 1, true, NOW(), NOW()),
(3, 'Nail Art', 'Özel tırnak süsleme örneği', '/uploads/gallery/tirnak-1.jpg', 1, true, NOW(), NOW());

-- ============================================
-- 12. ÖZEL GÜNLER
-- ============================================
INSERT INTO special_days (date, description, "isClosed", "openTime", "closeTime", "createdAt", "updatedAt") VALUES
(CURRENT_DATE + INTERVAL '10 days', 'Bayram', true, NULL, NULL, NOW(), NOW()),
(CURRENT_DATE + INTERVAL '15 days', 'Özel Etkinlik', false, '12:00', '18:00', NOW(), NOW());

-- ============================================
-- 13. SİTE AYARLARI
-- ============================================
INSERT INTO site_settings ("settingKey", "settingValue", "settingType", description, "isPublic", "createdAt", "updatedAt") VALUES
('site_title', 'Güzellik Merkezi', 'TEXT', 'Site başlığı', true, NOW(), NOW()),
('appointment_interval', '30', 'NUMBER', 'Randevu aralığı (dakika)', false, NOW(), NOW()),
('maintenance_mode', 'false', 'BOOLEAN', 'Bakım modu', false, NOW(), NOW());

-- ============================================
-- 14. İLETİŞİM MESAJLARI
-- ============================================
INSERT INTO contact_messages ("fullName", email, phone, subject, message, "isRead", "isReplied", "repliedByAdmin", "repliedAt", "adminNotes", "createdAt", "updatedAt") VALUES
('Ayşe Yılmaz', 'ayse@email.com', '0532 123 4567', 'Fiyat Bilgisi', 'Saç boyama fiyatları hakkında bilgi almak istiyorum.', true, true, 1, NOW(), 'Bilgi verildi', NOW() - INTERVAL '2 days', NOW()),
('Mehmet Demir', 'mehmet@email.com', '0533 234 5678', 'Randevu Talebi', 'Hafta sonu için randevu almak istiyorum.', false, false, NULL, NULL, NULL, NOW() - INTERVAL '1 day', NOW()); 