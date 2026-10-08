import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NavbarComponent } from './shared/components/navbar/navbar.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, NavbarComponent],
  template: `
    <div class="min-h-screen bg-fintech-dark flex flex-col font-sans selection:bg-blue-600 selection:text-white">
      <app-navbar />
      <main class="flex-1">
        <router-outlet />
      </main>
      <footer class="border-t border-slate-900 bg-slate-950/60 py-6 text-center text-xs text-slate-500 font-mono">
        TrendingAI Enterprise Platform &copy; 2026 • High-Throughput Model Inference Engine
      </footer>
    </div>
  `
})
export class AppComponent {}
