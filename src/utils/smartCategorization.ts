// Smart transaction categorization utility

interface CategoryRule {
  keywords: string[];
  category: string;
  confidence: number;
}

const categorizationRules: CategoryRule[] = [
  // Food & Dining
  {
    keywords: ['restaurant', 'cafe', 'coffee', 'starbucks', 'mcdonalds', 'pizza', 'burger', 'food', 'dining', 'lunch', 'dinner', 'breakfast', 'delivery', 'takeout', 'grubhub', 'doordash', 'ubereats'],
    category: 'food',
    confidence: 0.9
  },
  {
    keywords: ['grocery', 'supermarket', 'walmart', 'target', 'safeway', 'kroger', 'whole foods', 'trader joe'],
    category: 'food',
    confidence: 0.8
  },

  // Transport
  {
    keywords: ['gas', 'fuel', 'shell', 'bp', 'exxon', 'chevron', 'mobil', 'station'],
    category: 'fuel',
    confidence: 0.9
  },
  {
    keywords: ['uber', 'lyft', 'taxi', 'cab', 'bus', 'metro', 'subway', 'train', 'parking', 'toll'],
    category: 'transport',
    confidence: 0.9
  },
  {
    keywords: ['car payment', 'auto loan', 'insurance', 'registration', 'smog', 'repair', 'mechanic', 'oil change'],
    category: 'transport',
    confidence: 0.8
  },

  // Shopping
  {
    keywords: ['amazon', 'ebay', 'shopping', 'store', 'mall', 'retail', 'purchase', 'buy'],
    category: 'shopping',
    confidence: 0.7
  },
  {
    keywords: ['clothing', 'shoes', 'fashion', 'apparel', 'nike', 'adidas', 'h&m', 'zara'],
    category: 'shopping',
    confidence: 0.8
  },

  // Entertainment
  {
    keywords: ['movie', 'cinema', 'theater', 'netflix', 'spotify', 'game', 'concert', 'ticket', 'entertainment'],
    category: 'entertainment',
    confidence: 0.8
  },
  {
    keywords: ['bar', 'club', 'pub', 'brewery', 'wine', 'alcohol', 'drinks'],
    category: 'entertainment',
    confidence: 0.7
  },

  // Utilities
  {
    keywords: ['electric', 'electricity', 'gas bill', 'water', 'sewer', 'internet', 'phone', 'cable', 'utility'],
    category: 'utilities',
    confidence: 0.9
  },
  {
    keywords: ['verizon', 'at&t', 'tmobile', 'sprint', 'comcast', 'xfinity'],
    category: 'utilities',
    confidence: 0.8
  },

  // Healthcare
  {
    keywords: ['doctor', 'hospital', 'pharmacy', 'medical', 'dental', 'dentist', 'clinic', 'health', 'cvs', 'walgreens'],
    category: 'healthcare',
    confidence: 0.9
  },
  {
    keywords: ['prescription', 'medicine', 'drug', 'copay', 'insurance'],
    category: 'healthcare',
    confidence: 0.8
  },

  // Housing
  {
    keywords: ['rent', 'mortgage', 'lease', 'apartment', 'house', 'property', 'hoa', 'maintenance'],
    category: 'housing',
    confidence: 0.9
  },

  // Education
  {
    keywords: ['school', 'university', 'college', 'tuition', 'books', 'education', 'course', 'class'],
    category: 'education',
    confidence: 0.9
  },

  // Fitness
  {
    keywords: ['gym', 'fitness', 'yoga', 'personal trainer', 'workout', 'sports', 'athletic'],
    category: 'fitness',
    confidence: 0.8
  },

  // Gifts
  {
    keywords: ['gift', 'present', 'birthday', 'anniversary', 'wedding', 'donation', 'charity'],
    category: 'gifts',
    confidence: 0.8
  },

  // Coffee (specialized category)
  {
    keywords: ['coffee', 'starbucks', 'dunkin', 'peets', 'cafe', 'espresso', 'latte'],
    category: 'coffee',
    confidence: 0.9
  }
];

