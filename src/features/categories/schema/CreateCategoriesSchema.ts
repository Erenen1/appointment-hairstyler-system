import { z } from "zod";

export const createCategoriesSchema = z.object({
    name: z.string().min(1, "Kategori adı zorunludur"),
    description: z.string().min(1, "Açıklama zorunludur"),
});
