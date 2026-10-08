export type UserRole = 'ADMIN' | 'TRADER' | 'PRO_TRADER';

export interface User {
  id: string;
  email: string;
  name?: string;
  role: UserRole;
  isActive: boolean;
  subscriptionExpiresAt?: string;
  createdAt: string;
  avatarUrl?: string;
}

export interface AuthResponse {
  user: User;
  token: string;
  refreshToken: string;
  expiresIn: number;
}
