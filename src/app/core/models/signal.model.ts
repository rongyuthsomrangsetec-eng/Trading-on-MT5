export type SignalDirection = 'BUY' | 'SELL';
export type SignalTimeframe = '15m' | '1h' | '4h' | '1D';
export type SignalStatus = 'PENDING' | 'ACTIVE' | 'HIT_TP' | 'HIT_SL' | 'EXPIRED';

export interface TakeProfitTarget {
  level: 1 | 2 | 3;
  price: number;
  hit: boolean;
  gainPercentage?: number;
  lots?: number;   // Position size to close at this TP level
}

export interface NewsAnnouncement {
  headline: string;
  impact: 'HIGH' | 'MEDIUM' | 'LOW';
  time: string;
  advisory: string;
  sentiment: 'BULLISH_GOLD' | 'BEARISH_GOLD' | 'HIGH_VOLATILITY';
}

export interface SignalIndicators {
  rsi?: number;
  trend?: 'BULLISH' | 'BEARISH' | 'NEUTRAL';
  emaCross?: string;
  orderBookImbalance?: string;
  keyCatalyst?: string;
  modelSource?: 'GPT-4o' | 'Claude-3.5-Sonnet' | 'DeepSeek-R1' | 'Ensemble-Alpha';
}

export interface TradingSignal {
  id: string;
  ticker: string;              // e.g., 'XAUUSD', 'BTCUSDT'
  type: SignalDirection;
  timeframe: SignalTimeframe;
  entryPrice: {
    min: number;
    max: number;
  };
  takeProfits: TakeProfitTarget[];
  stopLoss: number;
  slLots?: number;             // Lots to close if SL is hit
  riskRewardRatio: number;
  aiConfidenceScore: number;   // 0 - 100%
  aiAnalysisSummary: string;   // Technical + sentiment summary
  status: SignalStatus;
  timestamp: string;
  indicators?: SignalIndicators;
  whySee?: string[];           // Key technical confluences to look for
  whyWait?: string[];          // Patience, trap avoidance, and execution filters
  newsAnnouncement?: NewsAnnouncement; // Macro catalyst & high-impact news warnings
}

export interface SignalFilterCriteria {
  ticker?: string;
  type?: SignalDirection | 'ALL';
  timeframe?: SignalTimeframe | 'ALL';
  status?: SignalStatus | 'ALL';
  minConfidence?: number;
}
