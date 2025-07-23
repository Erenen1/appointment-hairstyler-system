import { z } from "zod";

export const createServiceSchema = z.object({
    // slug: z.string().optional(), // opsiyonel
    categoryId: z.string().uuid("Geçerli bir UUID giriniz").optional(), // opsiyonel string
    name: z.string({ required_error: "Hizmet Adı zorunludur" }).min(3, "En az 3 karakter olmalıdır"), // zorunlu string
    description: z.string().optional(), // opsiyonel string
    duration: z.number({ required_error: "Süre zorunludur" }), // zorunlu number
    price: z.number({ required_error: "Fiyat zorunludur" }), // zorunlu number
    image: z
        .any()
        .refine((file) => file instanceof File || file === undefined, {
            message: "Geçerli bir dosya seçiniz"
        }).optional(), // opsiyonel file
    // isPopular: z.enum(["true", "false"]).optional(), // opsiyonel string (eğer string geliyorsa)
    // isActive: z.boolean().optional() // opsiyonel boolean
});
