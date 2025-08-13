export interface Property {
    id: number;
    title: string;
    description: string;
    price: number;
    type: 'Satılık' | 'Kiralık';
    category: 'Daire' | 'Müstakil' | 'Villa' | 'Ofis' | 'Dükkan' | 'Arsa';
    area: number; // m²
    rooms: string; // 2+1, 3+1, etc.
    bedrooms: number;
    bathrooms: number;
    floor: number;
    totalFloors: number;
    age: number;
    heating: 'Doğalgaz' | 'Elektrik' | 'Kömür' | 'Yakıt' | 'Merkezi';
    furnished: boolean;
    parking: boolean;
    balcony: boolean;
    elevator: boolean;
    address: {
        district: string;
        city: string;
        fullAddress: string;
        coordinates?: {
            lat: number;
            lng: number;
        };
    };
    features: string[]; // Özellikler
    images: string[]; // Resim URL'leri
    contact: {
        name: string;
        phone: string;
        email: string;
        isAgent: boolean;
    };
    status: 'active' | 'pending' | 'sold' | 'rented' | 'inactive';
    views: number;
    clicks: number;
    createdAt: string;
    updatedAt: string;
    expiresAt: string;
    tags: string[];
    isFeatured: boolean;
    isUrgent: boolean;
    isNew: boolean;
}

export interface PropertyForm {
    title: string;
    description: string;
    price: number;
    type: 'Satılık' | 'Kiralık';
    category: 'Daire' | 'Müstakil' | 'Villa' | 'Ofis' | 'Dükkan' | 'Arsa';
    area: number;
    rooms: string;
    bedrooms: number;
    bathrooms: number;
    floor: number;
    totalFloors: number;
    age: number;
    heating: 'Doğalgaz' | 'Elektrik' | 'Kömür' | 'Yakıt' | 'Merkezi';
    furnished: boolean;
    parking: boolean;
    balcony: boolean;
    elevator: boolean;
    address: {
        district: string;
        city: string;
        fullAddress: string;
    };
    features: string[];
    contact: {
        name: string;
        phone: string;
        email: string;
        isAgent: boolean;
    };
    tags: string[];
    isFeatured: boolean;
    isUrgent: boolean;
}

export interface PropertyFilter {
    type?: string[];
    category?: string[];
    priceRange?: {
        min: number;
        max: number;
    };
    areaRange?: {
        min: number;
        max: number;
    };
    rooms?: string[];
    district?: string[];
    features?: string[];
    status?: string[];
}

export interface PropertyStats {
    totalProperties: number;
    activeProperties: number;
    totalViews: number;
    totalClicks: number;
    avgPrice: number;
    avgArea: number;
    typeDistribution: Record<string, number>;
    categoryDistribution: Record<string, number>;
    districtDistribution: Record<string, number>;
}
