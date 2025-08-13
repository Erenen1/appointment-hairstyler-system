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
    isSeriousBuyer: boolean;
    customerNotes: string;
    viewedProperties: number[];
    assignedAgent: number;
}

export interface CustomerForm {
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
    isSeriousBuyer: boolean;
    customerNotes: string;
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