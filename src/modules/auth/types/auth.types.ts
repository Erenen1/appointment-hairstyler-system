export interface LoginDto {
  tenantId?: string;
  username: string; // email ya da username kabul edilir
  password: string;
  rememberMe?: boolean;
}

export interface RegisterDto {
  username: string;
  email: string;
  password: string;
  role?: 'admin' | 'staff' | 'user';
}

export interface RefreshDto {
  refreshToken: string;
}

export interface PasswordResetRequestDto {
  email: string;
}

export interface PasswordResetConfirmDto {
  email: string;
  token: string;
  newPassword: string;
}

export interface AuthUserResponse {
  id: string;
  username: string;
  email: string;
  firstName?: string | null;
  lastName?: string | null;
  role: 'admin' | 'staff' | 'user';
  isActive: boolean;
  lastLogin?: string | null;
  createdAt?: string;
  updatedAt?: string;
}


