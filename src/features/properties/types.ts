export interface Property {
    id: number;
    title: string;
    description: string;
    price: number;
    type: "Satılık" | "Kiralık";
    category: "Daire" | "Müstakil" | "Villa" | "Ofis" | "Dükkan" | "Arsa";
    location: string;
    district: string;
    city: string;
    address: string;
    area: number;
    rooms: string;
    bathrooms: number;
    age: number;
    floor: number;
    totalFloors: number;
    heating: string;
    furnished: boolean;
    parking: boolean;
    elevator: boolean;
    balcony: boolean;
    garden: boolean;
    pool: boolean;
    security: boolean;
    views: number;
    clicks: number;
    favorites: number;
    featured: boolean;
    status: "active" | "inactive" | "sold" | "rented";
    agentId: number;
    ownerId: number;
    createdAt: string;
    updatedAt: string;
    images: string[];
}

export interface PropertyForm {
    id?: number;
    title: string;
    description: string;
    price: number;
    type: "Satılık" | "Kiralık";
    category: "Daire" | "Müstakil" | "Villa" | "Ofis" | "Dükkan" | "Arsa";
    location: string;
    address: string;
    area: number;
    rooms: string;
    bathrooms: number;
    age: number;
    floor: number;
    totalFloors: number;
    heating: string;
    furnished: boolean;
    parking: boolean;
    elevator: boolean;
    balcony: boolean;
    garden: boolean;
    pool: boolean;
    security: boolean;
    featured: boolean;
    agentId: number;
}

export interface PropertyStats {
    totalProperties: number;
    activeProperties: number;
    soldProperties: number;
    rentedProperties: number;
    totalValue: number;
    averagePrice: number;
    mostViewedProperty: Property;
    mostClickedProperty: Property;
}

export interface PropertyFilter {
    type?: string[];
    category?: string[];
    priceMin?: number;
    priceMax?: number;
    areaMin?: number;
    areaMax?: number;
    district?: string[];
    rooms?: string[];
    featured?: boolean;
    status?: string[];
    agentId?: number;
}
