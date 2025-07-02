-- ============================================
-- KUAFÖR SALONU FAKE DATA
-- ============================================

-- Tablolari temizle (varsa)
TRUNCATE TABLE appointments, services, service_categories, 
               staff, customers, business_hours, appointment_statuses, admin 
               RESTART IDENTITY CASCADE;

-- ============================================
-- 1. ADMIN VERILER (Önce gelmeli - referans edilir)
-- ============================================
INSERT INTO admin (username, password, "fullName", email, phone, "lastLogin", "isActive", "createdAt", "updatedAt") VALUES
('admin', '$2a$10$QOlGz4HMOOJJkNXGABkhJeC3.wF3Z8yJV6cJw1AQGcvJU0JOJ3K3m', 'Sistem Yöneticisi', 'admin@kuafor.com', '0532 123 4567', NOW() - INTERVAL '2 hours', true, NOW(), NOW()),
('merve.owner', '$2a$10$QOlGz4HMOOJJkNXGABkhJeC3.wF3Z8yJV6cJw1AQGcvJU0JOJ3K3m', 'Merve Güzel', 'merve@kuafor.com', '0533 234 5678', NOW() - INTERVAL '1 day', true, NOW(), NOW()),
('ayse.manager', '$2a$10$QOlGz4HMOOJJkNXGABkhJeC3.wF3Z8yJV6cJw1AQGcvJU0JOJ3K3m', 'Ayşe Yıldız', 'ayse@kuafor.com', '0534 345 6789', NOW() - INTERVAL '3 hours', true, NOW(), NOW());

-- ============================================
-- 2. APPOINTMENT STATUS (Randevu durumları)
-- ============================================
INSERT INTO appointment_statuses (name, "displayName", description, color, "createdAt") VALUES
('pending', 'Bekliyor', 'Randevu onay bekliyor', '#fbbf24', NOW()),
('confirmed', 'Onaylandı', 'Randevu onaylandı', '#10b981', NOW()),
('in_progress', 'Devam Ediyor', 'Hizmet veriliyor', '#3b82f6', NOW()),
('completed', 'Tamamlandı', 'Hizmet tamamlandı', '#10b981', NOW()),
('cancelled', 'İptal Edildi', 'Randevu iptal edildi', '#ef4444', NOW()),
('no_show', 'Gelmedi', 'Müşteri gelmedi', '#f97316', NOW());

-- ============================================
-- 3. SERVICE CATEGORIES (Hizmet kategorileri)
-- ============================================
INSERT INTO service_categories (name, description, "imagePath", "orderIndex", "isActive", "createdAt", "updatedAt") VALUES
('Saç Kesimi', 'Kadın, erkek ve çocuk saç kesim hizmetleri', '/images/categories/haircut.jpg', 1, true, NOW(), NOW()),
('Saç Boyama', 'Profesyonel saç boyama ve renklendirme hizmetleri', '/images/categories/coloring.jpg', 2, true, NOW(), NOW()),
('Saç Bakımı', 'Saç maskesi, keratin ve onarım tedavileri', '/images/categories/care.jpg', 3, true, NOW(), NOW()),
('Kalıcı Makyaj', 'Kaş, göz ve dudak kalıcı makyaj uygulamaları', '/images/categories/permanent.jpg', 4, true, NOW(), NOW()),
('Cilt Bakımı', 'Yüz temizliği ve cilt bakım hizmetleri', '/images/categories/skincare.jpg', 5, true, NOW(), NOW()),
('Makyaj', 'Özel gün ve günlük makyaj hizmetleri', '/images/categories/makeup.jpg', 6, true, NOW(), NOW()),
('Nail Art', 'Manikür, pedikür ve tırnak süsleme', '/images/categories/nails.jpg', 7, true, NOW(), NOW()),
('Gelin Paketi', 'Gelin hazırlık ve düğün paketi hizmetleri', '/images/categories/bridal.jpg', 8, true, NOW(), NOW());

-- ============================================
-- 4. SERVICES (Hizmetler)
-- ============================================
INSERT INTO services ("categoryId", name, description, duration, price, "discountPrice", "isActive", "isPopular", "orderIndex", "createdAt", "updatedAt") VALUES
-- Saç Kesimi (categoryId: 1)
(1, 'Kadın Saç Kesimi', 'Profesyonel kadın saç kesimi ve şekillendirme', 60, 150.00, 120.00, true, true, 1, NOW(), NOW()),
(1, 'Erkek Saç Kesimi', 'Modern erkek saç kesimi ve styling', 45, 80.00, NULL, true, true, 2, NOW(), NOW()),
(1, 'Çocuk Saç Kesimi', '12 yaş altı çocuklar için saç kesimi', 30, 60.00, 50.00, true, false, 3, NOW(), NOW()),
(1, 'Sakal Tıraşı', 'Geleneksel ustura ile sakal tıraşı', 30, 50.00, NULL, true, false, 4, NOW(), NOW()),

