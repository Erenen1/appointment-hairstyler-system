export interface Property {
    id: number;
    title: string;
    price: number;
    type: string;
    category: string;
    location: string;
    area: number;
    views: number;
    clicks: number;
    featured: boolean;
    createdAt: string;
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
