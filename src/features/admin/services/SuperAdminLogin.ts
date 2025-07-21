'use client';

// import { APIURL } from "../../../../api/APIUrl";
import { LoginAdminRequest } from "../types/AdminLoginType";

export const loginAdmin = async (adminData: LoginAdminRequest) => {
    try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/business-admin/login`, {
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