-- Saç Boyama (categoryId: 2)
(2, 'Tek Renk Boya', 'Saçın tamamına tek renk boya uygulaması', 120, 200.00, 180.00, true, true, 1, NOW(), NOW()),
(2, 'Balyaj', 'Modern balyaj tekniği ile renklendirme', 180, 350.00, 300.00, true, true, 2, NOW(), NOW()),
(2, 'Röfle', 'Klasik röfle tekniği ile highlights', 150, 280.00, 250.00, true, false, 3, NOW(), NOW()),
(2, 'Ombre', 'Degradeli renk geçişi ile ombre boya', 160, 320.00, 290.00, true, true, 4, NOW(), NOW()),
(2, 'Dipten Alma', 'Saç köklerinin yeniden boyanması', 90, 120.00, 100.00, true, false, 5, NOW(), NOW()),

-- Saç Bakımı (categoryId: 3)
(3, 'Keratin Bakımı', 'Saç ipeksi parlaklık için keratin tedavisi', 120, 300.00, 250.00, true, true, 1, NOW(), NOW()),
(3, 'Argan Yağı Maskesi', 'Besleyici argan yağı ile saç maskesi', 45, 80.00, NULL, true, false, 2, NOW(), NOW()),
(3, 'Onarım Tedavisi', 'Yıpranmış saçlar için yoğun onarım', 90, 150.00, 130.00, true, true, 3, NOW(), NOW()),
(3, 'Saç Spa', 'Rahatlatıcı saç spa deneyimi', 75, 120.00, NULL, true, false, 4, NOW(), NOW()),

-- Kalıcı Makyaj (categoryId: 4)
(4, 'Microblading Kaş', 'Doğal görünümlü microblading kaş yapımı', 180, 800.00, 700.00, true, true, 1, NOW(), NOW()),
(4, 'Powder Brows', 'Pudra kaş tekniği ile kalıcı kaş', 150, 750.00, NULL, true, false, 2, NOW(), NOW()),
(4, 'Eyeliner', 'Kalıcı göz çizgisi uygulaması', 120, 600.00, 550.00, true, false, 3, NOW(), NOW()),
(4, 'Dudak Konturu', 'Doğal dudak konturu çizimi', 90, 500.00, NULL, true, false, 4, NOW(), NOW()),

-- Cilt Bakımı (categoryId: 5)
(5, 'Klasik Yüz Temizliği', 'Derinlemesine yüz temizliği ve bakımı', 75, 120.00, 100.00, true, true, 1, NOW(), NOW()),
(5, 'Hidrojen Peeling', 'Modern hidrojen peeling cilt bakımı', 60, 180.00, 160.00, true, true, 2, NOW(), NOW()),
(5, 'Altın Maske', 'Lüks altın maske ile anti-aging bakım', 90, 250.00, 220.00, true, false, 3, NOW(), NOW()),
(5, 'Akne Tedavisi', 'Akne ve sivilce tedavisi', 60, 150.00, NULL, true, false, 4, NOW(), NOW()),

-- Makyaj (categoryId: 6)
(6, 'Günlük Makyaj', 'Doğal ve hafif günlük makyaj', 45, 100.00, 80.00, true, true, 1, NOW(), NOW()),
(6, 'Özel Gün Makyajı', 'Özel günler için şık makyaj', 60, 150.00, 130.00, true, true, 2, NOW(), NOW()),
(6, 'Gece Makyajı', 'Davetler için göz alıcı makyaj', 75, 180.00, NULL, true, false, 3, NOW(), NOW()),
(6, 'Fotoğraf Makyajı', 'Fotoğraf çekimleri için profesyonel makyaj', 90, 200.00, 180.00, true, false, 4, NOW(), NOW()),

