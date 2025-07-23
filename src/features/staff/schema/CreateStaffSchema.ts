
import { z } from 'zod';

export const createStaffSchema = z.object({
    firstName: z.string().min(1, 'En az 1 karakter olmalıdır'),
    lastName: z.string().min(1, 'En az 1 karakter olmalıdır'),
    description: z.string().min(1, 'En az 1 karakter olmalıdır'),
    email: z.string().email('Geçerli bir email adresi giriniz').optional(),
    phone: z.string().optional(),
    specialties: z.string().min(1, 'En az 1 karakter olmalıdır').optional(),
    avatar: z.any().optional().refine((file) => file instanceof File || file === undefined, {
        message: 'Geçerli bir dosya seçiniz'
    }),

});

