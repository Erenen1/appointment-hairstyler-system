'use client';

import { Appointment } from "../types/AppointmentType";

export default async function deleteAppointment(adminData: Appointment, token: string) {
    try {

        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/appointments/${adminData.id}`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${token}`,
            },
        });
        const data = await response.json();
        console.log('Appointment deleted successfully:', data);
        return data;
    } catch (error) {
        console.error('Error deleting appointment:', error);
        throw error; // Rethrow the error to be handled by the caller
    }

}