-- Nail Art (categoryId: 7)
(7, 'Klasik Manikür', 'Geleneksel manikür ve oje uygulaması', 45, 60.00, 50.00, true, true, 1, NOW(), NOW()),
(7, 'Kalıcı Oje (Gel)', 'Uzun süre dayanıklı kalıcı oje', 60, 80.00, 70.00, true, true, 2, NOW(), NOW()),
(7, 'Nail Art Design', 'Özel tasarım tırnak süslemesi', 90, 120.00, 100.00, true, false, 3, NOW(), NOW()),
(7, 'Pedikür', 'Ayak bakımı ve pedikür hizmeti', 60, 70.00, NULL, true, true, 4, NOW(), NOW()),
(7, 'Protez Tırnak', 'Uzatma ve protez tırnak uygulaması', 120, 150.00, 130.00, true, false, 5, NOW(), NOW()),

-- Gelin Paketi (categoryId: 8)
(8, 'Gelin Makyajı', 'Düğün günü için özel gelin makyajı', 120, 400.00, 350.00, true, true, 1, NOW(), NOW()),
(8, 'Gelin Saçı', 'Düğün saç modeli ve aksesuarları', 90, 300.00, 280.00, true, true, 2, NOW(), NOW()),
(8, 'Gelin Paketi (Full)', 'Saç, makyaj ve bakım paketi', 180, 600.00, 550.00, true, true, 3, NOW(), NOW()),
(8, 'Nişan Hazırlığı', 'Nişan töreni için özel hazırlık', 150, 350.00, 320.00, true, false, 4, NOW(), NOW());

-- ============================================
-- 5. STAFF (Personel)
-- ============================================
INSERT INTO staff ("firstName", "lastName", title, specialties, bio, phone, email, password, "lastLogin", "profileImage", "isActive", "workingDays", "orderIndex", "createdAt", "updatedAt") VALUES
('Zeynep', 'Çelik', 'Baş Kuaför', 'Saç kesimi, boyama, balyaj', 'Sektörde 8 yıllık deneyimi olan, modern tekniklerde uzman baş kuaför. Özellikle balyaj ve renklendirmede mükemmel işler çıkarır.', '0532 111 2233', 'zeynep@kuafor.com', '$2a$10$QOlGz4HMOOJJkNXGABkhJeC3.wF3Z8yJV6cJw1AQGcvJU0JOJ3K3m', NOW() - INTERVAL '1 hour', '/images/staff/zeynep.jpg', true, '1,2,3,4,5,6', 1, NOW(), NOW()),

('Fatma', 'Şahin', 'Kıdemli Kuaför', 'Saç bakımı, keratin, maske', 'Saç sağlığı konusunda uzman. Keratin ve bakım uygulamalarında 6 yıllık tecrübesi var. Müşteri memnuniyetini ön planda tutar.', '0533 222 3344', 'fatma@kuafor.com', '$2a$10$QOlGz4HMOOJJkNXGABkhJeC3.wF3Z8yJV6cJw1AQGcvJU0JOJ3K3m', NOW() - INTERVAL '30 minutes', '/images/staff/fatma.jpg', true, '1,2,3,4,5', 2, NOW(), NOW()),

('Elif', 'Demir', 'Makyaj Uzmanı', 'Kalıcı makyaj, microblading, günlük makyaj', 'Kalıcı makyaj ve microblading konusunda sertifikalı uzman. Her yüz tipine uygun doğal sonuçlar elde eder.', '0534 333 4455', 'elif@kuafor.com', '$2a$10$QOlGz4HMOOJJkNXGABkhJeC3.wF3Z8yJV6cJw1AQGcvJU0JOJ3K3m', NOW() - INTERVAL '2 hours', '/images/staff/elif.jpg', true, '2,3,4,5,6', 3, NOW(), NOW()),

('Selin', 'Aktaş', 'Cilt Bakım Uzmanı', 'Yüz temizliği, cilt bakımı, anti-aging', 'Cilt bakımı ve estetik konularında sertifikalı. Modern cihazları kullanarak etkili sonuçlar elde ediyor.', '0535 444 5566', 'selin@kuafor.com', '$2a$10$QOlGz4HMOOJJkNXGABkhJeC3.wF3Z8yJV6cJw1AQGcvJU0JOJ3K3m', NOW() - INTERVAL '4 hours', '/images/staff/selin.jpg', true, '1,3,4,5,6', 4, NOW(), NOW()),

