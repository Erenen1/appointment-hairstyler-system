export type AccountStatus = 'active' | 'paid' | 'overdue' | 'cancelled';
export type PaymentTxType = 'payment' | 'charge' | 'adjustment';

export interface CurrentAccountListQuery {
  customerId?: string;
  status?: AccountStatus;
  minAmount?: number;
  maxAmount?: number;
  page?: number;
  pageSize?: number;
  sort?: string;
}

export interface CreateCurrentAccountDTO {
  customerId?: string;
  name: string;
  phone?: string;
  email?: string;
}

export type UpdateCurrentAccountDTO = Partial<CreateCurrentAccountDTO> & { status?: AccountStatus };

export interface CreateTransactionDTO {
  txType: PaymentTxType;
  amount: number;
  description?: string;
  date: string;
  reference?: string;
  notes?: string;
}


