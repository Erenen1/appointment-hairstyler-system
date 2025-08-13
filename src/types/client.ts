export interface Client {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    type: ClientType;
    status: ClientStatus;

    // Personal Info
    dateOfBirth?: Date;
    gender?: 'male' | 'female' | 'other';
    nationality?: string;
    idNumber?: string;

    // Address
    address?: ClientAddress;

    // Preferences
    preferences: ClientPreferences;

    // Financial
    budget?: {
        min: number;
        max: number;
        currency: 'TRY' | 'USD' | 'EUR';
    };

    // Agent Assignment
    assignedAgentId?: string;
    source: ClientSource;

    // Notes
    notes?: string;
    internalNotes?: string;

    // Timestamps
    createdAt: Date;
    updatedAt: Date;
    lastContactAt?: Date;
}

export type ClientType = 'buyer' | 'seller' | 'tenant' | 'landlord' | 'investor';

export type ClientStatus =
    | 'active'
    | 'inactive'
    | 'prospect'
    | 'qualified'
    | 'converted'
    | 'lost';

export type ClientSource =
    | 'website'
    | 'referral'
    | 'social_media'
    | 'advertisement'
    | 'walk_in'
    | 'other';

export interface ClientAddress {
    street: string;
    city: string;
    state: string;
    postalCode: string;
    country: string;
    isCurrent: boolean;
}

export interface ClientPreferences {
    propertyTypes: string[];
    locations: string[];
    maxPrice?: number;
    minSize?: number;
    maxSize?: number;
    bedrooms?: number;
    bathrooms?: number;
    parking?: boolean;
    garden?: boolean;
    balcony?: boolean;
    elevator?: boolean;
}

export interface ClientInteraction {
    id: string;
    clientId: string;
    agentId: string;
    type: 'call' | 'email' | 'meeting' | 'viewing' | 'other';
    subject: string;
    notes?: string;
    scheduledAt?: Date;
    completedAt?: Date;
    createdAt: Date;
}
