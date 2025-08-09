export interface Bill {
    id: number;
    customerId: number;
    billNumber: string;
    date: string;
    dueDate?: string;
    subtotal: number;
    taxAmount: number;
    discountAmount: number;
    totalAmount: number;
    status: 'draft' | 'sent' | 'paid' | 'overdue' | 'cancelled';
    paymentMethod?: string;
    paymentDate?: string;
    notes?: string;
    items: BillItem[];
    createdAt: string;
    updatedAt: string;
}

export interface BillItem {
    id: number;
    billId: number;
    serviceId: number;
    description: string;
    quantity: number;
    unitPrice: number;
    totalPrice: number;
    notes?: string;
}

export interface BillFilter {
    customerId?: number;
    status?: 'draft' | 'sent' | 'paid' | 'overdue' | 'cancelled';
    startDate?: string;
    endDate?: string;
    minAmount?: number;
    maxAmount?: number;
    billNumber?: string;
}

export interface BillStats {
    totalBills: number;
    totalAmount: number;
    paidAmount: number;
    overdueAmount: number;
    statusBreakdown: Array<{
        status: string;
        count: number;
        amount: number;
        percentage: number;
    }>;
    monthlyBreakdown: Array<{
        month: string;
        count: number;
        amount: number;
    }>;
    customerBreakdown: Array<{
        customerId: number;
        customerName: string;
        billCount: number;
        totalAmount: number;
    }>;
}

