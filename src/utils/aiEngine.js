import { formatINR } from './constants';

/**
 * Generate transparent, data-driven AI financial insights (Feature 5)
 * Analyzes:
 * - Current month vs previous month spending
 * - Category spending distribution & high spend alerts (>25% of income)
 * - Savings rate evaluation (< 10%, 10-25%, >25%)
 * - Discretionary spending (Shopping, Entertainment, Food) vs Essentials (Housing, Utilities, Healthcare)
 * - Budget utilization alerts
 */
export function generateAIInsights({
  currentMonth,
  totalIncome,
  totalExpenses,
  remainingBalance,
  savingsRate,
  categoryTotals, // { [cat]: amount }
  prevMonthExpenses,
  prevMonthIncome,
  prevMonthCategoryTotals,
  budgetsWithSpending
}) {
  const insights = [];

  // Check if there's enough data
  const hasTransactions = totalExpenses > 0;
  const hasIncome = totalIncome > 0;

  if (!hasTransactions && !hasIncome) {
    return [
      {
        id: 'ins_empty',
        type: 'info',
        title: 'Insufficient Data for AI Analysis',
        message: 'SmartSpend AI requires at least one income entry or expense transaction in this billing cycle to deliver actionable financial analysis.',
        category: 'General',
        impact: 'Neutral',
        recommendation: 'Add your primary salary or record your daily expenses to unlock smart budgeting suggestions.'
      }
    ];
  }

  // 1. Savings Rate & Cash Flow Health Insight
  if (hasIncome) {
    if (savingsRate >= 30) {
      insights.push({
        id: 'ins_savings_excellent',
        type: 'positive',
        title: 'Outstanding Savings Health',
        message: `You are saving ${savingsRate.toFixed(1)}% of your income this month (${formatINR(remainingBalance)} surplus). This exceeds the standard 50/30/20 benchmark!`,
        category: 'Savings',
        impact: 'High Positive',
        recommendation: 'Consider allocating a portion of this cash surplus into high-yield emergency funds or systematic investment plans (SIPs).'
      });
    } else if (savingsRate >= 15) {
      insights.push({
        id: 'ins_savings_healthy',
        type: 'positive',
        title: 'Healthy Savings Trajectory',
        message: `Your current savings rate is ${savingsRate.toFixed(1)}%, retaining ${formatINR(remainingBalance)}. You are on track for steady financial stability.`,
        category: 'Savings',
        impact: 'Moderate Positive',
        recommendation: 'Trimming non-essential subscriptions or dining out could push your savings above the 25% sweet spot.'
      });
    } else if (savingsRate > 0) {
      insights.push({
        id: 'ins_savings_low',
        type: 'warning',
        title: 'Thin Cash Flow Cushion',
        message: `Your savings rate is modest at ${savingsRate.toFixed(1)}% (${formatINR(remainingBalance)}). A single unexpected medical or utility emergency could exhaust your margin.`,
        category: 'Savings',
        impact: 'Caution',
        recommendation: 'Review your discretionary spending categories (Shopping, Entertainment) to reinforce your monthly buffer.'
      });
    } else {
      // Overspending: expenses exceed income
      const deficit = totalExpenses - totalIncome;
      insights.push({
        id: 'ins_deficit',
        type: 'critical',
        title: 'Negative Cash Flow Alert',
        message: `Your total spending (${formatINR(totalExpenses)}) exceeds your recorded income (${formatINR(totalIncome)}) by ${formatINR(deficit)}.`,
        category: 'Cash Flow',
        impact: 'High Risk',
        recommendation: 'Immediate action needed: pause non-essential shopping and entertainment purchases until the next billing cycle.'
      });
    }
  }

  // 2. High Category Concentration Insight
  if (hasIncome && totalExpenses > 0) {
    const sortedCategories = Object.entries(categoryTotals).sort((a, b) => b[1] - a[1]);
    if (sortedCategories.length > 0) {
      const [topCategory, topAmount] = sortedCategories[0];
      const categoryShareOfIncome = (topAmount / totalIncome) * 100;
      const categoryShareOfExpense = (topAmount / totalExpenses) * 100;

      if (categoryShareOfIncome > 30 && topCategory !== 'Housing') {
        insights.push({
          id: 'ins_category_high',
          type: 'warning',
          title: `Heavy Allocation to ${topCategory}`,
          message: `${topCategory} accounts for ${categoryShareOfIncome.toFixed(1)}% of your total income (${formatINR(topAmount)}), representing ${categoryShareOfExpense.toFixed(1)}% of your expenses.`,
          category: topCategory,
          impact: 'Moderate Caution',
          recommendation: `Target a 10-15% reduction in ${topCategory.toLowerCase()} expenses next month to redirect towards long-term wealth building.`
        });
      } else if (topCategory === 'Housing' && categoryShareOfIncome > 45) {
        insights.push({
          id: 'ins_housing_high',
          type: 'warning',
          title: 'High Fixed Housing Overhead',
          message: `Housing and rent take up ${categoryShareOfIncome.toFixed(1)}% of your net income, which leaves less room for lifestyle and savings flexibility.`,
          category: 'Housing',
          impact: 'Caution',
          recommendation: 'Aim to keep fixed overheads under 40% of income by managing utility bills or seeking shared amenities.'
        });
      }
    }
  }

  // 3. Month-over-Month Velocity Comparison
  if (prevMonthExpenses > 0 && totalExpenses > 0) {
    const expenseDiff = totalExpenses - prevMonthExpenses;
    const pctChange = ((expenseDiff) / prevMonthExpenses) * 100;

    if (pctChange > 20) {
      insights.push({
        id: 'ins_mom_increase',
        type: 'warning',
        title: 'Spending Surge Compared to Last Month',
        message: `Your spending this month is up by ${Math.abs(pctChange).toFixed(1)}% (+${formatINR(expenseDiff)}) compared to the previous month (${formatINR(prevMonthExpenses)}).`,
        category: 'Trend Analysis',
        impact: 'Caution',
        recommendation: 'Analyze recent large one-off purchases to verify if this increase was planned or spontaneous.'
      });
    } else if (pctChange < -15) {
      insights.push({
        id: 'ins_mom_decrease',
        type: 'positive',
        title: 'Disciplined Spend Reduction',
        message: `Commendable financial control! Your monthly expenditure decreased by ${Math.abs(pctChange).toFixed(1)}% (-${formatINR(Math.abs(expenseDiff))}) relative to last month.`,
        category: 'Trend Analysis',
        impact: 'Positive',
        recommendation: 'Lock in these savings gains by immediately moving the unspent balance into a dedicated savings deposit.'
      });
    }
  }

  // 4. Specific Category Shifts (e.g. Food vs Last Month)
  if (prevMonthCategoryTotals) {
    const currentFood = categoryTotals['Food'] || 0;
    const prevFood = prevMonthCategoryTotals['Food'] || 0;
    if (prevFood > 0 && currentFood > prevFood * 1.25) {
      const foodDiff = currentFood - prevFood;
      insights.push({
        id: 'ins_food_spike',
        type: 'warning',
        title: 'Dining & Grocery Inflation Spike',
        message: `You spent ${formatINR(foodDiff)} more on Food this month (+${(((currentFood - prevFood)/prevFood)*100).toFixed(0)}%) compared to the previous month.`,
        category: 'Food',
        impact: 'Moderate Caution',
        recommendation: 'Batch cooking at home and limiting food delivery apps (Zomato/Swiggy) to weekends can immediately curb this.'
      });
    }

    const currentShop = categoryTotals['Shopping'] || 0;
    const prevShop = prevMonthCategoryTotals['Shopping'] || 0;
    if (prevShop > 0 && currentShop > prevShop * 1.35) {
      insights.push({
        id: 'ins_shop_spike',
        type: 'warning',
        title: 'Discretionary Shopping Surge',
        message: `Shopping expenditure is ${(((currentShop - prevShop)/prevShop)*100).toFixed(0)}% higher than last month's figures (${formatINR(currentShop)} vs ${formatINR(prevShop)}).`,
        category: 'Shopping',
        impact: 'Moderate Caution',
        recommendation: 'Adopt the "48-Hour Rule" for online shopping carts to avoid impulse purchases.'
      });
    }
  }

  // 5. Budget Utilization Warnings
  if (budgetsWithSpending && budgetsWithSpending.length > 0) {
    budgetsWithSpending.forEach(b => {
      if (b.spent > b.limit) {
        insights.push({
          id: `ins_budget_exceeded_${b.id}`,
          type: 'critical',
          title: `Budget Exceeded: ${b.category}`,
          message: `You have spent ${formatINR(b.spent)} against your budgeted cap of ${formatINR(b.limit)} (${((b.spent / b.limit) * 100).toFixed(0)}% used).`,
          category: b.category,
          impact: 'Limit Breached',
          recommendation: `Halt discretionary spend in ${b.category} for the remainder of ${currentMonth} to prevent further deficit.`
        });
      } else if (b.spent >= b.limit * 0.8) {
        insights.push({
          id: `ins_budget_warning_${b.id}`,
          type: 'warning',
          title: `Approaching Budget Cap: ${b.category}`,
          message: `You have used ${((b.spent / b.limit) * 100).toFixed(0)}% of your ${b.category} allowance. Only ${formatINR(b.limit - b.spent)} remains.`,
          category: b.category,
          impact: 'Near Limit',
          recommendation: `Monitor your next transactions in ${b.category} closely to stay within your preset budget limit.`
        });
      }
    });
  }

  // 6. Positive Financial Behavior Observation (Fallback if few insights)
  if (insights.length < 3 && hasIncome && totalExpenses < totalIncome) {
    insights.push({
      id: 'ins_positive_behavior',
      type: 'positive',
      title: 'Positive Financial Solvency',
      message: `Your balance is in the black with a positive surplus of ${formatINR(remainingBalance)}. Consistent positive cash flow builds resilience.`,
      category: 'Financial Health',
      impact: 'Positive',
      recommendation: 'Set automated monthly transfer on salary day to automate your savings effortlessly.'
    });
  }

  return insights;
}

