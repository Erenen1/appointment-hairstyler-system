'use client';

import { Appointment } from "../types/AppointmentType";

export default async function detailAppointments(adminData: Appointment, token: string) {
    try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/appointments/${adminData.id}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        });
        const data = await response.json();
        console.log('Appointment details fetched successfully:', data);
        return data;
    } catch (error) {
        console.error('Error fetching appointment details:', error);
        throw error;
    }
}