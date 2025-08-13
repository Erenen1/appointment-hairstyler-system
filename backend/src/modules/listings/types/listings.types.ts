export type PropertyType = 'Satılık' | 'Kiralık';
export type PropertyCategory = 'Daire' | 'Müstakil' | 'Villa' | 'Ofis' | 'Dükkan' | 'Arsa';
export type PropertyStatus = 'active' | 'pending' | 'sold' | 'rented' | 'inactive';

export interface PropertyListQuery {
  type?: string | string[];
  category?: string | string[];
  priceMin?: number;
  priceMax?: number;
  areaMin?: number;
  areaMax?: number;
  district?: string | string[];
  rooms?: string | string[];
  features?: string | string[];
  status?: string | string[];
  page?: number;
  pageSize?: number;
  sort?: 'views' | '-views' | 'clicks' | '-clicks' | 'price' | '-price' | 'createdAt' | '-createdAt';
}

export interface CreatePropertyDTO {
  title: string;
  description?: string;
  price: number;
  type: PropertyType;
  category: PropertyCategory;
  area?: number;
  roomsLabel?: string;
  bedrooms?: number;
  bathrooms?: number;
  floor?: number;
  totalFloors?: number;
  age?: number;
  heating?: string;
  furnished?: boolean;
  parking?: boolean;
  balcony?: boolean;
  elevator?: boolean;
  districtName?: string;
  cityName?: string;
  fullAddress?: string;
  lat?: number;
  lng?: number;
  contactName?: string;
  contactPhone?: string;
  contactEmail?: string;
  contactIsAgent?: boolean;
  isFeatured?: boolean;
  isUrgent?: boolean;
  isNew?: boolean;
  status?: PropertyStatus;
  expiresAt?: string;
  agentId?: string;
  ownerCustomerId?: string;
}

export type UpdatePropertyDTO = Partial<CreatePropertyDTO>;

export interface CreatePropertyImageDTO { url: string; alt?: string; sortOrder?: number; }

export interface CreatePropertyEventDTO { eventType: 'view' | 'click' | 'favorite' | 'share' | 'inquiry'; metadata?: Record<string, any>; }


