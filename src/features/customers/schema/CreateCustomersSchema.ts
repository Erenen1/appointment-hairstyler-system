import { z } from "zod";

export const createCustomersSchema = z.object({
    fullName: z
        .string()
        .min(1, "İsim zorunludur")
        .min(2, "İsim en az 2 karakter olmalı")
        .max(100, "İsim en fazla 100 karakter olabilir"),

    phone: z
        .string()
        .min(1, "Telefon numarası zorunludur")
        .min(10, "Telefon numarası en az 10 karakter olmalı")
        .max(20, "Telefon numarası en fazla 20 karakter olabilir")
        .regex(/^[\+]?[\d\s\-\(\)]+$/, "Geçerli bir telefon numarası giriniz"),

    email: z
        .string()
        .email("Geçerli bir email adresi giriniz")
        .or(z.literal(""))
        .optional(),

    notes: z
        .string()
        .max(500, "Notlar en fazla 500 karakter olabilir")
        .optional(),
});