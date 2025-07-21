'use client';

import { LoginAdminRequest } from "../types/AdminLoginType";

export const loginBusiness = async (adminData: LoginAdminRequest) => {
    try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/business-admin/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(adminData),

        });
        const data = await res.json()
        console.log('admin başarıyla giriş yaptı', data);
        return data;
    } catch (error) {
        console.log('giriş yaparken bir hata oluştu', error)
        throw error;

    }
}