'use server';
import { APIKEY } from "../../../../../../api/ApiKey";
import { APIURL } from "../../../../../../api/ApiUrl";

export default async function allStaff() {
    try {
        const res = await fetch(`${APIURL}/staff`, {
            method: 'GET',
            headers: {
                'content-type': 'application/json',
                'x-api-key': APIKEY
            }
        })
        const data = await res.json();
        console.log('Tüm Personeller Listelendi Api:', data);
        return data
    }
    catch (error) {
        console.error('Tüm personeller listelenemedi api:', error);
        throw error;
    }
}