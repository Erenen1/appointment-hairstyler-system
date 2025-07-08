import { z } from 'zod';

export const CreateImageSchema = z.object({
    title: z.string().min(1, 'Başlık zorunludur'),
    description: z.string().min(1, 'Açıklama zorunludur'),
    categoryId: z.string().min(1, 'Kategori zorunludur'),
    image: z
        .any()
        .refine((file) => file instanceof File && file.size > 0, {
            message: 'Geçerli bir görsel yükleyin',
        }),
});

export type CreateImageSchemaType = z.infer<typeof CreateImageSchema>;
