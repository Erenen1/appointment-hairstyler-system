export interface Property {
    id: number;
    title: string;
    description?: string;
    price: number;
    type: string;
    category: string;
    location: string;
    city?: string;
    district?: string;
    address?: string;
    area: number;
    rooms?: string;
    age?: number;
    floor?: number;
    totalFloors?: number;
    heating?: string;
    furnished?: boolean;
    parking?: boolean;
    elevator?: boolean;
    balcony?: boolean;
    garden?: boolean;
    pool?: boolean;
    security?: boolean;
    views: number;
    clicks: number;
    favorites?: number;
    featured: boolean;
    status?: string;
    agentId?: number;
    ownerId?: number;
    createdAt: string;
    updatedAt?: string;
    images?: string[];
}

export interface SortOption {
    label: string;
    value: string;
}

export interface TimeRangeOption {
    label: string;
    value: string;
}

export interface FilterState {
    global: string;
    type: string[];
    category: string[];
    sortBy: string;
    timeRange: string;
}

export interface ChartDataset {
    label: string;
    data: number[];
    backgroundColor?: string | string[];
    borderColor?: string;
    borderWidth?: number;
}

export interface ChartConfig {
    data: {
        labels: string[];
        datasets: ChartDataset[];
    };
    options: Record<string, any>;
}
