// ========================================
// 🎯 APPOINTMENTS MODULE - RANDEVULAR
// ========================================
// 
// 📋 MODULE OVERVIEW
// Profesyonel randevu yönetimi ve takvimi
// Müşteriler sayfası ile %100 uyumlu tasarım
// Production-ready ve tam özellikli
//
// 🎨 DESIGN FEATURES
// - Hero Section: Mavi gradient arka plan
// - İstatistik Kartları: 8 adet gradient kart
// - Modern Grafikler: Line + Doughnut charts
// - Profesyonel Tablo: Müşteriler sayfası stili
// - Transparent Butonlar: Update/Sil şeffaf tasarım
// - Gradient Form: Kategorize edilmiş bölümler
//
// 🚀 FUNCTIONALITY
// - CRUD İşlemleri: Ekleme, güncelleme, silme
// - Export: Excel/CSV formatında veri indirme
// - Arama & Filtreleme: Gelişmiş özellikler
// - Responsive: Tüm ekran boyutlarında uyumlu
//
// 🎨 COLOR PALETTE
// - Genel: Mavi, yeşil, mor, turuncu
// - Durum: Emerald, amber, kırmızı, slate
// - Gradient: from-{color}-50 to-{color}-100
// - Border: border-{color}-200
//
// 📱 RESPONSIVE DESIGN
// - Mobile-first approach
// - Grid: grid-cols-1 md:grid-cols-2 lg:grid-cols-4
// - Spacing: space-y-6, gap-6, p-8
// - Shadows: shadow-lg, hover:shadow-xl
//
// ========================================

// Main Components
export { default as AppointmentsPage } from './AppointmentsPage';
export { default as AppointmentForm } from './components/AppointmentForm';
export { default as AppointmentStats } from './components/AppointmentStats';

// Types
export * from './types';

// Utilities
export * from './utils/exportUtils';

// ========================================
// 🎯 USAGE TEMPLATE
// ========================================
//
// import { AppointmentsPage } from '@/features/appointments';
//
// // Mock verilerle kullanım
// <AppointmentsPage
//     appointments={appointmentsData}
//     services={servicesData}
//     staff={staffData}
//     statuses={appointmentStatusesData}
// />
//
// ========================================
// 🎨 DESIGN PATTERNS TO COPY
// ========================================
//
// 1. HERO SECTION:
//    <div className="bg-gradient-to-br from-blue-50 to-indigo-100 rounded-xl p-8 border border-blue-200">
//        <div className="text-center mb-8">
//            <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full mb-6 shadow-lg">
//                <i className="pi pi-calendar text-white text-3xl"></i>
//            </div>
//            <h1 className="text-4xl font-bold text-gray-900 mb-3">Başlık</h1>
//            <p className="text-lg text-gray-600 max-w-2xl mx-auto">Açıklama</p>
//        </div>
//    </div>
//
// 2. STATS CARDS:
//    <Card className={`bg-gradient-to-br ${bgColor} ${borderColor} hover:shadow-lg transition-all duration-200`}>
//        <div className="flex items-center justify-between">
//            <div>
//                <p className={`text-sm font-medium ${textColor} mb-2`}>{title}</p>
//                <p className={`text-3xl font-bold ${valueColor}`}>{value}</p>
//                <p className={`text-xs ${textColor}`}>{description}</p>
//            </div>
//            <div className={`w-14 h-14 ${iconBg} rounded-2xl flex items-center justify-center shadow-lg`}>
//                <i className={`pi ${icon} text-white text-xl`}></i>
//            </div>
//        </div>
//    </Card>
//
// 3. TABLE HEADER:
//    <div className="flex flex-wrap gap-4 justify-between items-center pb-6 border-b border-gray-100">
//        <div className="flex gap-3 items-center">
//            <span className="p-input-icon-left">
//                <i className="pi pi-search" />
//                <InputText placeholder="Ara..." className="w-80" />
//            </span>
//        </div>
//        <div className="flex gap-3">
//            <Button icon="pi pi-download" label="Export" severity="success" className="bg-green-600 hover:bg-green-700 border-green-600" />
//            <Button icon="pi pi-plus" label="Yeni Ekle" className="bg-blue-600 hover:bg-blue-700 border-blue-600" />
//        </div>
//    </div>
//
// 4. TRANSPARENT ACTION BUTTONS:
//    <div className="flex items-center gap-2">
//        <Button icon="pi pi-pencil" severity="info" size="small" text className="hover:bg-blue-50 transition-all duration-200" />
//        <Button icon="pi pi-trash" severity="danger" size="small" text className="hover:bg-red-50 transition-all duration-200" />
//    </div>
//
// 5. GRADIENT FORM SECTIONS:
//    <div className="bg-gradient-to-r from-{color}-50 to-{color}-100 p-6 rounded-2xl border border-{color}-100">
//        <h3 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-3">
//            <div className="w-10 h-10 bg-{color}-500 rounded-xl flex items-center justify-center">
//                <i className="pi pi-{icon} text-white text-lg"></i>
//            </div>
//            Başlık
//        </h3>
//        {/* Form içeriği */}
//    </div>
//
// ========================================