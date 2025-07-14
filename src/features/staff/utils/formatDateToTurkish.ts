export function formatDateToTurkish(dateInput: string | number | Date | undefined) {
    if (!dateInput) return '';

    try {
        const date = new Date(dateInput);
        return date.toLocaleDateString('tr-TR', {
            day: '2-digit',
            month: 'long',
            year: 'numeric',
        });
    } catch (error) {
        console.error('Tarih formatı hatası:', error);
        return '';
    }
}