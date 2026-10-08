import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from '../../../core/auth/auth.service';
import { SignalService } from '../../../core/services/signal.service';
import { UserRole } from '../../../core/models/user.model';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive],
  template: `
    <header class="border-b border-slate-800/80 bg-slate-950/90 backdrop-blur-md sticky top-0 z-50">
      <div class="max-w-7xl mx-auto px-3 sm:px-4 lg:px-8 h-14 sm:h-16 flex items-center justify-between gap-2">

        <!-- Brand -->
        <a routerLink="/" class="flex items-center gap-2 flex-shrink-0">
          <div class="h-8 w-8 sm:h-9 sm:w-9 rounded-xl bg-gradient-to-tr from-blue-600 via-indigo-500 to-emerald-400 p-[1.5px] shadow-glow-accent">
            <div class="h-full w-full bg-slate-950 rounded-[10px] flex items-center justify-center">
              <svg class="w-4 h-4 sm:w-5 sm:h-5 text-blue-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path stroke-linecap="round" stroke-linejoin="round" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
              </svg>
            </div>
          </div>
          <div class="hidden xs:block sm:block">
            <div class="font-extrabold text-xs sm:text-sm tracking-tight text-white flex items-center gap-1 font-mono">
              TRENDING<span class="text-blue-400">AI</span>
              <span class="text-[9px] px-1 py-0.5 rounded bg-blue-500/20 text-blue-300 font-sans border border-blue-500/30">PRO</span>
            </div>
            <div class="hidden sm:block text-[9px] text-slate-400 tracking-wider font-mono">MULTI-MODEL ALPHA ENGINE</div>
          </div>
        </a>

        <!-- Live feed badge — desktop only -->
        <div class="hidden md:flex items-center gap-1.5 px-2 py-1 bg-slate-900 border border-slate-800 rounded-full text-xs flex-shrink-0">
          <span class="relative flex h-2 w-2">
            <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span class="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
          </span>
          <span class="text-slate-400 text-[10px] font-mono">FEED:</span>
          <span class="text-emerald-400 text-[10px] font-mono font-semibold">STREAMING</span>
        </div>

        <!-- Desktop nav links -->
        <nav class="hidden md:flex items-center gap-1 lg:gap-2 flex-1 justify-center">
          <a
            routerLink="/dashboard"
            routerLinkActive="bg-slate-800 text-white font-semibold"
            class="px-3 py-1.5 rounded-lg text-xs font-medium text-slate-300 hover:text-white hover:bg-slate-800/60 transition-colors flex items-center gap-1.5"
          >
            <svg class="w-3.5 h-3.5 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
            <span>Signals</span>
          </a>
          @if (authService.isAdmin()) {
            <a
              routerLink="/admin"
              routerLinkActive="bg-purple-950/40 border border-purple-500/40 text-purple-300 font-semibold"
              class="px-3 py-1.5 rounded-lg text-xs font-medium text-purple-400 hover:text-purple-300 hover:bg-purple-950/30 transition-colors flex items-center gap-1.5"
            >
              <svg class="w-3.5 h-3.5 text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
              </svg>
              <span>Admin</span>
            </a>
          }
          <!-- Role Switcher (demo) -->
          <div class="hidden lg:flex items-center gap-1 bg-slate-900 border border-slate-800 p-0.5 rounded-lg text-xs ml-1">
            <span class="text-[10px] text-slate-500 px-1 font-mono">ROLE:</span>
            <button (click)="setRole('ADMIN')" class="px-2 py-0.5 rounded text-[10px] font-semibold transition-colors"
              [ngClass]="authService.userRole() === 'ADMIN' ? 'bg-purple-600 text-white' : 'text-slate-400 hover:text-white'">Admin</button>
            <button (click)="setRole('PRO_TRADER')" class="px-2 py-0.5 rounded text-[10px] font-semibold transition-colors"
              [ngClass]="authService.userRole() === 'PRO_TRADER' ? 'bg-amber-600 text-white' : 'text-slate-400 hover:text-white'">Pro</button>
            <button (click)="setRole('TRADER')" class="px-2 py-0.5 rounded text-[10px] font-semibold transition-colors"
              [ngClass]="authService.userRole() === 'TRADER' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white'">Free</button>
          </div>
        </nav>

        <!-- Right side: User avatar + hamburger -->
        <div class="flex items-center gap-2 flex-shrink-0">
          <!-- User avatar (always visible) -->
          @if (authService.currentUser(); as user) {
            <div class="flex items-center gap-2">
              <div class="w-7 h-7 sm:w-8 sm:h-8 rounded-full overflow-hidden bg-slate-800 border-2 border-purple-500/60 flex items-center justify-center font-bold text-xs text-slate-300">
                @if (user.avatarUrl) {
                  <img [src]="user.avatarUrl" [alt]="user.name" class="w-full h-full object-cover">
                } @else {
                  <span>{{ (user.name || user.email).charAt(0).toUpperCase() }}</span>
                }
              </div>
              <div class="hidden lg:block text-left">
                <div class="text-xs font-extrabold text-white flex items-center gap-1 leading-tight font-mono">
                  {{ user.name }}
                  <span class="text-[9px] px-1 py-0.5 rounded bg-purple-500/25 text-purple-300 font-mono border border-purple-500/30">ADMIN</span>
                </div>
                <div class="text-[10px] font-mono text-slate-400">{{ user.email }}</div>
              </div>
            </div>
          }

          <!-- Hamburger button (mobile/tablet only) -->
          <button
            type="button"
            (click)="mobileMenuOpen.set(!mobileMenuOpen())"
            class="md:hidden flex items-center justify-center w-8 h-8 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            [attr.aria-label]="mobileMenuOpen() ? 'Close menu' : 'Open menu'"
          >
            @if (mobileMenuOpen()) {
              <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            } @else {
              <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                <path stroke-linecap="round" stroke-linejoin="round" d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            }
          </button>
        </div>
      </div>

      <!-- Mobile dropdown menu -->
      @if (mobileMenuOpen()) {
        <div class="md:hidden border-t border-slate-800 bg-slate-950/95 backdrop-blur-md px-3 py-3 space-y-1">
          <a
            routerLink="/dashboard"
            routerLinkActive="bg-slate-800 text-white"
            class="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-slate-300 hover:text-white hover:bg-slate-800/60 transition-colors"
            (click)="mobileMenuOpen.set(false)"
          >
            <svg class="w-4 h-4 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
            Signals Terminal
          </a>
          @if (authService.isAdmin()) {
            <a
              routerLink="/admin"
              routerLinkActive="bg-purple-950/40 text-purple-300"
              class="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-purple-400 hover:text-purple-300 hover:bg-purple-950/30 transition-colors"
              (click)="mobileMenuOpen.set(false)"
            >
              <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
              </svg>
              Admin Panel
            </a>
          }
          <!-- Mobile role switcher -->
          <div class="pt-2 border-t border-slate-800">
            <div class="text-[10px] uppercase tracking-wider text-slate-500 font-mono px-3 mb-1.5">Demo Role</div>
            <div class="flex gap-2 px-2">
              <button (click)="setRole('ADMIN')" class="flex-1 py-1.5 rounded-lg text-xs font-semibold transition-colors border"
                [ngClass]="authService.userRole() === 'ADMIN' ? 'bg-purple-600 text-white border-purple-500' : 'text-slate-400 border-slate-700 hover:text-white'">Admin</button>
              <button (click)="setRole('PRO_TRADER')" class="flex-1 py-1.5 rounded-lg text-xs font-semibold transition-colors border"
                [ngClass]="authService.userRole() === 'PRO_TRADER' ? 'bg-amber-600 text-white border-amber-500' : 'text-slate-400 border-slate-700 hover:text-white'">Pro</button>
              <button (click)="setRole('TRADER')" class="flex-1 py-1.5 rounded-lg text-xs font-semibold transition-colors border"
                [ngClass]="authService.userRole() === 'TRADER' ? 'bg-blue-600 text-white border-blue-500' : 'text-slate-400 border-slate-700 hover:text-white'">Free</button>
            </div>
          </div>
          <!-- Live feed status on mobile -->
          <div class="flex items-center gap-2 px-3 pt-1">
            <span class="relative flex h-2 w-2">
              <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span class="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            <span class="text-[11px] text-emerald-400 font-mono font-semibold">LIVE FEED STREAMING</span>
          </div>
        </div>
      }
    </header>
  `
})
export class NavbarComponent {
  readonly authService = inject(AuthService);
  readonly signalService = inject(SignalService);
  readonly mobileMenuOpen = signal<boolean>(false);

  setRole(role: UserRole): void {
    this.authService.switchRole(role);
    this.mobileMenuOpen.set(false);
  }
}
