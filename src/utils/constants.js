// Categories definition and icons/colors mapping
export const EXPENSE_CATEGORIES = [
  'Food',
  'Shopping',
  'Transportation',
  'Education',
  'Entertainment',
  'Healthcare',
  'Housing',
  'Bills and Utilities',
  'Other'
];

export const INCOME_SOURCES = [
  'Salary',
  'Freelance',
  'Business',
  'Other'
];

export const CATEGORY_COLORS = {
  'Food': '#B99AD9',              // Soft lavender
  'Shopping': '#8955B5',          // Rich violet
  'Transportation': '#633B86',    // Royal amethyst
  'Education': '#A479C9',         // Mid violet
  'Entertainment': '#D3C0E8',     // Pale lavender
  'Healthcare': '#754B98',        // Deep amethyst
  'Housing': '#C9B4E5',           // Lilac lavender
  'Bills and Utilities': '#523071', // Dark plum violet
  'Other': '#82768E'              // Muted grey-plum
};

// Keyword mapping for automatic expense categorization (Feature 3)
export const KEYWORD_CATEGORY_RULES = [
  { category: 'Food', keywords: ['restaurant', 'grocery', 'food', 'swiggy', 'zomato', 'dinner', 'lunch', 'breakfast', 'cafe', 'coffee', 'starbucks', 'supermarket', 'd mart', 'blinkit', 'zepto', 'vegetables', 'fruit', 'snacks', 'mcdonalds', 'dominos', 'pizza', 'burger', 'ration'] },
  { category: 'Shopping', keywords: ['amazon', 'clothes', 'shopping', 'flipkart', 'myntra', 'shoes', 'dress', 'tshirt', 'shirt', 'pants', 'zara', 'h&m', 'electronics', 'gadget', 'mall', 'ajio', 'meesho', 'purchase'] },
  { category: 'Transportation', keywords: ['bus', 'petrol', 'fuel', 'cab', 'uber', 'ola', 'auto', 'metro', 'train', 'flight', 'diesel', 'parking', 'toll', 'rapido', 'taxi', 'irctc'] },
  { category: 'Education', keywords: ['college', 'course', 'books', 'tuition', 'udemy', 'coursera', 'fees', 'school', 'exam', 'stationery', 'training', 'classes', 'notebook', 'pen', 'degree', 'admission'] },
  { category: 'Entertainment', keywords: ['movie', 'games', 'netflix', 'cinema', 'pvr', 'inox', 'spotify', 'prime video', 'hotstar', 'concert', 'club', 'party', 'gaming', 'steam', 'playstation', 'outing', 'amusement'] },
  { category: 'Healthcare', keywords: ['medicine', 'hospital', 'doctor', 'pharmacy', 'clinic', 'dentist', 'apollo', 'medical', 'tablets', 'checkup', 'lab test', 'pharmeasy', 'medplus', 'health', 'fitness', 'gym'] },
  { category: 'Housing', keywords: ['rent', 'maintenance', 'mortgage', 'pg', 'flat', 'apartment', 'house deposit', 'brokerage', 'home loan', 'furniture'] },
  { category: 'Bills and Utilities', keywords: ['electricity', 'water', 'internet', 'wifi', 'broadband', 'gas', 'lpg', 'cylinder', 'recharge', 'mobile bill', 'dth', 'airtel', 'jio', 'vi', 'utility', 'maintenance bill'] }
];

export function autoCategorizeExpense(title = '') {
  if (!title) return 'Other';
  const cleanTitle = title.toLowerCase().trim();
  
  for (const rule of KEYWORD_CATEGORY_RULES) {
    for (const kw of rule.keywords) {
      // Check full word or sub-match
      if (cleanTitle.includes(kw)) {
        return rule.category;
      }
    }
  }
  return 'Other';
}

// Format currency as INR (₹)
export function formatINR(amount, options = {}) {
  const num = Number(amount) || 0;
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: options.decimals !== undefined ? options.decimals : 0
  }).format(num);
}

