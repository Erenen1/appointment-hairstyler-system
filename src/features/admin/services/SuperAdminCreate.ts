'use client';

import { APIKEY } from "../../../../api/APIKey";
import { CreateAdminRequest } from "../types/AdminLoginType";

export const createAdmin = async (adminData: CreateAdminRequest) => {
    try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/business-auth/register`, {
            method: 'POST',
            headers: {
                'content-type': 'application/json',
                'x-api-key': APIKEY as string,
            },
            body: JSON.stringify(adminData),

        });
        const data = await res.json()
        console.log('super admin kayıt edildi', data);
        return data;
    } catch (error) {
        console.log('super admin kayıt edilirken bir hata oluştu', error)
        throw error;

    }
}