export interface CurrentAccount {
    id: number;
    name: string;
    phone: string;
    email: string;
    balance: number;
    lastTransaction: string;
    status: 'active' | 'paid' | 'overdue' | 'cancelled';
}

export interface CurrentAccountTransaction {
    id: number;
    accountId: number;
    type: 'payment' | 'charge' | 'adjustment';
    amount: number;
    description: string;
    date: string;
    reference?: string;
    notes?: string;
}

export interface CurrentAccountFilter {
    customerId?: number;
    type?: 'receivable' | 'payable';
    status?: 'active' | 'paid' | 'overdue' | 'cancelled';
    minAmount?: number;
    maxAmount?: number;
    dueDateStart?: string;
    dueDateEnd?: string;
}

export interface CurrentAccountStats {
    totalReceivables: number;
    totalPayables: number;
    overdueAmount: number;
    overdueCount: number;
    customerBreakdown: Array<{
        customerId: number;
        customerName: string;
        receivable: number;
        payable: number;
        balance: number;
    }>;
    statusBreakdown: Array<{
        status: string;
        count: number;
        amount: number;
        percentage: number;
    }>;
}