// Generate unique ID
export function generateId() {
  return 'tx_' + Date.now().toString(36) + '_' + Math.random().toString(36).substring(2, 7);
}

// Date helpers
export function getCurrentMonthYear() {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  return `${year}-${month}`; // Format: YYYY-MM
}

export function formatMonthName(monthStr) {
  if (!monthStr) return '';
  const [year, month] = monthStr.split('-');
  const date = new Date(parseInt(year, 10), parseInt(month, 10) - 1, 1);
  return date.toLocaleString('en-US', { month: 'long', year: 'numeric' });
}

// CSV export
export function exportTransactionsToCSV(transactions) {
  const headers = ['ID', 'Type', 'Title', 'Category', 'Amount', 'Date', 'Description', 'IsDemo'];
  const rows = transactions.map(t => [
    t.id,
    t.type || 'expense',
    `"${(t.title || '').replace(/"/g, '""')}"`,
    `"${(t.category || '').replace(/"/g, '""')}"`,
    t.amount,
    t.date,
    `"${(t.description || '').replace(/"/g, '""')}"`,
    t.isDemo ? 'Yes' : 'No'
  ]);
  
  const csvContent = [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', `SmartSpend_Transactions_${new Date().toISOString().slice(0, 10)}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

// CSV Import parser
export function parseCSV(text) {
  const lines = text.split(/\r?\n/).filter(line => line.trim() !== '');
  if (lines.length < 2) throw new Error('CSV file is empty or missing data rows');
  
  const headerLine = lines[0];
  const headers = headerLine.split(',').map(h => h.trim().toLowerCase().replace(/"/g, ''));
  
  const titleIdx = headers.findIndex(h => h.includes('title') || h.includes('name'));
  const amountIdx = headers.findIndex(h => h.includes('amount'));
  const dateIdx = headers.findIndex(h => h.includes('date'));
  const categoryIdx = headers.findIndex(h => h.includes('category'));
  const descIdx = headers.findIndex(h => h.includes('desc') || h.includes('note'));
  const typeIdx = headers.findIndex(h => h.includes('type'));

  if (titleIdx === -1 || amountIdx === -1 || dateIdx === -1) {
    throw new Error('CSV must contain at least Title, Amount, and Date columns');
  }

  const results = [];
  for (let i = 1; i < lines.length; i++) {
    const rawLine = lines[i];
    // Regex to properly match CSV row respecting quotes
    const cols = [];
    let cur = '';
    let inQuotes = false;
    for (let c = 0; c < rawLine.length; c++) {
      const char = rawLine[c];
      if (char === '"' && (c === 0 || rawLine[c-1] !== '\\')) {
        inQuotes = !inQuotes;
      } else if (char === ',' && !inQuotes) {
        cols.push(cur.trim().replace(/^"|"$/g, ''));
        cur = '';
      } else {
        cur += char;
      }
    }
    cols.push(cur.trim().replace(/^"|"$/g, ''));

    const title = cols[titleIdx];
    const amount = parseFloat(cols[amountIdx]);
    const date = cols[dateIdx];
    const category = categoryIdx !== -1 && cols[categoryIdx] ? cols[categoryIdx] : autoCategorizeExpense(title);
    const description = descIdx !== -1 ? cols[descIdx] : '';
    const type = typeIdx !== -1 && cols[typeIdx]?.toLowerCase().includes('income') ? 'income' : 'expense';

    if (title && !isNaN(amount) && amount > 0 && date) {
      results.push({
        id: generateId(),
        title,
        amount,
        date: date.slice(0, 10),
        category: EXPENSE_CATEGORIES.includes(category) ? category : (type === 'income' ? 'Salary' : 'Other'),
        description,
        type,
        isDemo: false
      });
    }
  }

  if (results.length === 0) {
    throw new Error('No valid transactions could be parsed from the CSV file.');
  }

  return results;
}

