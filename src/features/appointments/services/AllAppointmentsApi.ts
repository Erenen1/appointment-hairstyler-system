'use client';
import { APIURL } from "../../../../api/APIUrl";

export default async function allAppointments(token: string) {
    try {
        const res = await fetch(`${APIURL}/appointments`, {
            method: 'GET',
            headers: {
                'content-type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
        })
        const data = await res.json();
        console.log('Randevular getirildi api:', data);
        return data;
    } catch (error) {
        console.error('Randevular getirilemedi api:', error);
        throw error;
    };
};