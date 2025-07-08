import z from "zod"

export const contactFormSchema = z.object({
    fullName: z.string().min(2, {
        message: 'En az 2 karekter giriniz.'
    }),
    email: z.
        string()
        .email({ message: 'Geçerli bir email adresi giriniz.' }),
    phone: z
        .string()
        .min(10, { message: 'Telefon numarası en az 10 haneli olmalı.' })
        .regex(/^(\+90|0)?5\d{9}$/, {
            message: 'Geçerli bir Türk telefon numarası girin. Örnek: 05551234567',
        }),
    subject: z.string().min(6, {
        message: 'En az 6 karekter giriniz.'
    }),
    message: z.string().min(20, {
        message: 'En az 20 karekter giriniz.'
    }),
})
