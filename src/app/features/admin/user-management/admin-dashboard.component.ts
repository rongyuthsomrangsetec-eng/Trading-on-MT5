import { Component, computed, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { User, UserRole } from '../../../core/models/user.model';
import { SignalService } from '../../../core/services/signal.service';
import { AuthService } from '../../../core/auth/auth.service';

const MOCK_ADMIN_USERS: User[] = [
  {
    id: 'usr_panq_01',
    email: 'panq@alphatrading.ai',
    name: 'PANQ',
    role: 'ADMIN',
    isActive: true,
    subscriptionExpiresAt: '2029-12-31T23:59:59Z',
    createdAt: '2024-01-01T08:00:00Z',
    avatarUrl: '/images/admin_panq.jpg'
  },
  {
    id: 'usr_002',
    email: 'marcus.fx@alphaprop.com',
    name: 'Marcus Sterling',
    role: 'PRO_TRADER',
    isActive: true,
    subscriptionExpiresAt: '2027-06-30T23:59:59Z',
    createdAt: '2024-02-14T09:15:00Z',
    avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120&auto=format&fit=crop&q=80'
  },
  {
    id: 'usr_003',
    email: 'elena.rostova@cryptohedge.io',
    name: 'Elena Rostova',
    role: 'PRO_TRADER',
    isActive: true,
    subscriptionExpiresAt: '2026-11-20T23:59:59Z',
    createdAt: '2024-03-01T14:45:00Z',
    avatarUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=120&auto=format&fit=crop&q=80'
  },
  {
    id: 'usr_004',
    email: 'dave.trader99@gmail.com',
    name: 'David Chen',
    role: 'TRADER',
    isActive: true,
    subscriptionExpiresAt: '2025-10-15T23:59:59Z',
    createdAt: '2024-05-18T18:20:00Z'
  },
  {
    id: 'usr_005',
    email: 'spammer_bot@suspicious.net',
    name: 'Bot Crawler 42',
    role: 'TRADER',
    isActive: false,
    subscriptionExpiresAt: '2024-01-01T00:00:00Z',
    createdAt: '2024-06-12T02:10:00Z'
  },
  {
    id: 'usr_006',
    email: 'ken.whales@familyoffice.sg',
    name: 'Kenji Takahashi',
    role: 'PRO_TRADER',
    isActive: true,
    subscriptionExpiresAt: '2027-01-01T00:00:00Z',
    createdAt: '2024-07-22T08:00:00Z',
    avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=120&auto=format&fit=crop&q=80'
  }
];

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="min-h-screen bg-fintech-dark text-slate-100 p-6 md:p-8 space-y-8">
      
      <!-- Top Bar: Header & System Telemetry -->
      <div class="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-6 border-b border-slate-800">
        <div>
          <div class="flex items-center gap-2">
            <span class="px-2.5 py-0.5 text-xs font-mono font-bold tracking-widest uppercase bg-purple-500/20 text-purple-400 border border-purple-500/40 rounded">
              ADMIN CONTROL PANEL
            </span>
            <span class="text-xs text-slate-400 font-mono">RBAC LEVEL: ZERO-TRUST</span>
          </div>
          <h1 class="text-2xl md:text-3xl font-extrabold tracking-tight text-white mt-1">
            User & Signal Control Center
          </h1>
          <p class="text-sm text-slate-400 mt-0.5">
            Manage global platform accounts, subscriber entitlements, and monitor multi-model AI inference health.
          </p>
        </div>

        <!-- AI Engine Telemetry Pills -->
        <div class="flex flex-wrap items-center gap-3 bg-slate-900/90 border border-slate-800 p-3 rounded-xl backdrop-blur-md">
          <div class="flex items-center gap-2 px-3 py-1.5 bg-slate-950/60 rounded-lg border border-slate-800/80">
            <div class="h-2 w-2 rounded-full bg-emerald-400 animate-pulse"></div>
            <div class="text-xs">
              <span class="text-slate-400">Inference Latency: </span>
              <span class="font-mono font-bold text-emerald-400">{{ apiTelemetry().latencyMs }}ms</span>
            </div>
          </div>

          <div class="flex items-center gap-2 px-3 py-1.5 bg-slate-950/60 rounded-lg border border-slate-800/80">
            <div class="text-xs">
              <span class="text-slate-400">Failure Rate: </span>
              <span class="font-mono font-bold text-blue-400">{{ apiTelemetry().errorRate }}%</span>
            </div>
          </div>

          <button 
            type="button"
            (click)="onTriggerAiFetch()"
            [disabled]="isAiFetching()"
            class="px-3.5 py-1.5 rounded-lg text-xs font-semibold bg-blue-600 hover:bg-blue-500 text-white transition-all disabled:opacity-50 flex items-center gap-1.5 shadow-sm"
          >
            @if (isAiFetching()) {
              <svg class="animate-spin h-3.5 w-3.5 text-white" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" fill="none"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"></path>
              </svg>
              <span>Inference in progress...</span>
            } @else {
              <svg class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              <span>Force AI Ingest</span>
            }
          </button>
        </div>
      </div>

      <!-- Toast Feedback -->
      @if (actionToastMessage()) {
        <div class="bg-blue-500/10 border border-blue-500/40 text-blue-300 px-4 py-2.5 rounded-lg text-xs font-medium flex items-center justify-between animate-fadeIn">
          <span>{{ actionToastMessage() }}</span>
          <button (click)="actionToastMessage.set('')" class="text-blue-400 hover:text-white">&times;</button>
        </div>
      }

      <!-- KPI Stats Bar -->
      <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div class="bg-slate-900/80 border border-slate-800 rounded-xl p-4">
          <div class="text-xs font-medium text-slate-400 uppercase tracking-wider">Total Accounts</div>
          <div class="text-2xl font-extrabold text-white font-mono mt-1">{{ stats().total }}</div>
          <div class="text-[11px] text-slate-500 mt-1">Global registered users</div>
        </div>

        <div class="bg-slate-900/80 border border-slate-800 rounded-xl p-4">
          <div class="text-xs font-medium text-amber-400 uppercase tracking-wider">Pro Tier Active</div>
          <div class="text-2xl font-extrabold text-amber-300 font-mono mt-1">{{ stats().proTraders }}</div>
          <div class="text-[11px] text-amber-500/80 mt-1">High-frequency AI signals tier</div>
        </div>

        <div class="bg-slate-900/80 border border-slate-800 rounded-xl p-4">
          <div class="text-xs font-medium text-emerald-400 uppercase tracking-wider">Active Status</div>
          <div class="text-2xl font-extrabold text-emerald-400 font-mono mt-1">{{ stats().activeUsers }}</div>
          <div class="text-[11px] text-emerald-500/80 mt-1">Healthy standing</div>
        </div>

        <div class="bg-slate-900/80 border border-slate-800 rounded-xl p-4">
          <div class="text-xs font-medium text-rose-400 uppercase tracking-wider">Banned / Flagged</div>
          <div class="text-2xl font-extrabold text-rose-400 font-mono mt-1">{{ stats().bannedUsers }}</div>
          <div class="text-[11px] text-rose-500/80 mt-1">Access revoked</div>
        </div>
      </div>

      <!-- User Management Table Section -->
      <div class="bg-slate-900/90 border border-slate-800 rounded-xl overflow-hidden shadow-2xl">
        <!-- Table Toolbar -->
        <div class="p-4 md:p-5 border-b border-slate-800 flex flex-col md:flex-row items-center justify-between gap-4">
          <!-- Search input -->
          <div class="relative w-full md:w-80">
            <svg class="absolute left-3 top-2.5 w-4 h-4 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input 
              type="text"
              [ngModel]="searchQuery()"
              (ngModelChange)="searchQuery.set($event)"
              placeholder="Search user by email or name..."
              class="w-full bg-slate-950 border border-slate-800 rounded-lg pl-9 pr-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 transition-colors"
            />
          </div>

          <!-- Role Filter Pills -->
          <div class="flex items-center gap-1.5 self-start md:self-auto overflow-x-auto">
            @for (filter of roleFilters; track filter.value) {
              <button
                type="button"
                (click)="selectedRoleFilter.set(filter.value)"
                class="px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors"
                [ngClass]="selectedRoleFilter() === filter.value 
                  ? 'bg-blue-600 text-white shadow-sm' 
                  : 'bg-slate-800 text-slate-400 hover:text-slate-200'"
              >
                {{ filter.label }}
              </button>
            }
          </div>
        </div>

        <!-- Data Table -->
        <div class="overflow-x-auto">
          <table class="w-full text-left text-xs border-collapse">
            <thead>
              <tr class="bg-slate-950/80 border-b border-slate-800 text-slate-400 font-mono uppercase tracking-wider text-[11px]">
                <th class="py-3.5 px-4 font-semibold">User</th>
                <th class="py-3.5 px-4 font-semibold">Role Tier</th>
                <th class="py-3.5 px-4 font-semibold">Account State</th>
                <th class="py-3.5 px-4 font-semibold">Subscription Expiry</th>
                <th class="py-3.5 px-4 font-semibold">Member Since</th>
                <th class="py-3.5 px-4 font-semibold text-right">Administrative Actions</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-slate-800/80">
              @for (user of filteredUsers(); track user.id) {
                <tr class="hover:bg-slate-800/30 transition-colors">
                  <!-- User Column -->
                  <td class="py-3.5 px-4">
                    <div class="flex items-center gap-3">
                      <div class="w-8 h-8 rounded-full overflow-hidden bg-slate-800 border border-slate-700 flex items-center justify-center font-bold text-slate-300">
                        @if (user.avatarUrl) {
                          <img [src]="user.avatarUrl" [alt]="user.name" class="w-full h-full object-cover">
                        } @else {
                          <span>{{ (user.name || user.email).charAt(0).toUpperCase() }}</span>
                        }
                      </div>
                      <div>
                        <div class="font-semibold text-slate-100">{{ user.name || 'Anonymous Trader' }}</div>
                        <div class="text-[11px] text-slate-400 font-mono">{{ user.email }}</div>
                      </div>
                    </div>
                  </td>

                  <!-- Role Column -->
                  <td class="py-3.5 px-4">
                    <span 
                      class="px-2.5 py-0.5 rounded-full text-[11px] font-bold tracking-wide border inline-block"
                      [ngClass]="getRoleBadgeClass(user.role)"
                    >
                      {{ user.role }}
                    </span>
                  </td>

                  <!-- Status Column -->
                  <td class="py-3.5 px-4">
                    <div class="flex items-center gap-1.5">
                      <span 
                        class="h-2 w-2 rounded-full"
                        [ngClass]="user.isActive ? 'bg-emerald-400' : 'bg-rose-500'"
                      ></span>
                      <span [ngClass]="user.isActive ? 'text-emerald-400 font-medium' : 'text-rose-400 font-bold'">
                        {{ user.isActive ? 'Active' : 'Banned' }}
                      </span>
                    </div>
                  </td>

                  <!-- Subscription Expiry -->
                  <td class="py-3.5 px-4 font-mono text-slate-300">
                    {{ user.subscriptionExpiresAt ? (user.subscriptionExpiresAt | date:'mediumDate') : 'Permanent' }}
                  </td>

                  <!-- Member Since -->
                  <td class="py-3.5 px-4 font-mono text-slate-400">
                    {{ user.createdAt | date:'shortDate' }}
                  </td>

                  <!-- Action Buttons -->
                  <td class="py-3.5 px-4 text-right">
                    <div class="flex items-center justify-end gap-2">
                      <!-- Toggle Pro/Free Tier -->
                      @if (user.role !== 'ADMIN') {
                        <button
                          type="button"
                          (click)="onToggleTier(user)"
                          class="px-2.5 py-1 rounded text-[11px] font-medium border transition-colors"
                          [ngClass]="user.role === 'PRO_TRADER'
                            ? 'bg-amber-950/30 text-amber-300 border-amber-600/40 hover:bg-amber-900/50'
                            : 'bg-slate-800 text-slate-300 border-slate-700 hover:bg-slate-700'"
                        >
                          {{ user.role === 'PRO_TRADER' ? 'Downgrade to Free' : 'Promote to Pro' }}
                        </button>
                      }

                      <!-- Ban / Unban Toggle -->
                      @if (user.role !== 'ADMIN') {
                        <button
                          type="button"
                          (click)="onToggleBanStatus(user)"
                          class="px-2.5 py-1 rounded text-[11px] font-medium border transition-colors"
                          [ngClass]="user.isActive
                            ? 'bg-rose-950/20 text-rose-400 border-rose-500/40 hover:bg-rose-900/40'
                            : 'bg-emerald-950/20 text-emerald-400 border-emerald-500/40 hover:bg-emerald-900/40'"
                        >
                          {{ user.isActive ? 'Ban Account' : 'Lift Ban' }}
                        </button>
                      }

                      <!-- Role Toggle to ADMIN -->
                      @if (user.role === 'PRO_TRADER' || user.role === 'TRADER') {
                        <button
                          type="button"
                          (click)="onElevateToAdmin(user)"
                          class="px-2.5 py-1 rounded text-[11px] font-medium bg-purple-950/20 text-purple-300 border border-purple-500/30 hover:bg-purple-900/40 transition-colors"
                        >
                          Make Admin
                        </button>
                      }
                    </div>
                  </td>
                </tr>
              } @empty {
                <tr>
                  <td colspan="6" class="text-center py-8 text-slate-500">
                    No users matching criteria found.
                  </td>
                </tr>
              }
            </tbody>
          </table>
        </div>
      </div>
    </div>
  `
})
export class AdminDashboardComponent {
  private readonly signalService = inject(SignalService);
  private readonly authService = inject(AuthService);

  // Reactive state using Angular Signals
  readonly users = signal<User[]>(MOCK_ADMIN_USERS);
  readonly searchQuery = signal<string>('');
  readonly selectedRoleFilter = signal<string>('ALL');
  readonly isAiFetching = signal<boolean>(false);
  readonly actionToastMessage = signal<string>('');

  readonly apiTelemetry = signal({
    latencyMs: 38,
    errorRate: 0.08,
    uptime: 99.98,
    activeModels: ['Claude-3.5-Sonnet', 'GPT-4o', 'DeepSeek-R1']
  });

  readonly roleFilters = [
    { label: 'All Users', value: 'ALL' },
    { label: 'Admins', value: 'ADMIN' },
    { label: 'Pro Traders', value: 'PRO_TRADER' },
    { label: 'Standard Traders', value: 'TRADER' }
  ];

  // Computed signals
  readonly filteredUsers = computed(() => {
    const query = this.searchQuery().toLowerCase().trim();
    const role = this.selectedRoleFilter();

    return this.users().filter(u => {
      const matchSearch = !query || 
        u.email.toLowerCase().includes(query) || 
        (u.name && u.name.toLowerCase().includes(query));
      
      const matchRole = role === 'ALL' || u.role === role;

      return matchSearch && matchRole;
    });
  });

  readonly stats = computed(() => {
    const list = this.users();
    return {
      total: list.length,
      admins: list.filter(u => u.role === 'ADMIN').length,
      proTraders: list.filter(u => u.role === 'PRO_TRADER').length,
      activeUsers: list.filter(u => u.isActive).length,
      bannedUsers: list.filter(u => !u.isActive).length
    };
  });

  // Action methods
  onToggleTier(user: User): void {
    const nextRole: UserRole = user.role === 'PRO_TRADER' ? 'TRADER' : 'PRO_TRADER';
    this.users.update(prev => 
      prev.map(u => u.id === user.id ? { ...u, role: nextRole } : u)
    );
    this.actionToastMessage.set(`Updated ${user.email} tier to ${nextRole}`);
  }

  onToggleBanStatus(user: User): void {
    const newStatus = !user.isActive;
    this.users.update(prev => 
      prev.map(u => u.id === user.id ? { ...u, isActive: newStatus } : u)
    );
    this.actionToastMessage.set(`Account ${user.email} is now ${newStatus ? 'UNBANNED' : 'BANNED'}`);
  }

  onElevateToAdmin(user: User): void {
    this.users.update(prev => 
      prev.map(u => u.id === user.id ? { ...u, role: 'ADMIN' } : u)
    );
    this.actionToastMessage.set(`Elevated ${user.email} to full Platform ADMIN privileges`);
  }

  async onTriggerAiFetch(): Promise<void> {
    this.isAiFetching.set(true);
    await this.signalService.forceAiFetch();
    this.isAiFetching.set(false);
    this.actionToastMessage.set('Multi-model AI inference cycle triggered successfully across GPU worker nodes.');
  }

  getRoleBadgeClass(role: UserRole): string {
    switch (role) {
      case 'ADMIN':
        return 'bg-purple-500/15 text-purple-400 border-purple-500/40';
      case 'PRO_TRADER':
        return 'bg-amber-500/15 text-amber-400 border-amber-500/40';
      case 'TRADER':
        return 'bg-blue-500/15 text-blue-400 border-blue-500/40';
      default:
        return 'bg-slate-700/20 text-slate-400 border-slate-700';
    }
  }
}
