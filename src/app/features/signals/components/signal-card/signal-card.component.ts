import { Component, input, output, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TradingSignal } from '../../../../core/models/signal.model';

@Component({
  selector: 'app-signal-card',
  standalone: true,
  imports: [CommonModule],
  template: `
    <article 
      class="group relative rounded-xl border transition-all duration-300 overflow-hidden bg-slate-900/90 backdrop-blur-md hover:shadow-xl"
      [ngClass]="getCardContainerClasses()"
    >
      <!-- Top Gradient Glow Accent -->
      <div 
        class="h-1 w-full"
        [ngClass]="signal().type === 'BUY' ? 'bg-gradient-to-r from-emerald-500 via-teal-400 to-emerald-600' : 'bg-gradient-to-r from-rose-500 via-red-500 to-amber-600'"
      ></div>

      <div class="p-5 space-y-4">
        <!-- Header: Ticker, Direction, Timeframe & Status -->
        <div class="flex items-center justify-between gap-2">
          <div class="flex items-center gap-3">
            <!-- Direction Badge -->
            <div 
              class="flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-bold tracking-wider uppercase"
              [ngClass]="signal().type === 'BUY' ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30' : 'bg-rose-500/15 text-rose-400 border border-rose-500/30'"
            >
              @if (signal().type === 'BUY') {
                <svg class="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                  <path d="M12 4l-8 8h5v8h6v-8h5z" />
                </svg>
                <span>BUY / LONG</span>
              } @else {
                <svg class="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                  <path d="M12 20l8-8h-5v-8h-6v8h-5z" />
                </svg>
                <span>SELL / SHORT</span>
              }
            </div>

            <!-- Ticker -->
            <div>
              <h3 class="text-lg font-extrabold text-white tracking-tight flex items-center gap-1.5 font-mono">
                {{ signal().ticker }}
                <span class="text-xs px-2 py-0.5 rounded font-sans font-medium text-slate-400 bg-slate-800 border border-slate-700/60">
                  {{ signal().timeframe }}
                </span>
              </h3>
            </div>
          </div>

          <!-- Status Badge -->
          <div class="flex items-center gap-2">
            <span 
              class="px-2.5 py-0.5 text-xs font-semibold rounded-full border"
              [ngClass]="getStatusBadgeClass(signal().status)"
            >
              {{ signal().status }}
            </span>
          </div>
        </div>

        <!-- AI Confidence & Engine Meta -->
        <div class="flex items-center justify-between bg-slate-950/60 border border-slate-800/80 rounded-lg px-3.5 py-2">
          <div class="flex items-center gap-2">
            <div class="relative flex items-center justify-center">
              <span class="relative flex h-2 w-2">
                <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                <span class="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
              </span>
            </div>
            <span class="text-xs text-slate-400">AI Confidence:</span>
            <span class="text-xs font-bold text-blue-400 font-mono">{{ signal().aiConfidenceScore }}%</span>
          </div>

          @if (signal().indicators?.modelSource) {
            <span class="text-[11px] font-mono text-slate-400 bg-slate-900 border border-slate-700/60 px-2 py-0.5 rounded">
              {{ signal().indicators?.modelSource }}
            </span>
          }
        </div>

        <!-- Execution Blueprint: Entry Range, Stop Loss, Risk-Reward -->
        <div class="grid grid-cols-2 gap-3 pt-1">
          <!-- Entry Range Box -->
          <div class="p-3 bg-slate-950/40 rounded-lg border border-slate-800">
            <div class="text-[11px] uppercase tracking-wider font-semibold text-slate-400 mb-1 flex items-center justify-between">
              <span>Entry Range</span>
              <span class="text-slate-500 font-mono">Target</span>
            </div>
            <div class="font-mono text-sm font-semibold text-slate-100">
              {{ signal().entryPrice.min | number:'1.2-4' }} - {{ signal().entryPrice.max | number:'1.2-4' }}
            </div>
          </div>

          <!-- Stop Loss Box -->
          <div class="p-3 bg-slate-950/40 rounded-lg border border-slate-800">
            <div class="text-[11px] uppercase tracking-wider font-semibold text-slate-400 mb-1 flex items-center justify-between">
              <span class="text-rose-400/90">Stop Loss</span>
              <span class="text-xs text-slate-500">Risk</span>
            </div>
            <div class="font-mono text-sm font-semibold text-rose-400">
              {{ signal().stopLoss | number:'1.2-4' }}
            </div>
          </div>
        </div>

        <!-- Take Profit Targets Grid -->
        <div class="space-y-1.5">
          <div class="flex items-center justify-between text-[11px] uppercase tracking-wider text-slate-400 font-semibold px-0.5">
            <span>Targets (Take Profit)</span>
            <span class="text-emerald-400 font-mono">R:R {{ signal().riskRewardRatio }}:1</span>
          </div>

          <div class="grid grid-cols-3 gap-2">
            @for (tp of signal().takeProfits; track tp.level) {
              <div 
                class="p-2.5 rounded-lg border transition-colors flex flex-col justify-between"
                [ngClass]="tp.hit 
                  ? 'bg-emerald-950/30 border-emerald-500/40 text-emerald-300' 
                  : 'bg-slate-950/40 border-slate-800/80 text-slate-300'"
              >
                <div class="flex items-center justify-between mb-1">
                  <span class="text-[10px] font-bold uppercase tracking-wider" [class.text-emerald-400]="tp.hit">
                    TP {{ tp.level }}
                  </span>
                  @if (tp.hit) {
                    <span class="text-[10px] bg-emerald-500/20 text-emerald-400 px-1 rounded font-bold">HIT</span>
                  }
                </div>
                <div class="font-mono text-xs font-semibold">
                  {{ tp.price | number:'1.2-4' }}
                </div>
              </div>
            }
          </div>
        </div>

        <!-- AI Rationale Breakdown (Collapsible Drawer) -->
        <div class="pt-2 border-t border-slate-800/80">
          <button 
            type="button"
            (click)="toggleRationale()" 
            class="w-full flex items-center justify-between text-xs text-slate-400 hover:text-slate-200 transition-colors py-1 focus:outline-none"
          >
            <span class="flex items-center gap-1.5 font-medium">
              <svg class="w-3.5 h-3.5 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              AI Rationale & Technical Catalysts
            </span>
            <svg 
              class="w-4 h-4 transform transition-transform duration-200 text-slate-500"
              [class.rotate-180]="isRationaleExpanded()"
              fill="none" viewBox="0 0 24 24" stroke="currentColor"
            >
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
            </svg>
          </button>

          @if (isRationaleExpanded()) {
            <div class="mt-2.5 p-3 rounded-lg bg-slate-950/70 border border-slate-800 space-y-2 text-xs animate-fadeIn">
              <p class="text-slate-300 leading-relaxed font-sans">
                {{ signal().aiAnalysisSummary }}
              </p>

              @if (signal().indicators) {
                <div class="grid grid-cols-2 gap-2 pt-2 border-t border-slate-800/60 font-mono text-[11px]">
                  @if (signal().indicators?.rsi) {
                    <div class="text-slate-400">
                      RSI (14): <span class="text-slate-200 font-semibold">{{ signal().indicators?.rsi }}</span>
                    </div>
                  }
                  @if (signal().indicators?.trend) {
                    <div class="text-slate-400">
                      Trend: <span [ngClass]="signal().indicators?.trend === 'BULLISH' ? 'text-emerald-400' : 'text-rose-400'">
                        {{ signal().indicators?.trend }}
                      </span>
                    </div>
                  }
                  @if (signal().indicators?.orderBookImbalance) {
                    <div class="col-span-2 text-slate-400">
                      Order Book: <span class="text-slate-200">{{ signal().indicators?.orderBookImbalance }}</span>
                    </div>
                  }
                  @if (signal().indicators?.keyCatalyst) {
                    <div class="col-span-2 text-slate-400 font-sans">
                      Catalyst: <span class="text-amber-300/90">{{ signal().indicators?.keyCatalyst }}</span>
                    </div>
                  }
                </div>
              }
            </div>
          }
        </div>

        <!-- Card Footer Actions -->
        <div class="pt-2 flex items-center justify-between gap-2">
          <span class="text-[11px] text-slate-500 font-mono">
            {{ formatTimestamp(signal().timestamp) }}
          </span>

          <div class="flex items-center gap-2">
            <button
              type="button"
              (click)="onCopySignal()"
              class="px-3 py-1.5 text-xs font-semibold rounded-md bg-slate-800 hover:bg-slate-700 text-slate-200 transition-colors flex items-center gap-1 border border-slate-700/60"
            >
              @if (copied()) {
                <span class="text-emerald-400">Copied!</span>
              } @else {
                <svg class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                </svg>
                <span>Copy</span>
              }
            </button>

            <button
              type="button"
              (click)="onSelectSignal()"
              class="px-3 py-1.5 text-xs font-semibold rounded-md bg-blue-600 hover:bg-blue-500 text-white transition-colors shadow-sm"
            >
              Chart & Execute
            </button>
          </div>
        </div>
      </div>
    </article>
  `,
  styles: [`
    @keyframes fadeIn {
      from { opacity: 0; transform: translateY(-4px); }
      to { opacity: 1; transform: translateY(0); }
    }
    .animate-fadeIn {
      animation: fadeIn 0.2s ease-out forwards;
    }
  `]
})
export class SignalCardComponent {
  // Modern signal input
  readonly signal = input.required<TradingSignal>();

