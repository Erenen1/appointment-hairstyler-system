'use client';

import { APIURL } from "../../../../api/APIUrl";
export default async function allServices(token: string) {
    try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/services`, {
            method: 'GET',
            headers: {
                'content-type': 'application/json',
                'Authorization': `Bearer ${token}`,
            },
        })
        const data = await res.json();
        console.log('Hizmetler getirildi api:', data);
        return data;
    } catch (error) {
        console.error('Hizmetler getirilemedi api:', error);
        throw error;
    }
}