('Aylin', 'Özkan', 'Nail Art Uzmanı', 'Manikür, pedikür, nail art, kalıcı oje', 'Tırnak bakımı ve süslemede yaratıcı çalışmalar yapan uzman. Trend tasarımları takip eder ve özgün çalışmalar yapar.', '0536 555 6677', 'aylin@kuafor.com', '$2a$10$QOlGz4HMOOJJkNXGABkhJeC3.wF3Z8yJV6cJw1AQGcvJU0JOJ3K3m', NOW() - INTERVAL '1 day', '/images/staff/aylin.jpg', true, '1,2,3,4,5', 5, NOW(), NOW()),

('Gizem', 'Kaya', 'Gelin Uzmanı', 'Gelin makyajı, gelin saçı, özel gün hazırlığı', 'Düğün ve özel günlerde mükemmel sonuçlar için çalışan gelin uzmanı. Her detayı titizlikle planlar.', '0537 666 7788', 'gizem@kuafor.com', '$2a$10$QOlGz4HMOOJJkNXGABkhJeC3.wF3Z8yJV6cJw1AQGcvJU0JOJ3K3K3m', NOW() - INTERVAL '3 hours', '/images/staff/gizem.jpg', true, '4,5,6,7', 6, NOW(), NOW());

-- ============================================
-- 6. CUSTOMERS (Müşteriler)
-- ============================================
INSERT INTO customers ("firstName", "lastName", phone, email, "birthDate", address, city, district, "loyaltyPoints", "hairType", "hairColor", notes, "createdAt", "updatedAt") VALUES
('Esra', 'Aydın', '0532 100 1001', 'esra.aydin@gmail.com', '1990-05-15', 'Atatürk Cad. No:45 Daire:8', 'İstanbul', 'Kadıköy', 250, 'Düz', 'Kahverengi', 'Saç dökülmesi sorunu var, hassas saç', NOW() - INTERVAL '6 months', NOW()),

('Merve', 'Koç', '0533 200 2002', 'merve.koc@hotmail.com', '1985-12-03', 'Cumhuriyet Mah. 123. Sok. No:67', 'İstanbul', 'Üsküdar', 580, 'Dalgalı', 'Sarı', 'Keratin tedavisi düzenli yapılıyor', NOW() - INTERVAL '1 year', NOW()),

('Ayşe', 'Yılmaz', '0534 300 3003', 'ayse.yilmaz@outlook.com', '1992-08-22', 'Barbaros Mah. Deniz Sok. 34/2', 'İstanbul', 'Beşiktaş', 120, 'Kıvırcık', 'Siyah', 'Kıvırcık saç bakımı önemli', NOW() - INTERVAL '3 months', NOW()),

('Gamze', 'Özdemir', '0535 400 4004', 'gamze.ozdemir@gmail.com', '1988-03-10', 'Şehit Muhtar Cad. 56/A', 'İstanbul', 'Beyoğlu', 340, 'Düz', 'Kestane', 'Balyaj ve renklendirme düzenli', NOW() - INTERVAL '8 months', NOW()),

('Seda', 'Karaca', '0536 500 5005', 'seda.karaca@yahoo.com', '1995-11-28', 'İnönü Mah. Gül Cad. 78/12', 'İstanbul', 'Şişli', 95, 'Dalgalı', 'Kumral', 'Hassas cilt, allerjik reaksiyonlara dikkat', NOW() - INTERVAL '2 months', NOW()),

('Zehra', 'Çetin', '0537 600 6006', 'zehra.cetin@icloud.com', '1982-07-07', 'Beşyol Mah. 987. Sok. 12/5', 'İstanbul', 'Fatih', 750, 'Düz', 'Gri', 'Yaşlı müşteri, saç dökülmesi', NOW() - INTERVAL '2 years', NOW()),

('Nazlı', 'Demirer', '0538 700 7007', 'nazli.demirer@gmail.com', '1993-01-18', 'Acıbadem Mah. Çiçek Sok. 23/A', 'İstanbul', 'Kadıköy', 425, 'Kıvırcık', 'Sarı', 'Kalıcı makyaj müşterisi', NOW() - INTERVAL '10 months', NOW()),

('Büşra', 'Aslan', '0539 800 8008', 'busra.aslan@hotmail.com', '1991-09-12', 'Etiler Mah. Park Cad. 45/8', 'İstanbul', 'Beşiktaş', 180, 'Düz', 'Siyah', 'Gelin paketlerine ilgi gösteriyor', NOW() - INTERVAL '4 months', NOW()),

('Gül', 'Güven', '0530 900 9009', 'gul.guven@gmail.com', '1987-04-25', 'Kozyatağı Mah. 1234. Sok. 56/C', 'İstanbul', 'Kadıköy', 320, 'Dalgalı', 'Kahverengi', 'Cilt bakımı düzenli alıyor', NOW() - INTERVAL '7 months', NOW()),

