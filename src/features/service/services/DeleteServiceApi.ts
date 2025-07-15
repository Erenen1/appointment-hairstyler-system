'use client';
import { APIURL } from "../../../../api/APIUrl";

export default async function deleteService(id: string, token: string) {
    try {
        const res = await fetch(`${APIURL}/services/${id}`, {
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