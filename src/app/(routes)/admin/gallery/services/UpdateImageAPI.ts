'use server';
import { APIKEY } from "../../../../../../api/ApiKey";
import { APIURL } from "../../../../../../api/ApiUrl";
import { UpdateImageRequest } from "../types/UpdateImageType";

export default async function updateImage(id: string, body: UpdateImageRequest) {
    try {
        const res = await fetch(`${APIURL}/content/gallery/${id}`, {
            method: 'PUT',
            headers: {
                'content-type': 'application/json',
                'x-api-key': APIKEY,
            },
            body: JSON.stringify(body),
            credentials: 'include', // BU SATIR EKLENECEK
        });
        const data = await res.json();
        console.log('Resim başarıyla güncellendi api:', data);
        return data;
    } catch (error) {
        console.error('Resim güncelleme başarısız api:', error);
        throw error;
    };
};