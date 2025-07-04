'use server';
import { APIUrl } from './../../../../api/ApiUrl';
import { CreateAdminRequest } from "../types/RegisterProps";
import { APIKEY } from '../../../../api/ApiKey';


export const createAdmin = async (adminData: CreateAdminRequest) => {
    try {
        const res = await fetch(`${APIUrl}/admin/super/create`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'x-api-key': APIKEY,
            },
            body: JSON.stringify(adminData)
        });
        const data = await res.json()
        console.log('super admin oluşturuldu', data);
        return data;
    } catch (error) {
        console.log('super admin oluştururken hata oluştu', error)
    }
}