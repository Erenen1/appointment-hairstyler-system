'use server';
import { APIKEY } from "../../../../api/ApiKey";
import { APIUrl } from "../../../../api/ApiUrl";

export const adminLogout = async () => {
    try {
        const res = await fetch(`${APIUrl}/auth/logout`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'x-api-key': APIKEY,
            },
        })
        const data = await res.json();
        console.log('admin başarıyla çıkış yaptı', data);
    } catch (error) {
        console.log('admin çıkış yaparken bir hata oluştu', error);
    }
}