'use client';

export default async function deleteService(id: string, token: string) {
    try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/services/${id}`, {
            method: 'DELETE',
            headers: {
                'content-type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        })
        const data = await res.json();
        console.log('Servis silindi', data);
        return data;
    } catch (error) {
        console.error('Servis silinemedi api:', error);
        throw error;
    }
}