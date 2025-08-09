export type UUID = string;

export type DateString = string;

export type TimeString = string;

export interface TimeRange {
  start: TimeString;
  end: TimeString;
}

export interface DateRange {
  start: DateString;
  end: DateString;
}

export interface Coordinates {
  latitude: number;
  longitude: number;
}

export type Status = 'active' | 'inactive' | 'pending' | 'deleted';

export interface Auditable {
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date;
} 