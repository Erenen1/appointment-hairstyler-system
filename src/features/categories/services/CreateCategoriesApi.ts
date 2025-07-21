'use client';
import { CategoriesRequest } from "../types/CategoriesType";

export default async function createCategories(adminData: CategoriesRequest, token: string) {
    try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/categories`, {
            method: 'POST',
            headers: {
                'content-type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(adminData)
        })
        const data = await res.json();
        console.log('Kategori oluşturuldu api:', data);
        return data;
    } catch (error) {
        console.error('Kategori oluşturulamadı api:', error);
        throw error;
    };
};