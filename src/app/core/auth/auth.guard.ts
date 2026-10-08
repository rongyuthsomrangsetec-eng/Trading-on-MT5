import { inject } from '@angular/core';
import { CanActivateFn, Router, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { AuthService } from './auth.service';

/**
 * Functional Route Guard: authGuard
 * Enforces an active, authenticated session with valid JWT credentials.
 * If unauthenticated or account is inactive, redirects to login with returnUrl preservation.
 */
export const authGuard: CanActivateFn = (
  route: ActivatedRouteSnapshot,
  state: RouterStateSnapshot
) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  const isAuthenticated = authService.isAuthenticated();
  const currentUser = authService.currentUser();

  // Validate presence of authenticated session and active account status
  if (isAuthenticated && currentUser?.isActive) {
    return true;
  }

  // Not authenticated or account suspended -> redirect to login
  return router.createUrlTree(['/auth/login'], {
    queryParams: { returnUrl: state.url }
  });
};
