export interface Customer {
    id: number;
    fullName: string;
    email: string;
    phone: string;
    address: string;
    dateOfBirth: string;
    profession: string;
    budget: number;
    preferredType: "Satılık" | "Kiralık";
    preferredCategory: "Daire" | "Müstakil" | "Villa" | "Ofis" | "Dükkan" | "Arsa";
    preferredDistricts: string[];
    minArea: number;
    maxArea: number;
    minRooms: string;
    requirements: string[];
    isActive: boolean;
    registrationDate: string;
    lastContact: string;
    priority: "high" | "medium" | "low";
    notes: string;
    favoriteProperties: number[];
    viewedProperties: number[];
    assignedAgent: number;
}

export interface CustomerForm {
    fullName: string;
    email: string;
    phone: string;
    address: string;
    profession: string;
    budget: number;
    preferredType: "Satılık" | "Kiralık";
    preferredCategory: "Daire" | "Müstakil" | "Villa" | "Ofis" | "Dükkan" | "Arsa";
    preferredDistricts: string[];
    minArea: number;
    maxArea: number;
    minRooms: string;
    requirements: string[];
    priority: "high" | "medium" | "low";
    notes: string;
    assignedAgent: number;
}

export interface CustomerStats {
    totalCustomers: number;
    activeCustomers: number;
    newCustomersThisMonth: number;
    highPriorityCustomers: number;
    totalBudget: number;
    averageBudget: number;
    topBudgetCustomer: Customer;
}