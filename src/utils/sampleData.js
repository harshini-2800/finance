import { getCurrentMonthYear } from './constants';

export const INITIAL_DEMO_DATA = {
  // Monthly incomes keyed by YYYY-MM
  incomes: {
    // Current month and previous months
    '2026-11': [
      { id: 'inc_demo_1', source: 'Salary', amount: 42000, date: '2026-11-01', description: 'Tech Corp Monthly Base Salary', isDemo: true },
      { id: 'inc_demo_2', source: 'Freelance', amount: 8500, date: '2026-11-05', description: 'UI/UX Design Consulting', isDemo: true }
    ],
    '2026-10': [
      { id: 'inc_demo_3', source: 'Salary', amount: 42000, date: '2026-10-01', description: 'Tech Corp Monthly Base Salary', isDemo: true },
      { id: 'inc_demo_4', source: 'Freelance', amount: 5000, date: '2026-10-12', description: 'Web dev bug fix project', isDemo: true }
    ],
    '2026-09': [
      { id: 'inc_demo_5', source: 'Salary', amount: 40000, date: '2026-09-01', description: 'Tech Corp Monthly Base Salary', isDemo: true }
    ]
  },

  // Expenses list
  expenses: [
    // Current Month (Nov 2026)
    { id: 'exp_1', title: 'Apartment Monthly Rent', amount: 14000, category: 'Housing', date: '2026-11-02', description: '2BHK Apartment rental in HSR Layout', isDemo: true },
    { id: 'exp_2', title: 'Monthly Grocery Stock Blinkit', amount: 3450, category: 'Food', date: '2026-11-03', description: 'Groceries, dairy and pantry supplies', isDemo: true },
    { id: 'exp_3', title: 'Electricity & Water Bill', amount: 1850, category: 'Bills and Utilities', date: '2026-11-04', description: 'BESCOM electric bill & water charges', isDemo: true },
    { id: 'exp_4', title: 'Airtel Fiber Broadband', amount: 1180, category: 'Bills and Utilities', date: '2026-11-04', description: 'High speed fiber plan 200 Mbps', isDemo: true },
    { id: 'exp_5', title: 'Petrol for Two Wheeler', amount: 1200, category: 'Transportation', date: '2026-11-05', description: 'Indian Oil petrol bunk fillup', isDemo: true },
    { id: 'exp_6', title: 'Swiggy Dinner with Team', amount: 1250, category: 'Food', date: '2026-11-05', description: 'Gourmet burgers and sides', isDemo: true },
    { id: 'exp_7', title: 'Amazon Office Supplies & Organiser', amount: 2150, category: 'Shopping', date: '2026-11-06', description: 'Ergonomic mousepad and desk lamp', isDemo: true },
    { id: 'exp_8', title: 'Netflix & Spotify Family Subscription', amount: 899, category: 'Entertainment', date: '2026-11-06', description: 'Monthly entertainment digital renewal', isDemo: true },

    // Previous Month (Oct 2026)
    { id: 'exp_9', title: 'Apartment Monthly Rent', amount: 14000, category: 'Housing', date: '2026-10-02', description: 'October rental payment', isDemo: true },
    { id: 'exp_10', title: 'DMart Monthly Supermarket Ration', amount: 4800, category: 'Food', date: '2026-10-05', description: 'Household groceries and cleaning essentials', isDemo: true },
    { id: 'exp_11', title: 'Diwali Festive Clothes Shopping', amount: 6500, category: 'Shopping', date: '2026-10-15', description: 'Kurtas and shoes from FabIndia', isDemo: true },
    { id: 'exp_12', title: 'Uber Cabs Airport Travel', amount: 1650, category: 'Transportation', date: '2026-10-18', description: 'Cab ride to BLR airport terminal', isDemo: true },
    { id: 'exp_13', title: 'Udemy Fullstack React Masterclass', amount: 1499, category: 'Education', date: '2026-10-20', description: 'Modern cloud-native web engineering course', isDemo: true },
    { id: 'exp_14', title: 'Apollo Pharmacy Health Checkup & Vitamins', amount: 1850, category: 'Healthcare', date: '2026-10-22', description: 'Multivitamins, protein and prescription medicines', isDemo: true },
    { id: 'exp_15', title: 'PVR IMAX Movie Tickets & Popcorn', amount: 1300, category: 'Entertainment', date: '2026-10-25', description: 'Weekend movie with family', isDemo: true },
    { id: 'exp_16', title: 'Electricity Bill', amount: 1950, category: 'Bills and Utilities', date: '2026-10-28', description: 'October power consumption bill', isDemo: true },

    // Sept 2026
    { id: 'exp_17', title: 'Apartment Monthly Rent', amount: 14000, category: 'Housing', date: '2026-09-02', description: 'September house rent', isDemo: true },
    { id: 'exp_18', title: 'Grocery Blinkit', amount: 3900, category: 'Food', date: '2026-09-08', description: 'Provisions and snacks', isDemo: true },
    { id: 'exp_19', title: 'Petrol for Bike', amount: 1400, category: 'Transportation', date: '2026-09-12', description: 'Petrol full tank', isDemo: true },
    { id: 'exp_20', title: 'Zomato Gourmet Meals', amount: 1600, category: 'Food', date: '2026-09-22', description: 'Weekend food orders', isDemo: true }
  ],

  // Budgets set by month
  budgets: [
    { id: 'bdg_1', month: '2026-11', category: 'Food', limit: 8000, isDemo: true },
    { id: 'bdg_2', month: '2026-11', category: 'Shopping', limit: 6000, isDemo: true },
    { id: 'bdg_3', month: '2026-11', category: 'Housing', limit: 15000, isDemo: true },
    { id: 'bdg_4', month: '2026-11', category: 'Transportation', limit: 3500, isDemo: true },
    { id: 'bdg_5', month: '2026-11', category: 'Entertainment', limit: 2500, isDemo: true },
    { id: 'bdg_6', month: '2026-11', category: 'Bills and Utilities', limit: 4000, isDemo: true },
    { id: 'bdg_7', month: '2026-10', category: 'Shopping', limit: 5000, isDemo: true },
    { id: 'bdg_8', month: '2026-10', category: 'Food', limit: 8000, isDemo: true }
  ]
};

