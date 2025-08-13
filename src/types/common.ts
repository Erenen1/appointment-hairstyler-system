// Generic response types
export interface ApiResponse<T = any> {
    success: boolean;
    data?: T;
    message?: string;
    error?: string;
    errors?: Record<string, string[]>;
}

export interface PaginatedResponse<T> {
    data: T[];
    pagination: {
        page: number;
        limit: number;
        total: number;
        totalPages: number;
        hasNext: boolean;
        hasPrev: boolean;
    };
}

// File types
export interface FileUpload {
    id: string;
    name: string;
    size: number;
    type: string;
    url: string;
    thumbnail?: string;
    uploadedBy: string;
    createdAt: Date;
}

export interface ImageUpload extends FileUpload {
    width: number;
    height: number;
    alt?: string;
}

// Form types
export interface FormField {
    name: string;
    label: string;
    type: 'text' | 'email' | 'password' | 'number' | 'select' | 'textarea' | 'checkbox' | 'radio' | 'date';
    required: boolean;
    placeholder?: string;
    options?: { value: string; label: string }[];
    validation?: {
        min?: number;
        max?: number;
        pattern?: string;
        custom?: (value: any) => boolean | string;
    };
}

export interface FormSection {
    title: string;
    description?: string;
    fields: FormField[];
}

// UI types
export interface MenuItem {
    id: string;
    label: string;
    icon?: string;
    href?: string;
    children?: MenuItem[];
    isActive?: boolean;
    isVisible?: boolean;
    permissions?: string[];
}

export interface Breadcrumb {
    label: string;
    href?: string;
    isActive?: boolean;
}

export interface TabItem {
    id: string;
    label: string;
    icon?: string;
    content: React.ReactNode;
    isDisabled?: boolean;
}

// Notification types
export interface Notification {
    id: string;
    type: 'info' | 'success' | 'warning' | 'error';
    title: string;
    message: string;
    isRead: boolean;
    createdAt: Date;
    readAt?: Date;
    actionUrl?: string;
    actionText?: string;
}

// Search types
export interface SearchFilter {
    field: string;
    operator: 'eq' | 'ne' | 'gt' | 'gte' | 'lt' | 'lte' | 'contains' | 'startsWith' | 'endsWith' | 'in' | 'notIn';
    value: any;
}

export interface SearchSort {
    field: string;
    direction: 'asc' | 'desc';
}

export interface SearchParams {
    query?: string;
    filters?: SearchFilter[];
    sort?: SearchSort[];
    page?: number;
    limit?: number;
}

// Date types
export interface DateRange {
    start: Date;
    end: Date;
}

export interface TimeSlot {
    start: string; // HH:mm format
    end: string;   // HH:mm format
    isAvailable: boolean;
}

// Status types
export interface StatusBadge {
    label: string;
    variant: 'default' | 'secondary' | 'destructive' | 'outline';
    color?: string;
}
