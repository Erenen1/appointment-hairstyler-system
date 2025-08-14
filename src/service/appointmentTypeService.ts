import { AppointmentType } from '@/features/appointments/types/types';

const API_BASE_URL = 'http://148.230.104.189:8000/api';

export class AppointmentTypeService {
    private static async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
        const url = `${API_BASE_URL}${endpoint}`;

        const defaultOptions: RequestInit = {
            headers: {
                'Content-Type': 'application/json',
                ...options.headers,
            },
            ...options,
        };

        try {
            const response = await fetch(url, defaultOptions);

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            return await response.json();
        } catch (error) {
            console.error('API request failed:', error);
            throw error;
        }
    }

    static async getAllAppointmentTypes(): Promise<AppointmentType[]> {
        return this.request<AppointmentType[]>('/appointment-types');
    }

    static async getAppointmentTypeById(id: number): Promise<AppointmentType> {
        return this.request<AppointmentType>(`/appointment-types/${id}`);
    }

    static async createAppointmentType(appointmentType: Omit<AppointmentType, 'id'>): Promise<AppointmentType> {
        return this.request<AppointmentType>('/appointment-types', {
            method: 'POST',
            body: JSON.stringify(appointmentType),
        });
    }

    static async updateAppointmentType(id: number, appointmentType: Partial<AppointmentType>): Promise<AppointmentType> {
        return this.request<AppointmentType>(`/appointment-types/${id}`, {
            method: 'PUT',
            body: JSON.stringify(appointmentType),
        });
    }

    static async deleteAppointmentType(id: number): Promise<void> {
        return this.request<void>(`/appointment-types/${id}`, {
            method: 'DELETE',
        });
    }

    // Mock data fallback for development
    static async getMockAppointmentTypes(): Promise<AppointmentType[]> {
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 200));

        // Return mock data from appointment-types.json
        try {
            const response = await fetch('/mocks/appointment-types.json');
            if (response.ok) {
                return await response.json();
            }
        } catch (error) {
            console.warn('Failed to load mock appointment types, using fallback data');
        }

        // Fallback data
        return [
            {
                id: 1,
                name: "property_viewing",
                displayName: "Emlak Görüntüleme",
                description: "Müşteri ile birlikte emlak görüntüleme randevusu",
                color: "blue",
                icon: "pi pi-home"
            },
            {
                id: 2,
                name: "property_evaluation",
                displayName: "Emlak Değerleme",
                description: "Emlak değerleme ve fiyat belirleme randevusu",
                color: "green",
                icon: "pi pi-calculator"
            },
            {
                id: 3,
                name: "contract_signing",
                displayName: "Sözleşme İmzalama",
                description: "Kira veya satış sözleşmesi imzalama randevusu",
                color: "purple",
                icon: "pi pi-file-edit"
            },
            {
                id: 4,
                name: "consultation",
                displayName: "Danışmanlık",
                description: "Emlak danışmanlığı ve bilgilendirme randevusu",
                color: "orange",
                icon: "pi pi-comments"
            }
        ];
    }
}

export default AppointmentTypeService;
