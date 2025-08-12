// Generic CSV export function
export const exportToCsv = (
    data: any[],
    headers: string[],
    filename: string,
    transformRow?: (item: any) => any[]
) => {
    const csvData = data.map(item => {
        if (transformRow) {
            return transformRow(item);
        }
        // Default transformation - extract values based on header keys
        return headers.map(header => {
            const key = header.toLowerCase().replace(/\s+/g, '');
            return item[key] || item[header] || '';
        });
    });

    const csvContent = [headers, ...csvData]
        .map(row => row.map(field => `"${field}"`).join(','))
        .join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `${filename}_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
};

// Customer export functions
export const exportCustomersToCsv = (customers: any[]) => {
    const headers = [
        "ID", "Ad Soyad", "Telefon", "E-posta", "Meslek", "İlgi Alanı", "Bütçe",
        "Kategori", "Öncelik", "Durum", "Son İletişim"
    ];

    const transformRow = (customer: any) => [
        customer.id,
        customer.fullName,
        customer.phone,
        customer.email,
        customer.profession,
        customer.preferredType,
        customer.budget,
        customer.preferredCategory,
        customer.priority === "high" ? "Yüksek" : customer.priority === "medium" ? "Orta" : "Düşük",
        customer.isActive ? "Aktif" : "Pasif",
        new Date(customer.lastContact).toLocaleDateString('tr-TR')
    ];

    exportToCsv(customers, headers, 'musteri_listesi', transformRow);
};

// Expense export functions
export const exportExpensesToCsv = (expenses: any[]) => {
    const headers = [
        "ID", "Kategori", "Tutar", "Tarih", "Açıklama", "Ödeme Yöntemi"
    ];

    const transformRow = (expense: any) => [
        expense.id,
        expense.category,
        expense.amount.toFixed(2) + " ₺",
        new Date(expense.date).toLocaleDateString('tr-TR'),
        expense.description,
        expense.paymentMethod === "bank" ? "Banka" :
            expense.paymentMethod === "card" ? "Kart" :
                expense.paymentMethod === "cash" ? "Nakit" : expense.paymentMethod
    ];

    exportToCsv(expenses, headers, 'gider_listesi', transformRow);
};

// Income export functions
export const exportIncomeToCsv = (income: any[]) => {
    const headers = [
        "ID", "Kategori", "Tutar", "Tarih", "Açıklama", "Ödeme Yöntemi", "Kaynak"
    ];

    const transformRow = (item: any) => [
        item.id,
        item.category,
        item.amount.toFixed(2) + " ₺",
        new Date(item.date).toLocaleDateString('tr-TR'),
        item.description,
        item.paymentMethod === "cash" ? "Nakit" : "Kart",
        item.source === "service_sales" ? "Hizmet Satışı" :
            item.source === "property_sale" ? "Emlak Satışı" :
                item.source === "consulting" ? "Danışmanlık" : item.source
    ];

    exportToCsv(income, headers, 'gelir_listesi', transformRow);
};

// Properties export functions
export const exportPropertiesToCsv = (properties: any[]) => {
    const headers = [
        "ID", "Başlık", "Tür", "Kategori", "Konum", "Alan (m²)", "Oda", "Fiyat",
        "Görüntüleme", "Tıklama", "Emlakçı", "Durum"
    ];

    const transformRow = (property: any) => [
        property.id,
        property.title,
        property.type,
        property.category,
        property.location,
        property.area,
        property.rooms,
        property.price.toLocaleString() + " ₺",
        property.views || 0,
        property.clicks || 0,
        property.agentId || "Belirtilmemiş",
        property.status === "active" ? "Aktif" : "Pasif"
    ];

    exportToCsv(properties, headers, 'ilan_listesi', transformRow);
};

// Services export functions
export const exportServicesToCsv = (services: any[]) => {
    const headers = [
        "ID", "Başlık", "Kategori", "Süre", "Fiyat", "Durum"
    ];

    const transformRow = (service: any) => [
        service.id,
        service.title,
        service.categoryId || "Belirtilmemiş",
        service.duration + " dk",
        service.price + " ₺",
        service.isActive ? "Aktif" : "Pasif"
    ];

    exportToCsv(services, headers, 'hizmet_listesi', transformRow);
};

// Appointments export functions
export const exportAppointmentsToCsv = (appointments: any[]) => {
    const headers = [
        "ID", "Tarih", "Başlangıç", "Bitiş", "Hizmet", "Uzman", "Durum", "Fiyat"
    ];

    const transformRow = (appointment: any) => [
        appointment.id,
        new Date(appointment.appointmentDate).toLocaleDateString('tr-TR'),
        appointment.startTime.slice(0, 5),
        appointment.endTime.slice(0, 5),
        appointment.service,
        appointment.staff,
        appointment.status === "confirmed" ? "Onaylandı" :
            appointment.status === "pending" ? "Beklemede" :
                appointment.status === "cancelled" ? "İptal" : appointment.status,
        appointment.price + " ₺"
    ];

    exportToCsv(appointments, headers, 'randevu_listesi', transformRow);
};

// Bills export functions
export const exportBillsToCsv = (bills: any[]) => {
    const headers = [
        "ID", "Masa No", "Müşteri", "Ürünler", "Toplam", "Durum", "Açılış Tarihi"
    ];

    const transformRow = (bill: any) => [
        bill.id,
        bill.tableNumber,
        bill.customerName,
        bill.items.map((item: any) => item.serviceName).join(", "),
        bill.total.toFixed(2) + " ₺",
        bill.status === "open" ? "Açık" :
            bill.status === "closed" ? "Kapalı" : "İptal",
        new Date(bill.openedAt).toLocaleDateString('tr-TR')
    ];

    exportToCsv(bills, headers, 'adisyon_listesi', transformRow);
};

// Current accounts export functions
export const exportCurrentAccountsToCsv = (accounts: any[]) => {
    const headers = [
        "ID", "Müşteri Adı", "Telefon", "E-posta", "Bakiye", "Durum", "Son İşlem"
    ];

    const transformRow = (account: any) => [
        account.id,
        account.name,
        account.phone,
        account.email,
        account.balance.toFixed(2) + " ₺",
        account.status === "active" ? "Aktif" :
            account.status === "overdue" ? "Gecikmiş" : "Ödenmiş",
        new Date(account.lastTransaction).toLocaleDateString('tr-TR')
    ];

    exportToCsv(accounts, headers, 'cari_hesaplar', transformRow);
};

// Property analytics export functions
export const exportPropertyAnalyticsToCsv = (properties: any[]) => {
    const headers = [
        "ID", "İlan Başlığı", "Tür", "Kategori", "Konum", "Fiyat",
        "Alan (m²)", "Görüntüleme", "Tıklama", "Tıklama Oranı", "Oluşturulma Tarihi"
    ];

    const transformRow = (property: any) => {
        const clickRate = property.views > 0 ? (property.clicks / property.views) * 100 : 0;
        return [
            property.id,
            property.title,
            property.type,
            property.category,
            property.location,
            property.price,
            property.area,
            property.views,
            property.clicks,
            `${clickRate.toFixed(1)}%`,
            new Date(property.createdAt).toLocaleDateString('tr-TR')
        ];
    };

    exportToCsv(properties, headers, 'ilan_analitikleri', transformRow);
};

