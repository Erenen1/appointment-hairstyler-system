'use server';
import { APIUrl } from "../../../../api/ApiUrl";
import { APIKEY } from '../../../../api/ApiKey';

export const adminProfile = async () => {
    try {
        const res = await fetch(`${APIUrl}/auth/profile`, {
            method: 'GET',
            headers: {
                'Content-Type': 'Application/json',
                'x-api-key': APIKEY,
            },
        });
        const data = await res.json();
        console.log('Admin Profili Getirildi!', data);
        return data;

    } catch (error) {
        console.error('Admin profili getirilirken bir hata oluştu', error);
    }
}