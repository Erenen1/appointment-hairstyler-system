'use client';

export default async function deleteCustomers(id: string, token: string) {
    try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/customers/${id}`, {
            method: 'DELETE',
            headers: {
                'content-type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        })
        const data = await res.json();
        console.log('Müşteri silindi', data);
        return data;
    } catch (error) {
        console.error('Müşteri silinemedi api:', error);
        throw error;
    }
}