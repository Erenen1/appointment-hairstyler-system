export interface Property {
    id: string;
    title: string;
    description: string;
    type: PropertyType;
    status: PropertyStatus;

    // Basic Info
    price: number;
    currency: 'TRY' | 'USD' | 'EUR';
    size: number; // square meters
    rooms: number;
    bedrooms: number;
    bathrooms: number;
    floors: number;
    yearBuilt?: number;

    // Location
    address: PropertyAddress;
    coordinates?: {
        latitude: number;
        longitude: number;
    };

    // Features
    features: PropertyFeature[];
    amenities: PropertyAmenity[];

    // Media
    images: PropertyImage[];
    videos?: PropertyVideo[];
    virtualTour?: string;

    // Agent Info
    agentId: string;
    isFeatured: boolean;
    isPremium: boolean;

    // Timestamps
    createdAt: Date;
    updatedAt: Date;
    publishedAt?: Date;
    soldAt?: Date;
}

export type PropertyType =
    | 'apartment'
    | 'house'
    | 'villa'
    | 'office'
    | 'shop'
    | 'land'
    | 'commercial'
    | 'industrial';

export type PropertyStatus =
    | 'for_sale'
    | 'for_rent'
    | 'sold'
    | 'rented'
    | 'under_contract'
    | 'off_market';

export interface PropertyAddress {
    street: string;
    city: string;
    state: string;
    postalCode: string;
    country: string;
    neighborhood?: string;
}

export interface PropertyFeature {
    id: string;
    name: string;
    category: 'interior' | 'exterior' | 'security' | 'energy';
    isAvailable: boolean;
}

export interface PropertyAmenity {
    id: string;
    name: string;
    icon?: string;
    distance?: number; // meters
}

export interface PropertyImage {
    id: string;
    url: string;
    alt: string;
    isPrimary: boolean;
    order: number;
    createdAt: Date;
}

export interface PropertyVideo {
    id: string;
    url: string;
    thumbnail: string;
    duration: number; // seconds
    createdAt: Date;
}
