'use client';

import { Categories } from "../types/CategoriesType";

export default async function updateCategories(adminData: Categories, token: string) {
    try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/services/categories/${adminData.id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(adminData)
        });
        const data = await res.json();
        console.log('Güncellenen Kategori:', data);
        return data;
    } catch (error) {
        console.error('Error updating category:', error);
        throw error;
    }
}