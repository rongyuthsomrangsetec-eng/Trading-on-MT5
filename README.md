# TrendingAI - Enterprise Multi-Model AI Trading Signal Platform

An enterprise-grade, real-time AI trading signal intelligence platform built with modern **Angular 19** (Standalone Components, Signals API, RxJS) and **Tailwind CSS** (TradingView dark-mode fintech aesthetic).

---

## 1. Key Architectural Highlights

- **Pure Standalone Architecture**: Strictly no `NgModule` overhead. Zero-legacy components.
- **Modern Angular Signals**: High-performance, fine-grained reactivity using `signal()`, `computed()`, and `effect()`.
- **Zero-Trust Security & RBAC**: Functional Route Guards (`CanActivateFn`) implementing JWT validation and granular role gates (`ADMIN`, `PRO_TRADER`, `TRADER`).
- **Execution Blueprints**: Real-time signal cards visualizing entry ranges, multi-target take profits (TP1, TP2, TP3), stop loss, risk-to-reward ratio, and expandable AI technical catalysts.
- **Admin Control Center**: Responsive user management table with real-time AI latency/error-rate telemetry, tier promotion, and account banning.

---

## 2. Directory Structure

```
src/app/
├── core/                        # Global singleton services, interceptors, guards
│   ├── auth/                    # Auth interceptor, RBAC guards (authGuard, adminGuard)
│   ├── models/                  # Shared data models (TradingSignal, User, Role)
│   └── services/                # SignalService, ThemeService, WebSocketService
├── shared/                      # Dumb presentational components, pipes, directives
│   └── components/              # Navbar, Modal, Badge, StatsCard
├── features/                    # Feature domains (smart components)
│   ├── auth/                    # Login, Register
│   ├── user-dashboard/          # Overview, Live Signals, Charting
│   ├── signals/                 # Detailed signal card, filter by pair/timeframe/risk
│   └── admin/                   # Admin Controller
│       └── user-management/     # User list, role toggle, ban/unban, tier upgrade
├── app.config.ts                # Application providers & router configuration
├── app.routes.ts                # Lazy-loaded route configurations
└── app.component.ts             # Root standalone container
```

---

## 3. Quick Start

```bash
# 1. Install dependencies
npm install

# 2. Run local development server
npm start
# or: npx ng serve

# 3. Open your browser
http://localhost:4200
```
