import { z } from "zod";

export const createAppointmentsSchema = z.object({
    serviceId: z.coerce.string({
        required_error: "Hizmet ID zorunludur",
        invalid_type_error: "Hizmet ID sayısal olmalıdır",
    }),

    staffId: z
        .string({
            required_error: "Personel ID zorunludur",
            invalid_type_error: "Geçerli bir personel ID girilmelidir",
        })
        .uuid("Geçerli bir personel ID girilmelidir"),

    customerId: z
        .string({
            required_error: "Müşteri ID zorunludur",
            invalid_type_error: "Geçerli bir müşteri ID girilmelidir",
        })
        .uuid("Geçerli bir müşteri ID girilmelidir"),
    startTime: z
        .string({
            required_error: "Başlangıç saati zorunludur",
            invalid_type_error: "Başlangıç saati sayısal olmalıdır",
        })
        .min(0, "Başlangıç saati 0'dan küçük olamaz")
        .max(24, "Başlangıç saati 24'ten büyük olamaz"),

    endTime: z
        .string({
            required_error: "Bitiş saati zorunludur",
            invalid_type_error: "Bitiş saati sayısal olmalıdır",
        })
        .min(0, "Bitiş saati 0'dan küçük olamaz")
        .max(24, "Bitiş saati 24'ten büyük olamaz"),
    appointmentDate: z
        .string({
            required_error: "Randevu tarihi zorunludur",
            invalid_type_error: "Randevu tarihi geçerli bir tarih olmalıdır",
        })
        .refine(
            (val) => !isNaN(Date.parse(val)),
            "Randevu tarihi geçerli bir tarih olmalıdır"
        ),
    totalPrice: z
        .number({
            required_error: "Toplam fiyat zorunludur",
            invalid_type_error: "Toplam fiyat sayısal olmalıdır",
        })
        .min(0, "Toplam fiyat 0'dan küçük olamaz"),

    endTTime: z
        .string()
        .refine(
            (val) => /^([0-1][0-9]|2[0-3]):[0-5][0-9]$/.test(val),
            "Saat formatı HH:mm şeklinde olmalıdır"
        ),

    notes: z
        .string()
        .max(500, "Not en fazla 500 karakter olmalıdır")
        .optional(),
});
