import { Injectable, computed, signal } from '@angular/core';
import { Router } from '@angular/router';
import { User, UserRole } from '../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  // State represented via modern Angular Signals
  private readonly _currentUser = signal<User | null>({
    id: 'usr_panq_admin',
    email: 'panq@alphatrading.ai',
    name: 'PANQ',
    role: 'ADMIN',
    isActive: true,
    subscriptionExpiresAt: '2029-12-31T23:59:59Z',
    createdAt: '2024-01-01T00:00:00Z',
    avatarUrl: '/images/admin_panq.jpg'
  });

  private readonly _token = signal<string | null>('eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.dummy_token');

  // Read-only signals exposed to consumers
  readonly currentUser = this._currentUser.asReadonly();
  readonly token = this._token.asReadonly();

  // Computed signals
  readonly isAuthenticated = computed(() => !!this._currentUser() && !!this._token());
  readonly userRole = computed<UserRole | null>(() => this._currentUser()?.role ?? null);
  readonly isAdmin = computed(() => this._currentUser()?.role === 'ADMIN');
  readonly isProTrader = computed(() => 
    this._currentUser()?.role === 'ADMIN' || this._currentUser()?.role === 'PRO_TRADER'
  );

  constructor(private router: Router) {}

  login(email: string, role: UserRole = 'ADMIN'): void {
    const user: User = {
      id: 'usr_' + Math.random().toString(36).substring(2, 9),
      email,
      name: email.split('@')[0],
      role,
      isActive: true,
      subscriptionExpiresAt: '2026-12-31T23:59:59Z',
      createdAt: new Date().toISOString()
    };
    this._currentUser.set(user);
    this._token.set('jwt_' + Math.random().toString(36).substring(2));
  }

  logout(): void {
    this._currentUser.set(null);
    this._token.set(null);
    this.router.navigate(['/auth/login']);
  }

  updateCurrentUser(user: Partial<User>): void {
    const current = this._currentUser();
    if (current) {
      this._currentUser.set({ ...current, ...user });
    }
  }

  switchRole(role: UserRole): void {
    const current = this._currentUser();
    if (current) {
      this._currentUser.set({ ...current, role });
    }
  }
}
