'use client';

import { APIURL } from "../../../../api/APIUrl";
import { ServiceRequest } from "../types/CreateServiceType";
export default async function createService(adminData: ServiceRequest, token: string) {
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
        console.log('Serviceler oluşturuldu api:', data);
        return data;
    } catch (error) {
        console.error('Serviceler oluşturulamadı api:', error);
        throw error;
    }
}