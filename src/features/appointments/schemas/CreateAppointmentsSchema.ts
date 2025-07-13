import { z } from "zod";

export const createAppointmentsSchema = z.object({
    serviceId: z.coerce.number({
        required_error: "Hizmet ID zorunludur",
        invalid_type_error: "Hizmet ID sayısal olmalıdır",
    }),

    staffId: z
        .string({
            required_error: "Personel ID zorunludur",
            invalid_type_error: "Geçerli bir personel ID girilmelidir",
        })
        .uuid("Geçerli bir personel ID girilmelidir"),

    appointmentDate: z
        .string()
        .refine(
            (val) =>
                /^(0[1-9]|[12][0-9]|3[01])\/(0[1-9]|1[0-2])\/\d{4}$/.test(val),
            "Tarih formatı GG/AA/YYYY olmalıdır"
        ),

    appointmentTime: z
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
