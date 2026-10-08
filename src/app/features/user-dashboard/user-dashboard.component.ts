import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SignalService } from '../../core/services/signal.service';
import { SignalCardComponent } from '../signals/components/signal-card/signal-card.component';
import { TradingViewChartComponent } from '../signals/components/tradingview-chart/tradingview-chart.component';
import { StrategyPlaybookComponent } from '../signals/components/strategy-playbook/strategy-playbook.component';
import { TradingSignal } from '../../core/models/signal.model';

@Component({
  selector: 'app-user-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule, SignalCardComponent, TradingViewChartComponent, StrategyPlaybookComponent],
  template: `
    <div class="min-h-screen bg-fintech-dark text-slate-100 p-4 sm:p-6 lg:p-8 space-y-6">
      
      <!-- 1. HIGH-IMPACT NEWS & MACRO ANNOUNCEMENT BANNER -->
      @if (xauSignal().newsAnnouncement; as news) {
        <div class="relative overflow-hidden rounded-xl border border-amber-500/40 bg-gradient-to-r from-amber-950/40 via-slate-900 to-rose-950/40 p-4 shadow-xl backdrop-blur-md">
          <div class="flex flex-col md:flex-row md:items-center justify-between gap-3">
            <div class="flex items-start md:items-center gap-3">
              <!-- Pulsing High Alert Badge -->
              <div class="relative flex-shrink-0 mt-0.5 md:mt-0">
                <span class="relative flex h-3 w-3">
                  <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
                  <span class="relative inline-flex rounded-full h-3 w-3 bg-rose-500"></span>
                </span>
              </div>

              <div>
                <div class="flex flex-wrap items-center gap-2">
                  <span class="px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase tracking-wider bg-rose-500/20 text-rose-300 border border-rose-500/30">
                    MACRO EVENT RISK • {{ news.impact }}
                  </span>
                  <span class="text-xs font-mono text-amber-400 font-semibold">
                    {{ news.time }}
                  </span>
                  <span class="px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                    SAFE-HAVEN DRIVER
                  </span>
                </div>
                <h4 class="text-sm font-bold text-white mt-1">
                  {{ news.headline }}
                </h4>
                <p class="text-xs text-slate-300 mt-0.5 leading-relaxed font-sans max-w-4xl">
                  {{ news.advisory }}
                </p>
              </div>
            </div>

            <!-- Live News Risk Status -->
            <div class="flex items-center gap-2 self-end md:self-auto flex-shrink-0">
              <div class="text-right">
                <div class="text-[10px] uppercase font-mono text-slate-400">Trading Advisory</div>
                <div class="text-xs font-mono font-bold text-amber-300">PRE-NEWS CAUTION</div>
              </div>
              <div class="p-2 rounded-lg bg-amber-500/10 border border-amber-500/30 text-amber-400">
                <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              </div>
            </div>
          </div>
        </div>
      }

      <!-- 2. PRIMARY XAUUSD REALTIME COMMAND CENTER -->
      <div class="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-2xl backdrop-blur-md space-y-6">
        
        <!-- Header: Asset & Live Spot Price -->
        <div class="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-4 border-b border-slate-800">
          <div class="flex items-center gap-4">
            <div class="h-12 w-12 rounded-xl bg-gradient-to-tr from-amber-500 via-yellow-400 to-amber-600 p-[1.5px] shadow-glow-buy flex-shrink-0">
              <div class="h-full w-full bg-slate-950 rounded-[10px] flex items-center justify-center font-mono font-extrabold text-amber-400 text-lg">
                AU
              </div>
            </div>

            <div>
              <div class="flex items-center gap-2 flex-wrap">
                <h2 class="text-2xl font-extrabold text-white font-mono tracking-tight">
                  XAUUSD <span class="text-xs font-sans text-slate-400 font-normal">Gold Spot / US Dollar</span>
                </h2>
                <span class="px-2.5 py-0.5 rounded text-xs font-mono font-bold uppercase bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 flex items-center gap-1">
                  <span>▲</span> BUY / LONG
                </span>
                <span class="text-xs px-2 py-0.5 rounded font-mono text-slate-400 bg-slate-800 border border-slate-700">
                  4H TIMEFRAME
                </span>
              </div>

              <!-- Live Spot Price Feed -->
              <div class="flex items-center gap-3 mt-1 flex-wrap">
                <span class="text-xs text-slate-400 font-mono">LIVE SPOT PRICE:</span>
                @if (signalService.xauusdPriceLoading()) {
                  <span class="text-xl font-extrabold text-slate-500 font-mono tracking-tight flex items-center gap-2">
                    <svg class="w-4 h-4 animate-spin text-blue-400" fill="none" viewBox="0 0 24 24">
                      <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                      <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path>
                    </svg>
                    Fetching...
                  </span>
                } @else if (signalService.xauusdSpotPrice() > 0) {
                  <span class="text-xl font-extrabold text-emerald-400 font-mono tracking-tight">
                    $ {{ signalService.xauusdSpotPrice() | number:'1.2-2' }}
                  </span>
                  <span class="text-[11px] text-slate-500 font-mono">
                    (Yahoo Finance · XAU/USD · refreshes every 30s)
                  </span>
                  @if (signalService.xauusdPriceError()) {
                    <span class="text-[10px] text-amber-400 font-mono flex items-center gap-1">
                      ⚠ Stale — reconnecting
                    </span>
                  }
                } @else {
                  <span class="text-xl font-extrabold text-rose-400 font-mono tracking-tight">
                    N/A
                  </span>
                  <span class="text-[11px] text-amber-400 font-mono">{{ signalService.xauusdPriceError() }}</span>
                }
              </div>
            </div>

          <!-- AI Model & Execution KPI Badges -->
          <div class="flex flex-wrap items-center gap-3">
            <div class="px-3.5 py-2 rounded-xl bg-slate-950/80 border border-slate-800 flex items-center gap-2.5">
              <div class="h-2 w-2 rounded-full bg-blue-400 animate-ping"></div>
              <div>
                <div class="text-[10px] font-mono text-slate-400 uppercase">AI Consensus Score</div>
                <div class="text-sm font-bold text-blue-400 font-mono">96% High Conviction</div>
              </div>
            </div>

            <div class="px-3.5 py-2 rounded-xl bg-slate-950/80 border border-slate-800">
              <div class="text-[10px] font-mono text-slate-400 uppercase">Risk / Reward Ratio</div>
              <div class="text-sm font-bold text-indigo-400 font-mono">1 : 3.86 R:R</div>
            </div>

            <div class="px-3.5 py-2 rounded-xl bg-slate-950/80 border border-slate-800">
              <div class="text-[10px] font-mono text-slate-400 uppercase">Model Cluster</div>
              <div class="text-sm font-bold text-slate-200 font-mono">Claude 3.5 + DeepSeek-R1</div>
            </div>
          </div>
        </div>

        <!-- 3. REALTIME TRADINGVIEW CHART WITH LINKED EXECUTION BLUEPRINT -->
        <div class="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          <!-- Live TradingView Chart Frame (8 Cols) -->
          <div class="lg:col-span-8 flex flex-col space-y-3">
            <app-tradingview-chart 
              symbol="OANDA:XAUUSD" 
              interval="60" 
            />

            <!-- Visual Price Road Map Gauge -->
            <div class="p-3 bg-slate-950/70 border border-slate-800 rounded-xl space-y-2">
              <div class="grid grid-cols-2 sm:grid-cols-5 gap-2 text-xs font-mono text-center">
                <span class="text-rose-400 font-semibold bg-rose-950/20 py-1 px-2 rounded border border-rose-500/20">
                  SL: $4,048
                </span>
                <span class="text-blue-400 font-semibold bg-blue-950/20 py-1 px-2 rounded border border-blue-500/20">
                  Entry: $4,090 – $4,115
                </span>
                <span class="text-emerald-400 font-semibold bg-emerald-950/20 py-1 px-2 rounded border border-emerald-500/20">
                  TP1: $4,210
                </span>
                <span class="text-emerald-300 font-semibold bg-slate-900 py-1 px-2 rounded border border-slate-700">
                  TP2: $4,295
                </span>
                <span class="text-amber-400 font-semibold bg-amber-950/20 py-1 px-2 rounded border border-amber-500/20">
                  TP3: $4,420
                </span>
              </div>

              <!-- Roadmap Progress Bar -->
              <div class="relative w-full h-2.5 bg-slate-800 rounded-full overflow-hidden flex">
                <div class="h-full bg-rose-500/70 w-[15%]" title="Stop Loss Zone"></div>
                <div class="h-full bg-blue-500/60 w-[20%]" title="Entry Mitigation Band"></div>
                <div class="h-full bg-emerald-500/60 w-[30%]" title="TP1 Target (Reached)"></div>
                <div class="h-full bg-emerald-400/40 w-[20%]" title="TP2 Target (Active)"></div>
                <div class="h-full bg-amber-400/50 w-[15%]" title="TP3 Target (ATH Discovery)"></div>
              </div>
            </div>
          </div>

          <!-- Execution Levels Blueprint (4 Cols) -->
          <div class="lg:col-span-4 flex flex-col justify-between space-y-3">
            <div class="text-xs font-mono font-bold uppercase tracking-wider text-slate-400 flex items-center justify-between">
              <span>Linked Execution Blueprint</span>
              <span class="text-emerald-400 font-mono">Status: ACTIVE</span>
            </div>

            <!-- Entry Range Card -->
            <div class="p-3 rounded-xl bg-slate-950/60 border border-blue-500/30 space-y-1">
              <div class="flex items-center justify-between text-xs">
                <span class="text-blue-400 font-bold uppercase tracking-wider font-mono">Entry Range</span>
                <span class="text-[10px] text-slate-400 font-mono">Mitigation Zone</span>
              </div>
              <div class="text-base font-extrabold text-white font-mono">
                $ {{ xauSignal().entryPrice.min | number:'1.2-2' }} – $ {{ xauSignal().entryPrice.max | number:'1.2-2' }}
              </div>
              <div class="text-[11px] text-slate-400">
                4H institutional order block retest at the 9 EMA / Volume POC confluence zone.
              </div>
            </div>

            <!-- Stop Loss Card -->
            <div class="p-3 rounded-xl bg-slate-950/60 border border-rose-500/30 space-y-1">
              <div class="flex items-center justify-between text-xs">
                <span class="text-rose-400 font-bold uppercase tracking-wider font-mono">Invalidation Stop Loss</span>
                <span class="text-[10px] text-rose-400/80 font-mono">-1.27% Risk</span>
              </div>
              <div class="flex items-end justify-between">
                <div class="text-base font-extrabold text-rose-400 font-mono">
                  $ {{ xauSignal().stopLoss | number:'1.2-2' }}
                </div>
                <div class="flex items-center gap-1 px-2 py-0.5 rounded-md bg-rose-950/60 border border-rose-500/40">
                  <svg class="w-3 h-3 text-rose-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"/></svg>
                  <span class="text-rose-300 font-mono font-bold text-xs">{{ xauSignal().slLots ?? 10 }} lots</span>
                </div>
              </div>
              <div class="text-[11px] text-slate-400">
                Structural invalidation below the $4,083 sell-side liquidity sweep low.
              </div>
            </div>

            <!-- Take Profits Cards -->
            <div class="space-y-2">
              <div class="flex items-center justify-between">
                <div class="text-[11px] font-mono font-bold uppercase tracking-wider text-slate-400">
                  Target Progression (Take Profit)
                </div>
                <div class="text-[10px] font-mono text-slate-500">
                  Total: <span class="text-blue-400 font-bold">{{ (xauSignal().takeProfits[0].lots ?? 0) + (xauSignal().takeProfits[1].lots ?? 0) + (xauSignal().takeProfits[2].lots ?? 0) }} lots</span>
                </div>
              </div>

              <!-- TP1 -->
              <div class="p-2.5 rounded-lg bg-slate-950/70 border border-slate-700 flex items-center justify-between">
                <div>
                  <div class="flex items-center gap-1.5">
                    <span class="text-xs font-bold font-mono text-emerald-400">TARGET 1</span>
                    <span class="text-[9px] px-1 py-0.2 bg-blue-500/20 text-blue-300 font-bold rounded">IN PROGRESS</span>
                  </div>
                  <div class="text-sm font-extrabold text-white font-mono">$ {{ xauSignal().takeProfits[0].price | number:'1.2-2' }}</div>
                </div>
                <div class="text-right space-y-0.5">
                  <div class="text-xs font-mono font-bold text-emerald-400">+{{ xauSignal().takeProfits[0].gainPercentage }}%</div>
                  <div class="text-[10px] text-slate-400 font-mono">+$107.50 / oz</div>
                  <div class="inline-flex items-center gap-1 px-1.5 py-0.5 rounded bg-emerald-950/60 border border-emerald-500/30">
                    <span class="text-emerald-300 font-mono font-bold text-[10px]">{{ xauSignal().takeProfits[0].lots ?? 10 }} lots</span>
                  </div>
                </div>
              </div>

              <!-- TP2 -->
              <div class="p-2.5 rounded-lg bg-slate-950/70 border border-slate-800 flex items-center justify-between">
                <div>
                  <div class="flex items-center gap-1.5">
                    <span class="text-xs font-bold font-mono text-slate-300">TARGET 2</span>
                    <span class="text-[9px] px-1 py-0.2 bg-slate-700 text-slate-400 font-bold rounded">PENDING</span>
                  </div>
                  <div class="text-sm font-extrabold text-white font-mono">$ {{ xauSignal().takeProfits[1].price | number:'1.2-2' }}</div>
                </div>
                <div class="text-right space-y-0.5">
                  <div class="text-xs font-mono font-bold text-emerald-400">+{{ xauSignal().takeProfits[1].gainPercentage }}%</div>
                  <div class="text-[10px] text-slate-400 font-mono">+$192.50 / oz</div>
                  <div class="inline-flex items-center gap-1 px-1.5 py-0.5 rounded bg-emerald-950/60 border border-emerald-500/30">
                    <span class="text-emerald-300 font-mono font-bold text-[10px]">{{ xauSignal().takeProfits[1].lots ?? 20 }} lots</span>
                  </div>
                </div>
              </div>

              <!-- TP3 -->
              <div class="p-2.5 rounded-lg bg-slate-950/70 border border-slate-800 flex items-center justify-between">
                <div>
                  <div class="flex items-center gap-1.5">
                    <span class="text-xs font-bold font-mono text-slate-400">TARGET 3</span>
                    <span class="text-[9px] px-1 py-0.2 bg-amber-500/20 text-amber-300 font-bold rounded">EXPANSION</span>
                  </div>
                  <div class="text-sm font-extrabold text-amber-300 font-mono">$ {{ xauSignal().takeProfits[2].price | number:'1.2-2' }}</div>
                </div>
                <div class="text-right space-y-0.5">
                  <div class="text-xs font-mono font-bold text-emerald-400">+{{ xauSignal().takeProfits[2].gainPercentage }}%</div>
                  <div class="text-[10px] text-slate-400 font-mono">+$317.50 / oz</div>
                  <div class="inline-flex items-center gap-1 px-1.5 py-0.5 rounded bg-amber-950/60 border border-amber-500/30">
                    <span class="text-amber-300 font-mono font-bold text-[10px]">{{ xauSignal().takeProfits[2].lots ?? 30 }} lots</span>
                  </div>
                </div>
              </div>
            </div>

            <!-- Execution Action -->
            <button
              type="button"
              (click)="onCopyXauSignal()"
              class="w-full py-2.5 rounded-lg text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition-colors flex items-center justify-center gap-1.5"
            >
              @if (isCopied()) {
                <span class="text-emerald-400">Copied to Clipboard!</span>
              } @else {
                <svg class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                </svg>
                <span>Copy Trade Execution Order</span>
              }
            </button>
          </div>
        </div>
      </div>

      <!-- 4. SECTION TABS: CONFLUENCE DOSSIER / DATA TRADER PLAYBOOK / SECONDARY SIGNALS -->
      <div class="space-y-4">
        <!-- Tab Navigation Bar -->
        <div class="flex items-center justify-between border-b border-slate-800 pb-2">
          <div class="flex items-center gap-2 overflow-x-auto">
            <button
              type="button"
              (click)="activeMainTab.set('RATIONALE')"
              class="px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2"
              [ngClass]="activeMainTab() === 'RATIONALE'
                ? 'bg-blue-600 text-white shadow-glow-accent'
                : 'bg-slate-900 text-slate-400 hover:text-white'"
            >
              <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <span>Why You Have To See & Wait (Analysis)</span>
            </button>

            <button
              type="button"
              (click)="activeMainTab.set('STRATEGIES')"
              class="px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2"
              [ngClass]="activeMainTab() === 'STRATEGIES'
                ? 'bg-blue-600 text-white shadow-glow-accent'
                : 'bg-slate-900 text-slate-400 hover:text-white'"
            >
              <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
              </svg>
              <span>Data Trader Strategy Playbook (4 Systems)</span>
            </button>

            <button
              type="button"
              (click)="activeMainTab.set('ALL_SIGNALS')"
              class="px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2"
              [ngClass]="activeMainTab() === 'ALL_SIGNALS'
                ? 'bg-blue-600 text-white shadow-glow-accent'
                : 'bg-slate-900 text-slate-400 hover:text-white'"
            >
              <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
              </svg>
              <span>Secondary Market Signals ({{ otherSignals().length }})</span>
            </button>
          </div>
        </div>

        <!-- TAB 1: WHY YOU HAVE TO SEE & WAIT -->
        @if (activeMainTab() === 'RATIONALE') {
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6 animate-fadeIn">
            
            <!-- COLUMN A: WHY YOU HAVE TO SEE -->
            <div class="rounded-xl border border-emerald-500/30 bg-slate-950/70 p-5 space-y-4 shadow-xl">
              <div class="flex items-center justify-between pb-3 border-b border-emerald-500/20">
                <div class="flex items-center gap-2">
                  <div class="p-1.5 rounded-lg bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                    <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                  </div>
                  <div>
                    <h4 class="text-sm font-bold text-emerald-300 font-mono tracking-tight">
                      WHY YOU HAVE TO SEE
                    </h4>
                    <p class="text-[11px] text-slate-400">Mandatory Technical Triggers & Confluences</p>
                  </div>
                </div>
                <span class="text-xs font-mono font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                  4 CONFIRMED
                </span>
              </div>

              <div class="space-y-3">
                @for (item of xauSignal().whySee; track item; let idx = $index) {
                  <div class="p-3 rounded-lg bg-slate-900/80 border border-slate-800/80 flex items-start gap-3">
                    <span class="flex-shrink-0 w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-mono text-[11px] font-bold mt-0.5">
                      {{ idx + 1 }}
                    </span>
                    <p class="text-xs text-slate-200 leading-relaxed font-sans">
                      {{ item }}
                    </p>
                  </div>
                }
              </div>
            </div>

            <!-- COLUMN B: WHY YOU HAVE TO WAIT -->
            <div class="rounded-xl border border-amber-500/30 bg-slate-950/70 p-5 space-y-4 shadow-xl">
              <div class="flex items-center justify-between pb-3 border-b border-amber-500/20">
                <div class="flex items-center gap-2">
                  <div class="p-1.5 rounded-lg bg-amber-500/15 text-amber-400 border border-amber-500/30">
                    <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div>
                    <h4 class="text-sm font-bold text-amber-300 font-mono tracking-tight">
                      WHY YOU HAVE TO WAIT
                    </h4>
                    <p class="text-[11px] text-slate-400">Patience Protocol, Traps & Risk Filter</p>
                  </div>
                </div>
                <span class="text-xs font-mono font-bold text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20">
                  4 RULES
                </span>
              </div>

              <div class="space-y-3">
                @for (item of xauSignal().whyWait; track item; let idx = $index) {
                  <div class="p-3 rounded-lg bg-slate-900/80 border border-slate-800/80 flex items-start gap-3">
                    <span class="flex-shrink-0 w-5 h-5 rounded-full bg-amber-500/20 text-amber-400 flex items-center justify-center font-mono text-[11px] font-bold mt-0.5">
                      !
                    </span>
                    <p class="text-xs text-slate-200 leading-relaxed font-sans">
                      {{ item }}
                    </p>
                  </div>
                }
              </div>
            </div>

          </div>
        }

        <!-- TAB 2: DATA TRADER STRATEGY PLAYBOOK -->
        @if (activeMainTab() === 'STRATEGIES') {
          <div class="animate-fadeIn">
            <app-strategy-playbook />
          </div>
        }

        <!-- TAB 3: SECONDARY MARKET SIGNALS -->
        @if (activeMainTab() === 'ALL_SIGNALS') {
          <div class="space-y-4 animate-fadeIn">
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              @for (signal of otherSignals(); track signal.id) {
                <app-signal-card 
                  [signal]="signal"
                />
              }
            </div>
          </div>
        }
      </div>

    </div>
  `
})
export class UserDashboardComponent {
  readonly signalService = inject(SignalService);

  readonly activeMainTab = signal<'RATIONALE' | 'STRATEGIES' | 'ALL_SIGNALS'>('RATIONALE');
  readonly isCopied = signal<boolean>(false);

  // Directly exposed XAUUSD signal
  readonly xauSignal = this.signalService.xauusdSignal;

  // Secondary signals
  readonly otherSignals = this.signalService.filteredSignals;

  onCopyXauSignal(): void {
    const s = this.xauSignal();
    if (!s) return;
    const text = `[GOLD / XAUUSD AI SIGNAL] ${s.type} | Entry: $${s.entryPrice.min}-$${s.entryPrice.max} | TP1: $${s.takeProfits[0].price} (HIT) | TP2: $${s.takeProfits[1].price} | TP3: $${s.takeProfits[2].price} | SL: $${s.stopLoss} | R:R ${s.riskRewardRatio}`;
    navigator.clipboard?.writeText(text);
    this.isCopied.set(true);
    setTimeout(() => this.isCopied.set(false), 2000);
  }
}
