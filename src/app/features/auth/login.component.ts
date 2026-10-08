import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { AuthService } from '../../core/auth/auth.service';
import { UserRole } from '../../core/models/user.model';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="min-h-[85vh] flex items-center justify-center p-4">
      <div class="w-full max-w-md bg-slate-900/90 border border-slate-800 rounded-2xl p-8 shadow-2xl backdrop-blur-xl">
        
        <div class="text-center mb-8">
          <div class="inline-flex h-12 w-12 rounded-xl bg-gradient-to-tr from-blue-600 to-emerald-400 p-[1.5px] mb-3">
            <div class="h-full w-full bg-slate-950 rounded-[10px] flex items-center justify-center">
              <svg class="w-6 h-6 text-blue-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path stroke-linecap="round" stroke-linejoin="round" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
              </svg>
            </div>
          </div>
          <h2 class="text-2xl font-extrabold text-white">Sign In to AlphaTerminal</h2>
          <p class="text-xs text-slate-400 mt-1">Multi-model AI trading signal intelligence platform</p>
        </div>

        <form (ngSubmit)="onSubmit()" class="space-y-4">
          <div>
            <label class="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">Email Address</label>
            <input 
              type="email" 
              [(ngModel)]="email" 
              name="email"
              required 
              class="w-full bg-slate-950 border border-slate-800 rounded-lg px-3.5 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 transition-colors"
              placeholder="trader@hedgefund.com"
            />
          </div>

          <div>
            <label class="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">Password</label>
            <input 
              type="password" 
              [(ngModel)]="password" 
              name="password"
              required 
              class="w-full bg-slate-950 border border-slate-800 rounded-lg px-3.5 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 transition-colors"
              placeholder="••••••••••••"
            />
          </div>

          <div>
            <label class="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">Simulation Role</label>
            <select 
              [(ngModel)]="selectedRole" 
              name="selectedRole"
              class="w-full bg-slate-950 border border-slate-800 rounded-lg px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-blue-500"
            >
              <option value="ADMIN">ADMIN (Full Access to Admin & Signals)</option>
              <option value="PRO_TRADER">PRO_TRADER (Signals & High-frequency alerts)</option>
              <option value="TRADER">TRADER (Standard tier)</option>
            </select>
          </div>

          <button 
            type="submit" 
            class="w-full mt-2 py-3 px-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-semibold text-sm rounded-lg shadow-glow-accent transition-all duration-200"
          >
            Authenticate Session
          </button>
        </form>

        <div class="mt-6 text-center text-xs text-slate-500">
          Enterprise RBAC Active • 256-bit JWT Encryption
        </div>
      </div>
    </div>
  `
})
export class LoginComponent {
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);

  email = 'alex.vance@alphatrading.ai';
  password = '••••••••••••';
  selectedRole: UserRole = 'ADMIN';

  onSubmit(): void {
    this.authService.login(this.email, this.selectedRole);
    const returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/dashboard';
    this.router.navigateByUrl(returnUrl);
  }
}
