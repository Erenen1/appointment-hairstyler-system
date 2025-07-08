'use server';
import { APIKEY } from "../../../../../../api/ApiKey";
import { APIURL } from "../../../../../../api/ApiUrl";
import { UpdateStaffRequest } from '../types/UpdateStaffType';

export default async function updateStaff(id: string, body: UpdateStaffRequest) {
    try {
        const res = await fetch(`${APIURL}/staff/${id}`, {
            method: 'PUT',
            headers: {
                'content-type': 'application/json',
                'x-api-key': APIKEY,
            },
            body: JSON.stringify(body)

        })
        const data = await res.json()
        console.log('Personel Güncellendi api', data)
        return data;
    } catch (error) {
        console.error('Personel güncellenemedi api', error);
        throw error;
    };
};