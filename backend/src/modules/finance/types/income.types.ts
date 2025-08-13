export interface IncomeListQuery {
  startDate?: string;
  endDate?: string;
  categoryId?: string;
  source?: string;
  minAmount?: number;
  maxAmount?: number;
  page?: number;
  pageSize?: number;
  sort?: 'date' | '-date' | 'amount' | '-amount';
}

export interface CreateIncomeDTO {
  categoryId?: string;
  amount: number;
  date: string; // yyyy-mm-dd
  description?: string;
  paymentMethod?: string;
  source?: string;
}

export type UpdateIncomeDTO = Partial<CreateIncomeDTO>;

export interface IncomeCategoryDTO {
  name: string;
  description?: string;
  color?: string;
}

export type UpdateIncomeCategoryDTO = Partial<IncomeCategoryDTO>;


