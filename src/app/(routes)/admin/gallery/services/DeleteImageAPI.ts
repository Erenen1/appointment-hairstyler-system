'use client';
import { APIKEY } from "../../../../../../api/ApiKey";
import { APIURL } from "../../../../../../api/ApiUrl";
import { DeleteImageRequest } from "../types/DeleteImageType";

export default async function deleteImage(id: string, body: DeleteImageRequest) {
    try {
        const res = await fetch(`${APIURL}/content/gallery/${id}`, {
            method: 'DELETE',
            headers: {
                'content-type': 'application/json',
                'x-api-key': APIKEY,
            },
            body: JSON.stringify(body),
            credentials: 'include', // BU SATIR EKLENECEK
        });
        const data = await res.json();
        console.log('Resim silme işlemi başarılı api');
        return data;
    } catch (error) {
        console.error('Resim silme işlemi başarısız api', error)
        throw error;
    }
}