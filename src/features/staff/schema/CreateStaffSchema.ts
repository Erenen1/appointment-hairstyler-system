import { z } from "zod";

export const createStaffSchema = z.object({
    fullName: z.string().min(1, "İsim zorunludur"),
    email: z.string().email("Geçerli bir email giriniz"),
    phone: z.string().min(10, "Telefon numarası eksik"),
    specialties: z.string().min(1, "Uzmanlık alanı zorunludur"),
    serviceIds: z.array(z.number()).min(1, "Servis ID zorunludur"),
    avatar: z.string().optional(), // file yüklemeyi ayrı ele alırız
});
