export interface Service {
    id: number;
    categoryId: number;
    slug: string;
    title: string;
    description: string;
    duration: string;
    price: string;
    icon: string;
    isActive: boolean;
    orderIndex: number;
    benefits: string[];
    includes: string[];
    recommendedFor: string[];
    beforeAfterImages: string[];
    createdAt: string;
    updatedAt: string;
}

export interface ServiceCategory {
    id: number;
    name: string;
    description: string;
    imagePath: string;
    orderIndex: number;
    isActive: boolean;
    createdAt: string;
    updatedAt: string;
}

export interface ServiceFilter {
    search?: string;
    categoryId?: number;
    minPrice?: number;
    maxPrice?: number;
    minDuration?: number;
    maxDuration?: number;
    isActive?: boolean;
}

export interface ServiceStats {
    totalServices: number;
    activeServices: number;
    totalRevenue: number;
    categoryBreakdown: Array<{
        category: string;
        count: number;
        revenue: number;
        percentage: number;
    }>;
    topServices: Array<{
        id: number;
        name: string;
        revenue: number;
        appointmentCount: number;
    }>;
}
