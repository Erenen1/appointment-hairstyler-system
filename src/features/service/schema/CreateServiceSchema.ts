import { z } from "zod";

export const createServiceSchema = z.object({
    slug: z.string().optional(), // opsiyonel
    categoryId: z.string().min(1, "Kategori ID zorunludur"), // zorunlu string
    staffIds: z.string(z.string().uuid("Geçerli bir UUID giriniz")).optional(), // opsiyonel array
    title: z.string().min(1, "Başlık zorunludur"), // zorunlu string
    description: z.string().optional(), // opsiyonel string
    duration: z.number({ required_error: "Süre zorunludur" }), // zorunlu number
    price: z.number({ required_error: "Fiyat zorunludur" }), // zorunlu number
    image: z.string().url("Geçerli bir görsel URL'si giriniz").optional(), // opsiyonel ve URL kontrolü
    isPopular: z.enum(["true", "false"]).optional(), // opsiyonel string (eğer string geliyorsa)
    isActive: z.boolean().optional() // opsiyonel boolean
});
