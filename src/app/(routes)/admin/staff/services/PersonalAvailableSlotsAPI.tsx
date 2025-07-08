'use server';
import { APIKEY } from "../../../../../../api/ApiKey";
import { APIURL } from "../../../../../../api/ApiUrl";

export default async function personalAvailableSlots(id: string, date: string) {
    try {
        const res = await fetch(`${APIURL}/staff/${id}`, {
            method: 'GET',
            headers: {
                'content-type': 'application/json',
                'x-api-key': APIKEY
            }
        })
        const data = await res.json()
        console.log('Personellerin müsait sattleri getirildi', data)
        return data;
    } catch (error) {
        console.error('Personellerin müsait sattleri getirilemedi api', error);
        throw error;
    }
}