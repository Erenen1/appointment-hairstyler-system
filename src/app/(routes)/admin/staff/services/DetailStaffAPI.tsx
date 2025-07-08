'use server';
import { APIKEY } from "../../../../../../api/ApiKey";
import { APIURL } from "../../../../../../api/ApiUrl";
import { DetailStaffRequest } from "../types/DetailStaffType";

export default async function detailStaff(id: DetailStaffRequest) {
    try {
        const res = await fetch(`${APIURL}/staff/${id}`, {
            method: 'GET',
            headers: {
                'content-type': 'application/json',
                'x-api-key': APIKEY,
            }
        })
        const data = await res.json();
        console.log('Personel Detayı Getirildi api:', data);
        return data;
    } catch (error) {
        console.error('Personel detayı getirilemedi api:', error);
        throw error;
    };
};