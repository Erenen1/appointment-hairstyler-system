-- ============================================
-- SEED DATA - UUID'LI TABLOLAR İÇİN
-- ============================================

-- Hizmet kategorileri
INSERT INTO service_categories (id, name, description, order_index, is_active) VALUES
('550e8400-e29b-41d4-a716-446655440001', 'Saç Bakımı', 'Tüm saç bakım hizmetleri', 1, true),
('550e8400-e29b-41d4-a716-446655440002', 'Cilt Bakımı', 'Yüz ve cilt bakım hizmetleri', 2, true),
('550e8400-e29b-41d4-a716-446655440003', 'Makyaj', 'Özel gün ve günlük makyaj hizmetleri', 3, true),
('550e8400-e29b-41d4-a716-446655440004', 'Tırnak Bakımı', 'El ve ayak tırnak bakımı', 4, true);

-- Yöneticiler
INSERT INTO admins (id, full_name, email, password, phone, is_active) VALUES
('650e8400-e29b-41d4-a716-446655440001', 'Admin User', 'admin@kuafor.com', '$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', '+90 555 000 0001', true);

-- Müşteriler
INSERT INTO customers (id, email, full_name, phone, notes, is_active) VALUES
('750e8400-e29b-41d4-a716-446655440001', 'ayse@email.com', 'Ayşe Yılmaz', '+90 555 111 1111', 'Düzenli müşteri', true),
('750e8400-e29b-41d4-a716-446655440002', 'fatma@email.com', 'Fatma Kaya', '+90 555 222 2222', '', true),
('750e8400-e29b-41d4-a716-446655440003', 'zeynep@email.com', 'Zeynep Demir', '+90 555 333 3333', 'Özel gün makyajı tercih ediyor', true);

-- Personeller
INSERT INTO staff (id, email, full_name, phone, avatar, specialties, is_active) VALUES
('850e8400-e29b-41d4-a716-446655440001', 'elif@kuafor.com', 'Elif Şahin', '+90 555 444 4444', null, 'Saç kesimi, boyama, fön', true),
('850e8400-e29b-41d4-a716-446655440002', 'seda@kuafor.com', 'Seda Özkan', '+90 555 555 5555', null, 'Cilt bakımı, makyaj', true),
('850e8400-e29b-41d4-a716-446655440003', 'melike@kuafor.com', 'Melike Arslan', '+90 555 666 6666', null, 'Tırnak bakımı, manikür, pedikür', true);

-- Hizmetler
INSERT INTO services (id, category_id, slug, title, description, duration, price, is_active, order_index) VALUES
('950e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440001', 'sac-kesimi', 'Saç Kesimi', 'Profesyonel saç kesimi hizmeti', '45 dakika', '150 TL', true, 1),
('950e8400-e29b-41d4-a716-446655440002', '550e8400-e29b-41d4-a716-446655440001', 'sac-boyama', 'Saç Boyama', 'Kaliteli boyalar ile saç boyama', '120 dakika', '300 TL', true, 2),
('950e8400-e29b-41d4-a716-446655440003', '550e8400-e29b-41d4-a716-446655440001', 'fon-islemi', 'Fön İşlemi', 'Profesyonel fön ve şekillendirme', '30 dakika', '80 TL', true, 3),
('950e8400-e29b-41d4-a716-446655440004', '550e8400-e29b-41d4-a716-446655440002', 'cilt-temizligi', 'Cilt Temizliği', 'Derin cilt temizliği ve bakımı', '60 dakika', '200 TL', true, 4),
('950e8400-e29b-41d4-a716-446655440005', '550e8400-e29b-41d4-a716-446655440003', 'ozel-gun-makyaji', 'Özel Gün Makyajı', 'Düğün, nişan ve özel günler için makyaj', '90 dakika', '250 TL', true, 5),
('950e8400-e29b-41d4-a716-446655440006', '550e8400-e29b-41d4-a716-446655440004', 'manikur', 'Manikür', 'El tırnak bakımı ve süsleme', '45 dakika', '100 TL', true, 6);

-- Personel-Hizmet İlişkileri
INSERT INTO staff_services (id, staff_id, service_id) VALUES
('a50e8400-e29b-41d4-a716-446655440001', '850e8400-e29b-41d4-a716-446655440001', '950e8400-e29b-41d4-a716-446655440001'),
('a50e8400-e29b-41d4-a716-446655440002', '850e8400-e29b-41d4-a716-446655440001', '950e8400-e29b-41d4-a716-446655440002'),
('a50e8400-e29b-41d4-a716-446655440003', '850e8400-e29b-41d4-a716-446655440001', '950e8400-e29b-41d4-a716-446655440003'),
('a50e8400-e29b-41d4-a716-446655440004', '850e8400-e29b-41d4-a716-446655440002', '950e8400-e29b-41d4-a716-446655440004'),
('a50e8400-e29b-41d4-a716-446655440005', '850e8400-e29b-41d4-a716-446655440002', '950e8400-e29b-41d4-a716-446655440005'),
('a50e8400-e29b-41d4-a716-446655440006', '850e8400-e29b-41d4-a716-446655440003', '950e8400-e29b-41d4-a716-446655440006');

-- İş Saatleri
INSERT INTO business_hours (id, day_of_week, open_time, close_time, is_closed) VALUES
('b50e8400-e29b-41d4-a716-446655440001', 1, '09:00', '18:00', false), -- Pazartesi
('b50e8400-e29b-41d4-a716-446655440002', 2, '09:00', '18:00', false), -- Salı
('b50e8400-e29b-41d4-a716-446655440003', 3, '09:00', '18:00', false), -- Çarşamba
('b50e8400-e29b-41d4-a716-446655440004', 4, '09:00', '18:00', false), -- Perşembe
('b50e8400-e29b-41d4-a716-446655440005', 5, '09:00', '18:00', false), -- Cuma
('b50e8400-e29b-41d4-a716-446655440006', 6, '09:00', '17:00', false), -- Cumartesi
('b50e8400-e29b-41d4-a716-446655440007', 7, null, null, true); -- Pazar - Kapalı

-- Galeri Kategorileri
INSERT INTO gallery_categories (id, name, description, order_index) VALUES
('c50e8400-e29b-41d4-a716-446655440001', 'Saç Modelleri', 'Yapmış olduğumuz saç kesimi ve modellemeleri', 1),
('c50e8400-e29b-41d4-a716-446655440002', 'Makyaj Çalışmaları', 'Özel gün makyaj örnekleri', 2),
('c50e8400-e29b-41d4-a716-446655440003', 'Tırnak Sanatı', 'Nail art ve manikür örnekleri', 3);

-- Örnek Randevular
INSERT INTO appointments (id, customer_id, staff_id, service_id, appointment_date, start_time, end_time, notes, price) VALUES
('d50e8400-e29b-41d4-a716-446655440001', '750e8400-e29b-41d4-a716-446655440001', '850e8400-e29b-41d4-a716-446655440001', '950e8400-e29b-41d4-a716-446655440001', '2024-12-20', '10:00', '10:45', 'Kısa saç kesimi', 150.00),
('d50e8400-e29b-41d4-a716-446655440002', '750e8400-e29b-41d4-a716-446655440002', '850e8400-e29b-41d4-a716-446655440002', '950e8400-e29b-41d4-a716-446655440005', '2024-12-21', '14:00', '15:30', 'Düğün makyajı', 250.00); 