('Pınar', 'Şen', '0531 111 1111', 'pinar.sen@outlook.com', '1994-06-30', 'Maslak Mah. Teknoloji Cad. 789', 'İstanbul', 'Sarıyer', 140, 'Düz', 'Kumral', 'Nail art tutkunu', NOW() - INTERVAL '5 months', NOW()),

('Deniz', 'Polat', '0532 222 2222', 'deniz.polat@gmail.com', '1986-10-14', 'Nişantaşı Mah. Moda Sok. 12/3', 'İstanbul', 'Şişli', 670, 'Dalgalı', 'Sarı', 'VIP müşteri, özel günlerde geliyor', NOW() - INTERVAL '1.5 years', NOW()),

('Ceren', 'Türk', '0533 333 3333', 'ceren.turk@icloud.com', '1989-02-20', 'Levent Mah. İş Merkezi Cad. 456/7', 'İstanbul', 'Beşiktaş', 210, 'Kıvırcık', 'Kestane', 'Saç bakımı konusunda titiz', NOW() - INTERVAL '6 months', NOW()),

('İrem', 'Başar', '0534 444 4444', 'irem.basar@hotmail.com', '1996-12-05', 'Bostancı Mah. Sahil Yolu 321/B', 'İstanbul', 'Kadıköy', 85, 'Düz', 'Siyah', 'Genç müşteri, trend takipçisi', NOW() - INTERVAL '2 months', NOW()),

('Ece', 'Mutlu', '0535 555 5555', 'ece.mutlu@gmail.com', '1984-08-11', 'Çamlıca Mah. Tepede Sok. 654/A', 'İstanbul', 'Üsküdar', 490, 'Dalgalı', 'Kahverengi', 'Düzenli müşteri, tüm hizmetleri alıyor', NOW() - INTERVAL '11 months', NOW()),

('Sinem', 'Akın', '0536 666 6666', 'sinem.akin@yahoo.com', '1990-03-17', 'Mecidiyeköy Mah. Plaza Cad. 987/12', 'İstanbul', 'Şişli', 365, 'Düz', 'Sarı', 'İş kadını, hızlı hizmet istiyor', NOW() - INTERVAL '9 months', NOW());

-- ============================================
-- 7. BUSINESS HOURS (Çalışma Saatleri)
-- ============================================
INSERT INTO business_hours ("dayOfWeek", "openTime", "closeTime", "isClosed", "createdAt", "updatedAt") VALUES
(1, '09:00:00', '19:00:00', false, NOW(), NOW()), -- Pazartesi
(2, '09:00:00', '19:00:00', false, NOW(), NOW()), -- Salı
(3, '09:00:00', '19:00:00', false, NOW(), NOW()), -- Çarşamba
(4, '09:00:00', '19:00:00', false, NOW(), NOW()), -- Perşembe
(5, '09:00:00', '19:00:00', false, NOW(), NOW()), -- Cuma
(6, '10:00:00', '18:00:00', false, NOW(), NOW()), -- Cumartesi
(7, NULL, NULL, true, NOW(), NOW()); -- Pazar (Kapalı)

-- ============================================
-- 8. APPOINTMENTS (Randevular)
-- ============================================
INSERT INTO appointments ("customerId", "staffId", "serviceId", "statusId", "appointmentDate", "startTime", "endTime", notes, price, "discountAmount", "createdByAdmin", "createdAt", "updatedAt") VALUES
-- Geçmiş randevular (tamamlanan)
(1, 1, 1, 4, '2024-06-15', '10:00:00', '11:00:00', 'İlk kez geldi, saç kesimi başarılı', 150.00, 30.00, 1, NOW() - INTERVAL '8 days', NOW()),
(2, 2, 9, 4, '2024-06-16', '14:00:00', '16:00:00', 'Keratin tedavisi uygulandı', 300.00, 50.00, 1, NOW() - INTERVAL '7 days', NOW()),
(3, 3, 13, 4, '2024-06-17', '11:30:00', '14:30:00', 'Microblading işlemi başarılı', 800.00, 100.00, 2, NOW() - INTERVAL '6 days', NOW()),
(4, 1, 5, 4, '2024-06-18', '09:00:00', '11:00:00', 'Balyaj uygulandı, çok beğendi', 350.00, 50.00, 1, NOW() - INTERVAL '5 days', NOW()),
(5, 4, 17, 4, '2024-06-19', '15:00:00', '16:15:00', 'Yüz temizliği yapıldı', 120.00, 20.00, 2, NOW() - INTERVAL '4 days', NOW()),

