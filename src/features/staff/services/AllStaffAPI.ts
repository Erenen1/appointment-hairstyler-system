'use client';
import { APIURL } from "../../../../api/APIUrl";

export default async function allStaff(token: string) {
    try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/staff`, {
            method: 'GET',
            headers: {
                'content-type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
        });
        const data = await res.json();
        console.log('Personeller Getirildi api:', data)
        return data;
    } catch (error) {
        console.error('Personeller Getirilirken bir hata oluştu api:', error);
        throw error;
    };
};