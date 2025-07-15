export interface CategoriesRequest {
    name: string;
    description: string;
}

export type Categories = {
    id: string
    name: string;
    description: string;
    isActive: boolean;
    createdAt: string;
    updatedAt: string;
}

export interface CategoriesHeaderProps {
    onSearch: (query: string) => void;
}