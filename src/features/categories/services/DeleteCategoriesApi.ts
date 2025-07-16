'use client';
import { APIURL } from "../../../../api/APIUrl";

export default async function deleteCategories(id: string, token: string) {
    try {
        const res = await fetch(`${APIURL}/services/categories/${id}`, {
            method: 'DELETE',
            headers: {
                'content-type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        })
        const data = await res.json();
        console.log('Kategori silindi', data);
        return data;
    } catch (error) {
        console.error('Kategori silinemedi api:', error);
        throw error;
    }
}