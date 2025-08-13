import { z } from "zod";

export const registerSchema = z.object({
    firstName: z
        .string()
        .min(2, "İsim en az 2 karakter olmalıdır")
        .max(50, "İsim en fazla 50 karakter olabilir"),
    lastName: z
        .string()
        .min(2, "Soyisim en az 2 karakter olmalıdır")
        .max(50, "Soyisim en fazla 50 karakter olabilir"),
    email: z
        .string()
        .email("Geçerli bir e-posta adresi giriniz"),
    phone: z
        .string()
        .min(10, "Telefon numarası en az 10 karakter olmalıdır")
        .max(15, "Telefon numarası en fazla 15 karakter olabilir")
        .regex(/^[0-9+\-\s()]+$/, "Geçerli bir telefon numarası giriniz"),
    password: z
        .string()
        .min(6, "Şifre en az 6 karakter olmalıdır")
        .max(100, "Şifre en fazla 100 karakter olabilir")
        .regex(
            /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
            "Şifre en az bir küçük harf, bir büyük harf ve bir rakam içermelidir"
        ),
});

export const loginSchema = z.object({
    email: z
        .string()
        .email("Geçerli bir e-posta adresi giriniz"),
    password: z
        .string()
        .min(1, "Şifre gereklidir"),
});

export type RegisterFormData = z.infer<typeof registerSchema>;
export type LoginFormData = z.infer<typeof loginSchema>;
