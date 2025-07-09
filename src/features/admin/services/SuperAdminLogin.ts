'use client';

import { APIURL } from "../../../../api/APIUrl";



interface LoginAdminRequest {
    email: string;
    password: string
}
export const loginAdmin = async (adminData: LoginAdminRequest) => {
    try {
        const res = await fetch(`${APIURL}/auth/admin/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(adminData),

        });
        const data = await res.json()
        console.log('super admin başarıyla giriş yaptı', data);
        return data;
    } catch (error) {
        console.log('super admin giriş yaparken bir hata oluştu', error)
        throw error;

    }
}