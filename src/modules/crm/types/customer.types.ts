export type PropertyType = 'Satılık' | 'Kiralık';
export type PropertyCategory = 'Daire' | 'Müstakil' | 'Villa' | 'Ofis' | 'Dükkan' | 'Arsa';

export interface CustomerListQuery {
  search?: string;
  isActive?: boolean;
  assignedAgentId?: string;
  preferredType?: PropertyType;
  preferredCategory?: PropertyCategory;
  page?: number;
  pageSize?: number;
  sort?: string;
}

export interface CreateCustomerDTO {
  fullName: string;
  email?: string;
  phone?: string;
  address?: string;
  dateOfBirth?: string;
  profession?: string;
  budget?: number;
  preferredType?: PropertyType;
  preferredCategory?: PropertyCategory;
  minArea?: number;
  maxArea?: number;
  minRoomsLabel?: string;
  isSeriousBuyer?: boolean;
  customerNotes?: string;
  assignedAgentId?: string;
  preferredDistricts?: string[];
  requirements?: string[];
}

export type UpdateCustomerDTO = Partial<CreateCustomerDTO>;

export interface CustomerResponse {
  id: string;
  fullName: string;
  email?: string | null;
  phone?: string | null;
  address?: string | null;
  dateOfBirth?: string | null;
  profession?: string | null;
  budget?: number | null;
  preferredType?: PropertyType | null;
  preferredCategory?: PropertyCategory | null;
  minArea?: number | null;
  maxArea?: number | null;
  minRoomsLabel?: string | null;
  isSeriousBuyer: boolean;
  customerNotes?: string | null;
  assignedAgent?: { id: string; fullName?: string | null } | null;
  preferredDistricts?: string[];
  requirements?: string[];
  registrationDate: string;
  lastContact?: string | null;
  isActive: boolean;
}


