'use client';

import { Service } from "../types/ServiceType";



export default async function updateService(adminData: Service, token: string) {
    try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/services/${adminData.id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(adminData)
        });
        const data = await res.json();
        console.log('Service updated successfully:', data);
        return data;
    } catch (error) {
        console.error('Error updating service:', error);
        throw error; // Hata fırlat
    }
}
// // 'use client';
// // import { Service } from "../types/ServiceType";
// // export default async function updateService(service: Service, token: string) {
// //     const payload = {
// //         categoryId: service.category.id ,
// //         title: service.title,
// //         description: service.description,
// //         duration: Number(service.duration),
// //         price: Number(service.price),
// //         staffIds: service.staffMembers.map(staff => staff.id),
// //         isPopular: false,
// //         isActive: true,
// //     };

// //     const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/services/${service.id}`, {
// //         method: 'PUT',
// //         headers: {
// //             'Content-Type': 'application/json',
// //             'Authorization': `Bearer ${token}`
// //         },
// //         body: JSON.stringify(payload)
// //     });

// //     if (!res.ok) {
// //         throw new Error('Service update failed');
// //     }

// //     return await res.json();
// // }
