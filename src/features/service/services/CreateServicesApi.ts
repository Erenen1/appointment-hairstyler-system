'use client';

import { APIURL } from "../../../../api/APIUrl";
import { ServiceRequest } from "../types/CreateServiceType";
export default async function createServices(adminData: ServiceRequest, token: string) {
    try {
        const res = await fetch(`${APIURL}/services`, {
            method: 'POST',
            headers: {
                'content-type': 'application/json',
                'Authorization': `Bearer ${token}`,
            },
            body: JSON.stringify(adminData)
        })
        const data = await res.json();
        console.log('Hizmetler oluşturuldu api:', data);
        return data;
    } catch (error) {
        console.error('Hizmetler oluşturulamadı api:', error);
        throw error;
    }
}