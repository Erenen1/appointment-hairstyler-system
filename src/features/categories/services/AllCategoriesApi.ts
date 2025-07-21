'use client';

export default async function allCategories(token: string) {
    try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/categories`, {
            method: 'GET',
            headers: {
                'content-type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
        })
        const data = await res.json();
        console.log('Kategoriler getirildi api:', data);
        return data;
    } catch (error) {
        console.error('Kategoriler getirilemedi api:', error);
        throw error;
    };
};