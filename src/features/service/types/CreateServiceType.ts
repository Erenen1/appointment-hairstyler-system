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

export type Service = {
    slug: string;
    categoryId: string;
    title: string;
    description: string;
    duration: string;
    price: string;
    staffIds: [];
    isPopular: string;
    isActive: string;
    image: string;
}