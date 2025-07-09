export interface ServiceRequest {
    slug?: string;
    categoryId: string;
    title: string;
    description?: string;
    duration: number;
    price: number;
    image?: string;
    staffIds?: [];
    isPopular?: string;
    isActive?: boolean
}