'use server';
import { APIKEY } from "../../../../../../api/ApiKey";
import { APIURL } from "../../../../../../api/ApiUrl";
import Cookies from 'js-cookie'

export default async function createImage(formData: FormData) {
    try {
        // const sessionId = Cookies.get('sessionId');
        const res = await fetch(`${APIURL}/content/gallery`, {
            method: 'POST',
            headers: {
                'Content-Type': 'multipart/form-data',
            },
            body: JSON.stringify(formData),
            credentials: 'include',

        });
        const data = await res.json()
        console.log('Resim oluşturuldu', data);
        return data;
    } catch (error) {
        console.error('Resim oluşturulurken bir hata oluştu', error)
        throw error;
    }
}