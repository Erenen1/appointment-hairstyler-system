'use server';
import { APIKEY } from "../../../../../../api/ApiKey";
import { APIURL } from "../../../../../../api/ApiUrl";

import { CreateStaffRequest } from "../types/CreateStaffType";

export default async function createStaff(adminData: CreateStaffRequest) {
    try {
        const res = await fetch(`${APIURL}/staff`, {
            method: 'POST',
            headers: {
                'content-type': 'application/json',
                'x-api-key': APIKEY,
            },
            body: JSON.stringify(adminData),
        })
        const data = await res.json();
        console.log('Yeni Personel Oluşturuldu api', data)
        return data;
    } catch (error) {
        console.error('Yeni personel oluşturulamadı api', error)
        throw error;
    };
};