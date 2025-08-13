import { toast } from 'sonner';

// Toast tipleri
export type ToastType = 'success' | 'error' | 'warning' | 'info';

// Toast konfigürasyonu
interface ToastConfig {
    title: string;
    description?: string;
    type?: ToastType;
    duration?: number;
}

// Emoji mapping
const EMOJI_MAP = {
    success: '✅',
    error: '❌',
    warning: '⚠️',
    info: 'ℹ️',
} as const;

// Renk mapping
const COLOR_MAP = {
    success: {
        background: '#f0fdf4',
        border: '#bbf7d0',
        text: '#166534',
        icon: '#16a34a',
    },
    error: {
        background: '#fef2f2',
        border: '#fecaca',
        text: '#991b1b',
        icon: '#dc2626',
    },
    warning: {
        background: '#fffbeb',
        border: '#fed7aa',
        text: '#92400e',
        icon: '#ea580c',
    },
    info: {
        background: '#eff6ff',
        border: '#bfdbfe',
        text: '#1e40af',
        icon: '#3b82f6',
    },
} as const;

// Global toast fonksiyonu
export const showToast = ({
    title,
    type = 'info',
    duration = 4000,
}: ToastConfig) => {
    const emoji = EMOJI_MAP[type];
    const colors = COLOR_MAP[type];

    // Sadece durum mesajı ve emoji döndür
    const toastContent = `${emoji} ${title}`;

    toast(toastContent, {
        duration,
        style: {
            background: colors.background,
            border: `1px solid ${colors.border}`,
            borderRadius: '12px',
            padding: '16px',
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
        },
    });
};

// Kısayol fonksiyonları - toast.success() şeklinde kullanım için
export const showSuccessToast = (title: string, description?: string) => {
    showToast({ title, description, type: 'success' });
};

export const showErrorToast = (title: string) => {
    showToast({ title, type: 'error' });
};

export const showWarningToast = (title: string) => {
    showToast({ title, type: 'warning' });
};

export const showInfoToast = (title: string) => {
    showToast({ title, type: 'info' });
};

// Direkt toast.success() kullanımı için
export { toast };
