export interface Property {
    id: number;
    title: string;
    location: string;
    price: number;
    views: number;
    clicks: number;
    type: string;
    category: string;
    featured: boolean;
    agentId: number;
    area: number;
    rooms: string;
    createdAt: string;
}



export interface ChartData {
    data: {
        labels: string[];
        datasets: {
            data: number[];
            backgroundColor: string[];
        }[];
    };
    options: {
        cutout: string;
        plugins: {
            legend: {
                position: string;
            };
        };
        maintainAspectRatio: boolean;
    };
}

export interface StatisticsStats {
    totalProperties: number;
    totalViews: number;
    totalClicks: number;
    avgPrice: number;
}
