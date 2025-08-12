import { useState, useEffect } from 'react';
import appointmentsData from '@/mocks/appointments.json';

interface MockAppointment {
    id: number;
    appointmentDate: string;
    startTime: string;
    endTime: string;
    customerId: number;
    staffId: number;
    notes: string;
    duration: number;
    price: number;
    createdByAdmin: number | null;
    createdAt: string;
    updatedAt: string;
}

export interface Appointment {
    id: number;
    date: string;
    time: string;
    customerId: number;
    staffId: number;
    notes?: string;
}

export const useAppointments = () => {
    const [appointments, setAppointments] = useState<Appointment[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        // Simulate API call
        const loadAppointments = async () => {
            try {
                setLoading(true);
                // Simulate network delay
                await new Promise(resolve => setTimeout(resolve, 500));

                // Transform mock data to match our interface
                const transformedAppointments = appointmentsData.map((apt: MockAppointment) => ({
                    id: apt.id,
                    date: apt.appointmentDate,
                    time: apt.startTime,
                    customerId: apt.customerId,
                    staffId: apt.staffId,
                    notes: apt.notes
                }));

                setAppointments(transformedAppointments);
                setError(null);
            } catch (err) {
                setError('Randevular yüklenirken hata oluştu');
                console.error('Error loading appointments:', err);
            } finally {
                setLoading(false);
            }
        };

        loadAppointments();
    }, []);

    const createAppointment = async (appointment: Omit<Appointment, 'id'>) => {
        try {
            const newAppointment: Appointment = {
                ...appointment,
                id: Date.now()
            };

            setAppointments(prev => [...prev, newAppointment]);
            return newAppointment;
        } catch (err) {
            setError('Randevu oluşturulurken hata oluştu');
            throw err;
        }
    };

    const updateAppointment = async (id: number, updates: Partial<Appointment>) => {
        try {
            setAppointments(prev =>
                prev.map(apt =>
                    apt.id === id ? { ...apt, ...updates } : apt
                )
            );
        } catch (err) {
            setError('Randevu güncellenirken hata oluştu');
            throw err;
        }
    };

    const deleteAppointment = async (id: number) => {
        try {
            setAppointments(prev => prev.filter(apt => apt.id !== id));
        } catch (err) {
            setError('Randevu silinirken hata oluştu');
            throw err;
        }
    };

    const getAppointmentById = (id: number) => {
        return appointments.find(apt => apt.id === id);
    };

    const getAppointmentsByDate = (date: string) => {
        return appointments.filter(apt => apt.date === date);
    };

    const getAppointmentsByCustomer = (customerId: number) => {
        return appointments.filter(apt => apt.customerId === customerId);
    };

    const getAppointmentsByStaff = (staffId: number) => {
        return appointments.filter(apt => apt.staffId === staffId);
    };

    return {
        appointments,
        loading,
        error,
        createAppointment,
        updateAppointment,
        deleteAppointment,
        getAppointmentById,
        getAppointmentsByDate,
        getAppointmentsByCustomer,
        getAppointmentsByStaff
    };
};

