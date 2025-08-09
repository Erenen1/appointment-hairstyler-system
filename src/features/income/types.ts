export interface Income {
    id: number;
    category: string;
    amount: number;
    date: string;
    description: string;
    paymentMethod: string;
    source: string;
}

export interface IncomeForm {
    id?: number;
    category: string;
    amount: number;
    date: string;
    description: string;
    paymentMethod: string;
    source: string;
}

export interface IncomeCategory {
    id: number;
    name: string;
    description?: string;
    color: string;
}

export interface IncomeFilter {
    startDate?: string;
    endDate?: string;
    category?: string;
    source?: string;
    minAmount?: number;
    maxAmount?: number;
}

export interface IncomeStats {
    totalIncome: number;
    monthlyIncome: number;
    yearlyIncome: number;
    categoryBreakdown: Array<{
        category: string;
        total: number;
        percentage: number;
    }>;
    sourceBreakdown: Array<{
        source: string;
        total: number;
        percentage: number;
    }>;
}
