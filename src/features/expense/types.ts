export interface Expense {
    id: number;
    category: string;
    amount: number;
    date: string;
    description: string;
    paymentMethod: string;
    type: string;
}

export interface ExpenseCategory {
    id: number;
    name: string;
    description?: string;
    color: string;
    budget?: number;
}

export interface ExpenseFilter {
    startDate?: string;
    endDate?: string;
    category?: string;
    minAmount?: number;
    maxAmount?: number;
}

export interface ExpenseStats {
    totalExpenses: number;
    monthlyExpenses: number;
    yearlyExpenses: number;
    categoryBreakdown: Array<{
        category: string;
        total: number;
        percentage: number;
    }>;
    budgetStatus: Array<{
        category: string;
        spent: number;
        budget: number;
        remaining: number;
        percentage: number;
    }>;
}
