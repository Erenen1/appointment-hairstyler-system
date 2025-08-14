import { Appointment } from '@/features/appointments/types/types';

const API_BASE_URL = 'http://148.230.104.189:8000/api';

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

    static async createAppointment(appointment: Omit<Appointment, 'id' | 'createdAt' | 'updatedAt'>): Promise<Appointment> {
        return this.request<Appointment>('/appointments', {
            method: 'POST',
            body: JSON.stringify({
                ...appointment,
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString()
            }),
        });
    }

    static async updateAppointment(id: number, appointment: Partial<Appointment>): Promise<Appointment> {
        return this.request<Appointment>(`/appointments/${id}`, {
            method: 'PUT',
            body: JSON.stringify({
                ...appointment,
                updatedAt: new Date().toISOString()
            }),
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

    static async getAppointmentsByType(typeId: number): Promise<Appointment[]> {
        return this.request<Appointment[]>(`/appointments/type/${typeId}`);
    }

    // Mock data fallback for development
    static async getMockAppointments(): Promise<Appointment[]> {
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 300));

        // Return mock data from appointments.json
        try {
            const response = await fetch('/mocks/appointments.json');
            if (response.ok) {
                return await response.json();
            }
        } catch (error) {
            console.warn('Failed to load mock appointments, using fallback data');
        }

        // Fallback data
        return [
            {
                id: 1,
                customerId: 1,
                staffId: 1,
                serviceId: 1,
                statusId: 2,
                appointmentTypeId: 1,
                appointmentDate: "2024-12-19",
                startTime: "10:00:00",
                endTime: "11:00:00",
                customerPhone: "+90 532 123 45 67",
                message: "Kadıköy'deki 2+1 daireyi görüntülemek istiyoruz",
                notes: "Müşteri ilk kez geliyor, detaylı bilgi verilecek",
                duration: 60,
                price: 0.0,
                createdByAdmin: 1,
                createdAt: "2024-01-10T15:30:00.000Z",
                updatedAt: "2024-01-15T11:00:00.000Z"
            },
            {
                id: 2,
                customerId: 2,
                staffId: 3,
                serviceId: 2,
                statusId: 2,
                appointmentTypeId: 2,
                appointmentDate: "2024-12-19",
                startTime: "14:00:00",
                endTime: "14:45:00",
                customerPhone: "+90 533 987 65 43",
                message: "Beşiktaş'taki ofis için değerleme yapılacak",
                notes: "Ticari gayrimenkul değerleme",
                duration: 45,
                price: 500.0,
                createdByAdmin: null,
                createdAt: "2024-01-12T09:45:00.000Z",
                updatedAt: "2024-01-12T10:00:00.000Z"
            }
        ];
    }
}

export default AppointmentService;

