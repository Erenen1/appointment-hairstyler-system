import { Appointment } from '@/hooks/useAppointments';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api';

export class AppointmentService {
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

    static async getAllAppointments(): Promise<Appointment[]> {
        return this.request<Appointment[]>('/appointments');
    }

    static async getAppointmentById(id: number): Promise<Appointment> {
        return this.request<Appointment>(`/appointments/${id}`);
    }

    static async createAppointment(appointment: Omit<Appointment, 'id'>): Promise<Appointment> {
        return this.request<Appointment>('/appointments', {
            method: 'POST',
            body: JSON.stringify(appointment),
        });
    }

    static async updateAppointment(id: number, appointment: Partial<Appointment>): Promise<Appointment> {
        return this.request<Appointment>(`/appointments/${id}`, {
            method: 'PUT',
            body: JSON.stringify(appointment),
        });
    }

    static async deleteAppointment(id: number): Promise<void> {
        return this.request<void>(`/appointments/${id}`, {
            method: 'DELETE',
        });
    }

    static async getAppointmentsByDate(date: string): Promise<Appointment[]> {
        return this.request<Appointment[]>(`/appointments/date/${date}`);
    }

    static async getAppointmentsByCustomer(customerId: number): Promise<Appointment[]> {
        return this.request<Appointment[]>(`/appointments/customer/${customerId}`);
    }

    static async getAppointmentsByStaff(staffId: number): Promise<Appointment[]> {
        return this.request<Appointment[]>(`/appointments/staff/${staffId}`);
    }

    static async getAppointmentsByDateRange(startDate: string, endDate: string): Promise<Appointment[]> {
        return this.request<Appointment[]>(`/appointments/range?start=${startDate}&end=${endDate}`);
    }

    // Mock data fallback for development
    static async getMockAppointments(): Promise<Appointment[]> {
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 300));

        // Return mock data
        return [
            {
                id: 1,
                date: "2024-01-15",
                time: "10:00",
                customerId: 1,
                serviceId: 1,
                staffId: 1,
                statusId: 1,
                notes: "İlk randevu"
            },
            {
                id: 2,
                date: "2024-01-16",
                time: "14:30",
                customerId: 2,
                serviceId: 2,
                staffId: 2,
                statusId: 2,
                notes: "Kontrol randevusu"
            }
        ];
    }
}

export default AppointmentService;

