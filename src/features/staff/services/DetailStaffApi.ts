'use client';
import { APIURL } from "../../../../api/APIUrl";

export default async function allStaff(token: string, id: string) {
    try {
        const res = await fetch(`${APIURL}/staff/${id}`, {
            method: 'GET',
            headers: {
                'content-type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
        });
        const data = await res.json();
        console.log('Personeller detayları Getirildi api:', data)
        return data;
    } catch (error) {
        console.error('Personeller detayları Getirilirken bir hata oluştu api:', error);
        throw error;
    };
};