-- Yakın geçmiş randevular
(6, 5, 23, 4, '2024-06-20', '13:00:00', '14:00:00', 'Kalıcı oje uygulandı', 80.00, 10.00, 1, NOW() - INTERVAL '3 days', NOW()),
(7, 3, 21, 4, '2024-06-21', '10:30:00', '11:15:00', 'Günlük makyaj yapıldı', 100.00, 20.00, 2, NOW() - INTERVAL '2 days', NOW()),
(8, 6, 28, 4, '2024-06-22', '16:00:00', '17:30:00', 'Gelin makyajı prova', 400.00, 50.00, 1, NOW() - INTERVAL '1 day', NOW()),

-- Bugünkü randevular
(9, 2, 11, 3, CURRENT_DATE, '10:00:00', '11:30:00', 'Onarım tedavisi uygulanıyor', 150.00, 20.00, 1, NOW() - INTERVAL '2 hours', NOW()),
(10, 1, 2, 2, CURRENT_DATE, '14:00:00', '15:00:00', 'Erkek saç kesimi onaylandı', 80.00, 0.00, 2, NOW() - INTERVAL '1 hour', NOW()),
(11, 4, 18, 2, CURRENT_DATE, '15:30:00', '16:30:00', 'Hidrojen peeling randevusu', 180.00, 20.00, 1, NOW() - INTERVAL '30 minutes', NOW()),

-- Gelecek randevular
(12, 3, 14, 2, CURRENT_DATE + INTERVAL '1 day', '11:00:00', '12:30:00', 'Powder brows işlemi', 750.00, 0.00, 2, NOW(), NOW()),
(13, 5, 25, 2, CURRENT_DATE + INTERVAL '1 day', '14:00:00', '15:30:00', 'Nail art tasarım', 120.00, 20.00, 1, NOW(), NOW()),
(14, 6, 30, 2, CURRENT_DATE + INTERVAL '2 days', '10:00:00', '11:30:00', 'Gelin saçı deneme', 300.00, 20.00, 1, NOW(), NOW()),
(15, 1, 7, 2, CURRENT_DATE + INTERVAL '3 days', '13:00:00', '15:30:00', 'Röfle boya işlemi', 280.00, 30.00, 2, NOW(), NOW()),
(1, 2, 10, 2, CURRENT_DATE + INTERVAL '4 days', '16:00:00', '17:00:00', 'Argan yağı maskesi', 80.00, 0.00, 1, NOW(), NOW()),

-- Bekleyen onay randevular
(2, 1, 8, 1, CURRENT_DATE + INTERVAL '5 days', '11:00:00', '13:40:00', 'Ombre boya talebi', 320.00, 30.00, NULL, NOW(), NOW()),
(3, 4, 19, 1, CURRENT_DATE + INTERVAL '6 days', '14:30:00', '16:00:00', 'Altın maske talebi', 250.00, 30.00, NULL, NOW(), NOW()),

-- İptal edilmiş randevu
(4, 5, 24, 5, CURRENT_DATE + INTERVAL '1 day', '09:00:00', '10:00:00', 'Müşteri iptal etti', 70.00, 0.00, 1, NOW() - INTERVAL '2 hours', NOW()),

-- Gelmedi
(5, 3, 22, 6, CURRENT_DATE - INTERVAL '1 day', '16:00:00', '17:15:00', 'Müşteri gelmedi, arandı', 150.00, 20.00, 2, NOW() - INTERVAL '1 day', NOW());

-- Sequence'leri güncelle (PostgreSQL için)
SELECT setval('admin_id_seq', (SELECT MAX(id) FROM admin));
SELECT setval('appointment_statuses_id_seq', (SELECT MAX(id) FROM appointment_statuses));
SELECT setval('service_categories_id_seq', (SELECT MAX(id) FROM service_categories));
SELECT setval('services_id_seq', (SELECT MAX(id) FROM services));
SELECT setval('staff_id_seq', (SELECT MAX(id) FROM staff));
SELECT setval('customers_id_seq', (SELECT MAX(id) FROM customers));
SELECT setval('business_hours_id_seq', (SELECT MAX(id) FROM business_hours));
SELECT setval('appointments_id_seq', (SELECT MAX(id) FROM appointments));
