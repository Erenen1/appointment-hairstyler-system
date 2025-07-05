'use server';
import { LoginAdminRequest } from './../types/LoginProps';
import { APIUrl } from './../../../../api/ApiUrl';
import { APIKEY } from '../../../../api/ApiKey';


export const loginAdmin = async (adminData: LoginAdminRequest) => {
    try {
        const res = await fetch(`${APIUrl}/auth/admin/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'x-api-key': APIKEY,
            },
            body: JSON.stringify(adminData),
        });
        const data = await res.json()
        console.log('super admin başarıyla giriş yaptı', data);
        return data;
    } catch (error) {
        console.log('super admin giriş yaparken bir hata oluştu', error)
        return error;
    }
}