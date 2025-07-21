'use client';

export default async function allCustomers(token: string) {
    try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/customers`, {
            method: 'GET',
            headers: {
                'content-type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
        })
        const data = await res.json();
        console.log('Müşteriler getirildi api:', data);
        return data;
    } catch (error) {
        console.error('Müşteriler getirilemedi api:', error);
        throw error;
    };
};