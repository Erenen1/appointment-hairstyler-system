'use client';
import { APIURL } from "../../../../api/APIUrl";
import { StaffRequest } from "../types/StaffType";

export default async function createStaff(adminData: StaffRequest, token: string) {
    try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/staff`, {
            method: 'POST',
            headers: {
                'content-type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(adminData),
        });
        const data = await res.json();
        console.log('Personel Oluşturuldu:', data)
        return data;
    } catch (error) {
        console.error('Personel Oluşturulurken bir hata oluştu:', error);
        throw error;
    };
};
// 'use client';
// import { APIURL } from "../../../../api/APIUrl";
// import { StaffRequest } from "../types/StaffType";

// export default async function createStaff(adminData: StaffRequest, token: string) {
//     try {
//         const formData = new FormData();

//         // Text fields'ları FormData'ya ekle
//         formData.append('fullName', adminData.fullName);
//         formData.append('email', adminData.email);
//         formData.append('phone', adminData.phone);
//         formData.append('specialties', adminData.specialties);

//         // Avatar dosyasını ekle (eğer varsa)
//         if (adminData.avatar) {
//             formData.append('avatar', adminData.avatar);
//         }

//         const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/staff`, {
//             method: 'POST',
//             headers: {
//                 'Authorization': `Bearer ${token}`
//                 // NOT: multipart/form-data için Content-Type header'ı eklemeyin
//                 // Browser otomatik olarak boundary ile birlikte ekleyecektir
//             },
//             body: formData,
//         });

//         const data = await res.json();
//         console.log('Personel Oluşturuldu:', data)
//         return data;
//     } catch (error) {
//         console.error('Personel Oluşturulurken bir hata oluştu:', error);
//         throw error;
//     };
// };