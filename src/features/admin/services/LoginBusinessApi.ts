'use client';

import { LoginAdminRequest } from "../types/AdminLoginType";

export const loginBusiness = async (adminData: LoginAdminRequest, token: string) => {
    try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/business-auth/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
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