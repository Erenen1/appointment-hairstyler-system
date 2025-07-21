'use client';

import { Appointment } from "../types/AppointmentType";

export default async function createAppointment(adminData: Appointment, token: string) {
    // Your implementation here
    try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/appointments`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ adminData })
        });
        const data = await res.json();
        console.log('Appointment created successfully:', data);
        return data;
    } catch (error) {
        console.error('Error creating appointment:', error);
        throw error;
    }
}