  // Outputs
  readonly signalSelected = output<TradingSignal>();
  readonly signalCopied = output<TradingSignal>();

  // Local component UI signals
  readonly isRationaleExpanded = signal<boolean>(false);
  readonly copied = signal<boolean>(false);

  getCardContainerClasses(): string {
    const s = this.signal();
    if (s.status === 'ACTIVE') {
      if (s.type === 'BUY') {
        return 'border-emerald-500/40 hover:border-emerald-500/70 shadow-glow-buy';
      }
      return 'border-rose-500/40 hover:border-rose-500/70 shadow-glow-sell';
    }
    return 'border-slate-800';
  }

  toggleRationale(): void {
    this.isRationaleExpanded.update(v => !v);
  }

  onSelectSignal(): void {
    this.signalSelected.emit(this.signal());
  }

  onCopySignal(): void {
    const s = this.signal();
    const copyText = `[AI SIGNAL] ${s.ticker} ${s.type} | Entry: ${s.entryPrice.min}-${s.entryPrice.max} | TP1: ${s.takeProfits[0]?.price} TP2: ${s.takeProfits[1]?.price} | SL: ${s.stopLoss} | R:R ${s.riskRewardRatio}`;
    
    if (navigator?.clipboard) {
      navigator.clipboard.writeText(copyText);
    }
    this.copied.set(true);
    setTimeout(() => this.copied.set(false), 2000);
    this.signalCopied.emit(s);
  }

  getStatusBadgeClass(status: string): string {
    switch (status) {
      case 'ACTIVE':
        return 'bg-blue-500/10 text-blue-400 border-blue-500/30';
      case 'HIT_TP':
        return 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30';
      case 'HIT_SL':
        return 'bg-rose-500/15 text-rose-400 border-rose-500/30';
      case 'PENDING':
        return 'bg-amber-500/10 text-amber-400 border-amber-500/30';
      default:
        return 'bg-slate-700/30 text-slate-400 border-slate-700';
    }
  }

  formatTimestamp(isoString: string): string {
    try {
      const date = new Date(isoString);
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } catch {
      return isoString;
    }
  }
}
