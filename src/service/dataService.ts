const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api';

export interface Customer {
    id: number;
    name: string;
    email: string;
    phone: string;
    address?: string;
    createdAt: string;
}

export interface Service {
    id: number;
    name: string;
    description?: string;
    price: number;
    duration: number;
    category?: string;
}

export interface Staff {
    id: number;
    name: string;
    position: string;
    email: string;
    phone: string;
    isActive: boolean;
}

export interface AppointmentStatus {
    id: number;
    name: string;
    color: string;
    description?: string;
}

export interface Expense {
    id: number;
    description: string;
    amount: number;
    category: string;
    date: string;
    notes?: string;
}

export interface Income {
    id: number;
    description: string;
    amount: number;
    category: string;
    date: string;
    source: string;
}

export interface Adisyon {
    id: number;
    customerId: number;
    date: string;
    totalAmount: number;
    items: Array<{
        id: number;
        serviceId: number;
        quantity: number;
        unitPrice: number;
        totalPrice: number;
    }>;
    status: 'pending' | 'completed' | 'cancelled';
}

export class DataService {
    private static async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
        const url = `${API_BASE_URL}${endpoint}`;

        const defaultOptions: RequestInit = {
            headers: {
                'Content-Type': 'application/json',
                ...options.headers,
            },
            ...options,
        };

        try {
            const response = await fetch(url, defaultOptions);

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            return await response.json();
        } catch (error) {
            console.error('API request failed:', error);
            throw error;
        }
    }

    // Customer methods
    static async getCustomers(): Promise<Customer[]> {
        return this.request<Customer[]>('/customers');
    }

    static async getCustomerById(id: number): Promise<Customer> {
        return this.request<Customer>(`/customers/${id}`);
    }

    static async createCustomer(customer: Omit<Customer, 'id' | 'createdAt'>): Promise<Customer> {
        return this.request<Customer>('/customers', {
            method: 'POST',
            body: JSON.stringify(customer),
        });
    }

    static async updateCustomer(id: number, customer: Partial<Customer>): Promise<Customer> {
        return this.request<Customer>(`/customers/${id}`, {
            method: 'PUT',
            body: JSON.stringify(customer),
        });
    }

    static async deleteCustomer(id: number): Promise<void> {
        return this.request<void>(`/customers/${id}`, {
            method: 'DELETE',
        });
    }

    // Service methods
    static async getServices(): Promise<Service[]> {
        return this.request<Service[]>('/services');
    }

    static async getServiceById(id: number): Promise<Service> {
        return this.request<Service>(`/services/${id}`);
    }

    static async createService(service: Omit<Service, 'id'>): Promise<Service> {
        return this.request<Service>('/services', {
            method: 'POST',
            body: JSON.stringify(service),
        });
    }

    static async updateService(id: number, service: Partial<Service>): Promise<Service> {
        return this.request<Service>(`/services/${id}`, {
            method: 'PUT',
            body: JSON.stringify(service),
        });
    }

    static async deleteService(id: number): Promise<void> {
        return this.request<void>(`/services/${id}`, {
            method: 'DELETE',
        });
    }

    // Staff methods
    static async getStaff(): Promise<Staff[]> {
        return this.request<Staff[]>('/staff');
    }

    static async getStaffById(id: number): Promise<Staff> {
        return this.request<Staff>(`/staff/${id}`);
    }

    static async createStaff(staff: Omit<Staff, 'id'>): Promise<Staff> {
        return this.request<Staff>('/staff', {
            method: 'POST',
            body: JSON.stringify(staff),
        });
    }

    static async updateStaff(id: number, staff: Partial<Staff>): Promise<Staff> {
        return this.request<Staff>(`/staff/${id}`, {
            method: 'PUT',
            body: JSON.stringify(staff),
        });
    }

    static async deleteStaff(id: number): Promise<void> {
        return this.request<void>(`/staff/${id}`, {
            method: 'DELETE',
        });
    }

    // Appointment Status methods
    static async getAppointmentStatuses(): Promise<AppointmentStatus[]> {
        return this.request<AppointmentStatus[]>('/appointment-statuses');
    }

    // Financial methods
    static async getExpenses(): Promise<Expense[]> {
        return this.request<Expense[]>('/expenses');
    }

    static async createExpense(expense: Omit<Expense, 'id'>): Promise<Expense> {
        return this.request<Expense>('/expenses', {
            method: 'POST',
            body: JSON.stringify(expense),
        });
    }

    static async updateExpense(id: number, expense: Partial<Expense>): Promise<Expense> {
        return this.request<Expense>(`/expenses/${id}`, {
            method: 'PUT',
            body: JSON.stringify(expense),
        });
    }

    static async deleteExpense(id: number): Promise<void> {
        return this.request<void>(`/expenses/${id}`, {
            method: 'DELETE',
        });
    }

    static async getIncome(): Promise<Income[]> {
        return this.request<Income[]>('/income');
    }

    static async createIncome(income: Omit<Income, 'id'>): Promise<Income> {
        return this.request<Income>('/income', {
            method: 'POST',
            body: JSON.stringify(income),
        });
    }

    static async updateIncome(id: number, income: Partial<Income>): Promise<Income> {
        return this.request<Income>(`/income/${id}`, {
            method: 'PUT',
            body: JSON.stringify(income),
        });
    }

    static async deleteIncome(id: number): Promise<void> {
        return this.request<void>(`/income/${id}`, {
            method: 'DELETE',
        });
    }

    // Adisyon methods
    static async getAdisyon(): Promise<Adisyon[]> {
        return this.request<Adisyon[]>('/adisyon');
    }

    static async createAdisyon(adisyon: Omit<Adisyon, 'id'>): Promise<Adisyon> {
        return this.request<Adisyon>('/adisyon', {
            method: 'POST',
            body: JSON.stringify(adisyon),
        });
    }

    static async updateAdisyon(id: number, adisyon: Partial<Adisyon>): Promise<Adisyon> {
        return this.request<Adisyon>(`/adisyon/${id}`, {
            method: 'PUT',
            body: JSON.stringify(adisyon),
        });
    }

    static async deleteAdisyon(id: number): Promise<void> {
        return this.request<void>(`/adisyon/${id}`, {
            method: 'DELETE',
        });
    }
}

export default DataService;

