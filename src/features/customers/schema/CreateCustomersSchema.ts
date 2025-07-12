import { z } from "zod";

export const createCustomerschema = z.object({
    fullName: z.string().min(1, "İsim zorunludur"),
    description: z.string().min(1, "Açıklama zorunludur"),
    phone: z
        .string()
        .min(10, "Telefon numarası en az 10 karakter olmalı")
        .max(20, "Telefon numarası en fazla 20 karakter olabilir"),
    email: z
        .string()
        .email("Geçerli bir email adresi giriniz")
        .optional(),
    loyaltyPoints: z
        .number()
        .min(0, "Puan 0'dan küçük olamaz")
        .optional(),
    notes: z
        .string()
        .max(500, "Notlar en fazla 500 karakter olabilir")
        .optional(),
});
