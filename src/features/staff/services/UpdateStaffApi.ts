'use client';
import { Staff } from "../types/StaffType";
export default async function updateStaff(adminData: Staff, token: string) {
    try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/staff/${adminData.id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(adminData),
        });

        const data = await res.json();
        return data;
    } catch (error) {
        console.error('Error updating staff:', error);
        return { success: false, message: 'Güncelleme başarısız oldu.' };

    }

}