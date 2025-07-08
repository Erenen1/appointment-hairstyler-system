'use server';
import { APIKEY } from "../../../../../../api/ApiKey";
import { APIURL } from "../../../../../../api/ApiUrl";

export default async function allImage() {
    try {
        const res = await fetch(`${APIURL}/content/gallery`, {
            method: 'GET',
            headers: {
                'content-type': 'application/json',
                'x-api-key': APIKEY,
            },
            credentials: 'include', // BU SATIR EKLENECEK
        });
        const data = await res.json();
        console.log('Tüm resimler getirildi api:', data);
        return data;
    } catch (error) {
        console.log('Tüm resimler getirlirken bir hata oluştu', error)
        throw error;
    };
};