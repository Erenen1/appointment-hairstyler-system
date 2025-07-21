'use client';

export default async function allAppointments(token: string) {
    try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/appointments`, {
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