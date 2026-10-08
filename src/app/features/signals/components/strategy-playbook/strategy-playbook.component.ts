import { Component, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';

export interface StrategyItem {
  id: string;
  name: string;
  videoId: string;
  videoUrl: string;
  badge: string;
  timeframe: string;
  targetMarket: string;
  description: string;
  coreConcept: string;
  rules: {
    step: string;
    action: string;
    criteria: string;
  }[];
  confluenceWithCurrentGoldTrade: string;
}

@Component({
  selector: 'app-strategy-playbook',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="rounded-2xl border border-slate-800 bg-slate-900/90 p-5 md:p-6 shadow-2xl backdrop-blur-md space-y-6">
      
      <!-- Header -->
      <div class="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <div class="flex items-center gap-2">
            <span class="px-2.5 py-0.5 text-[10px] font-mono font-bold uppercase tracking-wider bg-blue-500/15 text-blue-400 border border-blue-500/30 rounded">
              DATA TRADER QUANT LABS
            </span>
            <span class="text-xs text-slate-400 font-mono">4-PILLAR REVERSE-ENGINEERED STRATEGY MATRIX</span>
          </div>
          <h3 class="text-xl md:text-2xl font-extrabold text-white mt-1">
            Algorithmic Strategy Playbook & Rule Engine
          </h3>
          <p class="text-xs text-slate-400 mt-0.5">
            Research and mechanical implementation of the 4 flagship trading systems curated from Data Trader research.
          </p>
        </div>

        <!-- Strategy Pill Selectors -->
        <div class="flex flex-wrap items-center gap-1.5 bg-slate-950 p-1.5 rounded-xl border border-slate-800">
          @for (strat of strategies; track strat.id) {
            <button
              type="button"
              (click)="selectedStrategyId.set(strat.id)"
              class="px-3 py-1.5 rounded-lg text-xs font-semibold transition-all font-mono"
              [ngClass]="selectedStrategyId() === strat.id 
                ? 'bg-blue-600 text-white shadow-glow-accent' 
                : 'text-slate-400 hover:text-white hover:bg-slate-800/60'"
            >
              {{ strat.badge }}
            </button>
          }
        </div>
      </div>

      <!-- Active Strategy Detailed Card -->
      @if (activeStrategy(); as current) {
        <div class="grid grid-cols-1 lg:grid-cols-12 gap-6 animate-fadeIn">
          
          <!-- Left Column: Overview, Formula & XAUUSD Alignment (5 Cols) -->
          <div class="lg:col-span-5 space-y-4">
            <div class="p-4 rounded-xl bg-slate-950/70 border border-slate-800 space-y-3">
              <div class="flex items-center justify-between">
                <span class="px-2 py-0.5 rounded text-[11px] font-mono font-bold text-amber-300 bg-amber-500/15 border border-amber-500/30">
                  {{ current.badge }}
                </span>
                <span class="text-xs text-slate-400 font-mono">
                  Timeframe: <span class="text-white font-bold">{{ current.timeframe }}</span>
                </span>
              </div>

              <h4 class="text-lg font-bold text-white font-sans leading-tight">
                {{ current.name }}
              </h4>

              <p class="text-xs text-slate-300 leading-relaxed font-sans">
                {{ current.description }}
              </p>

              <div class="pt-2 border-t border-slate-800/80">
                <div class="text-[11px] uppercase font-mono text-slate-400 font-semibold mb-1">
                  Core Mechanical Edge:
                </div>
                <div class="p-2.5 rounded-lg bg-slate-900 border border-slate-800 text-xs text-blue-300 font-mono">
                  {{ current.coreConcept }}
                </div>
              </div>
            </div>

            <!-- Alignment with current XAUUSD trade -->
            <div class="p-4 rounded-xl bg-emerald-950/20 border border-emerald-500/30 space-y-2">
              <div class="flex items-center gap-2">
                <div class="h-2 w-2 rounded-full bg-emerald-400"></div>
                <span class="text-xs font-mono font-bold text-emerald-400 uppercase tracking-wide">
                  Live Confluence on XAUUSD Trade:
                </span>
              </div>
              <p class="text-xs text-slate-200 leading-relaxed font-sans">
                {{ current.confluenceWithCurrentGoldTrade }}
              </p>
            </div>

            <!-- YouTube Video Reference Link -->
            <a 
              [href]="current.videoUrl" 
              target="_blank" 
              rel="noopener noreferrer"
              class="w-full py-2.5 px-4 rounded-xl bg-rose-600/15 hover:bg-rose-600/25 border border-rose-500/40 text-rose-300 hover:text-white transition-all text-xs font-semibold flex items-center justify-center gap-2"
            >
              <svg class="w-4 h-4 text-rose-500 fill-current" viewBox="0 0 24 24">
                <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
              </svg>
              <span>Watch Original Video by Data Trader ({{ current.videoId }})</span>
            </a>
          </div>

          <!-- Right Column: Step-by-Step Rule Engine (7 Cols) -->
          <div class="lg:col-span-7 space-y-4">
            <div class="flex items-center justify-between text-xs font-mono font-bold text-slate-400 px-1">
              <span>EXECUTION CHECKLIST & INVARIABILITY RULES</span>
              <span class="text-blue-400">NON-DISCRETIONARY STEPS</span>
            </div>

            <div class="space-y-3">
              @for (rule of current.rules; track rule.step; let i = $index) {
                <div class="p-4 rounded-xl bg-slate-950/80 border border-slate-800 space-y-1.5 transition-all hover:border-slate-700">
                  <div class="flex items-center justify-between">
                    <div class="flex items-center gap-2">
                      <span class="w-6 h-6 rounded-full bg-blue-500/20 text-blue-400 font-mono text-xs font-bold flex items-center justify-center">
                        {{ i + 1 }}
                      </span>
                      <span class="text-xs font-bold font-mono text-white uppercase tracking-wider">
                        {{ rule.step }}
                      </span>
                    </div>
                    <span class="text-[10px] font-mono text-slate-500 uppercase">STEP {{ i + 1 }}</span>
                  </div>

                  <div class="text-xs font-semibold text-slate-200 pl-8">
                    {{ rule.action }}
                  </div>

                  <div class="text-xs text-slate-400 leading-relaxed font-sans pl-8">
                    {{ rule.criteria }}
                  </div>
                </div>
              }
            </div>
          </div>

        </div>
      }
    </div>
  `
})
export class StrategyPlaybookComponent {
  readonly strategies: StrategyItem[] = [
    {
      id: 'strat_4h_range',
      name: 'The 4-Hour Range 5-Minute Liquidity Scalper',
      videoId: 'O5eC5lY7ZXY',
      videoUrl: 'https://youtu.be/O5eC5lY7ZXY?si=1fsYIeo8XySxXUtR',
      badge: 'Strategy 1: 4H Range Scalper',
      timeframe: '4H (Bias) + 5M (Trigger)',
      targetMarket: 'XAUUSD, Crypto, Forex',
      description: 'A pure price action scalping system that identifies institutional liquidity pools established during the first 4-hour candle of the trading session and trades the false breakout (re-entry).',
      coreConcept: 'False breakouts beyond key 4H extremes trap retail breakout traders. A 5M candle body close back INSIDE the 4H range confirms institutional absorption and provides a high-win-rate mean-reversion setup.',
      rules: [
        {
          step: 'Define 4H Range Boundary',
          action: 'Mark the High and Low of the first 4-hour candle of the day',
          criteria: 'Switch chart to 4H. Draw horizontal ray lines at the absolute Wick High and Wick Low of the day opening 4H candle.'
        },
        {
          step: 'Wait for Liquidity Sweep',
          action: 'Monitor the 5-minute chart for price breaking outside the boundaries',
          criteria: 'Price must push above the 4H High or below the 4H Low to induce retail breakout orders and sweep resting stop losses.'
        },
        {
          step: 'Wait for Full Re-Entry Body Close',
          action: 'Do NOT trade the breakout; wait for price to close BACK inside',
          criteria: 'CRITICAL RULE: A 5-minute candle MUST close with its entire body back inside the 4H range. Wicks outside do not count. The body close confirms the trap.'
        },
        {
          step: 'Execution & Risk Parameters',
          action: 'Enter immediately on candle close with 2:1 R:R target',
          criteria: 'Long if swept low and closed back in; Short if swept high and closed back in. Stop Loss placed beyond the sweep wick extreme. Take Profit minimum 2x risk or opposite 4H boundary.'
        }
      ],
      confluenceWithCurrentGoldTrade: 'Our XAUUSD signal at $2,740-$2,755 used this exact concept: Gold wicked below the London session 4H low to $2,735, trapping early sellers, before printing a 5M/15M body close back above $2,740.'
    },
    {
      id: 'strat_volume_profile',
      name: 'Volume Profile Auction Market Framework',
      videoId: 'Xa2fB097ajs',
      videoUrl: 'https://www.youtube.com/watch?v=Xa2fB097ajs',
      badge: 'Strategy 2: Volume Profile Matrix',
      timeframe: '1H / 4H / Daily (Fixed Range)',
      targetMarket: 'Futures, Spot Gold, BTC, Indices',
      description: 'Replaces vertical time-volume with horizontal price-volume distribution to reveal where institutions accumulated their largest positions, defining Point of Control (POC) and Value Area (VAH/VAL).',
      coreConcept: 'The market spends 70% of its volume in the Value Area. Breaks outside that fail will rotate back across the entire Value Area (80% Rule). High-Volume Nodes act as magnets; Low-Volume Nodes act as acceleration corridors.',
      rules: [
        {
          step: 'Anchor Fixed Range Volume Profile',
          action: 'Apply Fixed Range Profile across the prior consolidation or previous day session',
          criteria: 'Identify the Point of Control (POC: highest volume line), Value Area High (VAH), and Value Area Low (VAL: 70% boundary).'
        },
        {
          step: 'POC Bounce (Mean Reversion)',
          action: 'Trade pullbacks to untested / naked Point of Control',
          criteria: 'When price returns to an untested POC line with declining volume delta, enter on rejection with target at the opposite Value Area boundary.'
        },
        {
          step: 'Value Area 80% Rule Rotation',
          action: 'Trade re-entries into the Value Area after failed auction outside',
          criteria: 'If price pushes outside VAH/VAL but falls back inside with 2 consecutive candle closes, trade the rotation across the profile to the opposite VAL/VAH.'
        },
        {
          step: 'Low-Volume Node (LVN) Velocity Targets',
          action: 'Use LVNs as rapid profit acceleration runways',
          criteria: 'Do not place take profits inside LVNs; price glides through them effortlessly. Place targets just before the next High-Volume Node (HVN).'
        }
      ],
      confluenceWithCurrentGoldTrade: 'Our XAUUSD blueprint explicitly anchors TP1 ($2,790) and TP2 ($2,835) across the Low-Volume Node vacuum above the 4H POC ($2,742.80), where lack of historical volume ensures fast expansion.'
    },
    {
      id: 'strat_slc_framework',
      name: 'The SLC System: Structure, Level, Confirmation',
      videoId: 'JBpm1pd1RF8',
      videoUrl: 'https://www.youtube.com/watch?v=JBpm1pd1RF8',
      badge: 'Strategy 3: SLC System',
      timeframe: '1H (Structure) + 15M/5M (Confirmation)',
      targetMarket: 'All Liquidity Instruments',
      description: 'Solves why naked supply & demand zones fail by forcing traders to align Higher-Timeframe Structure (S) with Valid Displacement Levels (L) and Lower-Timeframe Confirmation (C).',
      coreConcept: 'A zone alone is meaningless without trend alignment. A valid level must have broken market structure with aggressive displacement. Never enter with blind limit orders; wait for LTF structure shift confirmation.',
      rules: [
        {
          step: 'S - Market Structure (Higher Timeframe)',
          action: 'Determine 1H/4H trend direction using swing points',
          criteria: 'Only look for Demand zones in an uptrend (Higher Highs / Higher Lows). Only look for Supply zones in a downtrend (Lower Highs / Lower Lows). Never counter-trend trade naked zones.'
        },
        {
          step: 'L - Valid Displacement Level',
          action: 'Identify supply/demand zones created by aggressive institutional candles',
          criteria: 'The zone MUST have caused a break of market structure (BOS) and left an imbalance (Fair Value Gap). Weak or gradual moves away from a level invalidate the zone.'
        },
        {
          step: 'C - Lower Timeframe Confirmation Trigger',
          action: 'Never place blind limit orders; zoom in to 5M/15M on tap',
          criteria: 'When price touches the zone, wait for a Change of Character (CHoCH) or double bottom rejection on the 5M chart before triggering execution.'
        },
        {
          step: 'Risk Invalidation',
          action: 'Place stop loss below the structural swing, not the tight zone edge',
          criteria: 'Protect trades from spread wicks by buffering stop loss 5-10 pips below the confirmed rejection wick.'
        }
      ],
      confluenceWithCurrentGoldTrade: 'The XAUUSD setup is a textbook SLC trade: 1H Structure is Bullish (S), the $2,740-$2,755 zone broke prior $2,730 resistance with displacement (L), and we waited for the 15M candle close above $2,748 (C).'
    },
    {
      id: 'strat_small_account',
      name: 'Small Account Growth: 50 EMA, FVG & Volume Oscillator',
      videoId: 'nnrs06knDEo',
      videoUrl: 'https://www.youtube.com/watch?v=nnrs06knDEo',
      badge: 'Strategy 4: Small Account Growth',
      timeframe: '15M / 1H',
      targetMarket: 'Gold, Forex Majors, Top Cryptos',
      description: 'Three high-probability setups engineered specifically to build small accounts with asymmetric risk: 50 EMA trend continuation into FVGs, Volume Oscillator exhaustion reversals, and 3-touch trendlines.',
      coreConcept: 'Compound small accounts by avoiding over-trading. Only trade when the 50 EMA provides trend bias, entry occurs at Fair Value Gap discounts, or the Volume Oscillator registers extreme +30% capitulation spikes.',
      rules: [
        {
          step: 'Setup 1: 50 EMA + Fair Value Gap (FVG)',
          action: 'Trade pullbacks to imbalances aligned with the 50 EMA',
          criteria: 'If price is above 50 EMA and sloping up, wait for an upward displacement candle leaving a 3-candle FVG. Enter when price mitigates into the FVG with stop below the 50 EMA.'
        },
        {
          step: 'Setup 2: Volume Oscillator Trend Exhaustion',
          action: 'Apply TradingView Volume Oscillator with 30% threshold line',
          criteria: 'When a strong trend is underway and the Volume Oscillator exceeds +30%, institutional climax buying/selling is occurring. Prepare for trend exhaustion and fade on reversal candle confirmation.'
        },
        {
          step: 'Setup 3: 3-Point Trendline Breakout',
          action: 'Draw trendlines connecting minimum 3 valid swing points',
          criteria: 'Wait for a full candle body close outside the trendline (not a wick). Enter on the retest of the broken line with 2:1 minimum target.'
        },
        {
          step: 'Account Sizing & Discipline',
          action: 'Strictly risk 1-2% per trade with zero revenge trading',
          criteria: 'Never risk more than 2% of equity per trade. Take partial profits at 1.5R and move stop loss to breakeven.'
        }
      ],
      confluenceWithCurrentGoldTrade: 'Gold rejected right off the rising 50 EMA on the 4H chart ($2,738) and tapped into the Fair Value Gap between $2,740-$2,752, satisfying Setup 1 with pristine accuracy.'
    }
  ];

  readonly selectedStrategyId = signal<string>('strat_4h_range');

  readonly activeStrategy = computed(() => {
    return this.strategies.find(s => s.id === this.selectedStrategyId()) || this.strategies[0];
  });
}
