'use client';
import { APIURL } from "../../../../api/APIUrl";
import { StaffRequest } from "../types/CreateStaffType";

export default async function createStaff(adminData: StaffRequest, token: string) {
    try {
        const res = await fetch(`${APIURL}/staff`, {
            method: 'POST',
            headers: {
                'content-type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(adminData),
        });
        const data = await res.json();
        console.log('Personel Oluşturuldu:', data)
        return data;
    } catch (error) {
        console.error('Personel Oluşturulurken bir hata oluştu:', error);
        throw error;
    };
};