export function categorizeTransaction(description: string, amount?: number): {
  category: string;
  confidence: number;
  suggestedCategories: Array<{ category: string; confidence: number }>;
} {
  const normalizedDescription = description.toLowerCase().trim();
  
  // Find matching rules
  const matches = categorizationRules
    .map(rule => {
      const matchCount = rule.keywords.filter(keyword => 
        normalizedDescription.includes(keyword.toLowerCase())
      ).length;
      
      if (matchCount === 0) return null;
      
      // Calculate confidence based on keyword matches and rule confidence
      const keywordConfidence = Math.min(matchCount / rule.keywords.length + 0.3, 1);
      const finalConfidence = rule.confidence * keywordConfidence;
      
      return {
        category: rule.category,
        confidence: finalConfidence,
        matchCount
      };
    })
    .filter(Boolean)
    .sort((a, b) => (b?.confidence || 0) - (a?.confidence || 0));

  // Amount-based hints
  if (amount) {
    // Small amounts might be coffee/snacks
    if (amount < 10 && normalizedDescription.includes('coffee')) {
      const coffeeMatch = matches.find(m => m?.category === 'coffee');
      if (coffeeMatch) {
        coffeeMatch.confidence += 0.1;
      }
    }
    
    // Large amounts might be rent/mortgage
    if (amount > 1000) {
      const housingMatch = matches.find(m => m?.category === 'housing');
      if (housingMatch) {
        housingMatch.confidence += 0.1;
      }
    }
  }

  // Re-sort after confidence adjustments
  matches.sort((a, b) => (b?.confidence || 0) - (a?.confidence || 0));

  const topMatch = matches[0];
  const suggestedCategories = matches
    .slice(0, 3)
    .map(m => ({ category: m?.category || '', confidence: m?.confidence || 0 }))
    .filter(s => s.category);

  return {
    category: topMatch?.category || 'shopping', // Default fallback
    confidence: topMatch?.confidence || 0.1,
    suggestedCategories
  };
}

export function getBatchCategorySuggestions(transactions: any[]): Array<{
  id: number;
  originalCategory: string;
  suggestedCategory: string;
  confidence: number;
  description: string;
}> {
  return transactions
    .map(transaction => {
      const result = categorizeTransaction(transaction.description, transaction.amount);
      
      return {
        id: transaction.id,
        originalCategory: transaction.category,
        suggestedCategory: result.category,
        confidence: result.confidence,
        description: transaction.description
      };
    })
    .filter(suggestion => 
      suggestion.originalCategory !== suggestion.suggestedCategory && 
      suggestion.confidence > 0.6
    )
    .sort((a, b) => b.confidence - a.confidence);
}

export function getSpendingInsights(transactions: any[]): Array<{
  type: 'pattern' | 'anomaly' | 'trend';
  title: string;
  description: string;
  confidence: number;
}> {
  const insights: Array<{
    type: 'pattern' | 'anomaly' | 'trend';
    title: string;
    description: string;
    confidence: number;
  }> = [];
  
  // Analyze spending patterns
  const categorySpending = transactions.reduce((acc, t) => {
    const amount = Number(t.amount) || 0;
    acc[t.category] = (acc[t.category] || 0) + Math.abs(amount);
    return acc;
  }, {} as Record<string, number>);

  const totalSpending = Object.values(categorySpending).reduce((sum: number, amount: number) => sum + amount, 0);
  
  // Find dominant categories
  Object.entries(categorySpending).forEach(([category, amount]) => {
    const numAmount = Number(amount);
    const numTotalSpending = Number(totalSpending);
    const percentage = numTotalSpending > 0 ? (numAmount / numTotalSpending) * 100 : 0;
    
    if (percentage > 40) {
      insights.push({
        type: 'pattern',
        title: `High ${category} spending`,
        description: `${category} accounts for ${percentage.toFixed(1)}% of your total spending`,
        confidence: 0.9
      });
    }
  });

  // Detect spending spikes
  const dailySpending = transactions.reduce((acc, t) => {
    const date = t.date;
    const amount = Number(t.amount) || 0;
    acc[date] = (acc[date] || 0) + Math.abs(amount);
    return acc;
  }, {} as Record<string, number>);

  const amounts: number[] = Object.values(dailySpending);
  const avgDaily = amounts.reduce((sum: number, amount: number) => sum + amount, 0) / amounts.length;
  const spikes = Object.entries(dailySpending).filter(([, amount]) => Number(amount) > avgDaily * 2);

  if (spikes.length > 0) {
    insights.push({
      type: 'anomaly',
      title: 'Spending spikes detected',
      description: `Found ${spikes.length} days with unusually high spending`,
      confidence: 0.8
    });
  }

  return insights.sort((a, b) => b.confidence - a.confidence);
}