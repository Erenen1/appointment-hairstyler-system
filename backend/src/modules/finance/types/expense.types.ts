export interface ExpenseListQuery {
  startDate?: string;
  endDate?: string;
  categoryId?: string;
  minAmount?: number;
  maxAmount?: number;
  page?: number;
  pageSize?: number;
  sort?: 'date' | '-date' | 'amount' | '-amount';
}

export interface CreateExpenseDTO {
  categoryId?: string;
  amount: number;
  date: string;
  description?: string;
  paymentMethod?: string;
  type?: string;
}

export type UpdateExpenseDTO = Partial<CreateExpenseDTO>;

export interface ExpenseCategoryDTO {
  name: string;
  description?: string;
  color?: string;
  budget?: number;
}

export type UpdateExpenseCategoryDTO = Partial<ExpenseCategoryDTO>;


