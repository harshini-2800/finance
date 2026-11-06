# SmartSpend – AI-Powered Personal Finance & Wealth Management System

An exclusive, premium, dark-purple ("Obsidian Amethyst") personal wealth and financial management platform built with React, Vite, Tailwind CSS, Recharts, and Lucide Icons.

![Obsidian Amethyst Aesthetic](https://raw.githubusercontent.com/harshini-2800/finance/main/public/preview.png)

---

## 🌟 Key Features

1. **Executive Financial Dashboard**:
   - Dynamic real-time calculation of Monthly Incomes, Total Expenditures, Net Liquidity Balance, and Savings Retention Rate.
   - Month Selector with historical cycle preservation (`2026-11`, `2026-10`, `2026-09`, etc.).
   - Multi-month Inflow vs Outflow comparisons and 9-sector allocation donut charts.
   - Recent transaction audit trail.

2. **Transaction Ledger**:
   - Full CRUD: Add, edit, delete, and inspect transactions.
   - Multi-field search (title, merchant, notes, category).
   - Filter by category and billing period; sort by date and amount.

3. **9 Standard Commercial Categories**:
   - *Food, Shopping, Transportation, Education, Entertainment, Healthcare, Housing, Bills & Utilities, Other*.
   - Automated keyword-based categorization rules.
   - Category spend volume rankings and percentage share of income.

4. **Spending Analytics & Velocity**:
   - Historical multi-month income vs expenses.
   - Monthly expenditure trend curve.
   - Primary outflow vector highlight and average monthly expenditure metrics.

5. **AI Advisory Intelligence**:
   - Deterministic, data-driven financial rule modeling.
   - Cash cushion evaluation, discretionary spend ratios, and category inflation alerts.
   - Zero hallucination and 100% private client-side evaluation.

6. **Monthly Budget Guardrails**:
   - Category spending limits with progress indicators.
   - Automated 80% threshold warnings and critical budget-exceeded alerts.

7. **Settings & Data Center (Demo vs Personal)**:
   - Realistic pre-loaded Indian benchmark demo data (₹40,000+ base salary, rent, groceries, utility bills).
   - Safe isolation: Clear demo data without affecting personal records.
   - CSV Export & Import with format validation and auto-categorization.

---

## 🎨 Visual Identity: Obsidian Amethyst Luxury

- **Backgrounds**: Obsidian Black (`#09070D`), Deep Black Plum (`#100B16`), and Dark Aubergine (`#17101F`).
- **Cards & Surfaces**: Deep Plum (`#201629`) and Muted Purple (`#291C35`) with purple ambient hover glows (`#8955B5`).
- **Accents**: Royal Amethyst (`#633B86`), Rich Violet (`#8955B5`), Soft Lavender (`#B99AD9`), and Pale Lilac (`#D3C0E8`).
- **Typography**: Manrope / Plus Jakarta Sans.

---

## 🚀 Getting Started

### Prerequisites
- Node.js (v18+)
- npm or yarn

### Installation
```bash
# Clone the repository
git clone https://github.com/harshini-2800/finance.git

# Navigate into the project folder
cd finance

# Install dependencies
npm install

# Start development server
npm run dev
```

### Production Build
```bash
npm run build
npm run preview
```

---

## 🔒 Security & Privacy
- **100% Client-Side**: All financial data is persisted locally in the browser's `localStorage`.
- Zero external API tracking, telemetry, or server storage.
