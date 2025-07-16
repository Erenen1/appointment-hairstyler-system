// import { z } from "zod";

// export const createStaffSchema = z.object({
//     fullName: z.string().min(1, "İsim zorunludur"),
//     email: z.string().email("Geçerli bir email giriniz"),
//     phone: z.string().min(10, "Telefon numarası eksik"),
//     specialties: z.string().min(1, "Uzmanlık alanı zorunludur"),
//     serviceIds: z
//         .array(z.number())
//         .min(1, "Servis ID zorunludur")
//         .optional()
//         .refine(val => val === undefined || val.length > 0, {
//             message: "Servis ID zorunludur",
//         }),

//     avatar: z.string().optional(), // file yüklemeyi ayrı ele alırız
// });

// import { z } from "zod";

// export const createStaffSchema = z.object({
//     fullName: z.string().min(1, "İsim zorunludur"),
//     email: z.string().email("Geçerli bir email giriniz"),
//     phone: z.string().min(10, "Telefon numarası eksik"),
//     specialties: z.string().min(1, "Uzmanlık alanı zorunlu"),
//     serviceIds: z.string().default('[]'),
//     avatar: z.any().optional(), // Dosya olduğu için genelde .any() ve optional kullanılır
// });

// CreateStaffSchema.ts
// CreateStaffSchema.ts
import { z } from 'zod';

export const createStaffSchema = z.object({
    fullName: z.string().min(1, 'İsim soyisim gereklidir'),
    email: z.string().email('Geçerli bir email adresi giriniz'),
    phone: z.string().min(1, 'Telefon numarası gereklidir'),
    specialties: z.string().min(1, 'Uzmanlık alanları gereklidir'),
    serviceIds: z.string().default('[]'),
    avatar: z.string().optional() // String olarak tanımla
});

