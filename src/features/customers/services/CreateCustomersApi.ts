'use client';
import { APIURL } from "../../../../api/APIUrl";
import { CustomersRequest } from '../types/CreateCustomersType';

export default async function createCustomers(adminData: CustomersRequest, token: string) {
    try {
        const res = await fetch(`${APIURL}/customers`, {
            method: 'POST',
            headers: {
                'content-type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(adminData)
        })
        const data = await res.json();
        console.log('Kategori oluşturuldu api:', data);
        return data;
    } catch (error) {
        console.error('Kategori oluşturulamadı api:', error);
        throw error;
    };
};