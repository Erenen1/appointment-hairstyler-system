'use client';

import { Customer } from "../types/CustomersType";
export default async function updateCustomer(adminData: Customer, token: string) {
    try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/customers/${adminData.id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`
            },
            body: JSON.stringify(adminData)
        });
        const data = await res.json();
        console.log('Güncellenen Müşteri:', data);
        return data;
    } catch (error) {
        console.error('Müşteri güncellenirken hata oluştu:', error);
        throw error; // Hata fırlat
    }
}