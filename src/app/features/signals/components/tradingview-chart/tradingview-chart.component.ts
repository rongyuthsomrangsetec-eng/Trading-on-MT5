import { Component, input, AfterViewInit, ElementRef, OnDestroy, viewChild } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-tradingview-chart',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="relative w-full h-[540px] rounded-xl overflow-hidden border border-slate-800 bg-[#0b0e14] shadow-2xl flex flex-col">
      
      <!-- Chart HUD Overlay Bar (Linking Entry, TP, SL visually on top of the chart) -->
      <div class="px-3 py-2 bg-slate-950/90 border-b border-slate-800/80 backdrop-blur-md flex flex-wrap items-center justify-between gap-2 z-20">
        <div class="flex items-center gap-2">
          <span class="inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-[11px] font-mono font-bold bg-amber-500/15 text-amber-300 border border-amber-500/30">
            <span class="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse"></span>
            OANDA:XAUUSD
          </span>
          <span class="text-xs font-mono text-slate-400">1H Candlesticks • Live Chart</span>
        </div>

        <!-- Floating Trade Target Overlay Pills on the Chart -->
        <div class="flex flex-wrap items-center gap-1.5 font-mono text-[11px]">
          <span class="px-2 py-0.5 rounded bg-rose-500/20 text-rose-300 border border-rose-500/30 font-semibold" title="Structural Stop Loss">
            SL: $4,048.00
          </span>
          <span class="px-2 py-0.5 rounded bg-blue-500/20 text-blue-300 border border-blue-500/30 font-semibold" title="Institutional Entry Range">
            Entry: $4,090 – $4,115
          </span>
          <span class="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 font-semibold" title="Target 1">
            TP1: $4,210
          </span>
          <span class="px-2 py-0.5 rounded bg-emerald-500/15 text-emerald-400 border border-emerald-500/25" title="Target 2">
            TP2: $4,295
          </span>
          <span class="px-2 py-0.5 rounded bg-amber-500/15 text-amber-300 border border-amber-500/25" title="Target 3">
            TP3: $4,420
          </span>
        </div>
      </div>

      <!-- Real-Time TradingView Advanced Chart Widget -->
      <div #chartContainer class="relative flex-1 w-full h-full bg-[#0b0e14]">
        <!-- TradingView widget mounts here via script injection -->
      </div>
    </div>
  `
})
export class TradingViewChartComponent implements AfterViewInit, OnDestroy {
  readonly symbol = input<string>('OANDA:XAUUSD');
  readonly interval = input<string>('60');

  readonly chartContainer = viewChild.required<ElementRef<HTMLDivElement>>('chartContainer');

  ngAfterViewInit(): void {
    this.injectTradingViewWidget();
  }

  ngOnDestroy(): void {
    // cleanup – remove injected script if component destroyed
    const existing = document.getElementById('tv-advanced-chart-script');
    if (existing) existing.remove();
  }

  private injectTradingViewWidget(): void {
    const container = this.chartContainer().nativeElement;

    // Create the container div TradingView expects
    const widgetDiv = document.createElement('div');
    widgetDiv.className = 'tradingview-widget-container';
    widgetDiv.style.cssText = 'width:100%;height:100%;position:absolute;inset:0;';

    const inner = document.createElement('div');
    inner.className = 'tradingview-widget-container__widget';
    inner.style.cssText = 'width:100%;height:100%;';
    widgetDiv.appendChild(inner);

    container.appendChild(widgetDiv);

    // Inject config script inline
    const configScript = document.createElement('script');
    configScript.type = 'text/javascript';
    configScript.text = JSON.stringify({
      autosize: true,
      symbol: this.symbol(),
      interval: this.interval(),
      timezone: 'Etc/UTC',
      theme: 'dark',
      style: '1',
      locale: 'en',
      backgroundColor: '#0b0e14',
      gridColor: 'rgba(30, 38, 56, 0.3)',
      hide_top_toolbar: false,
      hide_legend: false,
      allow_symbol_change: false,
      save_image: false,
      studies: ['STD;EMA', 'STD;Volume'],
      container_id: 'tradingview-widget-container__widget'
    });

    // Inject the TradingView Advanced Chart script (confirmed 200 OK)
    const script = document.createElement('script');
    script.id = 'tv-advanced-chart-script';
    script.type = 'text/javascript';
    script.src = 'https://s3.tradingview.com/external-embedding/embed-widget-advanced-chart.js';
    script.async = true;
    script.textContent = JSON.stringify({
      autosize: true,
      symbol: this.symbol(),
      interval: this.interval(),
      timezone: 'Etc/UTC',
      theme: 'dark',
      style: '1',
      locale: 'en',
      backgroundColor: '#0b0e14',
      gridColor: 'rgba(30, 38, 56, 0.3)',
      hide_top_toolbar: false,
      hide_legend: false,
      allow_symbol_change: false,
      save_image: false,
      studies: ['STD;EMA', 'STD;Volume']
    });

    widgetDiv.appendChild(script);
  }
}
