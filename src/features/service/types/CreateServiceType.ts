import React from "react";

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
    id: string;
    category: {
        category: string;
        name: string;
    };
    title: string;
    description: string;
    duration: string;
    price: string;
    staffMembers: [];
    serviceIds: [];
    isPopular: string;
    isActive: string;
    image: string;
    createdAt: string;
    updatedAt: string;
}

export interface ServiceModalProps {
    service: Service;
    children: React.ReactNode;
}
export interface ServiceHeaderProps {
    onSearch: (query: string) => void;
}