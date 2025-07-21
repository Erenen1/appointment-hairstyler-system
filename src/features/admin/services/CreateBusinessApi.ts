'use client';

import { CreateAdminRequest } from "../types/AdminLoginType";

export const createBusiness = async (adminData: CreateAdminRequest) => {
    try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/business-auth/register`, {
            method: 'POST',
            headers: {
                'content-type': 'application/json',
                'x-api-key': process.env.NEXT_PUBLIC_API_KEY as string,
            },
            body: JSON.stringify(adminData),

        });
        const data = await res.json()
        console.log('admin kayıt edildi', data);
        return data;
    } catch (error) {
        console.log('admin kayıt edilirken bir hata oluştu', error)
        throw error;

    }
}