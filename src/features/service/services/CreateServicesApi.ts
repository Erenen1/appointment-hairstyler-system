'use client';

import { ServiceRequest } from "../types/ServiceType";
export default async function createServices(adminData: ServiceRequest, token: string) {
    try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/services`, {
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



// export default async function createServices(data: any, token: string) {
//     const formData = new FormData();

//     formData.append('title', data.title);
//     formData.append('description', data.description || '');
//     formData.append('duration', Number(data.duration));
//     formData.append('price', Number(data.price));
//     formData.append('isActive', Boolean(data.isActive ?? true));
//     formData.append('isPopular', Boolean(data.isPopular ?? false));

//     if (data.image) {
//         formData.append('image', data.image); // File nesnesi
//     }

//     const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/services`, {
//         method: 'POST',
//         headers: {
//             'Authorization': `Bearer ${token}`,
//         },
//         body: formData,
//     });

//     if (!res.ok) {
//         throw new Error('Hizmet oluşturulamadı');
//     }

//     return await res.json();
// };
