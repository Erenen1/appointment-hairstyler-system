export interface AnalyticsListQuery {
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
  sort?: 'views' | '-views' | 'clicks' | '-clicks' | 'price' | '-price';
}

export interface AnalyticsStatsQuery {
  range?: '7d' | '30d' | '90d';
  groupBy?: 'day' | 'week' | 'month';
}

export interface AnalyticsTimeseriesQuery {
  metric: 'views' | 'clicks' | 'favorites';
  range?: '7d' | '30d' | '90d';
  groupBy?: 'day' | 'week' | 'month';
}

export interface CreateEventDTO {
  eventType: 'view' | 'click' | 'favorite' | 'share' | 'inquiry';
  metadata?: Record<string, any>;
}


