export type Customer = {
    id: string;
    fullName: string;
    phone: string;
    email: string;
    notes: string;
    createdAt: string;
    updatedAt: string;
}

export interface CustomersRequest {
    fullName: string;
    phone: string;
    email: string;
    notes: string;
}

export interface CustomersHeaderProps {
    onSearch: (query: string) => void;
}