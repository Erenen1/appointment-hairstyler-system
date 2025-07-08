import z from "zod"

export const userInfoSchema = z.object({
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
})
