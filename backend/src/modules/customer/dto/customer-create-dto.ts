/**
 * Müşteri oluşturma DTO
 */
export class CustomerCreateDTO {
    fullName: string;
    email: string;
    phone: string;
    notes?: string;
    isActive?: boolean;
}