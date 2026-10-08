import { inject } from '@angular/core';
import { CanActivateFn, Router, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { AuthService } from './auth.service';

/**
 * Functional Route Guard: adminGuard
 * Restricts access strictly to authenticated users with role === 'ADMIN'.
 * Trader and Pro Trader accounts attempting unauthorized access are redirected
 * to the trader dashboard with an access-denied flash query parameter.
 */
export const adminGuard: CanActivateFn = (
  route: ActivatedRouteSnapshot,
  state: RouterStateSnapshot
) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  // First verify user is authenticated
  if (!authService.isAuthenticated()) {
    return router.createUrlTree(['/auth/login'], {
      queryParams: { returnUrl: state.url }
    });
  }

  // Verify RBAC privilege
  if (authService.isAdmin()) {
    return true;
  }

  // Authenticated, but lacks ADMIN authorization
  console.warn(`[adminGuard] Unauthorized admin access attempt by user: ${authService.currentUser()?.email}`);
  return router.createUrlTree(['/dashboard'], {
    queryParams: { error: 'UNAUTHORIZED_ADMIN_RESOURCE' }
  });
};
