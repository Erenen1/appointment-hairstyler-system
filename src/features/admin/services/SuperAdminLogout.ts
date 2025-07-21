'use client';
import { APIURL } from "../../../../api/APIUrl";

export default async function adminLogout(token: string) {
    try {
        const res = await fetch(`${APIURL}/v1/auth/logout`, {
            method: 'POST',
            headers: {
                'content-type': 'application/json',
                'Authorization': `Bearer ${token}`,
            }
        })
        const data = await res.json();
        console.log('Admin çıkışı yapıldı api:', data);
        return data;
    } catch (error) {
        console.error('Admin çıkışı yapılırken bir hata oluştu:', error);
        throw error;
    };
};