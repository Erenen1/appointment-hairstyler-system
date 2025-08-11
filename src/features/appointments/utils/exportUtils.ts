import { Appointment } from '../types';
import { Service } from '../../services/types';
import { Staff } from '../../../service/dataService';

export const exportAppointmentsToCSV = (
    appointments: Appointment[],
    services: Service[],
    staff: Staff[]
): void => {
    // CSV başlıkları
    const headers = [
        'ID',
        'Tarih',
        'Başlangıç Saati',
        'Bitiş Saati',
        'Hizmet',
        'Uzman',
        'Müşteri ID',
        'Durum ID',
        'Notlar',
        'Süre (Dakika)',
        'Fiyat',
        'Oluşturulma Tarihi',
        'Güncellenme Tarihi'
    ];

    // CSV satırları
    const rows = appointments.map(appointment => {
        const service = services.find(s => s.id === appointment.serviceId);
        const staffMember = staff.find(s => s.id === appointment.staffId);

        return [
            appointment.id,
            appointment.appointmentDate,
            appointment.startTime,
            appointment.endTime,
            service?.title || '',
            staffMember?.fullName || '',
            appointment.customerId,
            appointment.statusId,
            appointment.notes || '',
            appointment.duration,
            appointment.price,
            appointment.createdAt,
            appointment.updatedAt
        ];
    });

    // CSV içeriğini oluştur
    const csvContent = [
        headers.join(','),
        ...rows.map(row => row.map(cell => `"${cell}"`).join(','))
    ].join('\n');

    // BOM ekle (Excel'de Türkçe karakterler için)
    const BOM = '\uFEFF';
    const csvContentWithBOM = BOM + csvContent;

    // Dosyayı indir
    const blob = new Blob([csvContentWithBOM], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);

    link.setAttribute('href', url);
    link.setAttribute('download', `randevular_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
};

export const exportAppointmentsToExcel = (
    appointments: Appointment[],
    services: Service[],
    staff: Staff[]
): void => {
    // Excel formatında export için CSV kullan (Excel otomatik olarak açacak)
    exportAppointmentsToCSV(appointments, services, staff);
};
