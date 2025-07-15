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
    // categoryId: string;
    category: {
        category: string;
        name: string;
    };
    title: string;
    description: string;
    duration: string;
    price: string;
    staffMembers: [];
    isPopular: string;
    isActive: string;
    image: string;
}

export interface ServiceHeaderProps {
    onSearch: (query: string) => void;
}