'use client';

import { CreateAdminRequest } from "../types/AdminLoginType";

export const createBusiness = async (adminData: CreateAdminRequest) => {
    try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/business-auth/register`, {
            method: 'POST',
            headers: {
                'content-type': 'application/json',
            },
            body: JSON.stringify(adminData),

        });
        const data = await res.json()
        console.log('admin kayıt edildi api:', data);
        return data;
    } catch (error) {
        console.log('admin kayıt edilirken bir hata oluştu api:', error)
        throw error;

    }
}