'use server';
import { APIURL } from '../../../../../../api/ApiUrl';
import { APIKEY } from '../../../../../../api/ApiKey';

export default async function DetailImage(id: string) {
    try {
        const res = await fetch(`${APIURL}/content/gallery/${id}`, {
            method: 'GET',
            headers: {
                'content-type': 'application/json',
                'x-api-key': APIKEY,
            },
            credentials: 'include', // BU SATIR EKLENECEK
        })
        const data = await res.json();
        console.log('Resim detayı getirilirdi api:', data)
        return data;
    } catch (error) {
        console.error('Resim detayı getirilemedi api:', error);
        throw error;
    };
};