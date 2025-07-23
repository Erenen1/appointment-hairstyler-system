import { Staff } from "@/features/staff/types/StaffType";
import React from "react";

export interface ServiceRequest {
    categoryId: string;
    description?: string;
    duration: number;
    price: number;
    image?: string;
    staffIds?: [];
    isPopular?: string;
    isActive?: boolean
}

export type Category = {
    id: string;
    name: string;
};
export type Service = {
    name: string;
    slug?: string;
    categoryId: string;
    id?: string;
    category: Category;
    description?: string;
    duration: string;
    price: string;
    staffMembers?: Staff[];

}
// export interface Service AI {
//     id: string;
//     slug: string;
//     category: Category;
//     title: string;
//     description: string;
//     duration: number;
//     price: number;
//     staffMembers: Staff[];
//     serviceIds?: [];
//     isPopular?: boolean;
//     isActive?: boolean;
//     image?: string;
//     createdAt: string;
//     updatedAt: string;
// }

export interface ServiceModalProps {
    service: Service;
    children: React.ReactNode;
}
export interface ServiceHeaderProps {
    onSearch: (query: string) => void;
}
export interface ServiceUpdateModalProps {
    children: React.ReactNode;
    selectedService: Service;
}